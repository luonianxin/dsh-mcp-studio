import test from 'node:test';
import assert from 'node:assert/strict';
import { connectMcp } from '../lib/connector.js';
import { apply } from '../index.js';

test('real SDK Streamable HTTP handshake, discovery, call and resources against offline fetch mock', async () => {
  const previousFetch = globalThis.fetch; const requests = [];
  globalThis.fetch = async (input, init) => {
    requests.push({ input: String(input), init });
    const headers = new Headers(init.headers);
    assert.equal(headers.get('authorization'), 'Bearer mock-only-secret');
    assert.equal(init.redirect, 'error');
    if (init.method === 'GET') return new Response('', { status: 405 });
    if (init.method === 'DELETE') return new Response('', { status: 200 });
    const body = JSON.parse(init.body);
    if (body.id === undefined) return new Response(null, { status: 202 });
    const results = {
      initialize: { protocolVersion: '2025-03-26', capabilities: { tools: {}, resources: {} }, serverInfo: { name: 'offline', version: '1' } },
      'tools/list': { tools: [{ name: 'echo', inputSchema: { type: 'object', properties: {} } }] },
      'tools/call': { content: [{ type: 'text', text: 'offline response' }] },
      'resources/list': { resources: [{ uri: 'memory://one', name: 'one' }] },
      'resources/templates/list': { resourceTemplates: [{ name: 'template', uriTemplate: 'memory://{id}' }] },
      'resources/read': { contents: [{ uri: 'memory://one', text: 'offline data' }] }
    };
    assert.ok(results[body.method], `unexpected method ${body.method}`);
    return new Response(JSON.stringify({ jsonrpc: '2.0', id: body.id, result: results[body.method] }), { headers: { 'Content-Type': 'application/json' } });
  };
  let client;
  try {
    client = await connectMcp({ transport: 'http', url: 'http://offline.invalid/mcp' }, { headers: { Authorization: 'Bearer mock-only-secret' }, env: {} }, { timeoutMs: 1000 });
    assert.equal(client.getServerVersion().name, 'offline');
    assert.equal((await client.listTools()).tools[0].name, 'echo');
    assert.equal((await client.callTool({ name: 'echo', arguments: {} })).content[0].text, 'offline response');
    assert.equal((await client.listResources()).resources.length, 1);
    assert.equal((await client.listResourceTemplates()).resourceTemplates.length, 1);
    assert.equal((await client.readResource({ uri: 'memory://one' })).contents[0].text, 'offline data');
    assert.ok(requests.length >= 8);
  } finally { if (client) await client.close(); globalThis.fetch = previousFetch; }
});

test('Host apply uses authenticated connection route, exact storage contract and safe RPC envelope', async () => {
  let route, guard; const definitions = [], cleanups = [], records = new Map();
  const ctx = {
    storage: { backend: { get: name => {
      assert.equal(name, 'json');
      return { kv: { open: async descriptor => {
        assert.deepEqual(descriptor, { name: 'mcpstudio', version: 1, tables: ['servers'], hasGlobal: false });
        return { loadAll: async () => ({ tables: { servers: {} } }), putRecord: async (_t,k,v) => records.set(k,v), deleteRecord: async (_t,k) => records.delete(k), close: async () => {} };
      } } };
    } } },
    credentials: { readRecord: async () => undefined, modifyRecord: async () => {}, deleteRecord: async () => {} },
    tools: { register: def => { definitions.push(def); return () => {}; }, guard: fn => { guard = fn; return () => {}; } },
    effect: callback => { const cleanup = callback(); cleanups.push(cleanup); return cleanup; },
    connection: { fetch: { register: value => { route = value; return async () => {}; } } }
  };
  await apply(ctx);
  assert.equal(route.path, '/api/mcpstudio'); assert.deepEqual(route.methods, ['POST']);
  assert.equal(definitions[0].name, 'mcpstudio_manage'); assert.equal(typeof guard, 'function');
  const request = body => route.fetch(new Request('http://localhost/api/mcpstudio', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }));
  const response = await request({ action: 'list' });
  assert.deepEqual(await response.json(), { ok: true, value: { servers: [] } });
  assert.equal(response.headers.get('cache-control'), 'no-store');
  const unknown = await request({ action: 'fake' }); assert.equal(unknown.status, 400);
  assert.equal((await unknown.json()).error.code, 'UNKNOWN_ACTION');
  const badJson = await route.fetch(new Request('http://localhost/api/mcpstudio', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' }));
  assert.equal(badJson.status, 400);
  for (const cleanup of cleanups) await cleanup();
});
