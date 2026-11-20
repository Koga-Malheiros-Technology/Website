import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readHtml } from './helpers.mjs';

test('sem dados reais, a seção de sistemas não publica conteúdo de exemplo', () => {
  const html = readHtml();
  const data = readFileSync(new URL('../src/data/site.ts', import.meta.url), 'utf8');
  const page = readFileSync(new URL('../src/pages/index.astro', import.meta.url), 'utf8');
  assert.match(page, /ProjectCard/);
  assert.match(page, /site\.projects\.length/);
  if (/projects:\s*\[\s*\]/.test(data)) {
    assert.doesNotMatch(html, /id="sistemas"/);
  } else {
    assert.match(html, /id="sistemas"/);
  }
  assert.doesNotMatch(html, /Sistema A|Exemplo/);
});

test('Recupera aparece em Sistemas com print e link', () => {
  const html = readHtml();
  const png = readFileSync(new URL('../public/images/recupera.png', import.meta.url));
  assert.match(html, /id="sistemas"/);
  assert.match(html, /Recupera/);
  assert.match(html, /recuperação tributária de ICMS, com módulos da CAT 42 e da CAT 207/);
  assert.match(html, /src="\/images\/recupera.png"/);
  assert.match(html, /alt="Tela de login do sistema Recupera"/);
  assert.match(html, /href="https:\/\/recupera\.kmtechnology\.com\.br"/);
  for (const tech of ['React', 'Material UI', 'Axios']) assert.ok(html.includes(tech));
  assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.equal(png.readUInt32BE(16), 1280);
  assert.equal(png.readUInt32BE(20), 900);
});
