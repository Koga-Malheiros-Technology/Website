import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readHtml } from './helpers.mjs';

test('build gera HTML com lang pt-BR, main e base de domínio próprio', () => {
  const html = readHtml();
  const config = readFileSync(new URL('../astro.config.mjs', import.meta.url), 'utf8');
  const cname = readFileSync(new URL('../public/CNAME', import.meta.url), 'utf8').trim();
  assert.match(html, /<html lang="pt-BR">/);
  assert.match(html, /<main/);
  // O nome da org pode aparecer em links externos ao GitHub; o que não pode
  // acontecer é ele entrar nos caminhos locais do site publicado no domínio próprio.
  assert.doesNotMatch(html, /(?:src|href)="\/(?:Koga-Malheiros-Technology|Website)\//);
  assert.match(config, /base:\s*['"]\/['"]/);
  assert.match(config, /public\/CNAME/);
  assert.match(config, /site:/);
  assert.ok(cname.length > 0);
});

test('CNAME usa o domínio definitivo kmtechnology.com.br', () => {
  const cname = readFileSync(new URL('../public/CNAME', import.meta.url), 'utf8').trim();
  assert.equal(cname, 'kmtechnology.com.br');
  assert.doesNotMatch(cname, /\.invalid$/);
});
