import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readHtml } from './helpers.mjs';

test('HTML traz Sobre e os quatro valores', () => {
  const html = readHtml();
  assert.match(html, /Somos uma software house/);
  for (const titulo of ['Segurança', 'Qualidade', 'Transparência', 'Inovação']) {
    assert.ok(html.includes(titulo), `falta o valor ${titulo}`);
  }
  assert.doesNotMatch(html, /Sistema A/);
});
