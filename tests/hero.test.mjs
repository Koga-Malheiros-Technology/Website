// tests/hero.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readHtml } from './helpers.mjs';

const css = readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8');

test('herói com nome, headline e acento', () => {
  const html = readHtml();
  assert.match(html, /class="hero"/);
  assert.match(html, /<h1[^>]*>KM Technology<\/h1>/);
  assert.match(html, /class="hero-lead"/);
  assert.match(html, /Soluções de tecnologia sob medida/);
  assert.match(html, /class="hero-accent"/);
  assert.match(html, /class="eyebrow"/);
  assert.match(css, /clamp\(/);
});
