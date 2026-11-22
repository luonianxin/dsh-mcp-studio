import test from 'node:test';
import assert from 'node:assert/strict';
import { McpStudio } from '../lib/studio.js';

// 探测结果可能回显凭据；清理临时脱敏缓存不能让回显越过响应边界。
test('probe redacts echoed credentials before releasing temporary secret scope', async () => {
  let closed = 0;
  const studio = new McpStudio({
    unit: { loadAll: async () => ({ tables: { servers: {} } }), close: async () => {} },
    credentials: {}, tools: {},
    connector: async (_row, secret) => ({
      getServerCapabilities: () => ({}),
      getServerVersion: () => ({ name: secret.headers.Authorization, version: '1' }),
      close: async () => { closed++; }
    })
  });
  await studio.init();
  try {
    const result = await studio.dispatch('probe', { name: 'probe', transport: 'http', url: 'http://127.0.0.1/mcp', credentials: { mode: 'replace', authType: 'bearer', bearer: 'probe-only-sensitive-value' } }, 'ui');
    assert.doesNotMatch(JSON.stringify(result), /probe-only-sensitive-value/);
    assert.equal(closed, 1);
  } finally { await studio.close(); }
});
