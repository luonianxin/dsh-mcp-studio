import test from 'node:test';
import assert from 'node:assert/strict';
import { connectMcp } from '../lib/connector.js';
import { startFixture } from './fixture.mjs';

// 独立于内存替身：真实 HTTP 服务返回过大的工具结果。
test('real HTTP rejects oversized MCP tool responses before normal delivery', { timeout: 15000 }, async () => {
  const fixture = await startFixture({ replyText: 'x'.repeat(12 * 1024 * 1024) });
  let client;
  try {
    client = await connectMcp({ transport: 'http', url: fixture.url }, { headers: { Authorization: 'Bearer fixture-only-token' }, env: {} }, { timeoutMs: 3000 });
    await assert.rejects(client.callTool({ name: 'echo', arguments: { message: 'small request' } }, undefined, { timeout: 3000 }), error => {
      assert.match(error.message, /limit|size|large|exceed/i);
      return true;
    });
  } finally {
    await client?.close();
    await fixture.close();
  }
});
