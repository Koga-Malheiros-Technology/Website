// tests/icon.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readHtml } from './helpers.mjs';

test('SVG inline no cabeçalho e CTA de contato', () => {
  const html = readHtml();
  assert.match(html, /<svg[^>]*data-icon="mark"/);
  assert.match(html, /<svg[^>]*aria-hidden="true"/);
  assert.match(html, /<svg[^>]*stroke-width="1\.75"/);
  assert.match(html, /<a class="cta" href="#contato">Fale conosco<\/a>/);
  assert.match(html, /src="\/logo\.svg"[^>]*alt="[^"]+"/);
});
