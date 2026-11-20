import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readHtml } from './helpers.mjs';

test('os quatro serviços aparecem na página', () => {
  const html = readHtml();
  for (const titulo of [
    'Marketing Digital',
    'Design',
    'Segurança da Informação',
    'Desenvolvimento de Software sob Encomenda',
  ]) {
    assert.ok(html.includes(titulo), `falta o serviço ${titulo}`);
  }
  assert.match(html, /id="servicos"/);
});
