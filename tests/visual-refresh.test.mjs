// tests/visual-refresh.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8');

test('paleta tecnológica e marcadores de acessibilidade', () => {
  const tokens = {
    '--cor-fundo': '#f8fbff',
    '--cor-texto': '#0b1f3a',
    '--cor-texto-suave': '#5b6b82',
    '--cor-acento': '#2563eb',
    '--cor-ciano': '#0e7490',
    '--cor-ciano-vivo': '#06b6d4',
    '--cor-superficie': '#ffffff',
    '--cor-borda': '#dbe7f5',
    '--cor-selo-azul': '#e8f0fe',
    '--cor-selo-ciano': '#e0f7fb',
  };
  for (const [name, value] of Object.entries(tokens)) {
    assert.match(css, new RegExp(`${name}:\\s*${value}`));
  }
  for (const marker of [':focus-visible', 'prefers-reduced-motion', '1120px', '44px']) {
    assert.ok(css.includes(marker), `marcador ausente: ${marker}`);
  }
  assert.match(css, /transition:\s*none\s*!important/);
});
