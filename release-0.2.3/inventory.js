// 仅投影已知 MCP 配置字段，不复制凭据、命令参数或原始 Loader 对象。
const PACKAGE = '@deepseek-ai/dsh-mcp-client';
const text = (value, max = 256) => typeof value === 'string' ? value.slice(0, max) : '';
function endpoint(config) {
  if (config.transport === 'stdio') return 'stdio';
  try { const url = new URL(config.url); return ['http:', 'https:'].includes(url.protocol) ? url.origin : ''; }
  catch { return ''; }
}
export function profileInventory(configEditor, tools) {
  const warnings = [];
  if (!configEditor) return { external: [], warnings: ['PROFILE_SOURCE_UNAVAILABLE'] };
  let entries;
  try { entries = configEditor.entries(); }
  catch { return { external: [], warnings: ['PROFILE_SOURCE_UNAVAILABLE'] }; }
  const candidates = entries.filter(entry => entry?.options?.name === PACKAGE);
  if (candidates.length > 100) warnings.push('PROFILE_SERVERS_TRUNCATED');
  const external = candidates.slice(0, 100).map(entry => {
    const config = entry.options.config ?? {};
    const namespace = typeof config.serverName === 'string' && /^[A-Za-z0-9_-]{1,32}$/.test(config.serverName) ? config.serverName : '';
    const entryId = text(entry.options.id);
    const enabled = entry.options.disabled !== true;
    return { id: `external:${entryId}`, entryId, name: namespace || entryId, source: 'profile', readOnly: true, namespace,
      transport: config.transport === 'stdio' ? 'stdio' : config.transport === 'streamable-http' ? 'http' : 'unknown',
      endpoint: endpoint(config), enabled, status: enabled ? 'unavailable' : 'disabled', tools: [], toolCount: 0 };
  });
  let schemas;
  try { schemas = tools.schemas(); }
  catch { warnings.push('PROFILE_TOOLS_UNAVAILABLE'); return { external, warnings }; }
  let count = 0, bytes = 0;
  for (const tool of schemas) {
    if (typeof tool.name !== 'string' || !tool.name.startsWith('mcp__')) continue;
    const owners = external.filter(server => server.enabled && server.namespace && tool.name.startsWith(`mcp__${server.namespace}__`));
    if (owners.length !== 1) { warnings.push('PROFILE_TOOL_SOURCE_UNRESOLVED'); continue; }
    const server = owners[0];
    if (count >= 1000) { warnings.push('PROFILE_TOOLS_TRUNCATED'); break; }
    let schema;
    try {
      const json = JSON.stringify(tool.parameters ?? {});
      if (json.length > 2 * 1024 * 1024 || (bytes += Buffer.byteLength(json)) > 2 * 1024 * 1024) { warnings.push('PROFILE_TOOLS_TRUNCATED'); break; }
      schema = JSON.parse(json);
    } catch { warnings.push('PROFILE_SCHEMA_UNAVAILABLE'); continue; }
    server.tools.push({ name: text(tool.name, 256), description: text(tool.description, 8192), inputSchema: schema });
    server.toolCount++; server.status = 'registered'; count++;
  }
  return { external, warnings: [...new Set(warnings)] };
}
