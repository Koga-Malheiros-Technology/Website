# KM Technology Visual Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aplicar a paleta tecnológica clara e ícones SVG inline ao site institucional da KM Technology, melhorando hierarquia e ritmo visual sem mudar conteúdo, rotas ou infraestrutura.

**Architecture:** Mudança visual em uma única página Astro estática. Tokens de cor ficam em `src/styles/global.css`; um componente `Icon.astro` centraliza todos os SVGs inline; os componentes de cards e o cabeçalho consomem o componente. Os testes continuam rodando sobre o HTML gerado e o CSS fonte.

**Tech Stack:** Astro 7, TypeScript nos componentes, CSS custom properties, SVGs inline, Node test runner.

**Spec:** `docs/superpowers/specs/2026-11-20-km-technology-visual-refresh-design.md`

## Global Constraints

- Sem fontes, ícones ou scripts carregados de serviços externos; apenas system font stack e SVGs inline.
- Nenhuma dependência nova de produção ou desenvolvimento.
- `base: '/'`, `public/CNAME` é a única fonte de hostname; não alterar domínio nem workflow de deploy.
- `public/logo.svg` continua referenciado como `/logo.svg` com `alt` não vazio; o arquivo ainda não existe e o build precisa continuar passando.
- Conteúdo vem apenas de `src/data/site.ts`; `projects: []` e `contact: { email: '', whatsapp: '' }` permanecem até o usuário fornecer dados reais.
- `<html lang="pt-BR">`; ordem de títulos h1 → h2 → h3; skip link "Pular para o conteúdo" permanece o primeiro elemento focável.
- Contraste AA (4,5:1 para texto normal); `--cor-ciano-vivo` é decorativo e nunca usado como cor de texto.
- Marcadores de acessibilidade obrigatórios no CSS: `:focus-visible` com contorno de 3 px, `min-height: 44px` em links, `max-width: 1120px`, `@media (prefers-reduced-motion: reduce)`.
- Comando de verificação de cada task: `npm run build && node --test tests/*.test.mjs`.

## Review Focus

1. **Arquivo `public/logo.svg` ainda não existe** — o build e a página não podem quebrar, e o `alt` precisa continuar descritivo. Teste: Task 2 verifica `src="/logo.svg"` com `alt` não vazio no HTML gerado e executa o build.
2. **Usuário preenche e-mail/WhatsApp no futuro** — os ícones de contato devem aparecer sem quebrar o estado vazio atual. Testes: Task 2 contrato do `Icon`; Task 5 verifica presença de `name="mail"`/`name="whatsapp"` no componente e ausência de `mailto:`/`wa.me` com dados vazios.
3. **Navegação por teclado no novo CTA** — o link "Fale conosco" precisa ter foco visível e alvo de 44 px. Teste: Task 2 verifica o CTA no HTML; Task 1 mantém `:focus-visible` e `44px` no CSS.
4. **Preferência por movimento reduzido** — o novo hover dos cards não pode animar quando o usuário pede `reduce`. Testes: Task 1 verifica o marcador `prefers-reduced-motion` com `transition: none !important`; Task 5 verifica que `.card` usa `transition` (não `animation`/`@keyframes`), coberta pela regra global.
5. **Viewport estreito (320 px)** — herói, grades e cards não podem estourar horizontalmente. Testes: Task 5 verifica `minmax(0, 1fr)` e os breakpoints no CSS; Task 3 verifica `clamp(` no CSS do herói.

---

### Task 1: Tokens de cor e base visual

**Files:**
- Modify: `src/styles/global.css`
- Test: `tests/visual-refresh.test.mjs` (create)

**Interfaces:**
- Consumes: estrutura atual de `global.css`.
- Produces: custom properties `--cor-fundo`, `--cor-texto`, `--cor-texto-suave`, `--cor-acento`, `--cor-ciano`, `--cor-ciano-vivo`, `--cor-superficie`, `--cor-borda`, `--cor-selo-azul`, `--cor-selo-ciano` com os valores exatos da spec; marcadores de acessibilidade preservados.

- [ ] **Step 1: Write the failing test**

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run build && node --test tests/visual-refresh.test.mjs`
Expected: FAIL no primeiro token ausente.

- [ ] **Step 3: Replace the token block and update base rules in `src/styles/global.css`**

Substituir o bloco `:root` pelos dez tokens acima. Fazer `body` usar `--cor-fundo`/`--cor-texto`, `a` usar `--cor-acento`, `:focus-visible` manter contorno de 3 px, links manter `min-height: 44px`, containers manter `max-width: 1120px` e manter integralmente `@media (prefers-reduced-motion: reduce)`. Não adicionar fontes externas.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run build && node --test tests/visual-refresh.test.mjs`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/styles/global.css tests/visual-refresh.test.mjs
git commit -m "feat: apply technology color palette tokens"
```

---

### Task 2: Componente Icon e marca no cabeçalho

**Files:**
- Create: `src/components/Icon.astro`
- Modify: `src/components/SiteHeader.astro`
- Test: `tests/icon.test.mjs` (create)

**Interfaces:**
- Consumes: tokens de `global.css` (Task 1).
- Produces: `<Icon name={string} />` renderizando `<svg data-icon={name} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" aria-hidden="true">` com os paths dos nomes: `mark`, `megaphone`, `palette`, `shield`, `code`, `check`, `eye`, `lightbulb`, `mail`, `whatsapp`. Nome desconhecido renderiza vazio (sem SVG quebrado). Cabeçalho com `<a class="cta" href="#contato">Fale conosco</a>` e `<Icon name="mark" />`, mantendo `<img src="/logo.svg" alt="Logo da ...">` e todos os links de navegação atuais.

