import test from 'node:test';
import assert from 'node:assert/strict';
import { McpStudio } from '../lib/studio.js';
import { limitedResponse } from '../lib/connector.js';

const never = () => new Promise(() => {});
function fixture() {
  let stuck = false;
  const studio = new McpStudio({
    unit: { loadAll: async () => ({ tables: { servers: {} } }), putRecord: async () => { if (stuck) await never(); }, close: () => stuck ? never() : Promise.resolve() },
    credentials: {}, tools: { register: () => () => {} },
    connector: async () => ({ getServerCapabilities: () => ({}), getServerVersion: () => ({}), close: () => stuck ? never() : Promise.resolve(), callTool: never })
  });
  return { studio, block: () => { stuck = true; }, draft: { name: 'lifecycle', transport: 'http', url: 'http://127.0.0.1/mcp' } };
}

test('close bounds nonresponsive connection, storage and queued operations', { timeout: 5000 }, async () => {
  const { studio, block, draft } = fixture();
  await studio.init();
  const row = await studio.dispatch('save', draft, 'ui');
  await studio.dispatch('connect', { id: row.id }, 'ui');
  block();
  const calls = [studio.dispatch('callTool', { id: row.id, name: 'wait' }, 'ui'), studio.dispatch('save', { ...draft, id: row.id }, 'ui'), studio.dispatch('save', draft, 'ui')];
  const outcomes = Promise.allSettled(calls);
  const start = Date.now();
  await studio.close();
  assert.ok(Date.now() - start < 2800, 'shutdown exceeded its bounded cleanup window');
  assert.ok((await outcomes).every(item => item.status === 'rejected'));
  assert.equal(studio.registrations.size, 0);
  assert.equal(studio.secretScopes.size, 0);
});

test('operation admission cap includes queued mutations', { timeout: 5000 }, async () => {
  const { studio, block, draft } = fixture();
  await studio.init(); block();
  const outcomes = Promise.allSettled(Array.from({ length: 8 }, () => studio.dispatch('save', draft, 'ui')));
  await assert.rejects(studio.dispatch('save', draft, 'ui'), { code: 'LIMIT_EXCEEDED' });
  await studio.close(); await outcomes;
});

test('result budget rejects deep and oversized values before redaction', () => {
  const { studio } = fixture();
  let value = {};
  for (let i = 0; i < 25; i++) value = { child: value };
  assert.throws(() => studio.scrub(value), { code: 'LIMIT_EXCEEDED' });
  assert.throws(() => studio.scrub('x'.repeat(5 * 1024 * 1024)), { code: 'LIMIT_EXCEEDED' });
  studio.remember({ headers: { key: 'E' }, env: {} }, 'test');
  assert.equal(studio.scrub('EEE'), '[REDACTED][REDACTED][REDACTED]');
});

test('SSE limit handles split CRLF and rejects one oversized event', async () => {
  const encode = new TextEncoder();
  const text = ':123456789\r\n\r\n'.repeat(5);
  const stream = new ReadableStream({ start(controller) { for (const byte of encode.encode(text)) controller.enqueue(Uint8Array.of(byte)); controller.close(); } });
  assert.equal(await (await limitedResponse(new Response(stream, { headers: { 'Content-Type': 'text/event-stream' } }), 16)).text(), text);
  const oversized = await limitedResponse(new Response(':1234567890123456789\n\n', { headers: { 'Content-Type': 'text/event-stream' } }), 16);
  await assert.rejects(oversized.text(), { code: 'LIMIT_EXCEEDED' });
});
