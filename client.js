window.__ModuleLoader__.load({
  id: '@local/dsh-mcp-studio',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const { useState, useEffect, useRef, useId, useDeferredValue } = React;
    const namespace = '@local/dsh-mcp-studio';
    const dictionaries = {
      "en": {
        "title": "MCP services",
        "intro": "Browse MCP sources, manage Studio connections, and inspect configured tools.",
        "add": "Add service",
        "import": "Import JSON",
        "refresh": "Refresh",
        "services": "MCP sources",
        "searchServers": "Search services…",
        "searchTools": "Search tools by name or purpose…",
        "boundaryTitle": "Connection and access are separate",
        "boundary": "Manage connections and Agent grants for Studio services. Configuration sources are read-only and remain managed by their original plugins.",
        "loading": "Loading…",
        "working": "Working…",
        "retry": "Retry",
        "emptyServers": "No MCP services yet",
        "emptyServersHelp": "Add a remote URL to discover your first tools.",
        "noMatches": "No matching results.",
        "selectService": "Select a service to view its capabilities.",
        "tools": "Tools",
        "config": "Connection",
        "permissions": "Agent permissions",
        "resources": "Resources",
        "details": "Service details",
        "connected": "Connected",
        "disconnected": "Disconnected",
        "disabled": "Disabled",
        "connecting": "Connecting…",
        "error": "Error",
        "unknown": "Not checked",
        "enabled": "Enabled",
        "enableService": "Enable service",
        "probe": "Test connection",
        "discover": "Discover tools",
        "connect": "Connect",
        "disconnect": "Disconnect",
        "granted": "Allowed",
        "notGranted": "Not allowed",
        "agentAccess": "Agent access",
        "authentication": "Authentication",
        "toolPurpose": "Tool / purpose",
        "actions": "Actions",
        "debug": "Test tool",
        "emptyTools": "No tools discovered",
        "emptyToolsHelp": "Connect and discover tools to see what this service offers.",
        "manualNote": "Manual tests do not change Agent permissions. Tool calls can change external data.",
        "edit": "Edit connection",
        "remove": "Delete service",
        "removeTitle": "Delete this service?",
        "removeHelp": "The connection and its stored credentials will be removed. This cannot be undone.",
        "deleteConfirm": "Delete",
        "cancel": "Cancel",
        "close": "Close",
        "save": "Save connection",
        "savePermissions": "Save permissions",
        "saved": "Saved",
        "address": "Service URL",
        "command": "Command",
        "arguments": "Arguments (JSON array)",
        "name": "Service name",
        "nameHint": "For example: Team knowledge base",
        "remote": "Remote service",
        "advanced": "Advanced: local command",
        "json": "Paste JSON",
        "jsonLabel": "mcpServers JSON",
        "parse": "Parse and fill",
        "jsonHint": "Paste a configuration, then select a service. Nothing is saved until you confirm.",
        "importService": "Service to import",
        "editTitle": "Edit connection",
        "addTitle": "Add MCP service",
        "connectionHint": "Start with a service URL and, if needed, a token.",
        "urlHint": "Use the complete HTTP or HTTPS MCP endpoint.",
        "stdioHint": "The command runs on the DSH host. Only use commands you trust.",
        "authType": "Authentication method",
        "none": "No authentication",
        "bearer": "Bearer token",
        "headers": "Custom headers",
        "token": "Token",
        "tokenHint": "Paste the token without the Bearer prefix.",
        "headersLabel": "Headers (JSON object)",
        "envLabel": "Environment variables (JSON object)",
        "credentialAction": "Stored credentials",
        "preserve": "Keep existing credentials",
        "replace": "Replace credentials",
        "clear": "Clear credentials",
        "secretStored": "Credentials configured · values are never displayed",
        "noSecret": "No stored credentials",
        "secretHint": "Existing secrets are never sent back to this page. Keep preserves them; replace replaces the complete credential set; clear removes them.",
        "probeSuccess": "Connection successful",
        "probeRequired": "Test this configuration successfully before saving.",
        "latency": "Latency (ms)",
        "discovered": "Discovered tools",
        "invalidUrl": "Enter a complete HTTP or HTTPS URL.",
        "requiredName": "Enter a service name.",
        "requiredCommand": "Enter a command.",
        "invalidArgs": "Arguments must be a JSON array of strings.",
        "invalidObject": "Enter a JSON object with string values.",
        "invalidJson": "Enter valid JSON containing a non-empty mcpServers object.",
        "invalidToolArgs": "Tool arguments must be a JSON object.",
        "missingToken": "Enter a token or select no authentication.",
        "permissionTitle": "Choose what your Agent can use",
        "permissionHint": "Manual debugging remains separate from these grants. Changes take effect after saving.",
        "agentEnabled": "Allow Agent access to this service",
        "allowResources": "Allow Agent resource access",
        "allowTool": "Allow tool",
        "emptyPermissions": "Discover tools before granting tool access.",
        "schema": "Input schema",
        "toolArguments": "Arguments (JSON)",
        "run": "Run tool",
        "result": "Result",
        "toolError": "The tool returned an error",
        "noDescription": "No description provided.",
        "resourceHint": "Browse resources published by the service.",
        "loadResources": "Load resources",
        "emptyResources": "No resources returned.",
        "readResource": "Read resource",
        "resourceTemplates": "Resource templates",
        "templateHint": "Templates describe parameterized resource addresses.",
        "resourceUri": "Resource URI",
        "requestFailed": "The request failed. Please retry.",
        "invalidResponse": "The service returned an invalid response.",
        "credentials": "Credentials",
        "toolName": "Tool name",
        "unsaved": "Unsaved changes",
        "jsonUnsupported": "This entry must contain a URL or a command.",
        "resourceReadTitle": "Resource contents",
        "loadMore": "Load more",
        "cwd": "Working directory (optional)",
        "permissionReset": "Changing the endpoint, command or credentials clears existing Agent grants.",
        "error_INVALID_INPUT": "Check the connection fields and arguments.",
        "error_CONNECTION_FAILED": "Connection failed. Check the endpoint, credentials and server availability.",
        "error_OPERATION_FAILED": "MCP operation failed. Check the connection and input.",
        "error_CREDENTIAL_MISSING": "Saved credentials are unavailable. Replace or clear them.",
        "error_NOT_FOUND": "This service no longer exists. Refresh the list.",
        "error_NOT_AUTHORIZED": "This operation is not authorized.",
        "error_DISABLED": "Enable this service before connecting.",
        "error_UNKNOWN_TOOL": "Discover tools before granting access.",
        "error_STALE_CONNECTION": "The connection was cancelled. Please retry.",
        "error_LIMIT_EXCEEDED": "The service response exceeded the supported limit.",
        "error_USER_ONLY": "Use the MCP settings interface to change connections and permissions.",
        "error_CLOSED": "MCP Studio is unavailable. Reload the page.",
        "error_FORBIDDEN": "Your current connection cannot manage MCP services.",
        "error_AUTH_FAILED": "Authentication failed. Check your token or headers.",
        "error_TIMEOUT": "Connection timed out. Check the endpoint and retry.",
        "error_CANCELLED": "Connection was cancelled.",
        "studioSources": "Managed by MCP Studio",
        "profileSources": "Configured MCP",
        "emptyStudioSources": "No services managed here yet.",
        "emptyProfileSources": "No configured MCP sources found.",
        "readOnly": "Read-only",
        "source": "Source",
        "profileSource": "Profile configuration · managed by its original plugin",
        "sourceEntry": "Source entry ID",
        "endpoint": "Endpoint (redacted)",
        "toolNamespace": "Tool namespace",
        "registeredTools": "Registered tools",
        "registered": "Tools registered",
        "unavailable": "Unavailable / no tools registered",
        "externalDisclaimerTitle": "Configuration source · read-only",
        "externalDisclaimer": "Registered tools do not indicate live connectivity or permission for the current Agent. Configuration is managed by the original plugin. MCP Studio only displays public tool metadata for this source; connection management, permissions, tool execution and resource access are unavailable here.",
        "externalToolHint": "View the input schema only. Tools from configuration sources cannot be run in MCP Studio.",
        "externalEmptyTools": "Unavailable / no tools registered",
        "externalEmptyToolsHelp": "No public tools are registered for this source. Check its original plugin configuration; this is not a successful connection check.",
        "viewSchema": "View schema",
        "inventoryWarnings": "MCP source discovery warnings",
        "error_UNAUTHORIZED": "Reconnect to DSH to authenticate this request."
      },
      "zh": {
        "title": "MCP 服务",
        "intro": "统一浏览 MCP 来源，管理本插件连接，查看配置中的公开工具。",
        "add": "添加服务",
        "import": "导入 JSON",
        "refresh": "刷新",
        "services": "MCP 来源",
        "searchServers": "搜索服务…",
        "searchTools": "搜索工具名称或用途…",
        "boundaryTitle": "连接与授权，分别管理",
        "boundary": "本插件管理的服务可连接、调试及授权；配置来源仅供只读浏览，由原插件管理。",
        "loading": "正在加载…",
        "working": "正在处理…",
        "retry": "重试",
        "emptyServers": "还没有 MCP 服务",
        "emptyServersHelp": "添加一个远程地址，发现你的第一组工具。",
        "noMatches": "没有匹配的结果。",
        "selectService": "选择一个服务，查看它提供的能力。",
        "tools": "工具",
        "config": "连接配置",
        "permissions": "Agent 权限",
        "resources": "资源",
        "details": "服务详情",
        "connected": "已连接",
        "disconnected": "未连接",
        "disabled": "已停用",
        "connecting": "正在连接…",
        "error": "发生错误",
        "unknown": "尚未检查",
        "enabled": "启用",
        "enableService": "启用服务",
        "probe": "测试连接",
        "discover": "发现工具",
        "connect": "连接",
        "disconnect": "断开连接",
        "granted": "已开放",
        "notGranted": "未开放",
        "agentAccess": "Agent 已开放",
        "authentication": "认证",
        "toolPurpose": "工具 / 用途",
        "actions": "操作",
        "debug": "调试",
        "emptyTools": "尚未发现工具",
        "emptyToolsHelp": "连接并发现工具，查看此服务提供的能力。",
        "manualNote": "人工调试不改变 Agent 权限。工具调用可能修改外部数据。",
        "edit": "编辑连接",
        "remove": "删除服务",
        "removeTitle": "删除此服务？",
        "removeHelp": "连接配置与保存的凭据将被移除，此操作无法撤销。",
        "deleteConfirm": "确认删除",
        "cancel": "取消",
        "close": "关闭",
        "save": "保存连接",
        "savePermissions": "保存权限",
        "saved": "已保存",
        "address": "服务地址",
        "command": "启动命令",
        "arguments": "参数（JSON 数组）",
        "name": "服务名称",
        "nameHint": "例如：团队知识库",
        "remote": "远程服务",
        "advanced": "高级：本地命令",
        "json": "粘贴 JSON",
        "jsonLabel": "mcpServers JSON",
        "parse": "解析并填写",
        "jsonHint": "粘贴配置后选择一个服务，确认保存前不会写入。",
        "importService": "选择要导入的服务",
        "editTitle": "编辑连接",
        "addTitle": "添加 MCP 服务",
        "connectionHint": "一个地址，以及需要时填写的 Token，就能开始。",
        "urlHint": "请输入完整的 HTTP 或 HTTPS MCP 服务地址。",
        "stdioHint": "命令会在 DSH 宿主上运行，请仅使用你信任的命令。",
        "authType": "认证方式",
        "none": "无需认证",
        "bearer": "Bearer Token",
        "headers": "自定义 Header",
        "token": "Token",
        "tokenHint": "粘贴 Token，无需填写 Bearer 前缀。",
        "headersLabel": "Headers（JSON 对象）",
        "envLabel": "环境变量（JSON 对象）",
        "credentialAction": "已保存的凭据",
        "preserve": "保留现有凭据",
        "replace": "替换凭据",
        "clear": "清除凭据",
        "secretStored": "已配置凭据 · 凭据不回显",
        "noSecret": "未保存凭据",
        "secretHint": "现有密钥不会传回此页面。“保留”沿用凭据，“替换”会替换整组凭据，“清除”会移除凭据。",
        "probeSuccess": "连接成功",
        "probeRequired": "当前配置测试成功后才可保存。",
        "latency": "延迟（毫秒）",
        "discovered": "已发现工具",
        "invalidUrl": "请填写完整的 HTTP 或 HTTPS 地址。",
        "requiredName": "请填写服务名称。",
        "requiredCommand": "请填写启动命令。",
        "invalidArgs": "参数必须是字符串组成的 JSON 数组。",
        "invalidObject": "请填写值均为字符串的 JSON 对象。",
        "invalidJson": "请填写包含非空 mcpServers 对象的有效 JSON。",
        "invalidToolArgs": "工具参数必须是 JSON 对象。",
        "missingToken": "请填写 Token，或选择无需认证。",
        "permissionTitle": "决定 Agent 可以使用哪些能力",
        "permissionHint": "人工调试与这里的授权互不影响，修改后需保存才会生效。",
        "agentEnabled": "允许 Agent 访问此服务",
        "allowResources": "允许 Agent 读取资源",
        "allowTool": "允许工具",
        "emptyPermissions": "请先发现工具，再授予工具权限。",
        "schema": "输入参数规范",
        "toolArguments": "调用参数（JSON）",
        "run": "运行工具",
        "result": "返回结果",
        "toolError": "工具返回了错误",
        "noDescription": "未提供说明。",
        "resourceHint": "浏览此服务发布的资源。",
        "loadResources": "加载资源",
        "emptyResources": "服务未返回资源。",
        "readResource": "读取资源",
        "resourceTemplates": "资源模板",
        "templateHint": "模板描述带参数的资源地址。",
        "resourceUri": "资源 URI",
        "requestFailed": "请求失败，请重试。",
        "invalidResponse": "服务返回的数据格式无效。",
        "credentials": "凭据",
        "toolName": "工具名称",
        "unsaved": "尚未保存",
        "jsonUnsupported": "此配置必须包含服务地址或启动命令。",
        "resourceReadTitle": "资源内容",
        "loadMore": "加载更多",
        "cwd": "工作目录（选填）",
        "permissionReset": "修改地址、命令或凭据会清除现有 Agent 授权。",
        "error_INVALID_INPUT": "请检查连接配置和调用参数。",
        "error_CONNECTION_FAILED": "连接失败，请检查地址、凭据以及服务是否可用。",
        "error_OPERATION_FAILED": "MCP 操作失败，请检查连接与输入。",
        "error_CREDENTIAL_MISSING": "已保存的凭据不可用，请替换或清除凭据。",
        "error_NOT_FOUND": "此服务已不存在，请刷新列表。",
        "error_NOT_AUTHORIZED": "当前操作未获得授权。",
        "error_DISABLED": "请先启用此服务再连接。",
        "error_UNKNOWN_TOOL": "请先发现工具，再授予权限。",
        "error_STALE_CONNECTION": "连接已取消，请重试。",
        "error_LIMIT_EXCEEDED": "服务响应超出了支持的范围。",
        "error_USER_ONLY": "请通过 MCP 设置界面修改连接与权限。",
        "error_CLOSED": "MCP Studio 暂不可用，请重新加载页面。",
        "error_FORBIDDEN": "当前连接无权管理 MCP 服务。",
        "error_AUTH_FAILED": "认证失败，请检查 Token 或自定义 Header。",
        "error_TIMEOUT": "连接超时，请检查服务地址并重试。",
        "error_CANCELLED": "连接已取消。",
        "studioSources": "本插件管理",
        "profileSources": "配置 MCP",
        "emptyStudioSources": "暂无本插件管理的服务。",
        "emptyProfileSources": "未发现配置 MCP 来源。",
        "readOnly": "只读",
        "source": "来源",
        "profileSource": "配置来源 · 由原插件管理",
        "sourceEntry": "来源 entryId",
        "endpoint": "端点（已脱敏）",
        "toolNamespace": "工具命名空间",
        "registeredTools": "注册工具数",
        "registered": "工具已注册",
        "unavailable": "不可用 / 未注册工具",
        "externalDisclaimerTitle": "配置来源 · 只读浏览",
        "externalDisclaimer": "工具已注册不代表实时连通，也不代表当前 Agent 具备使用权限。配置由原插件管理。MCP Studio 仅展示此来源的公开工具元数据；此处不提供连接管理、授权、工具调用或资源读取。",
        "externalToolHint": "仅可查看输入参数规范。配置来源的工具不能在 MCP Studio 中运行。",
        "externalEmptyTools": "不可用 / 未注册工具",
        "externalEmptyToolsHelp": "此来源尚无已注册的公开工具，请检查原插件配置；这不表示连接测试成功。",
        "viewSchema": "查看 Schema",
        "inventoryWarnings": "MCP 来源发现警告",
        "error_UNAUTHORIZED": "请重新连接 DSH 以完成认证。"
      }
    };

    // 所有样式限制在组件内；颜色由宿主语义 token 提供。
    const css = `
.mcp-studio{container-type:inline-size;color:var(--mcp-text);font:inherit;line-height:1.5;min-width:0}
.mcp-studio,.mcp-studio-dialog{--mcp-text:var(--dsw-alias-label-primary);--mcp-muted:var(--dsw-alias-label-secondary);--mcp-bg:var(--dsw-alias-bg-base);--mcp-soft:var(--dsw-alias-bg-layer-1);--mcp-line:var(--dsw-alias-border-l1);--mcp-accent:var(--dsw-alias-brand-primary);color:var(--mcp-text)}
.mcp-studio *,.mcp-studio-dialog *{box-sizing:border-box}
.mcp-studio h2,.mcp-studio h3,.mcp-studio p,.mcp-studio-dialog h2,.mcp-studio-dialog p{margin:0}
.mcp-studio h2,.mcp-studio-dialog h2{font-size:20px;line-height:1.35;font-weight:650;letter-spacing:-.3px}
.mcp-studio h3{font-size:15px;font-weight:600}
.mcp-studio p,.mcp-studio-dialog p{color:var(--mcp-muted)}
.mcp-head,.mcp-service-head,.mcp-toolbar,.mcp-actions{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.mcp-head,.mcp-service-head,.mcp-toolbar{justify-content:space-between}
.mcp-head{margin-bottom:24px;align-items:flex-start}.mcp-head p{margin-top:6px;max-width:55ch}
.mcp-board{display:grid;grid-template-columns:minmax(190px,240px) minmax(0,1fr);border:1px solid var(--mcp-line);border-radius:12px;overflow:hidden;background:var(--mcp-bg);min-height:460px}
.mcp-sidebar{background:var(--mcp-soft);border-right:1px solid var(--mcp-line);padding:20px 12px;display:flex;flex-direction:column;gap:16px;min-width:0}
.mcp-side-label{display:flex;justify-content:space-between;padding:0 8px;font-size:13px;font-weight:600;color:var(--mcp-muted)}
.mcp-server-list{display:flex;flex-direction:column;gap:6px}.mcp-server{appearance:none;border:1px solid transparent;background:transparent;color:inherit;border-radius:8px;padding:12px;display:flex;align-items:center;gap:10px;text-align:left;cursor:pointer;min-width:0;width:100%;font:inherit}
.mcp-server:hover,.mcp-btn:hover{background:var(--mcp-soft)}.mcp-server[aria-current=true]{border-color:var(--mcp-accent);background:color-mix(in srgb,var(--mcp-accent) 9%,var(--mcp-bg))}
.mcp-server-copy{min-width:0;flex:1}.mcp-server-copy strong{display:block;overflow-wrap:anywhere}.mcp-server-copy small{display:block;margin-top:3px;color:var(--mcp-muted);font-size:12px}
.mcp-iconbox{width:34px;height:34px;border:1px solid var(--mcp-line);border-radius:9px;display:grid;place-items:center;flex-shrink:0;background:var(--mcp-bg);color:var(--mcp-accent)}
.mcp-side-note{margin-top:auto;padding:14px 8px 0;border-top:1px solid var(--mcp-line);font-size:12px;color:var(--mcp-muted)}.mcp-side-note strong{display:block;margin-bottom:5px;color:var(--mcp-text)}
.mcp-detail{min-width:0;padding:24px}.mcp-service-name{display:flex;align-items:center;gap:12px;min-width:0}.mcp-service-name h2{overflow-wrap:anywhere}.mcp-subline{display:flex;gap:10px;align-items:center;margin-top:5px;color:var(--mcp-muted);font-size:12px}
.mcp-tag{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--mcp-line);border-radius:5px;padding:2px 7px;font-size:12px;white-space:nowrap}.mcp-tag[data-active=true]{color:var(--mcp-accent);background:color-mix(in srgb,var(--mcp-accent) 8%,var(--mcp-bg))}
.mcp-stats{display:flex;gap:24px;flex-wrap:wrap;padding:18px 0;color:var(--mcp-muted);font-size:12px}.mcp-stats b{margin-left:8px;color:var(--mcp-text);font-size:14px}
.mcp-tabs{display:flex;border-bottom:1px solid var(--mcp-line);gap:4px;overflow:auto}.mcp-tab{font:inherit;white-space:nowrap;color:var(--mcp-muted);background:transparent;border:0;border-bottom:2px solid transparent;padding:12px;cursor:pointer;min-height:44px}.mcp-tab[aria-selected=true]{color:var(--mcp-accent);border-bottom-color:var(--mcp-accent);font-weight:600}
.mcp-pane{padding-top:22px}.mcp-toolbar{margin-bottom:18px}.mcp-toolbar .mcp-input{flex:1;max-width:340px}.mcp-toolbar small{color:var(--mcp-muted)}
.mcp-btn{appearance:none;font:inherit;font-size:13px;font-weight:550;min-height:40px;display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:8px 13px;border:1px solid var(--mcp-line);border-radius:7px;background:var(--mcp-bg);color:var(--mcp-text);cursor:pointer;transition:background .15s,border-color .15s;white-space:nowrap}.mcp-btn-primary{color:var(--mcp-accent);border-color:var(--mcp-accent);background:color-mix(in srgb,var(--mcp-accent) 10%,var(--mcp-bg))}.mcp-btn-danger{color:var(--dsw-alias-state-error-primary);border-color:var(--dsw-alias-state-error-primary)}
.mcp-studio button:disabled,.mcp-studio-dialog button:disabled{cursor:not-allowed;opacity:.55}
.mcp-studio :is(button,input,select,textarea):focus-visible,.mcp-studio-dialog :is(button,input,select,textarea):focus-visible{outline:2px solid var(--mcp-accent);outline-offset:3px}
.mcp-input{font:inherit;font-size:13px;min-height:40px;width:100%;min-width:0;border:1px solid var(--mcp-line);border-radius:7px;padding:9px 11px;background:var(--mcp-bg);color:var(--mcp-text)}.mcp-input::placeholder{color:var(--mcp-muted)}textarea.mcp-input{resize:vertical;min-height:120px;font-family:ui-monospace,Consolas,monospace;tab-size:2}
.mcp-field{display:flex;flex-direction:column;gap:7px;margin-bottom:18px;font-size:13px}.mcp-field>span{font-weight:600}.mcp-field small,.mcp-help{font-size:12px;color:var(--mcp-muted);line-height:1.6}.mcp-check{display:flex;gap:10px;align-items:center;font-size:13px;min-height:40px}.mcp-check input{accent-color:var(--mcp-accent);width:17px;height:17px;flex-shrink:0}
.mcp-field>label{font-weight:600}
/* 对齐 Desktop 重启菜单的间距、圆角、阴影与行状态。 */
.mcp-select{min-width:0;width:100%}.mcp-select-trigger{display:flex;align-items:center;justify-content:space-between;gap:9px;text-align:start;cursor:pointer}.mcp-select-trigger>span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.mcp-select-trigger>svg{width:14px;height:14px;flex:none;transition:transform .15s}.mcp-select-trigger[aria-expanded=true]>svg{transform:rotate(180deg)}
.mcp-select-menu{position:fixed;inset:auto;margin:0;padding:5px;border:1px solid var(--mcp-line);border-radius:10px;background:var(--mcp-soft,Canvas);color:var(--mcp-text,CanvasText);box-shadow:0 12px 32px color-mix(in srgb,#000 28%,transparent);overflow:auto;overscroll-behavior:contain;max-width:calc(100vw - 24px);font:inherit;scrollbar-width:thin;-webkit-app-region:no-drag}.mcp-select-menu::backdrop{background:transparent}.mcp-select-menu:popover-open{display:grid;grid-template-columns:minmax(0,1fr);gap:0}
.mcp-select-option{appearance:none;display:flex;align-items:center;gap:9px;width:100%;min-height:32px;padding:5px 9px;border:0;border-radius:7px;background:transparent;color:inherit;font:inherit;font-size:12px;line-height:20px;text-align:start;cursor:pointer}.mcp-select-option>span{flex:1;min-width:0;overflow-wrap:anywhere}.mcp-select-option>svg{width:14px;height:14px;flex:none;color:var(--mcp-accent)}.mcp-select-option:hover,.mcp-select-option:focus-visible{background:var(--dsw-alias-interactive-bg-hover);outline:none}.mcp-select-option[aria-selected=true]{font-weight:600}.mcp-select-trigger:disabled{cursor:not-allowed}
@media(pointer:coarse){.mcp-select-option{min-height:44px}}
@media(prefers-reduced-motion:reduce){.mcp-select-trigger>svg{transition:none}}
.mcp-table-head,.mcp-tool-row{display:grid;grid-template-columns:minmax(0,1fr) 90px 85px;align-items:center;gap:16px}.mcp-table-head{font-size:12px;color:var(--mcp-muted);padding:10px 0;border-bottom:1px solid var(--mcp-line)}.mcp-tool-row{padding:17px 0;border-bottom:1px solid var(--mcp-line)}.mcp-tool-name{font-family:ui-monospace,Consolas,monospace;font-size:13px;font-weight:600;overflow-wrap:anywhere}.mcp-tool-row p{font-size:12px;margin-top:5px;overflow-wrap:anywhere}.mcp-note{margin-top:18px;font-size:12px;color:var(--mcp-muted);display:flex;gap:8px;align-items:flex-start}
.mcp-empty{padding:36px 16px;text-align:center;color:var(--mcp-muted);display:grid;justify-items:center;gap:12px}.mcp-empty h3{color:var(--mcp-text)}.mcp-intro{margin-bottom:20px}.mcp-intro p{font-size:13px;margin-top:6px}.mcp-form-area{max-width:620px}.mcp-grant-row{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:14px 0;border-bottom:1px solid var(--mcp-line)}.mcp-grant-row p{font-size:12px;margin-top:4px}.mcp-grant-row>div{min-width:0}.mcp-grant-row strong{overflow-wrap:anywhere}
.mcp-alert{padding:12px 14px;border:1px solid var(--mcp-line);border-radius:8px;background:var(--mcp-soft);font-size:13px;margin-bottom:16px;overflow-wrap:anywhere}.mcp-alert[data-error=true]{border-color:var(--dsw-alias-state-error-primary);color:var(--dsw-alias-state-error-primary)}.mcp-alert[data-success=true]{border-color:var(--mcp-accent);color:var(--mcp-accent)}
.mcp-studio-dialog{font:inherit;line-height:1.5;background:var(--mcp-bg);border:1px solid var(--mcp-line);border-radius:12px;padding:0;width:min(620px,calc(100% - 32px));max-height:calc(100dvh - 48px);box-shadow:0 16px 60px color-mix(in srgb,var(--mcp-text) 20%,transparent)}.mcp-studio-dialog::backdrop{background:color-mix(in srgb,var(--mcp-text) 40%,transparent)}.mcp-dialog-content{padding:24px}.mcp-dialog-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:20px}.mcp-dialog-head p{font-size:13px;margin-top:6px}.mcp-dialog-footer{display:flex;justify-content:flex-end;gap:10px;flex-wrap:wrap;border-top:1px solid var(--mcp-line);padding-top:18px;margin-top:20px}.mcp-mode{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px}.mcp-mode button[aria-pressed=true]{border-color:var(--mcp-accent);color:var(--mcp-accent)}.mcp-pre{font:12px/1.6 ui-monospace,Consolas,monospace;white-space:pre-wrap;overflow-wrap:anywhere;background:var(--mcp-soft);border:1px solid var(--mcp-line);border-radius:7px;padding:14px;max-height:320px;overflow:auto;margin:10px 0 16px}.mcp-resource{border-bottom:1px solid var(--mcp-line);padding:16px 0}.mcp-resource code{font-size:12px;overflow-wrap:anywhere}.mcp-resource p{margin:5px 0 10px;font-size:13px}.mcp-studio svg,.mcp-studio-dialog svg{width:18px;height:18px;flex-shrink:0}
.mcp-studio-dialog{--mcp-bg:Canvas;--mcp-soft:Canvas;--mcp-text:var(--dsw-alias-label-primary,CanvasText);--mcp-muted:var(--dsw-alias-label-secondary,CanvasText);opacity:1;isolation:isolate;overflow:auto;overscroll-behavior:contain;color-scheme:inherit}
/* 浮层必须遮住下层文字；主题底色可能被背景插件设为半透明。 */
@supports (background:rgb(from Canvas r g b / 1)){
.mcp-studio-dialog{--mcp-bg:rgb(from var(--dsw-alias-bg-overlay,Canvas) r g b / 1);--mcp-soft:rgb(from var(--dsw-alias-bg-layer-1,Canvas) r g b / 1)}
}
@container (max-width:760px){.mcp-board{grid-template-columns:1fr}.mcp-sidebar{border-right:0;border-bottom:1px solid var(--mcp-line)}.mcp-server-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));max-height:220px;overflow:auto}.mcp-side-note{display:none}.mcp-detail{padding:18px}.mcp-tool-row{grid-template-columns:minmax(0,1fr) auto;gap:10px}.mcp-tool-row>.mcp-tag{grid-column:1;justify-self:start}.mcp-tool-row>.mcp-btn{grid-column:2;grid-row:1 / span 2}.mcp-table-head{display:none}.mcp-stats{gap:14px}.mcp-head{gap:16px}.mcp-tab{padding:10px 8px}}
.mcp-external-meta{display:grid;gap:12px;margin:20px 0 24px}.mcp-external-meta>div{display:grid;grid-template-columns:minmax(100px,140px) minmax(0,1fr);gap:12px;font-size:13px}.mcp-external-meta dt{color:var(--mcp-muted)}.mcp-external-meta dd{margin:0;min-width:0;overflow-wrap:anywhere}.mcp-tool-row.mcp-external-tool{grid-template-columns:minmax(0,1fr) auto}.mcp-tool-row.mcp-external-tool>.mcp-btn{grid-column:2;grid-row:auto}.mcp-source-group{display:flex;flex-direction:column;gap:8px;min-width:0}.mcp-subline{flex-wrap:wrap}.mcp-warnings ul{margin:8px 0 0;padding-left:20px}
@media(prefers-reduced-motion:reduce){.mcp-btn{transition:none}}
`;

    const paths = {
      plug: 'M8 3v5m8-5v5M6 8h12v3a6 6 0 0 1-6 6v4m0-4a6 6 0 0 1-6-6V8',
      plus: 'M12 5v14M5 12h14', import: 'M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5',
      shield: 'm12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3m-4 9 3 3 5-6',
      play: 'm8 4 12 8-12 8V4', close: 'm6 6 12 12M6 18 18 6',
      activity: 'M3 12h4l3-8 4 16 3-8h4', refresh: 'M20 7v5h-5M4 17v-5h5M6 6a8 8 0 0 1 13 2M5 16a8 8 0 0 0 13 2',
    };
    function Icon({ name }) {
      return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }, h('path', { d: paths[name] || paths.plug }));
    }
    function Button({ children, icon, primary, danger, ...props }) {
      return h('button', { type: 'button', ...props, className: `mcp-btn${primary ? ' mcp-btn-primary' : ''}${danger ? ' mcp-btn-danger' : ''}` }, icon && h(Icon, { name: icon }), children);
    }
    function Field({ label, hint, children }) {
      const id = useId();
      return h('div', { className: 'mcp-field' }, h('label', { htmlFor: id }, label), React.cloneElement(children, { id }), hint && h('small', null, hint));
    }
    // Popover 顶层避免菜单被 dialog 的滚动区域裁切。
    function Select({ id, value, options, onChange, disabled }) {
      const trigger = useRef(null);
      const menu = useRef(null);
      const [open, setOpen] = useState(false);
      const listId = useId();
      const search = useRef({ text: '', time: 0 });
      const rows = () => [...(menu.current?.querySelectorAll('[role="option"]') || [])];
      const place = () => {
        if (!trigger.current || !menu.current) return;
        const rect = trigger.current.getBoundingClientRect();
        const list = menu.current;
        const gap = 5, margin = 12;
        list.style.width = `${Math.min(Math.max(rect.width, 220), window.innerWidth - margin * 2)}px`;
        const below = window.innerHeight - rect.bottom - gap - margin;
        const above = rect.top - gap - margin;
        const upwards = below < Math.min(list.scrollHeight, 260) && above > below;
        list.style.maxHeight = `${Math.max(32, Math.min(260, upwards ? above : below))}px`;
        list.style.left = `${Math.max(margin, Math.min(rect.left, window.innerWidth - list.offsetWidth - margin))}px`;
        list.style.top = `${upwards ? Math.max(margin, rect.top - gap - list.offsetHeight) : rect.bottom + gap}px`;
      };
      const close = (restore = false) => {
        menu.current?.hidePopover();
        setOpen(false);
        if (restore) trigger.current?.focus();
      };
      const show = (edge) => {
        if (disabled || trigger.current?.matches(':disabled')) return;
        menu.current.showPopover();
        setOpen(true);
        place();
        const items = rows();
        const index = edge === 'first' ? 0 : edge === 'last' ? items.length - 1 : Math.max(0, options.findIndex(option => option.value === value));
        items[index]?.focus({ preventScroll: true });
        items[index]?.scrollIntoView({ block: 'nearest' });
      };
      useEffect(() => {
        if (!open) return;
        window.addEventListener('resize', place);
        window.addEventListener('scroll', place, true);
        return () => { window.removeEventListener('resize', place); window.removeEventListener('scroll', place, true); };
      }, [open]);
      useEffect(() => {
        const list = menu.current;
        const sync = () => setOpen(list.matches(':popover-open'));
        list.addEventListener('toggle', sync);
        return () => list.removeEventListener('toggle', sync);
      }, []);
      useEffect(() => { if (disabled) close(); }, [disabled]);
      const choose = next => { close(true); if (next !== value) onChange(next); };
      const navigate = event => {
        const items = rows();
        const current = items.indexOf(document.activeElement);
        let next;
        if (event.key === 'ArrowDown') next = (current + 1) % items.length;
        if (event.key === 'ArrowUp') next = (current - 1 + items.length) % items.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = items.length - 1;
        if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(true); return; }
        if (event.key === 'Tab') { close(true); return; }
        if (event.key.length === 1 && event.key !== ' ' && !event.ctrlKey && !event.metaKey && !event.altKey) {
          const now = Date.now();
          search.current.text = (now - search.current.time < 700 ? search.current.text : '') + event.key.toLocaleLowerCase();
          search.current.time = now;
          const index = options.findIndex(option => option.label.toLocaleLowerCase().startsWith(search.current.text));
          if (index >= 0) next = index;
        }
        if (next !== undefined) { event.preventDefault(); items[next]?.focus({ preventScroll: true }); items[next]?.scrollIntoView({ block: 'nearest' }); }
      };
      return h('div', { className: 'mcp-select' },
        h('button', { id, ref: trigger, type: 'button', role: 'combobox', className: 'mcp-input mcp-select-trigger', disabled, 'aria-expanded': open, 'aria-controls': listId, 'aria-haspopup': 'listbox', onClick: () => open ? close(true) : show(), onKeyDown: event => {
          if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) { event.preventDefault(); show(event.key === 'Home' ? 'first' : event.key === 'End' ? 'last' : undefined); }
        } }, h('span', null, options.find(option => option.value === value)?.label || value), h('svg', { viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true }, h('path', { d: 'm4 6 4 4 4-4', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }))),
        h('div', { id: listId, ref: menu, popover: 'auto', role: 'listbox', className: 'mcp-select-menu', 'aria-labelledby': id, onKeyDown: navigate }, options.map(option => h('button', { key: option.value, type: 'button', role: 'option', tabIndex: -1, 'aria-selected': option.value === value, className: 'mcp-select-option', onClick: () => choose(option.value) }, h('span', null, option.label), option.value === value && h('svg', { viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true }, h('path', { d: 'm3 8 3 3 7-7', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' }))))));
    }
    function Check({ label, checked, onChange, disabled }) {
      return h('label', { className: 'mcp-check' }, h('input', { type: 'checkbox', checked, disabled, onChange: e => onChange(e.target.checked) }), label);
    }
    function Alert({ children, error, success }) {
      return children ? h('div', { className: 'mcp-alert', role: error ? 'alert' : 'status', 'data-error': Boolean(error), 'data-success': Boolean(success) }, children) : null;
    }
    function Dialog({ title, description, children, onClose, t, busy }) {
      const ref = useRef(null);
      const titleId = useId();
      useEffect(() => {
        const previous = document.activeElement;
        const dialog = ref.current;
        dialog.showModal();
        return () => { dialog.close(); if (previous instanceof HTMLElement && previous.isConnected) previous.focus(); };
      }, []);
      return h('dialog', { ref, className: 'mcp-studio-dialog', 'aria-labelledby': titleId, onCancel: e => { e.preventDefault(); if (!busy) onClose(); } },
        h('div', { className: 'mcp-dialog-content' },
          h('div', { className: 'mcp-dialog-head' }, h('div', null, h('h2', { id: titleId }, title), description && h('p', null, description)),
            h('form', { method: 'dialog', onSubmit: e => { e.preventDefault(); if (!busy) onClose(); } }, h(Button, { type: 'submit', icon: 'close', 'aria-label': t('close'), disabled: busy }))), children));
    }
    const pretty = value => JSON.stringify(value, null, 2);
    const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
    function stringObject(text, t) {
      let value;
      try { value = JSON.parse(text || '{}'); } catch { throw new Error(t('invalidObject')); }
      if (!isObject(value) || Object.values(value).some(item => typeof item !== 'string')) throw new Error(t('invalidObject'));
      return value;
    }

    // API 与视图分离，精确协议由 Host 实现确认后集中接入。
    function createApi(ctx, t) {
      return async (action, payload = {}, signal) => {
        let response;
        try {
          response = await fetch('/api/mcpstudio', {
            method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, payload }), signal,
          });
        } catch (cause) {
          if (cause.name === 'AbortError') throw cause;
          throw new Error(t('requestFailed'));
        }
        let result;
        try { result = await response.json(); } catch { throw new Error(t('invalidResponse')); }
        if (!isObject(result)) throw new Error(t('invalidResponse'));
        if (!response.ok || !result.ok) {
          const code = result.error?.code || (response.status === 401 ? 'UNAUTHORIZED' : response.status === 403 ? 'FORBIDDEN' : '');
          throw new Error(t(Object.hasOwn(dictionaries.en, `error_${code}`) ? `error_${code}` : 'requestFailed'));
        }
        return result.value;
      };
    }

    function initialForm(server) {
      return {
        id: server?.id, name: server?.name || '', mode: server?.transport || 'http',
        url: server?.url || '', command: server?.command || '', cwd: server?.cwd || '', args: pretty(server?.args || []),
        enabled: server ? server.enabled : true,
        credentialMode: server ? 'preserve' : 'replace', authType: server?.authType || 'none',
        token: '', headers: '{}', env: '{}', json: '', importKey: '',
      };
    }
    function ConnectionDialog({ server, importMode, api, t, onClose, onSaved }) {
      const [form, setForm] = useState(() => ({ ...initialForm(server), ...(importMode ? { mode: 'json' } : {}) }));
      const [imports, setImports] = useState(null);
      const [error, setError] = useState('');
      const [probe, setProbe] = useState(null);
      const [busy, setBusy] = useState('');
      const generation = useRef(0);
      const controller = useRef(null);
      const actionLock = useRef(false);
      useEffect(() => () => { generation.current++; controller.current?.abort(); }, []);
      function change(patch) {
        generation.current++;
        controller.current?.abort();
        actionLock.current = false;
        setBusy(''); setError(''); setProbe(null);
        setForm(current => ({ ...current, ...patch }));
      }
      function payload() {
        const result = { id: form.id, name: form.name.trim(), transport: form.mode, enabled: form.enabled, credentials: { mode: form.credentialMode, authType: form.mode === 'stdio' ? 'none' : form.authType } };
        if (form.mode === 'http') {
          try { const url = new URL(form.url); if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.hash) throw new Error(); } catch { throw new Error(t('invalidUrl')); }
          result.url = form.url.trim();
          if (!result.name) result.name = new URL(result.url).hostname;
        } else {
          if (!form.command.trim()) throw new Error(t('requiredCommand'));
          result.command = form.command.trim();
          if (!result.name) result.name = result.command.split(/[\\/]/).pop();
          result.cwd = form.cwd.trim();
          try { result.args = JSON.parse(form.args); if (!Array.isArray(result.args) || result.args.some(arg => typeof arg !== 'string')) throw new Error(); } catch { throw new Error(t('invalidArgs')); }
        }
        if (form.credentialMode === 'replace') {
          if (form.mode === 'http' && form.authType === 'bearer') {
            if (!form.token.trim()) throw new Error(t('missingToken'));
            result.credentials.bearer = form.token.trim();
          }
          if (form.mode === 'http' && form.authType === 'headers') result.credentials.headers = stringObject(form.headers, t);
          if (form.mode === 'stdio') result.credentials.env = stringObject(form.env, t);
        }
        return result;
      }
      function cancel() {
        generation.current++; controller.current?.abort(); onClose();
      }
      function fillImport(key, entries) {
        const source = entries[key];
        if (!isObject(source) || (!source.url && !source.command)
          || ['url', 'command', 'cwd'].some(name => source[name] != null && typeof source[name] !== 'string')
          || (source.headers != null && (!isObject(source.headers) || Object.values(source.headers).some(value => typeof value !== 'string')))) throw new Error(t('jsonUnsupported'));
        const headers = source.headers || {};
        const authKey = Object.keys(headers).find(name => name.toLowerCase() === 'authorization');
        const bearer = authKey && /^Bearer\s+(.+)$/i.exec(headers[authKey]);
        const onlyBearer = bearer && Object.keys(headers).length === 1;
        change({ ...initialForm(), name: key, mode: source.url ? 'http' : 'stdio', url: source.url || '', command: source.command || '', cwd: source.cwd || '', args: pretty(source.args || []),
          authType: onlyBearer ? 'bearer' : Object.keys(headers).length ? 'headers' : 'none', token: onlyBearer ? bearer[1] : '', headers: pretty(headers), env: pretty(source.env || {}), json: '', importKey: key });
      }
      function parseImport() {
        try {
          const source = JSON.parse(form.json);
          if (!isObject(source.mcpServers) || !Object.keys(source.mcpServers).length) throw new Error(t('invalidJson'));
          setImports(source.mcpServers); fillImport(Object.keys(source.mcpServers)[0], source.mcpServers);
        } catch (cause) { setError(cause instanceof SyntaxError ? t('invalidJson') : cause.message); }
      }
      async function perform(action) {
        if (actionLock.current) return;
        let data;
        try { data = payload(); } catch (cause) { setError(cause.message); return; }
        if (action === 'save' && !probe) return;
        actionLock.current = true;
        const version = generation.current;
        const abort = new AbortController(); controller.current = abort;
        setBusy(action); setError('');
        try {
          const value = await api(action, data, abort.signal);
          if (version !== generation.current) return;
          if (action === 'probe') setProbe(value);
          else onSaved(value);
        } catch (cause) { if (version === generation.current && cause.name !== 'AbortError') setError(cause.message); }
        finally { if (version === generation.current) { setBusy(''); actionLock.current = false; } }
      }
      const input = (name, extra = {}) => h('input', { className: 'mcp-input', value: form[name], onChange: e => change({ [name]: e.target.value }), ...extra });
      const textarea = name => h('textarea', { className: 'mcp-input', value: form[name], spellCheck: false, onChange: e => change({ [name]: e.target.value }) });
      const select = (name, keys) => h(Select, { value: form[name], options: keys.map(key => ({ value: key, label: t(key) })), disabled: busy === 'save', onChange: value => change({ [name]: value }) });
      return h(Dialog, { title: t(server ? 'editTitle' : 'addTitle'), description: t('connectionHint'), t, onClose: cancel, busy: busy === 'save' },
        h('form', { onSubmit: e => { e.preventDefault(); perform('save'); } },
          h('fieldset', { disabled: busy === 'save', style: { border: 0, padding: 0, margin: 0, minWidth: 0 } },
            h('div', { className: 'mcp-mode' }, ['http', 'stdio', ...(!server ? ['json'] : [])].map(mode => h(Button, { key: mode, 'aria-pressed': form.mode === mode, onClick: () => change({ mode }) }, t({ http: 'remote', stdio: 'advanced', json: 'json' }[mode])))),
            form.mode === 'json' ? h(React.Fragment, null,
              h(Field, { label: t('jsonLabel'), hint: t('jsonHint') }, textarea('json')),
              h(Button, { onClick: parseImport, icon: 'import' }, t('parse')))
              : h(React.Fragment, null,
                imports && Object.keys(imports).length > 1 && h(Field, { label: t('importService') }, h(Select, { value: form.importKey, options: Object.keys(imports).map(key => ({ value: key, label: key })), disabled: busy === 'save', onChange: key => { try { fillImport(key, imports); } catch (cause) { setError(cause.message); } } })),
                h(Field, { label: t('name') }, input('name', { placeholder: t('nameHint'), maxLength: 100 })),
                form.mode === 'http' ? h(Field, { label: t('address'), hint: t('urlHint') }, input('url', { type: 'url', required: true, placeholder: 'https://example.com/mcp', autoComplete: 'off' }))
                  : h(React.Fragment, null, h(Field, { label: t('command'), hint: t('stdioHint') }, input('command', { required: true, autoComplete: 'off' })), h(Field, { label: t('arguments') }, textarea('args')), h(Field, { label: t('cwd') }, input('cwd'))),
                server && h('p', { className: 'mcp-help' }, t('permissionReset')),
                server && h(Field, { label: t('credentialAction'), hint: t('secretHint') }, select('credentialMode', ['preserve', 'replace', 'clear'])),
                form.credentialMode === 'replace' && (form.mode === 'http' ? h(React.Fragment, null,
                  h(Field, { label: t('authType') }, select('authType', ['none', 'bearer', 'headers'])),
                  form.authType === 'bearer' && h(Field, { label: t('token'), hint: t('tokenHint') }, input('token', { type: 'password', autoComplete: 'new-password' })),
                  form.authType === 'headers' && h(Field, { label: t('headersLabel') }, textarea('headers')))
                  : h(Field, { label: t('envLabel') }, textarea('env'))),
                h(Check, { label: t('enabled'), checked: form.enabled, onChange: enabled => change({ enabled }) })),
            h(Alert, { error: true }, error),
            probe && h(Alert, { success: true }, h('strong', null, t('probeSuccess')), h('div', null, t('discovered'), ': ', probe.tools?.length ?? probe.toolCount ?? 0), probe.latencyMs != null && h('div', null, t('latency'), ': ', probe.latencyMs)),
            form.mode !== 'json' && h('p', { className: 'mcp-help' }, t('probeRequired'))),
          h('div', { className: 'mcp-dialog-footer' },
            h(Button, { onClick: cancel, disabled: busy === 'save' }, t('cancel')),
            form.mode !== 'json' && h(Button, { onClick: () => perform('probe'), disabled: Boolean(busy), icon: 'activity' }, t(busy === 'probe' ? 'working' : 'probe')),
            h(Button, { type: 'submit', primary: true, disabled: !probe || Boolean(busy) }, t(busy === 'save' ? 'working' : 'save')))));
    }

    function ToolDialog({ tool, serverId, api, t, onClose }) {
      const [args, setArgs] = useState('{}');
      const [busy, setBusy] = useState(false);
      const [error, setError] = useState('');
      const [result, setResult] = useState(null);
      const lock = useRef(false);
      const alive = useRef(true);
      useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
      async function run() {
        if (lock.current) return;
        let parsed;
        try { parsed = JSON.parse(args); if (!isObject(parsed)) throw new Error(); } catch { setError(t('invalidToolArgs')); return; }
        lock.current = true; setBusy(true); setError(''); setResult(null);
        try { const value = await api('callTool', { id: serverId, name: tool.name, arguments: parsed }); if (alive.current) setResult(value); }
        catch (cause) { if (alive.current) setError(cause.message); }
        finally { lock.current = false; if (alive.current) setBusy(false); }
      }
      return h(Dialog, { title: tool.name, description: tool.description || t('noDescription'), onClose, t, busy },
        h('p', { className: 'mcp-help' }, t('manualNote')),
        h('details', { open: true }, h('summary', null, t('schema')), h('pre', { className: 'mcp-pre' }, pretty(tool.inputSchema || {}))),
        h(Field, { label: t('toolArguments') }, h('textarea', { className: 'mcp-input', spellCheck: false, value: args, disabled: busy, onChange: e => { setArgs(e.target.value); setError(''); } })),
        h(Alert, { error: true }, error || (result?.isError ? t('toolError') : '')),
        result !== null && h(React.Fragment, null, h('h3', null, t('result')), h('pre', { className: 'mcp-pre', tabIndex: 0 }, pretty(result))),
        h('div', { className: 'mcp-dialog-footer' }, h(Button, { onClick: onClose, disabled: busy }, t('close')), h(Button, { primary: true, icon: 'play', onClick: run, disabled: busy }, t(busy ? 'working' : 'run'))));
    }

    function Permissions({ server, tools, api, t, onSaved }) {
      const original = server.policy || { agentEnabled: false, allowedTools: [], allowResources: false };
      const [policy, setPolicy] = useState(original);
      const [busy, setBusy] = useState(false);
      const [error, setError] = useState('');
      const lock = useRef(false);
      const dirty = pretty(policy) !== pretty(original);
      useEffect(() => { setPolicy(original); }, [server.policy]);
      async function save() {
        if (lock.current) return;
        lock.current = true; setBusy(true); setError('');
        try { await api('setPolicy', { id: server.id, ...policy }); await onSaved(); }
        catch (cause) { setError(cause.message); }
        finally { lock.current = false; setBusy(false); }
      }
      return h('div', null,
        h('div', { className: 'mcp-intro' }, h('h3', null, t('permissionTitle')), h('p', null, t('permissionHint'))),
        h(Check, { label: t('agentEnabled'), checked: policy.agentEnabled, disabled: busy, onChange: agentEnabled => setPolicy(current => ({ ...current, agentEnabled })) }),
        h(Check, { label: t('allowResources'), checked: policy.allowResources, disabled: busy, onChange: allowResources => setPolicy(current => ({ ...current, allowResources })) }),
        !tools.length && h('p', { className: 'mcp-help' }, t('emptyPermissions')),
        tools.map(tool => h('div', { key: tool.name, className: 'mcp-grant-row' }, h('div', null, h('strong', { className: 'mcp-tool-name' }, tool.name), h('p', null, tool.description || t('noDescription'))),
          h(Check, { label: t('allowTool'), checked: policy.allowedTools.includes(tool.name), disabled: busy, onChange: allowed => setPolicy(current => ({ ...current, allowedTools: allowed ? [...current.allowedTools, tool.name] : current.allowedTools.filter(name => name !== tool.name) })) }))),
        h(Alert, { error: true }, error),
        h('div', { className: 'mcp-dialog-footer' }, dirty && h('span', { className: 'mcp-help' }, t('unsaved')), h(Button, { primary: true, onClick: save, disabled: busy || !dirty }, t(busy ? 'working' : 'savePermissions'))));
    }

    function Resources({ serverId, api, t, disabled }) {
      const [data, setData] = useState(null);
      const [resource, setResource] = useState(null);
      const [busy, setBusy] = useState('');
      const [error, setError] = useState('');
      const lock = useRef(false);
      const alive = useRef(true);
      useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
      async function perform(uri, pageKind) {
        if (lock.current || disabled) return;
        lock.current = true; setBusy(uri || 'list'); setError('');
        try {
          if (uri) {
            const value = await api('readResource', { id: serverId, uri });
            if (alive.current) setResource(value);
          } else {
            const kinds = pageKind ? [pageKind] : ['resources', 'templates'];
            const results = await Promise.allSettled(kinds.map(kind => api(kind === 'resources' ? 'listResources' : 'listResourceTemplates', {
              id: serverId, ...(pageKind ? { cursor: data[`${kind}Cursor`] } : {}),
            })));
            if (!alive.current) return;
            const next = pageKind ? { ...data } : { resources: [], templates: [] };
            const failures = [];
            results.forEach((result, index) => {
              const kind = kinds[index];
              if (result.status === 'rejected') { failures.push(result.reason.message); return; }
              const value = result.value;
              const items = value[kind === 'resources' ? 'resources' : 'resourceTemplates'] || [];
              const unique = new Map((pageKind ? next[kind] : []).map(item => [item.uri || item.uriTemplate, item]));
              items.forEach(item => unique.set(item.uri || item.uriTemplate, item));
              next[kind] = [...unique.values()];
              next[`${kind}Cursor`] = value.nextCursor === data?.[`${kind}Cursor`] ? undefined : value.nextCursor;
            });
            setData(next); setError(failures.join('\n'));
          }
        } catch (cause) { if (alive.current) setError(cause.message); }
        finally { lock.current = false; if (alive.current) setBusy(''); }
      }
      return h('div', null,
        h('div', { className: 'mcp-toolbar' }, h('p', { className: 'mcp-help' }, t('resourceHint')), h(Button, { onClick: () => perform(), disabled: disabled || Boolean(busy), icon: 'refresh' }, t(busy === 'list' ? 'loading' : 'loadResources'))),
        h(Alert, { error: true }, error),
        data && !data.resources.length && h('div', { className: 'mcp-empty' }, t('emptyResources')),
        data?.resources.map(item => h('div', { className: 'mcp-resource', key: item.uri }, h('h3', null, item.name || item.uri), h('code', null, item.uri), h('p', null, item.description), h(Button, { onClick: () => perform(item.uri), disabled: disabled || Boolean(busy) }, t(busy === item.uri ? 'loading' : 'readResource')))),
        data?.resourcesCursor && h(Button, { onClick: () => perform(null, 'resources'), disabled: disabled || Boolean(busy) }, t('loadMore')),
        data?.templates.length > 0 && h('section', null, h('h3', null, t('resourceTemplates')), h('p', { className: 'mcp-help' }, t('templateHint')), data.templates.map(item => h('div', { className: 'mcp-resource', key: item.uriTemplate }, h('strong', null, item.name), h('p', null, item.description), h('code', null, item.uriTemplate)))),
        data?.templatesCursor && h(Button, { onClick: () => perform(null, 'templates'), disabled: disabled || Boolean(busy) }, t('loadMore')),
        resource !== null && h(Dialog, { title: t('resourceReadTitle'), t, onClose: () => setResource(null) }, h('pre', { className: 'mcp-pre', tabIndex: 0 }, pretty(resource)), h('div', { className: 'mcp-dialog-footer' }, h(Button, { onClick: () => setResource(null) }, t('close')))));
    }

    function externalState(server) {
      if (!server.enabled || server.status === 'disabled') return 'disabled';
      return server.status === 'registered' && server.tools?.length ? 'registered' : 'unavailable';
    }

    // 配置来源只浏览公开工具元数据，不接收 API 或管理操作。
    function SchemaDialog({ tool, t, onClose }) {
      return h(Dialog, { title: tool.name, description: tool.description || t('noDescription'), t, onClose },
        h('p', { className: 'mcp-help' }, t('externalToolHint')),
        h('h3', null, t('schema')),
        h('pre', { className: 'mcp-pre', tabIndex: 0 }, pretty(tool.inputSchema || {})),
        h('div', { className: 'mcp-dialog-footer' }, h(Button, { onClick: onClose }, t('close')),
          h(Button, { disabled: true, icon: 'play', title: t('externalToolHint') }, t('run'))));
    }

    function ExternalDetails({ server, t, onViewSchema }) {
      const [query, setQuery] = useState('');
      const search = useDeferredValue(query.toLowerCase());
      const tools = server.tools || [];
      const displayedTools = tools.filter(tool => `${tool.name} ${tool.description || ''}`.toLowerCase().includes(search));
      return h(React.Fragment, null,
        h('div', { className: 'mcp-service-head' },
          h('div', { className: 'mcp-service-name' }, h('span', { className: 'mcp-iconbox' }, h(Icon, { name: 'plug' })),
            h('div', null, h('h2', null, server.name), h('div', { className: 'mcp-subline' },
              h('span', null, t(externalState(server))), h('span', { className: 'mcp-tag' }, (server.transport || 'unknown').toUpperCase()),
              h('span', { className: 'mcp-tag' }, t('readOnly')))))),
        h('div', { className: 'mcp-pane' },
          h(Alert, null, h('strong', null, t('externalDisclaimerTitle')), h('p', null, t('externalDisclaimer'))),
          h('dl', { className: 'mcp-external-meta' },
            h('div', null, h('dt', null, t('source')), h('dd', null, t('profileSource'))),
            h('div', null, h('dt', null, t('sourceEntry')), h('dd', null, server.entryId)),
            h('div', null, h('dt', null, t('endpoint')), h('dd', null, server.endpoint || t('unknown'))),
            server.namespace && h('div', null, h('dt', null, t('toolNamespace')), h('dd', null, server.namespace)),
            h('div', null, h('dt', null, t('registeredTools')), h('dd', null, server.toolCount ?? tools.length))),
          h('div', { className: 'mcp-toolbar' }, h('h3', null, t('tools')),
            h('input', { className: 'mcp-input', type: 'search', value: query, placeholder: t('searchTools'), 'aria-label': t('searchTools'), onChange: e => setQuery(e.target.value) })),
          !tools.length ? h('div', { className: 'mcp-empty' }, h('h3', null, t('externalEmptyTools')), h('p', null, t('externalEmptyToolsHelp')))
            : h('div', null, displayedTools.map(tool => h('div', { key: tool.name, className: 'mcp-tool-row mcp-external-tool' },
              h('div', null, h('div', { className: 'mcp-tool-name' }, tool.name), h('p', null, tool.description || t('noDescription'))),
              h(Button, { onClick: () => onViewSchema(tool) }, t('viewSchema')))),
              !displayedTools.length && h('div', { className: 'mcp-empty' }, t('noMatches')))));
    }

    function Studio({ ctx }) {
      React.useSyncExternalStore(callback => ctx.locale.subscribe(callback), () => ctx.locale.getSnapshot());
      const t = ctx.locale.bind(namespace);
      const api = React.useMemo(() => createApi(ctx, t), [ctx]);
      const [servers, setServers] = useState([]);
      const [warnings, setWarnings] = useState([]);
      const [selected, setSelected] = useState('');
      const [tab, setTab] = useState('tools');
      const [query, setQuery] = useState('');
      const [toolQuery, setToolQuery] = useState('');
      const [busy, setBusy] = useState({});
      const [error, setError] = useState('');
      const [dialog, setDialog] = useState(null);
      const [notice, setNotice] = useState('');
      const locks = useRef(new Set());
      const listVersion = useRef(0);
      const alive = useRef(true);
      const tabsId = useId();
      const search = useDeferredValue(query.toLowerCase());
      const toolSearch = useDeferredValue(toolQuery.toLowerCase());
      async function load() {
        const version = ++listVersion.current;
        const result = await api('inventory');
        if (!alive.current || version !== listVersion.current) return;
        if (!isObject(result) || !Array.isArray(result.servers) || !Array.isArray(result.external)
          || !Array.isArray(result.warnings) || result.warnings.some(warning => typeof warning !== 'string')) throw new Error(t('invalidResponse'));
        const items = [...result.servers.map(item => ({ ...item, source: 'studio', readOnly: false })),
          ...result.external.map(item => ({ ...item, source: 'profile', readOnly: true }))];
        setWarnings(result.warnings);
        setServers(items); setSelected(current => items.some(item => item.id === current) ? current : items[0]?.id || '');
      }
      async function act(key, operation) {
        if (locks.current.has(key)) return;
        locks.current.add(key); setBusy(current => ({ ...current, [key]: true })); setError(''); setNotice('');
        try { await operation(); }
        catch (cause) { if (alive.current) setError(cause.message); }
        finally { locks.current.delete(key); if (alive.current) setBusy(current => ({ ...current, [key]: false })); }
      }
      useEffect(() => {
        let current = true;
        alive.current = true; locks.current.add('list');
        setBusy(state => ({ ...state, list: true }));
        load().catch(cause => { if (current) setError(cause.message); }).finally(() => {
          if (current) { locks.current.delete('list'); setBusy(state => ({ ...state, list: false })); }
        });
        return () => { current = false; alive.current = false; listVersion.current++; };
      }, []);
      const server = servers.find(item => item.id === selected);
      const tools = server?.tools || [];
      const serverBusy = Boolean(busy[selected]);
      const granted = server?.policy?.agentEnabled ? server.policy.allowedTools || [] : [];
      const state = item => item.readOnly ? externalState(item) : !item.enabled ? 'disabled' : ['connected', 'disconnected', 'connecting', 'error'].includes(item.status) ? item.status : 'unknown';
      const groups = [
        { key: 'studio', title: 'studioSources', items: servers.filter(item => item.source === 'studio') },
        { key: 'profile', title: 'profileSources', items: servers.filter(item => item.source === 'profile') },
      ];
      const matchesServer = item => `${item.name} ${item.readOnly ? item.entryId || '' : ''} ${item.readOnly ? t('profileSource') : t('studioSources')}`.toLowerCase().includes(search);
      function serverAction(action, extra = {}) {
        if (!server || server.readOnly) return;
        const id = server.id;
        return act(id, async () => {
          let value;
          try { value = await api(action, { id, ...extra }); } catch (cause) { await load(); throw cause; }
          if (action === 'probe' && alive.current) setNotice(t('probeSuccess') + ' · ' + t('discovered') + ': ' + value.tools.length);
          try { if (action === 'save' && value.enabled) await api('connect', { id }); }
          finally { await load(); }
        });
      }
      function switchTab(next) { setTab(next); setToolQuery(''); }
      const displayedTools = tools.filter(tool => `${tool.name} ${tool.description || ''}`.toLowerCase().includes(toolSearch));
      return h('section', { className: 'mcp-studio', 'aria-label': t('title') },
        h('style', null, css),
        h('div', { className: 'mcp-head' }, h('div', null, h('h2', null, t('title')), h('p', null, t('intro'))),
          h('div', { className: 'mcp-actions' }, h(Button, { icon: 'refresh', disabled: busy.list, onClick: () => act('list', load), 'aria-label': t('refresh') }), h(Button, { icon: 'import', onClick: () => setDialog({ type: 'connection', importMode: true }) }, t('import')), h(Button, { primary: true, icon: 'plus', onClick: () => setDialog({ type: 'connection' }) }, t('add')))),
        h(Alert, { error: true }, error),
        h(Alert, { success: true }, notice),
        warnings.length > 0 && h(Alert, null, h('div', { className: 'mcp-warnings' }, h('strong', null, t('inventoryWarnings')),
          h('ul', null, warnings.map((warning, index) => h('li', { key: index }, warning))))),
        h('div', { className: 'mcp-board', 'aria-busy': Boolean(busy.list) },
          h('aside', { className: 'mcp-sidebar' },
            h('div', { className: 'mcp-side-label' }, h('span', null, t('services')), h('span', null, servers.length)),
            h('input', { className: 'mcp-input', type: 'search', value: query, placeholder: t('searchServers'), 'aria-label': t('searchServers'), onChange: e => setQuery(e.target.value) }),
            groups.map(group => h('div', { key: group.key, className: 'mcp-source-group' },
              h('div', { className: 'mcp-side-label' }, h('span', null, t(group.title)), h('span', null, group.items.length)),
              h('nav', { className: 'mcp-server-list', 'aria-label': t(group.title) }, group.items.filter(matchesServer).map(item => h('button', { key: item.id, type: 'button', className: 'mcp-server', 'aria-current': item.id === selected, onClick: () => { setSelected(item.id); setToolQuery(''); setNotice(''); } },
                h('span', { className: 'mcp-iconbox' }, h(Icon, { name: 'plug' })), h('span', { className: 'mcp-server-copy' }, h('strong', null, item.name),
                  h('small', null, t(state(item)), item.readOnly ? ' · ' + t('readOnly') : ''))))),
              !group.items.length && h('p', { className: 'mcp-help' }, t(group.key === 'profile' ? 'emptyProfileSources' : 'emptyStudioSources')))),
            search && !servers.some(matchesServer) && h('p', { className: 'mcp-help' }, t('noMatches')),
            h('div', { className: 'mcp-side-note' }, h('strong', null, t('boundaryTitle')), t('boundary'))),
          h('section', { className: 'mcp-detail', 'aria-label': t('details') },
            !server ? h('div', { className: 'mcp-empty' }, h('span', { className: 'mcp-iconbox' }, h(Icon, { name: 'plug' })), h('h3', null, t(busy.list ? 'loading' : 'emptyServers')), !busy.list && h('p', null, t('emptyServersHelp')), !busy.list && h(Button, { primary: true, icon: 'plus', onClick: () => setDialog({ type: 'connection' }) }, t('add')))
              : server.readOnly ? h(ExternalDetails, { key: server.id, server, t, onViewSchema: tool => setDialog({ type: 'externalSchema', tool }) })
              : h(React.Fragment, null,
                h('div', { className: 'mcp-service-head' }, h('div', { className: 'mcp-service-name' }, h('span', { className: 'mcp-iconbox' }, h(Icon, { name: 'plug' })), h('div', null, h('h2', null, server.name), h('div', { className: 'mcp-subline' }, h('span', null, t(state(server))), h('span', { className: 'mcp-tag' }, server.transport.toUpperCase())))),
                  h('div', { className: 'mcp-actions' }, h(Button, { icon: 'activity', disabled: serverBusy, onClick: () => serverAction('probe') }, t(serverBusy ? 'working' : 'probe')), h(Check, { label: t('enabled'), checked: server.enabled, disabled: serverBusy, onChange: enabled => serverAction('save', { enabled, credentials: { mode: 'preserve' } }) }))),
                h(Alert, { error: true }, server.lastError),
                h('div', { className: 'mcp-stats' }, h('span', null, t('tools'), h('b', null, tools.length)), h('span', null, t('agentAccess'), h('b', null, tools.filter(tool => granted.includes(tool.name)).length, ' / ', tools.length)), h('span', null, t('authentication'), h('b', null, t(server.authType || 'none')))),
                h('div', { className: 'mcp-tabs', role: 'tablist', 'aria-label': t('details') }, ['tools', 'config', 'permissions', 'resources'].map((key, index, all) => h('button', { key, id: `${tabsId}-${key}`, type: 'button', role: 'tab', className: 'mcp-tab', 'aria-selected': tab === key, 'aria-controls': `${tabsId}-panel`, tabIndex: tab === key ? 0 : -1, onClick: () => switchTab(key), onKeyDown: e => { let next; if (e.key === 'ArrowRight') next = (index + 1) % all.length; if (e.key === 'ArrowLeft') next = (index + all.length - 1) % all.length; if (e.key === 'Home') next = 0; if (e.key === 'End') next = all.length - 1; if (next !== undefined) { e.preventDefault(); switchTab(all[next]); document.getElementById(`${tabsId}-${all[next]}`)?.focus(); } } }, t(key)))),
                h('div', { className: 'mcp-pane', id: `${tabsId}-panel`, role: 'tabpanel', 'aria-labelledby': `${tabsId}-${tab}` },
                  tab === 'tools' && h(React.Fragment, null,
                    h('div', { className: 'mcp-toolbar' }, h('input', { className: 'mcp-input', type: 'search', value: toolQuery, 'aria-label': t('searchTools'), placeholder: t('searchTools'), onChange: e => setToolQuery(e.target.value) }), h(Button, { disabled: serverBusy || !server.enabled, onClick: () => serverAction('discover') }, t(serverBusy ? 'loading' : 'discover'))),
                    !tools.length ? h('div', { className: 'mcp-empty' }, h('h3', null, t('emptyTools')), h('p', null, t('emptyToolsHelp')))
                      : h('div', null, h('div', { className: 'mcp-table-head', 'aria-hidden': true }, h('span', null, t('toolPurpose')), h('span', null, t('permissions')), h('span', null, t('actions'))),
                        displayedTools.map(tool => h('div', { key: tool.name, className: 'mcp-tool-row' }, h('div', null, h('div', { className: 'mcp-tool-name' }, tool.name), h('p', null, tool.description || t('noDescription'))), h('span', { className: 'mcp-tag', 'data-active': granted.includes(tool.name) }, t(granted.includes(tool.name) ? 'granted' : 'notGranted')), h(Button, { disabled: !server.enabled || serverBusy, onClick: () => setDialog({ type: 'tool', tool, serverId: server.id }) }, t('debug')))), !displayedTools.length && h('div', { className: 'mcp-empty' }, t('noMatches'))),
                    h('div', { className: 'mcp-note' }, h(Icon, { name: 'shield' }), t('manualNote'))),
                  tab === 'config' && h('div', { className: 'mcp-form-area' }, h('div', { className: 'mcp-intro' }, h('h3', null, t('config')), h('p', null, t('secretHint'))),
                    h(Field, { label: t(server.transport === 'stdio' ? 'command' : 'address') }, h('input', { className: 'mcp-input', readOnly: true, value: server.url || server.command || '' })),
                    server.transport === 'stdio' && h(Field, { label: t('arguments') }, h('pre', { className: 'mcp-pre' }, pretty(server.args || []))),
                    h(Alert, null, t(server.credentials?.configured ? 'secretStored' : 'noSecret')),
                    h('div', { className: 'mcp-actions' }, h(Button, { onClick: () => setDialog({ type: 'connection', server }), disabled: serverBusy }, t('edit')), h(Button, { disabled: serverBusy || !server.enabled, onClick: () => serverAction(server.status === 'connected' ? 'disconnect' : 'connect') }, t(server.status === 'connected' ? 'disconnect' : 'connect')), h(Button, { danger: true, disabled: serverBusy, onClick: () => setDialog({ type: 'delete', server }) }, t('remove')))),
                  tab === 'permissions' && h(Permissions, { key: server.id, server, tools, api, t, onSaved: load }),
                  tab === 'resources' && h(Resources, { key: server.id, serverId: server.id, api, t, disabled: !server.enabled }))))),
        dialog?.type === 'connection' && h(ConnectionDialog, { ...dialog, api, t, onClose: () => setDialog(null), onSaved: value => { setDialog(null); setSelected(value.id); act(value.id, async () => { await load(); if (value.enabled) { try { await api('connect', { id: value.id }); } finally { await load(); } } setNotice(t('saved')); }); } }),
        dialog?.type === 'tool' && h(ToolDialog, { ...dialog, api, t, onClose: () => setDialog(null) }),
        dialog?.type === 'externalSchema' && h(SchemaDialog, { tool: dialog.tool, t, onClose: () => setDialog(null) }),
        dialog?.type === 'delete' && h(Dialog, { title: t('removeTitle'), description: t('removeHelp'), t, busy: Boolean(busy[dialog.server.id]), onClose: () => setDialog(null) }, h('strong', null, dialog.server.name), h('div', { className: 'mcp-dialog-footer' }, h(Button, { disabled: busy[dialog.server.id], onClick: () => setDialog(null) }, t('cancel')), h(Button, { danger: true, disabled: busy[dialog.server.id], onClick: () => act(dialog.server.id, async () => { await api('delete', { id: dialog.server.id }); setDialog(null); await load(); }) }, t(busy[dialog.server.id] ? 'working' : 'deleteConfirm')))));
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        for (const [language, dictionary] of Object.entries(dictionaries)) {
          ctx.effect(() => ctx.locale.register(namespace, language, dictionary));
        }
        ctx.slots.inject('settings.section', () => ctx.slots.register({
          name: 'settings.section', id: 'mcp-studio', order: 17,
          label: () => ctx.locale.bind(namespace)('title'),
        }, () => h(Studio, { ctx })));
      },
    };
  },
});
