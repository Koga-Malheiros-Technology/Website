// tests/polish.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readHtml } from './helpers.mjs';

test('contato, rodapé e grades responsivas', () => {
  const html = readHtml();
  const css = readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8');
  const contact = readFileSync(new URL('../src/components/ContactSection.astro', import.meta.url), 'utf8');
  assert.match(html, /Informações de contato em breve\./);
  assert.doesNotMatch(html, /mailto:|wa\.me/);
  assert.match(contact, /name="mail"/);
  assert.match(contact, /name="whatsapp"/);
  assert.match(html, /class="site-footer"/);
  assert.match(css, /minmax\(0,\s*1fr\)/);
  assert.match(css, /@media \(min-width: 640px\)/);
  assert.match(css, /\.card\s*\{[^}]*transition:/);
  assert.doesNotMatch(css, /@keyframes/);
});
