import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readHtml } from './helpers.mjs';

test('navegação, logo e contato sem links inválidos', () => {
  const html = readHtml();
  const data = readFileSync(new URL('../src/data/site.ts', import.meta.url), 'utf8');
  const email = data.match(/\bemail:\s*(['"])(.*?)\1/)?.[2] ?? '';
  const whatsapp = data.match(/\bwhatsapp:\s*(['"])(.*?)\1/)?.[2] ?? '';

  for (const id of ['sobre', 'valores', 'servicos', 'contato']) {
    assert.match(html, new RegExp(`href="#${id}"`));
  }
  assert.match(html, /src="\/logo\.svg"/);
  assert.match(html, /src="\/logo\.svg"[^>]*alt="[^"]+"/);

  if (email) {
    assert.match(html, /mailto:/);
  } else {
    assert.doesNotMatch(html, /mailto:/);
  }

  if (whatsapp) {
    assert.match(html, /wa\.me/);
    const digits = whatsapp.replace(/\D/g, '');
    assert.ok(
      html.includes(`https://wa.me/${digits}`),
      'href do WhatsApp deve conter apenas dígitos',
    );
  } else {
    assert.doesNotMatch(html, /wa\.me/);
  }

  assert.match(html, /id="contato"/);
});
