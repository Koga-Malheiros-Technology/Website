# Mobile-first e sistema Recupera Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar o layout em mobile-first e publicar o Recupera, com print, na seção Sistemas.

**Architecture:** O conteúdo continua centralizado em `src/data/site.ts`; o card genérico `ProjectCard.astro` renderiza o print via campo opcional `imageAlt`. Toda a responsividade vive em `src/styles/global.css`, com base de uma coluna e breakpoints progressivos em `min-width`. Nenhuma dependência nova entra no projeto.

**Tech Stack:** Astro 7, TypeScript via `site.ts`, CSS global, Node test runner.

**Spec:** `docs/superpowers/specs/2026-11-20-mobile-first-recupera-design.md`

## Global Constraints

- `src/data/site.ts` é a única fonte de conteúdo; `projects` agora terá uma entradas real.
- `public/CNAME` é a única fonte de hostname e contém `kmtechnology.com.br`.
- Astro `base: '/'`, `<html lang="pt-BR">`, h1 → h2 → h3, skip link, contraste AA.
- `:focus-visible` com `outline: 3px`, alvos de toque com `min-height: 44px`, container `1120px`, `prefers-reduced-motion`.
- Sem fontes, ícones ou scripts externos; sem novas dependências; sem `<style>` scoped.
- Toda mudança começa com teste que falha; suíte completa roda antes de cada commit.
- Imagem do sistema: `aspect-ratio: 16/9`, `object-fit: cover`, texto alternativo descritivo.

## Review Focus

- Print 1280×900 em tela de 360 px → testar `article img` com `width:100%`, `aspect-ratio:16/9`, `object-fit:cover`.
- Cabeçalho apertado no celular → testar que `header > div`, `nav` e `.cta` ocupam 100% na base e voltam a `auto` em `min-width:640px`.
- Logo distorcida entre 56 px e 72 px → testar `object-fit:contain` na regra `header img` e os dois tamanhos.
- Seção Sistemas omitida com `projects` vazio → testar presença de `id="sistemas"` no HTML gerado.
- Leitor de tela anunciando apenas "Recupera" → testar `alt="Tela de login do sistema Recupera"` no HTML.

---

### Task 1: Dados e print do Recupera

**Files:**
- Modify: `src/data/site.ts` (interface `Project` e array `projects`)
- Modify: `src/components/ProjectCard.astro`
- Create: `public/images/recupera.png`
- Test: `tests/projects.test.mjs`

**Interfaces:**
- Consumes: print já gerado em `/private/var/folders/59/xm3ybsb901q85k7c0hztz83h0000gn/T/opencode/recupera-print2.png` (PNG 1280×900).
- Produces: `Project.imageAlt?: string`, entrada `projects[0]` com `name`, `description`, `technologies`, `image`, `imageAlt`, `link`; HTML com `id="sistemas"`.

- [ ] **Step 1: Write the failing test**

Em `tests/projects.test.mjs`, adicionar:

```js
test('Recupera aparece em Sistemas com print e link', () => {
  const html = readHtml();
  const png = readFileSync(new URL('../public/images/recupera.png', import.meta.url));
  assert.match(html, /id="sistemas"/);
  assert.match(html, /Recupera/);
  assert.match(html, /recuperação tributária de ICMS, com módulos da CAT 42 e da CAT 207/);
  assert.match(html, /src="\/images\/recupera.png"/);
  assert.match(html, /alt="Tela de login do sistema Recupera"/);
  assert.match(html, /href="https:\/\/recupera\.kmtechnology\.com\.br"/);
  for (const tech of ['React', 'Material UI', 'Axios']) assert.ok(html.includes(tech));
  assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.equal(png.readUInt32BE(16), 1280);
  assert.equal(png.readUInt32BE(20), 900);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run build >/dev/null && node --test tests/projects.test.mjs`
Expected: FAIL com `ENOENT` para `/public/images/recupera.png` e ausência de `id="sistemas"`.

- [ ] **Step 3: Implementar dados e card**

Em `src/data/site.ts`: adicionar `imageAlt?: string` ao `interface Project`; substituir `projects: []` por:

```ts
projects: [
  {
    name: 'Recupera',
    description: 'Software de recuperação tributária de ICMS, com módulos da CAT 42 e da CAT 207.',
    technologies: ['React', 'Material UI', 'Axios'],
    image: '/images/recupera.png',
    imageAlt: 'Tela de login do sistema Recupera',
    link: 'https://recupera.kmtechnology.com.br',
  },
],
```

Em `src/components/ProjectCard.astro`: trocar `<img src={project.image} alt={project.name} />` por `<img src={project.image} alt={project.imageAlt ?? project.name} loading="lazy" decoding="async" />`.

