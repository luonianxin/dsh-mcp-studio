import test from 'node:test';
import assert from 'node:assert/strict';
import { connectMcp as connector } from '../lib/connector.js';
import { McpStudio } from '../lib/studio.js';
import { startFixture } from './fixture.mjs';

function stores() {
  const rows = {}, credentials = new Map(), registered = new Map();
  return {
    rows, registered,
    unit: {
      loadAll: async () => ({ tables: { servers: structuredClone(rows) } }),
      putRecord: async (_t, id, row) => { rows[id] = structuredClone(row); },
      deleteRecord: async (_t, id) => { delete rows[id]; }, close: async () => {},
    },
    credentials: {
      readRecord: async key => structuredClone(credentials.get(key)),
      modifyRecord: async (key, fn) => { credentials.set(key, await fn(credentials.get(key))); },
      deleteRecord: async key => { credentials.delete(key); },
    },
    tools: { register: definition => { registered.set(definition.name, definition); return () => registered.delete(definition.name); } },
  };
}

test('real HTTP MCP: discovery, safe views, invocation, revoke and durable policy', { timeout: 15000 }, async () => {
  const fixture = await startFixture(), state = stores();
  const studio = new McpStudio({ ...state, connector, timeoutMs: 3000 });
  await studio.init();
  try {
    const draft = { name: 'Fixture', transport: 'http', url: fixture.url, enabled: true, credentials: { mode: 'replace', authType: 'bearer', bearer: 'Bearer fixture-only-token' } };
    const probe = await studio.dispatch('probe', draft, 'ui');
    assert.equal(probe.tools[0].name, 'echo');
    assert.equal(probe.tools[0].inputSchema.properties.message.type, 'string');
    const row = await studio.dispatch('save', draft, 'ui');
    assert.equal(JSON.stringify(row).includes('fixture-only-token'), false);
    assert.equal(JSON.stringify(state.rows).includes('fixture-only-token'), false);
    await studio.dispatch('connect', { id: row.id }, 'ui');
    assert.equal(state.registered.size, 0);
    await assert.rejects(studio.dispatch('callTool', { id: row.id, name: 'echo', arguments: { message: 'blocked' } }, 'agent'), /not enabled/);
    const result = await studio.dispatch('callTool', { id: row.id, name: 'echo', arguments: { message: 'hello' } }, 'ui');
    assert.equal(result.content[0].text, 'hello');
    const resources = await studio.dispatch('listResources', { id: row.id }, 'ui');
    assert.equal(resources.resources[0].uri, 'fixture://guide');
    await studio.dispatch('setPolicy', { id: row.id, agentEnabled: true, allowedTools: ['echo'], allowResources: true }, 'ui');
    assert.equal(state.registered.size, 1);
    const tool = [...state.registered.values()][0];
    assert.equal((await tool.execute({ message: 'approved' }, {})).content[0].text, 'approved');
    await studio.dispatch('setPolicy', { id: row.id, agentEnabled: false, allowedTools: [], allowResources: false }, 'ui');
    assert.equal(state.registered.size, 0);
    await assert.rejects(tool.execute({ message: 'stale' }, {}), /revoked/);
    assert.equal(fixture.calls, 2);
    const reloaded = new McpStudio({ ...state, connector, timeoutMs: 3000 });
    await reloaded.init();
    try {
      const saved = (await reloaded.dispatch('list')).servers[0];
      assert.equal(saved.policy.agentEnabled, false);
      assert.equal(saved.credentials.configured, true);
    } finally { await reloaded.close(); }
  } finally { await studio.close(); await fixture.close(); }
});

test('timeout classification returns safe actionable feedback', async () => {
  const studio = new McpStudio({ ...stores(), connector: async () => { throw Object.assign(new Error('request timeout private-upstream-detail'), { code: -32001 }); } });
  await studio.init();
  try {
    await assert.rejects(studio.dispatch('probe', { name: 'Slow', transport: 'http', url: 'https://example.invalid/mcp', credentials: { mode: 'clear' } }, 'ui'), error => error.code === 'TIMEOUT' && !error.message.includes('private-upstream-detail'));
  } finally { await studio.close(); }
});

test('real HTTP MCP: authentication error does not leak the submitted credential', { timeout: 15000 }, async () => {
  const fixture = await startFixture(), state = stores();
  const studio = new McpStudio({ ...state, connector, timeoutMs: 3000 });
  await studio.init();
  try {
    await assert.rejects(studio.dispatch('probe', { name: 'Invalid', transport: 'http', url: fixture.url, credentials: { mode: 'replace', authType: 'bearer', bearer: 'wrong-private-token' } }, 'ui'), error => {
      assert.equal(error.code, 'AUTH_FAILED');
      assert.equal(error.message.includes('wrong-private-token'), false);
      return true;
    });
  } finally { await studio.close(); await fixture.close(); }
});