- [ ] **Step 1: Write the failing test**

```js
// tests/icon.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readHtml } from './helpers.mjs';

test('SVG inline no cabeçalho e CTA de contato', () => {
  const html = readHtml();
  assert.match(html, /<svg[^>]*data-icon="mark"/);
  assert.match(html, /<svg[^>]*aria-hidden="true"/);
  assert.match(html, /<svg[^>]*stroke-width="1\.75"/);
  assert.match(html, /<a class="cta" href="#contato">Fale conosco<\/a>/);
  assert.match(html, /src="\/logo\.svg"[^>]*alt="[^"]+"/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run build && node --test tests/icon.test.mjs`
Expected: FAIL em `data-icon="mark"`.

- [ ] **Step 3: Implement `Icon.astro` and update `SiteHeader.astro`**

`Icon.astro`: props `{ name: string }`; mapa nome → conteúdo SVG com os paths de `mark` (losango/monograma geométrico), `megaphone`, `palette`, `shield`, `code`, `check`, `eye`, `lightbulb`, `mail`, `whatsapp`; fallback vazio para nome fora do mapa. Todos os SVGs com os atributos exatos da interface. `SiteHeader.astro`: inserir `<Icon name="mark" />` antes do `<img>`, e o CTA com classe e href exatos após a navegação, sem remover nenhum link existente.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run build && node --test tests/icon.test.mjs`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Icon.astro src/components/SiteHeader.astro tests/icon.test.mjs
git commit -m "feat: add inline icon component and header CTA"
```

---

### Task 3: Herói e rótulos de seção

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/components/SectionHeading.astro`
- Modify: `src/styles/global.css`
- Test: `tests/hero.test.mjs` (create)

**Interfaces:**
- Consumes: `site.company.name`, `site.company.headline` de `src/data/site.ts`; tokens de `global.css`.
- Produces: `<section class="hero">` com `<h1>` vindo de `site.company.name`, `<p class="hero-lead">` vindo de `site.company.headline` e `<span class="hero-accent" aria-hidden="true">`; `SectionHeading` com props `{ id: string; title: string; eyebrow: string }` renderizando `<section id={id}><p class="eyebrow">{eyebrow}</p><h2>{title}</h2><slot /></section>`. Rótulos usados em `index.astro`: `SOBRE`, `VALORES`, `SERVIÇOS`, `SISTEMAS`.

- [ ] **Step 1: Write the failing test**

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run build && node --test tests/hero.test.mjs`
Expected: FAIL em `class="hero"`.

- [ ] **Step 3: Implement hero and section eyebrow**

Em `index.astro`, substituir o `<h1>KM Technology</h1>` pelo `<section class="hero">` da interface, usando `site.company.name` e `site.company.headline`. Em `SectionHeading.astro`, adicionar a prop `eyebrow` ao tipo `Props` e ao markup. Em `index.astro`, passar os quatro rótulos exatos. Em `global.css`, estilizar `.hero`, `.hero-lead`, `.hero-accent` e `.eyebrow`: `h1` com `clamp(2rem, 5vw, 3.25rem)`, grade sutil apenas com `linear-gradient`, barra de acento em gradiente azul→ciano, rótulo pequeno em maiúsculas com `letter-spacing`. Sem novos recursos externos.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run build && node --test tests/hero.test.mjs`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/index.astro src/components/SectionHeading.astro src/styles/global.css tests/hero.test.mjs
git commit -m "feat: add hero and section eyebrows"
```

---

### Task 4: Cards de serviços e valores com ícones

**Files:**
- Modify: `src/components/ServiceCard.astro`
- Modify: `src/components/ValueCard.astro`
- Modify: `src/styles/global.css`
- Test: `tests/cards.test.mjs` (create)

**Interfaces:**
- Consumes: `Icon.astro` (Task 2); `site.services` e `site.values` (títulos exatos já existentes).
- Produces: `<article class="card card--service">` e `<article class="card card--value">`, cada um com `<span class="icon-badge">` contendo `<Icon name={...} />`, `<h3>` e `<p>`. Mapeamento por título — serviços: `Marketing Digital` → `megaphone`, `Design` → `palette`, `Segurança da Informação` → `shield`, `Desenvolvimento de Software sob Encomenda` → `code`; valores: `Segurança` → `shield`, `Qualidade` → `check`, `Transparência` → `eye`, `Inovação` → `lightbulb`.

