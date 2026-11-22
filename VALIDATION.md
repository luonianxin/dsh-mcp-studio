# 0.2.5 公开发行准备

补齐安装说明、MIT 许可证、仓库元数据、原创图标位图、变更日志和 GitHub Actions。保持已验证的后端与 UI 行为不变。完整回归 31 项通过、0 项失败（约 6.51 秒），JavaScript 语法检查通过。分发校验按当前 manifest 核对许可证、发布入口及包内源文件；仓库年龄以 GitHub created_at 为准，不用本地历史冒充。

# 0.2.4 下拉菜单

认证方式、凭据处理、JSON 导入服务选择共 3 处改为统一 Select，参照 Desktop 重启菜单的 5px 内距、10px 卡片圆角、32px 行高、7px 行圆角和阴影，使用相同主题令牌。使用原生 Popover 顶层，避免被原生 dialog 裁剪或遮挡；点击外部关闭，选择后恢复焦点，支持方向键、Home/End、Enter、Escape、Tab 和前缀检索。

真实 Chromium 中挂载源码提取的 Select、完整 CSS 和 React 18.3.1，在原生 showModal 弹窗内验证：选择更新、Home/End、Escape 仅关闭菜单且弹窗保持打开、Tab 移至下一控件、点击外部关闭均通过；390px 窗口菜单边界 x=41、width=308，无横向溢出。此为组件浏览器验证，不代替登录后的完整 DSH 设置页视觉验收。

完整回归 31 项通过、0 项失败（约 11.95 秒），语法与 diff 检查通过。本次仅更新前端，宿主入口及 release-0.2.3 后端文件保持原版本路径，不触发后端模块换代。

# 0.2.3 列表请求失败修复

用户截图显示整个列表“请求失败”。真实宿主调用 `mcpstudio_manage` 的 `inventory` 返回 `UNKNOWN_ACTION`，确认页面已更新而活动后端仍执行旧模块。此前只调用 `profileInventory` 的检查未覆盖完整请求，这是验证遗漏。

修复使用补丁相对路径 `./host-0.2.3.js` 直接绑定发布入口，入口和依赖均使用 `release-0.2.3/` 下的独立真实路径，避免包名解析缓存与内部模块缓存。仅改变包根导出或使用导入 query 的尝试没有通过真实复测，已弃用。安装后已通过插件管理器重新启用活动宿主入口。

真实调用已由 `UNKNOWN_ACTION` 变为成功。通过公开 `connection.createSharedFetchHandler('/api')` 和宿主 browserPeer 调用相同 `POST /api/mcpstudio` 路由：HTTP 200，`ok: true`，返回 1 个 Studio 服务及 playwright 25、chrome-devtools 33、github 46 个注册工具，warnings 为空。设置页 `mcp-studio` 注册仍 active；浏览器控制不可用，未声称完成视觉验收。临时检查插件已卸载。

完整回归 31 项通过，0 项失败（约 5.62 秒）；新增测试从实际分发入口调用 Fetch inventory，校验补丁绑定、独立模块路径和返回列表，避免只测试盘点函数。原有配置和授权保留；单个不可达的测试连接显示 error，不影响来源列表成功返回。

后续发布必须生成新的入口和发布依赖目录并同步补丁，不能只修改版本号或复用旧文件路径。

# 0.2.0 统一 MCP 来源浏览

完整回归：`node --test --test-isolation=none test/*.test.js verification/*.test.mjs`，30 项通过、0 项失败，约 7.30 秒。新增 4 项覆盖配置来源过滤、URL 敏感部分剔除、原始进程配置不外泄、命名空间歧义、不可用与截断提示，以及 UI/Agent 盘点一致和外部 ID 无管理权限。原有 26 项协议、权限、资源、生命周期和包发现测试继续通过。

2026-11-22，0.2.0 已通过插件管理器安装，返回 `application: applied`、`warnings: []`。临时只读检查插件调用同一 `profileInventory` 实现，使用真实宿主 `configEditor` 和 `tools` 服务，得到 playwright、chrome-devtools、github 三个原生来源，盘点警告为空；检查插件随后卸载。现有 Studio 连接、工具与 Agent 授权保留。检查只输出来源及数量，不写入原始配置或凭据。

