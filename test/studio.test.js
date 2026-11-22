import test from 'node:test';
import assert from 'node:assert/strict';
import { McpStudio } from '../lib/studio.js';

function harness(shared = {}) {
  const records = shared.records ?? new Map(), vault = shared.vault ?? new Map();
  const registry = new Map(), clients = [], connections = [];
  const unit = {
    loadAll: async () => ({ tables: { servers: Object.fromEntries(records) } }),
    putRecord: async (_table, key, value) => records.set(key, structuredClone(value)),
    deleteRecord: async (_table, key) => records.delete(key), close: async () => {}
  };
  const credentials = {
    readRecord: async key => structuredClone(vault.get(key)),
    modifyRecord: async (key, fn) => {
      assert.match(key, /^[a-z][a-z0-9-]*\/[a-z][a-z0-9-]*$/);
      vault.set(key, await fn(vault.get(key)));
    }, deleteRecord: async key => vault.delete(key)
  };
  const tools = { register(def) { registry.set(def.name, def); return () => registry.delete(def.name); } };
  const connector = async (row, secret) => {
    connections.push({ row: structuredClone(row), secret: structuredClone(secret) });
    const client = {
      closed: 0, calls: [],
      close: async () => { client.closed++; client.onclose?.(); },
      getServerCapabilities: () => ({ tools: {}, resources: {} }),
      getServerVersion: () => ({ name: 'mock', version: '1' }),
      listTools: async () => ({ tools: [{ name: 'echo', description: 'echo input', inputSchema: { type: 'object', properties: { text: { type: 'string' } } } }] }),
      callTool: async args => { client.calls.push(args); return { content: [{ type: 'text', text: args.arguments.text }] }; },
      listResources: async () => ({ resources: [{ uri: 'memory://one', name: 'one' }] }),
      listResourceTemplates: async () => ({ resourceTemplates: [{ uriTemplate: 'memory://{name}', name: 'named' }] }),
      readResource: async ({ uri }) => ({ contents: [{ uri, text: 'resource data' }] })
    };
    clients.push(client); return client;
  };
  const studio = new McpStudio({ unit, credentials, tools, connector });
  return { studio, unit, credentials, records, vault, registry, clients, connections, ui: (action,payload) => studio.dispatch(action,payload,'ui'), agent: (action,payload) => studio.dispatch(action,payload,'agent') };
}
const server = { name: 'Local mock', transport: 'http', url: 'http://127.0.0.1:9901/mcp', enabled: true };
const secret = { mode: 'replace', authType: 'bearer', bearer: 'top-secret-123', env: { API_KEY: 'env-secret-456' } };
async function granted(h) {
  const row = await h.ui('save', server);
  await h.ui('connect', { id: row.id });
  await h.ui('setPolicy', { id: row.id, agentEnabled: true, allowedTools: ['echo'], allowResources: true });
  return row;
}

test('credentials only enter vault; preserve/replace/clear and restart retain safe state', async () => {
  const h = harness(); await h.studio.init();
  const first = await h.ui('save', { ...server, credentials: secret });
  assert.equal(first.credentials.configured, true);
  assert.doesNotMatch(JSON.stringify(first), /top-secret|env-secret|credentialKey/);
  assert.doesNotMatch(JSON.stringify([...h.records.values()]), /top-secret|env-secret/);
  assert.equal(h.vault.size, 1);
  await h.ui('save', { ...server, id: first.id, name: 'Renamed', credentials: { mode: 'preserve' } });
  await h.ui('connect', { id: first.id });
  assert.equal(h.connections[0].secret.headers.Authorization, 'Bearer top-secret-123');
  await h.studio.close();
  const next = harness(h); await next.studio.init();
  const listed = await next.ui('list'); assert.equal(listed.servers[0].name, 'Renamed');
  await next.ui('connect', { id: first.id });
  assert.equal(next.connections[0].secret.env.API_KEY, 'env-secret-456');
  const cleared = await next.ui('save', { ...server, id: first.id, credentials: { mode: 'clear' } });
  assert.equal(cleared.credentials.configured, false); assert.equal(next.vault.size, 0);
  await next.studio.close();
});

