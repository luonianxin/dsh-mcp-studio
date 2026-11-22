import test from 'node:test';
import assert from 'node:assert/strict';
import { profileInventory } from '../lib/inventory.js';
import { McpStudio } from '../lib/studio.js';
const row = (id, serverName, extra = {}) => ({ options: { id, name: '@deepseek-ai/dsh-mcp-client', config: { serverName, transport: 'stdio', command: 'secret-command', args: ['private-arg'], env: { TOKEN: 'private-token' }, ...extra } } });
const schema = name => ({ name, description: '公开工具', parameters: { type: 'object', properties: { text: { type: 'string' } } } });
const registry = (...items) => ({ schemas: () => items });
test('盘点仅投影 MCP 来源并剔除 URL 凭据、路径、查询和进程配置', () => {
  const entries = [row('native-one', 'one'), row('native-http', 'web', { transport: 'streamable-http', url: 'https://user:password@example.com/private-token?token=private-token#private-token', headers: { Authorization: 'private-token' } }), { options: { id: 'ordinary', name: 'ordinary', config: {} } }];
  const result = profileInventory({ entries: () => entries }, registry(schema('mcp__one__echo'), schema('mcp__web__query'), schema('read')));
  assert.equal(result.external.length, 2);
  assert.equal(result.external[1].endpoint, 'https://example.com');
  assert.equal(result.external[0].tools[0].inputSchema.type, 'object');
  assert.equal(result.external[0].status, 'registered');
  assert.doesNotMatch(JSON.stringify(result), /private-|secret-command|password|Authorization|command|args|env/);
  assert.deepEqual(result.warnings, []);
});
test('缺失来源、工具枚举失败、无工具和重复命名空间不伪装连通', () => {
  assert.deepEqual(profileInventory(undefined, registry()).warnings, ['PROFILE_SOURCE_UNAVAILABLE']);
  const editor = { entries: () => [row('one', 'dup'), row('two', 'dup'), row('empty', 'empty')] };
  const result = profileInventory(editor, registry(schema('mcp__dup__echo'), schema('mcp__orphan__echo')));
  assert.ok(result.external.every(server => server.status === 'unavailable' && server.tools.length === 0));
  assert.ok(result.warnings.includes('PROFILE_TOOL_SOURCE_UNRESOLVED'));
  assert.deepEqual(profileInventory(editor, { schemas() { throw new Error('private-error'); } }).warnings, ['PROFILE_TOOLS_UNAVAILABLE']);
});
test('配置数量与参数 Schema 输出有界且返回截断提示', () => {
  const result = profileInventory({ entries: () => Array.from({ length: 101 }, (_, i) => row(`entry-${i}`, `server${i}`)) }, registry({ name: 'mcp__server0__huge', parameters: { description: 'x'.repeat(3 * 1024 * 1024) } }));
  assert.equal(result.external.length, 100);
  assert.ok(result.warnings.includes('PROFILE_SERVERS_TRUNCATED'));
  assert.ok(result.warnings.includes('PROFILE_TOOLS_TRUNCATED'));
});
test('UI 与 Agent 共用盘点且外部 ID 无管理和授权通道', async () => {
  const inventory = () => profileInventory({ entries: () => [row('one', 'one')] }, registry(schema('mcp__one__echo')));
  const studio = new McpStudio({ unit: { loadAll: async () => ({}), close: async () => {} }, inventory });
  await studio.init();
  try {
    assert.deepEqual(await studio.dispatch('inventory', {}, 'agent'), await studio.dispatch('inventory', {}, 'ui'));
    for (const caller of ['ui', 'agent']) for (const action of ['connect', 'delete', 'callTool', 'setPolicy']) {
      await assert.rejects(studio.dispatch(action, { id: 'external:one' }, caller), error => ['NOT_FOUND', 'USER_ONLY'].includes(error.code));
    }
    assert.deepEqual(await studio.dispatch('list', {}, 'agent'), { servers: [] });
  } finally { await studio.close(); }
});
