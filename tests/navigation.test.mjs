import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readHtml } from './helpers.mjs';

test('navegação, logo e contato sem links inválidos', () => {
  const html = readHtml();
  for (const id of ['sobre', 'valores', 'servicos', 'contato']) {
    assert.match(html, new RegExp(`href="#${id}"`));
  }
  assert.match(html, /src="\/logo\.svg"/);
  assert.match(html, /src="\/logo\.svg"[^>]*alt="[^"]+"/);
  assert.doesNotMatch(html, /mailto:|wa\.me/);
  assert.match(html, /id="contato"/);
});
