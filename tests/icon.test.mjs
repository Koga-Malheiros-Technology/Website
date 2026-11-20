// tests/icon.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readHtml } from './helpers.mjs';

test('SVG inline no cabeçalho e CTA de contato', () => {
  const html = readHtml();
  assert.match(html, /<svg[^>]*data-icon="mark"/);
  assert.match(html, /<svg[^>]*aria-hidden="true"/);
  assert.match(html, /<svg[^>]*stroke-width="1\.75"/);
  assert.match(html, /<a class="cta" href="#contato">Fale conosco<\/a>/);
  assert.match(html, /src="\/logo\.svg"[^>]*alt="[^"]+"/);
});

// O componente é compilado pelo Astro, não importável em Node puro; sem call
// site com chave de protótipo, cobrimos o contrato via asserção de fonte.
test('fallback vazio do ícone para chaves de protótipo', () => {
  const source = readFileSync(new URL('../src/components/Icon.astro', import.meta.url), 'utf8');
  assert.match(source, /const content = Object\.hasOwn\(icons, name\) \? icons\[name\] : undefined/);
  assert.match(source, /\{content && \(/);
  assert.match(source, /<svg data-icon=\{name\}/);
  assert.match(source, /stroke-width="1\.75"/);
});
