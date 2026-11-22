# Changelog

## 0.2.5 — 2026-11-22

- Prepare the public GitHub distribution with installation instructions, MIT license, repository metadata and CI.
- Keep the tested 0.2.3 backend and 0.2.4 dropdown behavior unchanged.
- Verify distribution contents against the current manifest and source files.

## 0.2.4 — 2026-11-22

- Replace native selects in authentication, credential handling and JSON import with menus matching DSH's restart menu.
- Support keyboard navigation, outside dismissal and narrow windows using the browser Popover top layer.

## 0.2.3 — 2026-11-22

- Bind the Host entry and backend dependencies to versioned real paths to avoid stale modules during upgrades.
- Verify the authenticated inventory route through the actual distribution entry.

## 0.2.0 — 2026-11-22

- Add a unified view of Studio-managed connections and read-only native profile MCP sources.
- Show tool descriptions and input schemas without copying credentials or registering tools twice.

## 0.1.x

- Add HTTP/stdio connections, JSON import, credentials, tool debugging, resource browsing and per-tool Agent permissions.
- Bound requests, responses, discovery, queues and shutdown; fix package discovery and dialog opacity.