- [ ] **Step 1: Write the failing test**

```js
// tests/cards.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readHtml } from './helpers.mjs';

test('cards com selos de ícone', () => {
  const html = readHtml();
  assert.match(html, /class="card card--service"/);
  assert.match(html, /class="card card--value"/);
  assert.match(html, /class="icon-badge"/);
  for (const name of ['megaphone', 'palette', 'shield', 'code', 'check', 'eye', 'lightbulb']) {
    assert.match(html, new RegExp(`data-icon="${name}"`));
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run build && node --test tests/cards.test.mjs`
Expected: FAIL em `class="card card--service"`.

- [ ] **Step 3: Implement card markup and styles**

Em cada componente, envolver o conteúdo no `<article>` da interface, inserir `<span class="icon-badge"><Icon name={...} /></span>` usando o mapeamento exato por `service.title` / `value.title`. Em `global.css`, estilizar `.card` com superfície branca, borda, raio, barra superior em `--cor-acento` para serviços e `--cor-ciano-vivo` para valores, `.icon-badge` com 44 px de altura e fundo `--cor-selo-azul`/`--cor-selo-ciano`, hover com leve elevação via `transition` (coberta por `prefers-reduced-motion`).

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run build && node --test tests/cards.test.mjs`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/ServiceCard.astro src/components/ValueCard.astro src/styles/global.css tests/cards.test.mjs
git commit -m "feat: add icons and accent bars to cards"
```

---

### Task 5: Contato, rodapé e acabamento responsivo

**Files:**
- Modify: `src/components/ContactSection.astro`
- Modify: `src/components/SiteFooter.astro`
- Modify: `src/components/ProjectCard.astro`
- Modify: `src/styles/global.css`
- Test: `tests/polish.test.mjs` (create)

**Interfaces:**
- Consumes: `Icon.astro` (Task 2); `site.contact` e `site.projects` de `src/data/site.ts`.
- Produces: `ContactSection.astro` com `<a ...><span class="icon-badge"><Icon name="mail" /></span>...` e o equivalente com `name="whatsapp"` nos links condicionais, estado vazio inalterado; `SiteFooter.astro` com `<footer class="site-footer">` e `<Icon name="mark" />`; `ProjectCard.astro` com `<span class="tech-chip">` para cada tecnologia; CSS com breakpoints e `minmax(0, 1fr)`.

- [ ] **Step 1: Write the failing test**

```js
// tests/polish.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readHtml } from './helpers.mjs';

test('contato, rodapé e grades responsivas', () => {
  const html = readHtml();
  const css = readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8');
  const contact = readFileSync(new URL('../src/components/ContactSection.astro', import.meta.url), 'utf8');
  assert.match(html, /Informações de contato em breve\./);
  assert.doesNotMatch(html, /mailto:|wa\.me/);
  assert.match(contact, /name="mail"/);
  assert.match(contact, /name="whatsapp"/);
  assert.match(html, /class="site-footer"/);
  assert.match(css, /minmax\(0,\s*1fr\)/);
  assert.match(css, /@media \(min-width: 768px\)/);
  assert.match(css, /\.card\s*\{[^}]*transition:/);
  assert.doesNotMatch(css, /@keyframes/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run build && node --test tests/polish.test.mjs`
Expected: FAIL em `name="mail"`.

- [ ] **Step 3: Implement contact icons, footer, chips and responsive polish**

Em `ContactSection.astro`, inserir `<span class="icon-badge"><Icon name="mail" /></span>` dentro do link de e-mail e `<span class="icon-badge"><Icon name="whatsapp" /></span>` dentro do link de WhatsApp, sem alterar as condições `email &&` / `whatsapp &&`, os `href` nem o texto do estado vazio. Em `SiteFooter.astro`, trocar `<footer>` por `<footer class="site-footer">` e adicionar `<Icon name="mark" />` decorativo. Em `ProjectCard.astro`, trocar cada `<li>{technology}</li>` por `<li><span class="tech-chip">{technology}</span></li>`. Em `global.css`, garantir `grid-template-columns: repeat(2, minmax(0, 1fr))` e `repeat(3, minmax(0, 1fr))` nos breakpoints existentes, estilizar `.site-footer`, `.tech-chip` e o selo de ícone do contato.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run build && node --test tests/polish.test.mjs`
Expected: PASS.

- [ ] **Step 5: Run the full suite and commit**

Run: `npm run build && node --test tests/*.test.mjs`
Expected: 12/12 pass, 0 fail.

```bash
git add src/components/ContactSection.astro src/components/SiteFooter.astro src/components/ProjectCard.astro src/styles/global.css tests/polish.test.mjs
git commit -m "feat: polish contact, footer and responsive cards"
```
