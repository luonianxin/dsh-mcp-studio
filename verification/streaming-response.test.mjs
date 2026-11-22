import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { connectMcp } from '../lib/connector.js';

// 服务发送完整 SSE 消息后保持 HTTP 流打开，客户端仍应立即完成握手。
for (const warmup of [0, 3]) test(`HTTP limit preserves progressive SSE delivery (warmup frames: ${warmup})`, { timeout: 10000 }, async () => {
  const server = createServer(async (req, res) => {
    if (req.method !== 'POST') { res.writeHead(405); res.end(); return; }
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const message = JSON.parse(Buffer.concat(chunks).toString());
    if (message.method !== 'initialize') { res.writeHead(202); res.end(); return; }
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' });
    for (let i = 0; i < warmup; i++) res.write(`:${'x'.repeat(2 * 1024 * 1024)}\n\n`);
    res.write(`event: message\ndata: ${JSON.stringify({ jsonrpc: '2.0', id: message.id, result: { protocolVersion: message.params.protocolVersion, capabilities: {}, serverInfo: { name: 'streaming-fixture', version: '1' } } })}\n\n`);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let client;
  try {
    client = await connectMcp({ transport: 'http', url: `http://127.0.0.1:${server.address().port}/mcp` }, { headers: {}, env: {} }, { timeoutMs: 1500 });
    assert.equal(client.getServerVersion().name, 'streaming-fixture');
  } finally {
    await client?.close();
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
});
