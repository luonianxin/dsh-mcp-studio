import { randomUUID, createHash } from 'node:crypto';
import { settleWithin, withAbort } from './lifecycle.js';

export class StudioError extends Error {
  constructor(code, message) { super(message); this.code = code; }
}
function connectionError(error) {
  if (error instanceof StudioError) return error;
  const status = error?.code ?? error?.status;
  if ([401, 403].includes(status) || error?.name === 'UnauthorizedError' || /\b(401|403)\b/.test(error?.message ?? '')) return new StudioError('AUTH_FAILED', 'Authentication failed. Check your token or headers.');
  if (status === -32001 || error?.name === 'TimeoutError' || /timed? ?out|timeout/i.test(error?.message ?? '')) return new StudioError('TIMEOUT', 'Connection timed out. Check the endpoint and try again.');
  if (error?.name === 'AbortError') return new StudioError('CANCELLED', 'Connection was cancelled.');
  return new StudioError('CONNECTION_FAILED', 'Connection failed. Check endpoint and server availability.');
}
const fail = (code, message) => { throw new StudioError(code, message); };
const copy = value => structuredClone(value);
const object = value => value && typeof value === 'object' && !Array.isArray(value);
const emptyPolicy = () => ({ agentEnabled: false, allowedTools: [], allowResources: false });
const keyOf = id => `mcpstudio/server-${id}`;
const toolName = (id, name) => `mcpstudio_${id.replaceAll('-', '')}_${createHash('sha256').update(name).digest('hex').slice(0, 16)}`;
const MAX_RESULT_BYTES = 4 * 1024 * 1024;
const MAX_RESULT_DEPTH = 20;
const MAX_RESULT_ITEMS = 1000;
const MAX_CONCURRENT_OPERATIONS = 8;
const MAX_SAVED_SERVERS = 100;
export const output = { schema: { type: 'object', additionalProperties: true }, render: (_args, value) => [{ type: 'text', text: JSON.stringify(value) }] };
function bounded(value) {
  let bytes = 0, nodes = 0;
  const seen = new Set();
  const charge = count => { bytes += count; if (bytes > MAX_RESULT_BYTES) fail('LIMIT_EXCEEDED', 'MCP result exceeds the configured size limit.'); };
  const text = value => {
    if (Buffer.byteLength(value) > MAX_RESULT_BYTES) fail('LIMIT_EXCEEDED', 'MCP string exceeds the configured size limit.');
    charge(Buffer.byteLength(JSON.stringify(value)));
    return value;
  };
  function visit(item, depth) {
    if (++nodes > 20000 || depth > MAX_RESULT_DEPTH) fail('LIMIT_EXCEEDED', 'MCP result nesting or node count exceeds the configured limit.');
    if (typeof item === 'string') return text(item);
    if (!item || typeof item !== 'object') { charge(16); return item; }
    if (seen.has(item)) fail('LIMIT_EXCEEDED', 'MCP result contains a circular value.');
    seen.add(item);
    const keys = Object.keys(item);
    if (keys.length > MAX_RESULT_ITEMS) fail('LIMIT_EXCEEDED', 'MCP result contains too many items.');
    charge(2 + keys.length * 2);
    const result = Array.isArray(item) ? item.map(child => visit(child, depth + 1)) : Object.fromEntries(keys.map(key => [text(key), visit(item[key], depth + 1)]));
    seen.delete(item);
    return result;
  }
  return visit(value, 0);
}

