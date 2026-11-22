import { createServer } from 'node:http';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { ListToolsRequestSchema, CallToolRequestSchema, ListResourcesRequestSchema, ReadResourceRequestSchema } from '@modelcontextprotocol/sdk/types.js';

// 仅用于集成验证的环回 MCP 服务，无外部网络和真实凭据。
export async function startFixture({ replyText } = {}) {
  const transports = new Set();
  let calls = 0;
  const server = createServer(async (req, res) => {
    if (req.headers.authorization !== 'Bearer fixture-only-token') {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'unauthorized' }));
      return;
    }
    if (req.method !== 'POST') { res.writeHead(405); res.end(); return; }
    let transport;
    try {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const body = JSON.parse(Buffer.concat(chunks).toString());
      const mcp = new Server({ name: 'studio-fixture', version: '1.0.0' }, { capabilities: { tools: {}, resources: {} } });
      mcp.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: [{ name: 'echo', description: 'Echo an integration-test message', inputSchema: { type: 'object', properties: { message: { type: 'string' } }, required: ['message'] } }] }));
      mcp.setRequestHandler(CallToolRequestSchema, async request => {
        calls++;
        return { content: [{ type: 'text', text: replyText ?? request.params.arguments?.message ?? '' }] };
      });
      mcp.setRequestHandler(ListResourcesRequestSchema, async () => ({ resources: [{ uri: 'fixture://guide', name: 'Guide', mimeType: 'text/plain' }] }));
      mcp.setRequestHandler(ReadResourceRequestSchema, async () => ({ contents: [{ uri: 'fixture://guide', mimeType: 'text/plain', text: 'Integration fixture' }] }));
      transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
      transports.add(transport);
      res.on('close', () => { transports.delete(transport); void mcp.close(); });
      await mcp.connect(transport);
      await transport.handleRequest(req, res, body);
    } catch {
      if (!res.headersSent) res.writeHead(500);
      res.end();
      if (transport) await transport.close();
    }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return {
    url: `http://127.0.0.1:${server.address().port}/mcp`,
    get calls() { return calls; },
    async close() {
      await Promise.all([...transports].map(t => t.close()));
      server.closeAllConnections();
      await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
    },
  };
}