Copiar o print: `mkdir -p public/images && cp /private/var/folders/59/xm3ybsb901q85k7c0hztz83h0000gn/T/opencode/recupera-print2.png public/images/recupera.png`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run build && node --test tests/*.test.mjs`
Expected: PASS, suíte completa sem falhas.

- [ ] **Step 5: Commit**

```bash
git add src/data/site.ts src/components/ProjectCard.astro public/images/recupera.png tests/projects.test.mjs
git commit -m "feat: add Recupera system with screenshot"
```

### Task 2: Imagem e grades responsivas

**Files:**
- Modify: `src/styles/global.css` (`article img`, `section > ul`, media queries)
- Modify: `tests/polish.test.mjs`
- Test: `tests/responsive.test.mjs` (criar)

**Interfaces:**
- Consumes: `article` e `section > ul` já existem em `global.css`; print de `public/images/recupera.png` renderizado por `ProjectCard.astro`.
- Produces: regras `article img`, base de 1 coluna, `min-width:640px` com 2 colunas e `min-width:1024px` com 3 colunas.

- [ ] **Step 1: Write the failing test**

Criar `tests/responsive.test.mjs`:

```js
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
```

Em `tests/polish.test.mjs`, trocar a asserção `/@media \(min-width: 768px\)/` por `/@media \(min-width: 640px\)/`.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run build >/dev/null && node --test tests/responsive.test.mjs tests/polish.test.mjs`
Expected: FAIL — regra `article img` ausente e breakpoint 768px ainda presente.

- [ ] **Step 3: Implementar CSS responsivo**

Em `src/styles/global.css`:
- Adicionar após `article h3`:

```css
article img {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: 0.375rem;
}
```

- Trocar `@media (min-width: 768px)` por `@media (min-width: 640px)`; manter `@media (min-width: 1024px)` como está.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run build && node --test tests/*.test.mjs`
Expected: PASS, suíte completa sem falhas.

- [ ] **Step 5: Commit**

```bash
git add src/styles/global.css tests/responsive.test.mjs tests/polish.test.mjs
git commit -m "feat: make cards and grids mobile-first"
```

### Task 3: Cabeçalho, herói e fechamento

**Files:**
- Modify: `src/styles/global.css` (`header`, `header img`, `main`, `.hero`, `.hero h1`, media query 640px)
- Modify: `tests/icon.test.mjs`
- Test: `tests/responsive.test.mjs`

**Interfaces:**
- Consumes: regras `header`, `header > div`, `header p`, `nav`, `.cta`, `.hero` e `.hero h1` do CSS global; breakpoint `640px` da Task 2.
- Produces: cabeçalho empilhado na base e em linha a partir de 640px; logo 56 px → 72 px; suíte completa verde.

- [ ] **Step 1: Write the failing test**

Em `tests/responsive.test.mjs`, adicionar:

```js
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
```

Em `tests/icon.test.mjs`, trocar a asserção da regra `header img` para `width: 56px`, `height: 56px` e `object-fit: contain`.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run build >/dev/null && node --test tests/responsive.test.mjs tests/icon.test.mjs`
Expected: FAIL — tamanhos 56/72 px e regras mobile ausentes.

- [ ] **Step 3: Implementar cabeçalho e herói**

Em `src/styles/global.css`:
- Adicionar a regra base `header > div, nav, .cta { flex: 1 1 100%; }` junto ao bloco do cabeçalho.
- Trocar `header img` para `width: 56px; height: 56px; object-fit: contain; flex: 0 0 auto;`.
- Ajustar `header p { flex: 1 1 100%; margin: 0; }` (inalterado se já presente).
- Ajustar `.hero` para `padding: clamp(1.75rem, 6vw, 4.5rem) clamp(1rem, 4vw, 3rem);` e `.hero h1` para `font-size: clamp(1.75rem, 8vw, 3.25rem);`.
- Dentro de `@media (min-width: 640px)`, acrescentar:

```css
header > div,
nav,
.cta {
  flex: 0 1 auto;
}

header p {
  flex: 1 1 auto;
}

header img {
  width: 72px;
  height: 72px;
}
```

- [ ] **Step 4: Run full verification**

Run: `npm run build && node --test tests/*.test.mjs`
Expected: PASS, suíte completa sem falhas.

- [ ] **Step 5: Commit e push**

```bash
git add src/styles/global.css tests/responsive.test.mjs tests/icon.test.mjs
git commit -m "feat: make header and hero mobile-first"
git push origin HEAD:refs/heads/main HEAD:refs/heads/feature/km-technology-site
git fetch --all --prune
git -C /Users/iuri_ramos/Projetos/KM_SITE reset --hard origin/main
```
