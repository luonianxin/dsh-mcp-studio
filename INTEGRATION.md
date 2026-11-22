# Integration contract

## Runtime

The bundle patch mounts `host-0.2.3.js`, which imports the frozen `release-0.2.3/` backend modules. `index.js` and `lib/` are the development sources. When changing backend behavior, generate a new release entry and dependency directory and update the package export and patch together; updating the package version alone does not invalidate all Host module caches. UI-only releases can retain the existing backend entry.

The client registers the `mcp-studio` item in `settings.section` with order 17. It uses the Host-provided React runtime, locale service and theme tokens. Credentials are sent through the authenticated same-origin `POST /api/mcpstudio` route and are never persisted in browser storage.

## API

Request: `{action, payload}`. Success: `{ok: true, value}`. Failure: `{ok: false, error: {code, message}}`.

- `inventory`: Studio connections plus read-only native profile MCP sources and warnings.
- `list`: Studio connections only.
- User operations: `save`, `probe`, `setPolicy` and connection changes.
- Tool/resource operations: `discover`, `callTool`, `listResources`, `listResourceTemplates`, `readResource`.
- Shared backend dispatch applies caller-specific authorization. Agent calls cannot save credentials or grant themselves tools.

`ServerView` includes `id`, `name`, `transport`, `enabled`, `status`, `tools`, `policy`, `authType` and `credentials.configured`. Credential values are omitted. Save does not connect automatically; the UI connects after a successful probe/save.

Native sources are matched by MCP namespace and never registered a second time. Registration is not a live-health or Agent-permission assertion. Original command arguments, environment variables and headers are excluded from this read-only inventory.

## Verification

Run `pnpm run check` and `pnpm test`. The latter includes real loopback HTTP protocol tests and the actual distribution entry. Browser component checks and Host integration evidence are recorded separately in `VALIDATION.md`.
