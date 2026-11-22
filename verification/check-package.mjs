import fs from 'node:fs';
import { gunzipSync } from 'node:zlib';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

const manifest = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const archive = process.argv[2] || `${manifest.name.replace(/^@/, '').replace('/', '-')}-${manifest.version}.tgz`;
const raw = fs.readFileSync(archive), tar = gunzipSync(raw);
const included = new Set();
for (let i = 0; i + 512 <= tar.length;) {
  const name = tar.subarray(i, i + 100).toString().split('\0')[0];
  if (!name) break;
  const size = parseInt(tar.subarray(i + 124, i + 136).toString().replace(/\0/g, '').trim(), 8) || 0;
  const type = String.fromCharCode(tar[i + 156]);
  const data = tar.subarray(i + 512, i + 512 + size);
  if (type === '0' || type === '\0') {
    assert.ok(name.startsWith('package/'));
    const relative = name.slice(8);
    assert.ok(!relative.split('/').includes('..'));
    if (relative === 'package.json') assert.deepEqual(JSON.parse(data), manifest, relative);
    else assert.deepEqual(data, fs.readFileSync(relative), relative);
    included.add(relative);
  }
  i += 512 + Math.ceil(size / 512) * 512;
}
for (const required of ['package.json', 'LICENSE', 'README.md', 'client.js', 'icon.svg', manifest.dsh.bundle.patch.replace(/^\.\//, ''), manifest.exports['.'].replace(/^\.\//, ''), 'release-0.2.3/studio.js', 'release-0.2.3/connector.js', 'release-0.2.3/inventory.js', 'release-0.2.3/lifecycle.js']) {
  assert.ok(included.has(required), `Missing distribution file: ${required}`);
}
assert.ok(![...included].some(path => path.includes('node_modules/') || path.includes('.git/')));
console.log('Verified files:', included.size);
console.log('Version:', manifest.version);
console.log('Bytes:', raw.length);
console.log('SHA256:', createHash('sha256').update(raw).digest('hex'));
