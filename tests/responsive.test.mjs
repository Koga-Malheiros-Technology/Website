import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8');

test('print do sistema é contido no card', () => {
  const rule = css.match(/article img\s*\{[^}]*\}/)?.[0];
  assert.ok(rule, 'regra article img ausente');
  assert.match(rule, /width:\s*100%/);
  assert.match(rule, /aspect-ratio:\s*16\s*\/\s*9/);
  assert.match(rule, /object-fit:\s*cover/);
  assert.match(rule, /display:\s*block/);
});

test('grades crescem de uma para duas e três colunas', () => {
  const list = css.match(/section > ul\s*\{[^}]*\}/)?.[0];
  assert.match(list, /grid-template-columns:\s*minmax\(0,\s*1fr\)/);
  const tablet = css.match(/@media \(min-width: 640px\)\s*\{[^}]*section > ul[^}]*\{[^}]*\}/)?.[0];
  assert.match(tablet, /repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(css, /@media \(min-width: 1024px\)/);
  assert.match(css, /repeat\(3,\s*minmax\(0,\s*1fr\)\)/);
  assert.doesNotMatch(css, /@media \(min-width: 768px\)/);
});
