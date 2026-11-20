import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readHtml } from './helpers.mjs';

test('sem dados reais, a seção de sistemas não publica conteúdo de exemplo', () => {
  const html = readHtml();
  const page = readFileSync(new URL('../src/pages/index.astro', import.meta.url), 'utf8');
  assert.match(page, /ProjectCard/);
  assert.match(page, /site\.projects\.length/);
  assert.doesNotMatch(html, /id="sistemas"/);
  assert.doesNotMatch(html, /Sistema A|Exemplo/);
});
