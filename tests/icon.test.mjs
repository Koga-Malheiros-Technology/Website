// tests/icon.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readHtml } from './helpers.mjs';

test('CTA de contato e logo PNG no cabeçalho', () => {
  const html = readHtml();
  assert.match(html, /<svg[^>]*aria-hidden="true"/);
  assert.match(html, /<svg[^>]*stroke-width="1\.75"/);
  assert.match(html, /<a class="cta" href="#contato">Fale conosco<\/a>/);
  assert.match(html, /src="\/logo\.png"[^>]*alt="[^"]+"/);
});

test('cabeçalho não exibe monograma ao lado da logo', () => {
  const html = readHtml();
  const header = html.match(/<header>[\s\S]*?<\/header>/)?.[0] ?? '';
  assert.doesNotMatch(header, /data-icon="mark"/);
});

test('rodapé não exibe ícone decorativo', () => {
  const html = readHtml();
  const footer = html.match(/<footer[\s\S]*?<\/footer>/)?.[0] ?? '';
  assert.doesNotMatch(footer, /<svg/);
});

test('arquivo da logo PNG está disponível publicamente', () => {
  const png = readFileSync(new URL('../public/logo.png', import.meta.url));
  assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
});

test('logo do cabeçalho é maior e mantém proporção', () => {
  const css = readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8');
  const rule = css.match(/header img\s*\{[^}]*\}/)?.[0] ?? '';
  assert.match(rule, /width:\s*56px/);
  assert.match(rule, /height:\s*56px/);
  assert.match(rule, /object-fit:\s*contain/);
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
