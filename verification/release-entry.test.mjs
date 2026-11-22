import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const manifest = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));
const patch = await readFile(new URL('cordis.patch.yml', root), 'utf8');
const entry = manifest.exports['.'];
const { apply } = await import(new URL(entry, root));
test('发布入口直接绑定独立模块路径且真实 Fetch inventory 返回列表', async () => {
  assert.ok(patch.includes(`name: '${entry}'`));
  const source = await readFile(new URL(entry, root), 'utf8');
  assert.ok(source.includes('./release-0.2.3/studio.js'));
  assert.ok(!source.includes('?release='));
  let route; const cleanups = [];
  const ctx = {
    get: key => key === 'configEditor' ? { entries: () => [{options:{id:'native',name:'@deepseek-ai/dsh-mcp-client',config:{serverName:'native',transport:'stdio'}}}] } : undefined,
    storage: { backend: { get: () => ({kv:{open: async () => ({loadAll:async()=>({}),close:async()=>{}})}}) } },
    credentials: {},
    tools: { schemas: () => [{name:'mcp__native__echo',description:'Echo',parameters:{type:'object'}}],register:()=>()=>{},guard:()=>()=>{} },
    effect: callback => { const dispose=callback(); cleanups.push(dispose); return dispose; },
    connection: { fetch: { register: value => {route=value; return async()=>{};} } },
  };
  await apply(ctx);
  try {
    const response = await route.fetch(new Request('http://localhost/api/mcpstudio',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'inventory',payload:{}})}));
    const body = await response.json();
    assert.equal(response.status,200);
    assert.equal(body.ok,true);
    assert.equal(body.value.external[0].toolCount,1);
    assert.deepEqual(body.value.warnings,[]);
  } finally { for (const dispose of cleanups) await dispose(); }
});
