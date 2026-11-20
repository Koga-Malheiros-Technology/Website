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
