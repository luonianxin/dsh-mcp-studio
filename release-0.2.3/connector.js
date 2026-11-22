import { settleWithin } from './lifecycle.js';

// SDK 仅在显式连接或恢复已授权连接时载入。
export const MAX_HTTP_RESPONSE_BYTES = 4 * 1024 * 1024;

export async function limitedResponse(response, maxBytes = MAX_HTTP_RESPONSE_BYTES) {
  if (!response.body) return response;
  const sse = response.headers.get('content-type')?.split(';')[0].trim().toLowerCase() === 'text/event-stream';
  let total = 0, lineBytes = 0, previousCR = false;
  const body = response.body.pipeThrough(new TransformStream({
    transform(chunk, controller) {
      const exceed = () => { const error = new Error('MCP response exceeds the configured size limit.'); error.code = 'LIMIT_EXCEEDED'; throw error; };
      if (!sse) {
        total += chunk.byteLength;
        if (total > maxBytes) exceed();
      } else {
        // SSE 以空行结束事件；CRLF、LF、CR 以及跨 chunk 分隔符均保留状态。
        for (const byte of chunk) {
          if (++total > maxBytes) exceed();
          if (previousCR && byte === 10) { previousCR = false; continue; }
          previousCR = false;
          if (byte === 13 || byte === 10) {
            if (lineBytes === 0) total = 0;
            lineBytes = 0; previousCR = byte === 13;
          } else lineBytes++;
        }
      }
      controller.enqueue(chunk);
    }
  }));
  return new Response(body, { status: response.status, statusText: response.statusText, headers: response.headers });
}

export async function connectMcp(server, secret, { signal, timeoutMs = 30000 } = {}) {
  const [{ Client }, { StreamableHTTPClientTransport }, { StdioClientTransport }] = await Promise.all([
    import('@modelcontextprotocol/sdk/client/index.js'),
    import('@modelcontextprotocol/sdk/client/streamableHttp.js'),
    import('@modelcontextprotocol/sdk/client/stdio.js')
  ]);
  signal?.throwIfAborted();
  const client = new Client({ name: 'dsh-mcp-studio', version: '1.0.0' }, { capabilities: {} });
  const transport = server.transport === 'http'
    ? new StreamableHTTPClientTransport(new URL(server.url), {
      requestInit: { headers: secret.headers, redirect: 'error' }, redirectPolicy: 'same-origin',
      fetch: async (input, init) => limitedResponse(await fetch(input, { ...init, redirect: 'error' }))
    })
    : new StdioClientTransport({ command: server.command, args: server.args, cwd: server.cwd, env: secret.env, stderr: 'ignore' });
  try { await client.connect(transport, { signal, timeout: timeoutMs }); return client; }
  catch (error) { await settleWithin(() => client.close()); throw error; }
}
