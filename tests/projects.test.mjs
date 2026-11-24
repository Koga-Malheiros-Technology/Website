import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readHtml } from './helpers.mjs';

test('sem dados reais, a seção de sistemas não publica conteúdo de exemplo', () => {
  const html = readHtml();
  const data = readFileSync(new URL('../src/data/site.ts', import.meta.url), 'utf8');
  const page = readFileSync(new URL('../src/pages/index.astro', import.meta.url), 'utf8');
  assert.match(page, /ProjectCard/);
  assert.match(page, /site\.projects\.length/);
  if (/projects:\s*\[\s*\]/.test(data)) {
    assert.doesNotMatch(html, /id="sistemas"/);
  } else {
    assert.match(html, /id="sistemas"/);
  }
  assert.doesNotMatch(html, /Sistema A|Exemplo/);
});

test('KM Recupera aparece em Sistemas com print e link', () => {
  const html = readHtml();
  const png = readFileSync(new URL('../public/images/recupera.png', import.meta.url));
  assert.match(html, /id="sistemas"/);
  assert.match(html, /KM Recupera/);
  assert.match(html, /recuperação tributária de ICMS, com módulos da CAT 42 e da CAT 207/);
  assert.match(html, /src="\/images\/recupera.png"/);
  assert.match(html, /alt="Tela dos módulos do sistema KM Recupera"/);
  assert.match(html, /href="https:\/\/recupera\.kmtechnology\.com\.br"/);
  for (const tech of ['React', 'Material UI']) assert.ok(html.includes(tech));
  assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.equal(png.readUInt32BE(16), 2878);
  assert.equal(png.readUInt32BE(20), 1800);
});

test('OrganizadorXML aparece com ícone próprio e link para os releases no GitHub', () => {
  const html = readHtml();
  const css = readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8');
  const icon = readFileSync(new URL('../public/images/organizador-xml.png', import.meta.url));
  assert.match(html, /OrganizadorXML/);
  assert.match(html, /src="\/images\/organizador-xml\.png"/);
  assert.match(html, /alt="Ícone do OrganizadorXML"/);
  assert.deepEqual([...icon.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.equal(icon.readUInt32BE(16), 512);
  assert.equal(icon.readUInt32BE(20), 512);
  assert.match(
    html,
    /href="https:\/\/github\.com\/Koga-Malheiros-Technology\/Organizador-XMLS\/releases"/,
  );
  assert.match(html, /aria-label="Baixar no GitHub: OrganizadorXML"/);
  assert.match(html, />Baixar no GitHub/);
  for (const tech of ['Python', 'Tkinter', 'PyInstaller']) assert.ok(html.includes(tech));
  const rule = css.match(/article img\.project-icon\s*\{[^}]*\}/)?.[0] ?? '';
  assert.match(rule, /object-fit:\s*contain/);
});