function string(value, name, max = 4096) {
  if (typeof value !== 'string' || !value.trim() || value.length > max) fail('INVALID_INPUT', `${name} must be a non-empty string (max ${max}).`);
  return value;
}
function mapStrings(value, name) {
  if (value === undefined) return {};
  if (!object(value) || Object.keys(value).length > 100) fail('INVALID_INPUT', `${name} must be a string map.`);
  let bytes = 0;
  for (const [key, val] of Object.entries(value)) {
    if (!key || typeof val !== 'string' || /[\r\n\0]/.test(key) || val.includes('\0')) fail('INVALID_INPUT', `Invalid ${name} entry.`);
    bytes += Buffer.byteLength(key) + Buffer.byteLength(val);
    if (bytes > 65536) fail('LIMIT_EXCEEDED', `${name} exceeds 64 KiB.`);
  }
  return { ...value };
}
function draft(input, old) {
  if (!object(input)) fail('INVALID_INPUT', 'A server draft is required.');
  const transport = input.transport ?? old?.transport;
  if (!['http', 'stdio'].includes(transport)) fail('INVALID_INPUT', 'transport must be http or stdio.');
  const next = { id: old?.id ?? randomUUID(), name: string(input.name ?? old?.name, 'name', 120), transport, enabled: input.enabled ?? old?.enabled ?? true, policy: copy(old?.policy ?? emptyPolicy()), authType: old?.authType ?? 'none', credentialKey: old?.credentialKey };
  if (typeof next.enabled !== 'boolean') fail('INVALID_INPUT', 'enabled must be boolean.');
  if (transport === 'http') {
    let url;
    try { url = new URL(string(input.url ?? old?.url, 'url')); } catch { fail('INVALID_INPUT', 'A valid HTTP URL is required.'); }
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.hash) fail('INVALID_INPUT', 'Use HTTP(S) without embedded credentials or fragments.');
    next.url = url.href;
  } else {
    next.command = string(input.command ?? old?.command, 'command');
    next.args = input.args ?? old?.args ?? [];
    if (!Array.isArray(next.args) || next.args.length > 100 || next.args.some(x => typeof x !== 'string' || x.length > 8192)) fail('INVALID_INPUT', 'args must be an array of strings.');
    next.args = [...next.args];
    if (input.cwd ?? old?.cwd) next.cwd = string(input.cwd ?? old?.cwd, 'cwd');
  }
  return next;
}
function secretDraft(input, old) {
  const c = input.credentials ?? { mode: 'preserve' };
  if (!object(c) || !['preserve', 'replace', 'clear'].includes(c.mode)) fail('INVALID_INPUT', 'Credential mode must be preserve, replace or clear.');
  if (c.mode === 'preserve') return old ?? { authType: 'none', headers: {}, env: {} };
  if (c.mode === 'clear') return { authType: 'none', headers: {}, env: {} };
  const authType = c.authType ?? 'none';
  if (!['none', 'bearer', 'headers'].includes(authType)) fail('INVALID_INPUT', 'Invalid authentication type.');
  const headers = authType === 'headers' ? mapStrings(c.headers, 'headers') : {};
  if (authType === 'bearer') headers.Authorization = `Bearer ${string(string(c.bearer, 'bearer', 16384).trim().replace(/^Bearer\s+/i, ''), 'bearer', 16384)}`;
  for (const [k, v] of Object.entries(headers)) {
    if (!/^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/.test(k) || /[\r\n]/.test(v) || ['host','content-length','connection','cookie','transfer-encoding'].includes(k.toLowerCase())) fail('INVALID_INPUT', 'Invalid or reserved HTTP header.');
  }
  return { authType, headers, env: mapStrings(c.env, 'env') };
}

