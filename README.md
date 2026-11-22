# DSH MCP Studio · MCP 服务管理

<p><img src="./icon.svg" width="72" height="72" alt="MCP Studio icon"></p>

MCP service management in DSH Settings: HTTP/stdio connections, JSON import, tool schemas and manual debugging, resources, explicit per-tool Agent permissions, and read-only browsing of native MCP sources.

独立的 DSH Web 插件，入口为 **设置 → MCP 服务**，排在“插件”之后。使用宿主 React 插槽与主题颜色，统一浏览本插件连接与当前 profile 中的原生 MCP 来源。

## 安装

要求 DSH `>=0.2.1-rc.2 <0.3.0-0`，使用 Web 设置界面；已验证宿主为 DSH `0.2.1-rc.2`。本地开发使用 Node.js 22 或更高版本，CI 使用 Node.js 24。

```sh
dsh plugin add github:luonianxin/dsh-mcp-studio
```

也可在 DSH 插件管理工具中，以 `github:luonianxin/dsh-mcp-studio` 作为安装目标。安装后刷新 Web 页面，进入 **设置 → MCP 服务**。以插件管理器返回的应用状态判断是否需要重启宿主。安装会影响当前 profile 的所有会话。

项目使用原生 JavaScript，仓库包含全部运行文件，安装无需编译或构建脚本。包名 `@local/dsh-mcp-studio` 是既有插件标识，当前通过 GitHub 分发，未发布到 npm。建议从仓库发布的固定版本安装；不要手工修改 DSH profile。

## 功能与范围

- **本插件管理**：保留添加、编辑、连接、调试、资源和逐工具 Agent 授权。
- **配置 MCP**：通过 `configEditor.entries()` 识别 `@deepseek-ai/dsh-mcp-client`，按 `serverName` 与公开工具名称匹配，只读展示来源、工具描述和输入 Schema。工具已注册不代表实时连通或当前 Agent 有权调用。
- 外部来源不提供管理与调用操作，不迁移配置、不复制 Token、Header、环境变量、命令或参数，不重复注册工具。HTTP 端点只显示 origin，不显示 userinfo、路径、query 或 fragment。
- 目前覆盖本插件和原生 MCP Client；其他连接器需有可信来源适配后才能纳入。命名空间冲突、来源缺失、工具枚举失败和截断会显示提示。
- Agent 使用 `mcpstudio_manage` 的 `inventory` 动作获取同一视图；`list` 仍只返回 Studio 连接。外部来源 ID 无法用于管理操作。
- 盘点最多 100 个原生来源、1000 个工具，输入 Schema 累计最多 2 MiB，返回结果还受通用 4 MiB 和结构预算约束。

## 使用流程

1. 添加服务，选择远程 HTTP 或本地 stdio；也可粘贴 `mcpServers` JSON。
2. 远程服务填写 URL，选择 Bearer Token、自定义 Header 或无认证。Bearer 前缀由程序处理。
3. 测试连接，查看服务器返回的能力后保存。
4. 在工具页浏览工具名称、描述、输入 Schema，并手动输入 JSON 参数调试。
5. 在 Agent 权限页明确开放服务及指定工具。新服务默认不向 Agent 开放工具。

配置只属于本插件。手动调试与 Agent 授权相互独立；工具调用可能产生服务端副作用，请核对工具及参数再执行。

## 凭据与授权

凭据通过 DSH Credentials 服务保存，配置列表只返回是否已设置，不返回 Token 或环境变量的明文。编辑支持保留、替换、清除。更改连接目标或凭据会清空该服务的 Agent 授权，需要重新确认。

管理接口使用 DSH 已认证的同源 `/api/mcpstudio` 路由。不会通过聊天命令传递凭据，也不会把凭据放到浏览器持久化存储。错误与返回结果经过已知配置秘密的脱敏。宿主 Credentials 的具体静态加密能力取决于运行环境，本插件不额外承诺系统密钥库加密。

Agent 只能使用明确授权的工具；授予权限、修改凭据以及启动未授权的连接属于用户操作。禁用服务、撤销授权或删除服务会撤销对应工具注册。不会更改其他 MCP 插件的工具权限。

## 开发与验证

完整回归覆盖 HTTP 认证、工具发现、资源、授权撤销、响应大小限制、生命周期、原生来源盘点及实际发布入口。真实宿主已验证设置插槽和 `/api/mcpstudio` 列表请求；下拉框通过独立 Chromium 组件交互验证。完整设置页视觉效果及真实 stdio 子进程的端到端覆盖仍有限，详见 [验证记录](./VALIDATION.md)。插件与 Host 同进程运行。

本地验证：

```sh
pnpm install --ignore-scripts --node-linker=hoisted
pnpm run check
pnpm test
```

运行时依赖 `@modelcontextprotocol/sdk` 固定为 `1.32.2`。客户端复用 DSH 提供的 React，不打包另一份 React。插件没有依赖安装脚本。

第一版支持 Streamable HTTP 与 stdio，不包含旧 HTTP+SSE 传输和 OAuth 登录流程。资源和资源模板仅在服务端声明支持时可用。

## 0.1.1 稳定性修复

- 管理请求采用流式读取：上限 1 MiB，读取超时 10 秒；超限后不等待完整请求或取消回调结束。
- HTTP JSON 响应和单个 SSE 事件上限 4 MiB。SSE 事件完成后重置计数，支持持续连接及跨数据块的 CRLF 分隔符。
- MCP 返回值和工具发现设置累计大小预算；返回结构最多 20 层、每个容器最多 1000 项、总节点最多 20000。工具发现最多 1000 个工具、100 页，并检测重复游标。
- 最多管理 100 个服务，同时运行或排队的操作最多 8 个。Header 和环境变量映射各限 64 KiB。
- 凭据脱敏缓存按服务和临时探测分别管理；替换、删除和关闭时清理，探测结果先脱敏再释放临时缓存。
- 关闭时立即撤销注册并发出取消信号，连接/队列清理最多等待 1 秒，存储清理再最多等待 1 秒。此限制保证插件不无限等待，不等同于强制终止不配合的外部进程或存储操作。
- 单条损坏配置转为禁用状态并显示错误，其余配置继续加载。

stdio 的原始消息读取由固定版本 SDK 负责，其默认 ReadBuffer 上限为 10 MiB；插件另在解析后的结果边界实施上述限制。真实 stdio 子进程尚未端到端验收。

## 开发文件

- `index.js`：Host 插件注册与管理入口。
- `lib/`：连接、配置、凭据和授权实现。
- `client.js`：设置页 React 客户端。
- `locale/`：中英文显示元信息。
- `test/`：行为与权限验证。
- `cordis.patch.yml`：独立插件注册项。

图标为本项目原创 SVG。
