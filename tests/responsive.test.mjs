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

test('cabeçalho empilha no mobile e volta a uma linha no desktop', () => {
  assert.match(css, /a\s*\{[^}]*min-height:\s*44px/);
  assert.match(css, /header\s*\{[^}]*flex-wrap:\s*wrap/);
  assert.match(css, /header > div,\s*nav,\s*\.cta\s*\{[^}]*flex:\s*1 1 100%/);
  const desktop = css.match(/@media \(min-width: 640px\)\s*\{[\s\S]*?header > div,\s*nav,\s*\.cta\s*\{[^}]*flex:\s*0 1 auto/);
  assert.ok(desktop, 'cabeçalho desktop não restaurado');
});

test('logo mantém proporção e cresce no desktop', () => {
  const rule = css.match(/header img\s*\{[^}]*\}/)?.[0];
  assert.match(rule, /width:\s*56px/);
  assert.match(rule, /height:\s*56px/);
  assert.match(rule, /object-fit:\s*contain/);
  assert.match(css, /@media \(min-width: 640px\)[\s\S]*?header img\s*\{[^}]*width:\s*72px/);
});

test('herói usa espaçamento e título fluidos', () => {
  const hero = css.match(/\.hero\s*\{[^}]*\}/)?.[0];
  assert.match(hero, /padding:\s*clamp\(1\.75rem,\s*6vw,\s*4\.5rem\)\s+clamp\(1rem,\s*4vw,\s*3rem\)/);
  assert.match(css, /\.hero h1\s*\{[^}]*font-size:\s*clamp\(1\.75rem,\s*8vw,\s*3\.25rem\)/);
});
