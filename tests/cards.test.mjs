// tests/cards.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readHtml } from './helpers.mjs';

test('cards com selos de ícone', () => {
  const html = readHtml();
  assert.match(html, /class="card card--service"/);
  assert.match(html, /class="card card--value"/);
  assert.match(html, /class="icon-badge"/);
  for (const name of ['megaphone', 'palette', 'shield', 'code', 'check', 'eye', 'lightbulb']) {
    assert.match(html, new RegExp(`data-icon="${name}"`));
  }
});