test('default deny, Agent bridge guards, UI-only grants and dynamic registration', async () => {
  const h = harness(); await h.studio.init(); const row = await h.ui('save', server);
  await h.ui('connect', { id: row.id });
  assert.equal(h.registry.size, 0);
  await assert.rejects(h.agent('callTool', { id: row.id, name: 'echo', arguments: { text: 'x' } }), { code: 'NOT_AUTHORIZED' });
  await assert.rejects(h.agent('setPolicy', { id: row.id, agentEnabled: true, allowedTools: ['echo'], allowResources: true }), { code: 'USER_ONLY' });
  await h.ui('setPolicy', { id: row.id, agentEnabled: true, allowedTools: ['echo'], allowResources: false });
  assert.equal(h.registry.size, 1);
  const def = [...h.registry.values()][0];
  assert.match(def.name, /^mcpstudio_/);
  await def.execute({ text: 'works' }, { signal: new AbortController().signal });
  assert.equal(h.clients[0].calls.length, 1);
  await assert.rejects(h.agent('readResource', { id: row.id, uri: 'memory://one' }), { code: 'NOT_AUTHORIZED' });
  await assert.rejects(h.agent('callTool', { id: row.id, name: 'ungranted', arguments: {} }), { code: 'NOT_AUTHORIZED' });
  await h.studio.close();
});

test('revocation blocks stale execute handles and final dispatch guard', async () => {
  const h = harness(); await h.studio.init(); const row = await granted(h);
  const stale = [...h.registry.values()][0];
  await h.ui('setPolicy', { id: row.id, agentEnabled: false, allowedTools: [], allowResources: false });
  assert.equal(h.registry.size, 0);
  assert.ok(h.studio.guard({ name: stale.name }));
  await assert.rejects(stale.execute({ text: 'blocked' }, {}), { code: 'NOT_AUTHORIZED' });
  assert.equal(h.clients[0].calls.length, 0);
  await h.ui('setPolicy', { id: row.id, agentEnabled: true, allowedTools: ['echo'], allowResources: true });
  await assert.rejects(stale.execute({ text: 'still blocked' }, {}), { code: 'NOT_AUTHORIZED' });
  await h.studio.close();
});

test('probe connection closes without saving or registering, including discovery errors', async () => {
  const h = harness(); await h.studio.init();
  const result = await h.ui('probe', { ...server, credentials: secret });
  assert.equal(result.tools[0].name, 'echo'); assert.equal(h.clients[0].closed, 1);
  assert.equal(h.records.size, 0); assert.equal(h.vault.size, 0); assert.equal(h.registry.size, 0);
  const original = h.studio.connector;
  h.studio.connector = async (...args) => { const client = await original(...args); client.listTools = async () => { throw new Error('top-secret-123'); }; return client; };
  await assert.rejects(h.ui('probe', { ...server, credentials: secret }), error => error.code === 'CONNECTION_FAILED' && !error.message.includes('top-secret'));
  assert.equal(h.clients[1].closed, 1); await h.studio.close();
});

test('resources, templates and user invocation work independently of Agent grants', async () => {
  const h = harness(); await h.studio.init(); const row = await h.ui('save', server);
  assert.equal((await h.ui('listResources', { id: row.id })).resources[0].uri, 'memory://one');
  assert.equal((await h.ui('listResourceTemplates', { id: row.id })).resourceTemplates.length, 1);
  assert.equal((await h.ui('readResource', { id: row.id, uri: 'memory://one' })).contents[0].text, 'resource data');
  assert.equal((await h.ui('callTool', { id: row.id, name: 'echo', arguments: { text: 'UI call' } })).content[0].text, 'UI call');
  assert.equal(h.registry.size, 0); await h.studio.close();
});