前端通过语法、翻译键一致性与静态 diff 检查。真实设置页的视觉验收仍需登录状态下检查；静态验证不代表实际界面验收。原生 MCP 工具注册状态不等价于连接健康或具体 Agent 权限。

# 0.1.4 弹窗背景修复

用户截图确认设置入口已出现，但添加服务弹窗透出下层文字。原弹窗与页面共享 `--dsw-alias-bg-base`。弹窗改为使用浮层色 `--dsw-alias-bg-overlay`，通过 CSS relative color 保留 RGB 并将 alpha 固定为 1；不支持时采用系统 `Canvas` 不透明底色。保留原生 `showModal()` 交互。

Chromium 原生 CSS 检查通过：alpha 为 0.12 的颜色转换后得到不透明的 `color(srgb ...)`。这只验证颜色计算，不等于用户实际设置页已经验收；宿主或其他插件是否还有额外样式覆盖仍未确认。临时样式诊断插件已卸载。

# 0.1.3 客户端发现修复

当前 DSH 0.2.1-rc.2（687f282）的运行诊断确认：`loader.internal.resolveSync` 不可用，客户端模块发现回退到 `createRequire(baseUrl).resolve(packageName + '/package.json')`。旧包未导出 `./package.json`，触发 `ERR_PACKAGE_PATH_NOT_EXPORTED`，Host 的客户端加载清单因此没有 MCP Studio，且包元数据缓存为 `null`。浏览器刷新及插件停用/启用均未改变清单。

修复：新增 `exports["./package.json"] = "./package.json"`，保留其余入口。新增 `verification/client-discovery.test.mjs`，使用真实 Node 包解析复现同一错误；修复前 1 项失败，修复后 1 项通过。此测试验证包发现路径，不替代真实 UI 验收。

安装修复包后需要重启 DSH Host，以清除已有的空元数据缓存。重启后的客户端清单、设置入口和实际页面仍待验证。

# 0.1.1 历史验证记录

以下为 0.1.1 打包时记录；后续已安装到 web profile。

## 最终结果

使用 Node 原生测试运行器执行 `node --test --test-isolation=none test/*.test.js verification/*.test.mjs`：**25 项通过，0 项失败**，本轮约 4.94 秒。

覆盖：

- 配置持久化、凭据保留/替换/清除、默认拒绝、动态工具注册与撤销、过期句柄拒绝。
- 真实环回 HTTP MCP 服务的 SDK 握手、Bearer 认证、工具发现、工具调用和资源读取。
- 真实 12 MiB 工具响应被拒绝。
- 完整 SSE 消息发送后保持连接打开，握手仍立即完成；累计 6 MiB 的多个正常帧不会触发单帧限额。
- 跨数据块 CRLF 分隔符和单个超限 SSE 事件。
- 管理请求在读取期间超限即拒绝，即使流的取消回调永不结束也能返回。
- 临时探测凭据被服务器回显时先脱敏再清理缓存。
- 损坏配置逐条隔离。
- 非响应连接、非响应存储与排队任务同时存在时，关闭测试约 2.02 秒完成；排队操作也受 8 个并发额度约束。
- 深层、超大返回值及脱敏替换的增长边界。

## 实现要点

管理请求限 1 MiB；HTTP JSON 响应与 SSE 单帧限 4 MiB。结果采用有总预算的遍历，避免逐层重复序列化。关闭立即撤销能力并取消等待；连接与队列清理等待 1 秒、存储再等待 1 秒。不会因未完成的定时器额外停留 30 秒。

## 尚未覆盖

真实 DSH 设置页挂载、启停和卸载，以及真实 stdio 子进程的端到端验证，需在用户批准安装后完成。本轮使用真实本地 HTTP 协议测试和隔离的 Host 服务契约替身，不能据此宣称已完成真实宿主验收。

stdio 原始消息读取依赖固定版本 SDK，已核实其默认 ReadBuffer 为 10 MiB；插件自身只在 SDK 解析后的结果边界继续限制。插件与 Host 同进程，以上措施降低已发现风险，不提供进程隔离级别的崩溃保证。有界等待也不代表强制终止不配合的外部操作。
