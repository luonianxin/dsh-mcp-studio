import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';

// 对齐没有 loader.internal.resolveSync 时宿主使用的包发现路径。
test('Host fallback discovery can resolve the exported manifest and client artifact', () => {
  const require = createRequire(import.meta.url);
  const manifestPath = require.resolve('@local/dsh-mcp-studio/package.json');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  assert.equal(manifest.name, '@local/dsh-mcp-studio');
  assert.equal(manifest.dsh.client.platform, 'web');
  assert.ok(readFileSync(require.resolve('@local/dsh-mcp-studio/client'), 'utf8').includes("id: '@local/dsh-mcp-studio'"));
});