test('tool echo and upstream errors never reveal configured secrets', async () => {
  const h = harness(); await h.studio.init(); const row = await h.ui('save', { ...server, credentials: secret });
  const result = await h.ui('callTool', { id: row.id, name: 'echo', arguments: { text: 'Bearer top-secret-123 / env-secret-456' } });
  assert.doesNotMatch(JSON.stringify(result), /top-secret|env-secret/);
  h.clients[0].callTool = async () => { throw new Error('failed with Bearer top-secret-123'); };
  await assert.rejects(h.ui('callTool', { id: row.id, name: 'echo' }), error => error.code === 'OPERATION_FAILED' && !error.message.includes('top-secret'));
  await h.studio.close();
});

test('configuration changes reset grants, disable/delete close and unregister', async () => {
  const h = harness(); await h.studio.init(); const row = await granted(h);
  const updated = await h.ui('save', { ...server, id: row.id, url: 'http://127.0.0.1:9902/mcp' });
  assert.equal(updated.policy.agentEnabled, false); assert.deepEqual(updated.policy.allowedTools, []);
  assert.equal(h.clients[0].closed, 1); assert.equal(h.registry.size, 0);
  await h.ui('save', { ...server, id: row.id, enabled: false });
  await assert.rejects(h.ui('connect', { id: row.id }), { code: 'DISABLED' });
  await h.ui('delete', { id: row.id }); assert.equal(h.records.size, 0);
  await h.studio.close();
});

test('failed grant persistence fails closed and credential write rollback preserves old config', async () => {
  const h = harness(); await h.studio.init(); const row = await granted(h);
  h.unit.putRecord = async () => { throw new Error('disk full'); };
  await assert.rejects(h.ui('setPolicy', { id: row.id, agentEnabled: true, allowedTools: ['echo'], allowResources: true }));
  assert.equal(h.registry.size, 0);
  await assert.rejects(h.agent('callTool', { id: row.id, name: 'echo' }), { code: 'NOT_AUTHORIZED' });
  await assert.rejects(h.ui('save', { ...server, id: row.id, credentials: secret }));
  assert.equal(h.vault.size, 0); assert.equal(h.records.get(row.id).credentialKey, undefined);
  await h.studio.close();
});

test('remote close and discovery removing tools revoke dynamic entries', async () => {
  const h = harness(); await h.studio.init(); const row = await granted(h);
  const stale = [...h.registry.values()][0];
  h.clients[0].listTools = async () => ({ tools: [] });
  assert.deepEqual((await h.ui('discover', { id: row.id })).tools, []);
  assert.equal(h.registry.size, 0);
  await assert.rejects(stale.execute({}, {}), { code: 'NOT_AUTHORIZED' });
  h.clients[0].onclose();
  assert.equal((await h.ui('list')).servers[0].status, 'disconnected');
  await h.studio.close();
});



test('initialization isolates malformed saved rows and exposes a diagnostic', async () => {
  const records = new Map([
    ['bad', { id: 'bad', name: '', transport: 'wat' }],
    ['good', { id: 'good', name: 'Good', transport: 'http', url: 'http://127.0.0.1:9901/mcp', enabled: true }]
  ]);
  const h = harness({ records });
  await h.studio.init();
  const listed = (await h.ui('list')).servers;
  assert.equal(listed.length, 2);
  assert.equal(listed.find(row => row.id === 'bad').status, 'error');
  assert.match(listed.find(row => row.id === 'bad').lastError, /invalid/i);
  assert.equal(listed.find(row => row.id === 'good').name, 'Good');
  await h.studio.close();
});

test('probe secret scope is cleaned after the temporary connection closes', async () => {
  const h = harness();
  await h.studio.init();
  await h.ui('probe', { ...server, credentials: secret });
  assert.equal(h.studio.secretScopes.size, 0);
  await h.studio.close();
});
