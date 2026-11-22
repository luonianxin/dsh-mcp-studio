import test from 'node:test';
import assert from 'node:assert/strict';
import { apply } from '../index.js';

test('management request cap acts during streaming and does not await stuck cancellation', { timeout: 5000 }, async () => {
  let route;
  const cleanups = [];
  await apply({
    storage: { backend: { get: () => ({ kv: { open: async () => ({ loadAll: async () => ({ tables: { servers: {} } }), close: async () => {} }) } }) } },
    credentials: {}, tools: { guard: () => () => {}, register: () => () => {} },
    effect: callback => { cleanups.push(callback()); },
    connection: { fetch: { register: value => { route = value; return async () => {}; } } }
  });
  let timer;
  try {
    assert.equal(route.requestBody, 'streaming');
    let reads = 0;
    const body = new ReadableStream({
      pull(controller) { reads++; controller.enqueue(new Uint8Array(64 * 1024)); },
      cancel() { return new Promise(() => {}); }
    });
    const request = new Request('http://localhost/api/mcpstudio', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, duplex: 'half' });
    const response = await Promise.race([
      route.fetch(request),
      new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('request limit waited for EOF/cancellation')), 1500); })
    ]);
    assert.ok([400, 413].includes(response.status));
    assert.ok(['INVALID_INPUT', 'LIMIT_EXCEEDED'].includes((await response.json()).error.code));
    assert.ok(reads <= 18, `request continued reading past limit: ${reads}`);
  } finally {
    clearTimeout(timer);
    for (const cleanup of cleanups) await cleanup();
  }
});