export class McpStudio {
  constructor({ unit, credentials, connector, tools, inventory, timeoutMs = 30000 }) {
    Object.assign(this, { unit, credentials, connector, tools, inventory, timeoutMs });
    this.servers = new Map(); this.live = new Map(); this.registrations = new Map(); this.secretScopes = new Map(); this.closed = false; this.closing = false; this.queue = Promise.resolve(); this.lifecycle = new AbortController(); this.activeOperations = 0;
  }
  async init() {
    const state = await this.unit.loadAll();
    for (const [key, row] of Object.entries(state?.tables?.servers ?? {})) {
      if (this.servers.size >= MAX_SAVED_SERVERS) break;
      try {
        if (!object(row) || typeof row.id !== 'string' || !row.id || row.id.length > 128) fail('INVALID_INPUT', 'Invalid saved server ID.');
        if (!object(row.policy) || typeof row.policy.agentEnabled !== 'boolean' || typeof row.policy.allowResources !== 'boolean' || !Array.isArray(row.policy.allowedTools) || row.policy.allowedTools.length > MAX_RESULT_ITEMS || row.policy.allowedTools.some(name => typeof name !== 'string')) fail('INVALID_INPUT', 'Invalid saved permissions.');
        const valid = draft(row, row);
        valid.policy = { ...emptyPolicy(), ...row.policy };
        this.servers.set(valid.id, valid);
        try { await this.readSecret(valid); }
        catch { this.live.set(valid.id, { status: 'error', tools: [], error: 'Saved credentials are unavailable; replace or clear them.' }); }
      } catch (error) {
        const id = typeof row?.id === 'string' && row.id ? row.id : String(key);
        if (this.servers.has(id)) continue;
        const fallback = { id, name: typeof row?.name === 'string' && row.name ? row.name.slice(0, 120) : 'Invalid saved server', transport: 'http', url: 'http://invalid.local/', enabled: false, policy: emptyPolicy(), authType: 'none' };
        this.servers.set(id, fallback);
        this.live.set(id, { status: 'error', tools: [], error: error instanceof StudioError ? `Saved server record is invalid: ${error.message}` : 'Saved server record is invalid; repair or delete it.' });
      }
    }
  }
  remember(value, scope = 'global') {
    if (this.closed) return value;
    const secrets = this.secretScopes.get(scope) ?? new Set();
    for (const s of [...Object.values(value?.headers ?? {}), ...Object.values(value?.env ?? {})]) {
      if (s) secrets.add(s);
      if (s?.startsWith('Bearer ')) secrets.add(s.slice(7));
    }
    this.secretScopes.set(scope, secrets);
    return value;
  }
  clearSecrets(scope) { this.secretScopes.delete(scope); }
  scrub(value) {
    value = bounded(value);
    const all = [...new Set([...this.secretScopes.values()].flatMap(set => [...set]))].sort((a,b) => b.length-a.length);
    const pattern = all.length ? new RegExp(all.map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'g') : null;
    const redact = text => pattern ? text.replace(pattern, '[REDACTED]') : text;
    function visit(item) {
      if (typeof item === 'string') return redact(item);
      if (Array.isArray(item)) return item.map(visit);
      if (object(item)) return Object.fromEntries(Object.entries(item).map(([key, child]) => [redact(key), visit(child)]));
      return item;
    }
    return bounded(visit(value));
  }
  async readSecret(row) {
    if (!row.credentialKey) return { authType: 'none', headers: {}, env: {} };
    const record = await this.credentials.readRecord(row.credentialKey);
    if (!record || record.kind !== 'grant') fail('CREDENTIAL_MISSING', 'Saved credentials are unavailable; replace or clear them.');
    return this.remember(record.payload, row.id);
  }
  require(id) { const row = this.servers.get(id); if (!row) fail('NOT_FOUND', 'Server not found.'); return row; }
  view(row) {
    const { credentialKey, ...publicRow } = row;
    const live = this.live.get(row.id);
    return this.scrub({ ...copy(publicRow), credentials: { configured: !!credentialKey, authType: row.authType }, status: live?.status ?? 'disconnected', tools: copy(live?.tools ?? []), lastError: live?.error ?? null });
  }
  authorize(action, p, caller) {
    if (caller === 'ui') return;
    if (action === 'list' || action === 'inventory') return;
    if (['save','probe','setPolicy'].includes(action)) fail('USER_ONLY', 'Connection configuration and permissions require the user in MCP Studio.');
    const row = this.require(p.id);
    if (['delete','disconnect'].includes(action)) return;
    if (!row.enabled || !row.policy.agentEnabled) fail('NOT_AUTHORIZED', 'The user has not enabled Agent access for this server.');
    if (['listResources','listResourceTemplates','readResource'].includes(action) && !row.policy.allowResources) fail('NOT_AUTHORIZED', 'Resource access is not granted.');
    if (action === 'callTool' && !row.policy.allowedTools.includes(p.name)) fail('NOT_AUTHORIZED', 'This MCP tool is not granted.');
  }
  async dispatch(action, payload = {}, caller = 'agent', signal) {
    if (this.closed || this.closing) fail('CLOSED', 'MCP Studio is closed.');
    if (!object(payload)) fail('INVALID_INPUT', 'payload must be an object.');
    if (!['list','inventory','save','delete','probe','connect','reconnect','disconnect','discover','callTool','listResources','listResourceTemplates','readResource','setPolicy'].includes(action)) fail('UNKNOWN_ACTION', 'Unknown MCP Studio action.');
    this.authorize(action, payload, caller);
    if (this.activeOperations >= MAX_CONCURRENT_OPERATIONS) fail('LIMIT_EXCEEDED', 'Too many concurrent MCP operations.');
    const mutation = ['save','delete','setPolicy','connect','reconnect','disconnect'].includes(action);
    const operationSignal = signal && typeof AbortSignal.any === 'function' ? AbortSignal.any([this.lifecycle.signal, signal]) : (signal ?? this.lifecycle.signal);
    this.activeOperations++;
    const run = async () => {
      if (this.closed || this.closing) fail('CLOSED', 'MCP Studio is closed.');
      operationSignal.throwIfAborted();
      try {
        this.authorize(action, payload, caller);
        return this.scrub(await withAbort(this.perform(action, payload, caller, operationSignal), operationSignal));
      } catch (error) {
        if (operationSignal.aborted) fail('CANCELLED', 'MCP operation was cancelled.');
        throw error instanceof StudioError ? new StudioError(error.code, this.scrub(error.message)) : new StudioError('OPERATION_FAILED', 'MCP operation failed. Check the connection and input.');
      }
    };
    const pending = mutation ? this.queue.then(run, run) : run();
    if (mutation) this.queue = pending.catch(() => {});
    try { return await withAbort(pending, operationSignal); }
    finally { this.activeOperations--; }
  }
  async perform(action, p, caller, signal) {
    if (action === 'inventory') return { servers: [...this.servers.values()].map(row => ({ ...this.view(row), source: 'studio', readOnly: false })), ...(this.inventory?.() ?? { external: [], warnings: ['PROFILE_SOURCE_UNAVAILABLE'] }) };
    if (action === 'list') return { servers: [...this.servers.values()].map(row => this.view(row)) };
    if (action === 'save') return this.save(p);
    if (action === 'probe') return this.probe(p, signal);
    const row = this.require(p.id);
    if (action === 'delete') {
      await this.disconnect(row.id); await this.unit.deleteRecord('servers', row.id); this.servers.delete(row.id); this.clearSecrets(row.id);
      if (row.credentialKey) await this.credentials.deleteRecord(row.credentialKey);
      return { deleted: true };
    }
    if (action === 'setPolicy') {
      if (typeof p.agentEnabled !== 'boolean' || typeof p.allowResources !== 'boolean' || !Array.isArray(p.allowedTools) || p.allowedTools.some(x => typeof x !== 'string')) fail('INVALID_INPUT', 'Supply agentEnabled, allowResources and allowedTools.');
      const known = new Set((this.live.get(row.id)?.tools ?? []).map(t => t.name));
      if (p.allowedTools.some(t => !known.has(t) && !row.policy.allowedTools.includes(t))) fail('UNKNOWN_TOOL', 'Discover tools before granting access.');
      const next = { ...row, policy: { agentEnabled: p.agentEnabled, allowResources: p.allowResources, allowedTools: [...new Set(p.allowedTools)] } };
      // 先撤销内存权限，持久化失败仍然保持拒绝状态。
      this.revoke(row.id); row.policy = emptyPolicy();
      await this.unit.putRecord('servers', row.id, next); this.servers.set(row.id, next); this.syncTools(row.id); return this.view(next);
    }
    if (action === 'disconnect') { await this.disconnect(row.id); return this.view(row); }
    if (action === 'connect' || action === 'reconnect') {
      if (action === 'reconnect') await this.disconnect(row.id);
      await this.connect(row, signal); return this.view(row);
    }
    const live = await this.connect(row, signal);
    this.authorize(action, p, caller);
    if (action === 'discover') {
      const discovered = await this.enumerate(live.client, signal);
      if (this.live.get(row.id) !== live) fail('STALE_CONNECTION', 'Connection was cancelled.');
      live.tools = discovered; this.syncTools(row.id);
      return { tools: copy(live.tools), capabilities: live.client.getServerCapabilities?.() ?? {}, serverInfo: live.client.getServerVersion?.() ?? {} };
    }
    const opts = { signal, timeout: this.timeoutMs };
    if (action === 'callTool') return live.client.callTool({ name: string(p.name, 'name'), arguments: p.arguments ?? {} }, undefined, opts);
    if (action === 'listResources') return live.client.listResources(p.cursor ? { cursor: p.cursor } : {}, opts);
    if (action === 'listResourceTemplates') return live.client.listResourceTemplates(p.cursor ? { cursor: p.cursor } : {}, opts);
    if (action === 'readResource') return live.client.readResource({ uri: string(p.uri, 'uri') }, opts);
    fail('UNKNOWN_ACTION', 'Unknown MCP Studio action.');
  }
  async save(p) {
    if (!p.id && this.servers.size >= MAX_SAVED_SERVERS) fail('LIMIT_EXCEEDED', 'Saved server limit exceeded.');
    const old = p.id ? this.require(p.id) : undefined;
    const row = draft(p, old);
    const previous = p.credentials?.mode === 'replace' || p.credentials?.mode === 'clear' ? undefined : old ? await this.readSecret(old) : undefined;
    const secret = secretDraft(p, previous); const secretScope = `save:${randomUUID()}`;
    const hasSecret = Object.keys(secret.headers).length > 0 || Object.keys(secret.env).length > 0;
    const changed = !!old && (JSON.stringify([row.transport,row.url,row.command,row.args,row.cwd]) !== JSON.stringify([old.transport,old.url,old.command,old.args,old.cwd]) || (p.credentials && p.credentials.mode !== 'preserve'));
    if (changed) row.policy = emptyPolicy();
    if (old) await this.disconnect(old.id);
    row.authType = secret.authType;
    row.credentialKey = hasSecret ? `${keyOf(row.id)}-${randomUUID()}` : undefined;
    if (hasSecret) await this.credentials.modifyRecord(row.credentialKey, async () => ({ kind: 'grant', payload: secret }));
    try { await this.unit.putRecord('servers', row.id, row); }
    catch (error) { if (row.credentialKey) await this.credentials.deleteRecord(row.credentialKey).catch(() => {}); this.clearSecrets(secretScope); throw error; }
    this.servers.set(row.id, row);
    this.clearSecrets(row.id); this.remember(secret, row.id); this.clearSecrets(secretScope);
    if (old?.credentialKey) await this.credentials.deleteRecord(old.credentialKey);
    return this.view(row);
  }
  async enumerate(client, signal) {
    if (!client.getServerCapabilities?.()?.tools) return [];
    const tools = []; let cursor, discoveryBytes = 0; const seen = new Set();
    do {
      const page = bounded(await client.listTools(cursor ? { cursor } : {}, { signal, timeout: this.timeoutMs }));
      if (seen.size >= 100) fail('LIMIT_EXCEEDED', 'MCP discovery returned too many pages.');
      if (!Array.isArray(page?.tools)) fail('CONNECTION_FAILED', 'MCP tool discovery returned an invalid response.');
      discoveryBytes += Buffer.byteLength(JSON.stringify(page.tools));
      if (discoveryBytes > MAX_RESULT_BYTES) fail('LIMIT_EXCEEDED', 'MCP discovery exceeds the configured size limit.');
      tools.push(...page.tools); cursor = page.nextCursor;
      if (tools.length > MAX_RESULT_ITEMS || (cursor && (typeof cursor !== 'string' || cursor.length > 8192 || seen.has(cursor)))) fail('LIMIT_EXCEEDED', 'MCP tool discovery exceeded the limit.');
      if (cursor) seen.add(cursor);
    } while (cursor);
    return tools;
  }
  async connect(row, signal) {
    if (!row.enabled) fail('DISABLED', 'Enable the server before connecting.');
    const current = this.live.get(row.id);
    if (current?.status === 'connected') return current;
    if (current?.promise) return current.promise;
    const live = { status: 'connecting', tools: [], client: null };
    this.live.set(row.id, live);
    live.promise = (async () => {
      try {
        const secret = await this.readSecret(row);
        live.client = await this.connector(row, secret, { signal, timeoutMs: this.timeoutMs });
        if (this.closed || this.live.get(row.id) !== live) { await settleWithin(() => live.client.close()); fail('STALE_CONNECTION', 'Connection was cancelled.'); }
        const previousOnClose = live.client.onclose;
        live.client.onclose = () => {
          previousOnClose?.();
          if (this.live.get(row.id) === live) { live.status = 'disconnected'; this.revoke(row.id); }
        };
        live.tools = await this.enumerate(live.client, signal);
        if (this.live.get(row.id) !== live || this.closed) { await settleWithin(() => live.client.close()); fail('STALE_CONNECTION', 'Connection was cancelled.'); }
        live.status = 'connected'; this.syncTools(row.id); return live;
      } catch (error) {
        const safeError = connectionError(error);
        live.status = 'error'; live.error = safeError.message;
        if (live.client) await settleWithin(() => live.client.close());
        live.status = 'error';
        throw safeError;
      } finally { delete live.promise; }
    })();
    return live.promise;
  }
  async probe(p, signal) {
    const old = p.id ? this.require(p.id) : undefined;
    const row = draft(p, old);
    const oldSecret = old && (!p.credentials || p.credentials.mode === 'preserve') ? await this.readSecret(old) : undefined;
    const secretScope = `probe:${randomUUID()}`;
    const secret = this.remember(secretDraft(p, oldSecret), secretScope); let client;
    try {
      client = await this.connector(row, secret, { signal, timeoutMs: this.timeoutMs });
      const result = { tools: await this.enumerate(client, signal), capabilities: client.getServerCapabilities?.() ?? {}, serverInfo: client.getServerVersion?.() ?? {} };
      return this.scrub(result);
    } catch (error) { throw connectionError(error); }
    finally { if (client) await settleWithin(() => client.close()); this.clearSecrets(secretScope); }
  }
  revoke(id) { for (const [name, reg] of this.registrations) if (reg.id === id) { reg.dispose(); this.registrations.delete(name); } }
  syncTools(id) {
    this.revoke(id); const row = this.servers.get(id), live = this.live.get(id);
    if (!row?.enabled || !row.policy.agentEnabled || live?.status !== 'connected') return;
    for (const tool of live.tools) {
      if (!row.policy.allowedTools.includes(tool.name)) continue;
      const name = toolName(id, tool.name);
      const token = Symbol(name);
      const dispose = this.tools.register({ name, description: this.scrub(`MCP ${row.name}: ${tool.description ?? tool.name}`.slice(0, 3000)), parameters: this.scrub(tool.inputSchema ?? { type: 'object', properties: {} }), output,
        execute: async (args, exec) => {
          if (this.live.get(id) !== live || this.registrations.get(name)?.token !== token) fail('NOT_AUTHORIZED', 'This tool handle has been revoked.');
          return this.dispatch('callTool', { id, name: tool.name, arguments: args }, 'agent', exec.signal);
        } });
      this.registrations.set(name, { id, originalName: tool.name, token, dispose });
    }
  }
  guard(exec) {
    if (!exec.name.startsWith('mcpstudio_') || exec.name === 'mcpstudio_manage') return;
    const reg = this.registrations.get(exec.name);
    if (!reg) return 'MCP Studio tool is revoked.';
    const row = this.servers.get(reg.id);
    if (!row?.enabled || !row.policy.agentEnabled || !row.policy.allowedTools.includes(reg.originalName)) return 'MCP Studio tool is not authorized.';
  }
  async disconnect(id) {
    this.revoke(id); const live = this.live.get(id); this.live.delete(id);
    if (live?.client) await settleWithin(() => live.client.close());
  }
  async close() {
    if (this.closePromise) return this.closePromise;
    this.closed = true; this.closing = true; this.lifecycle.abort();
    const disconnects = [...this.live.keys()].map(id => this.disconnect(id));
    this.secretScopes.clear();
    this.closePromise = (async () => {
      await settleWithin(() => Promise.allSettled([this.queue, ...disconnects]), 1000);
      await settleWithin(() => this.unit.close(), 1000);
    })();
    return this.closePromise;
  }
}
