# Site institucional KM Technology Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar, no GitHub Pages com domínio próprio, um site institucional de uma página para a KM Technology com Sobre, Valores, Serviços, Sistemas (quando houver dados) e Contato.

**Architecture:** Astro em modo estático, uma única página montada por componentes, com todo o conteúdo concentrado em `src/data/site.ts`. O hostname do domínio próprio vive em `public/CNAME` e é lido por `astro.config.mjs`, de modo que `site` e CNAME nunca divirjam.

**Tech Stack:** Astro, TypeScript (apenas para o módulo de dados), CSS puro, Node built-in test runner (`node:test`), GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-11-19-km-technology-website-design.md`

## Global Constraints

- Domínio próprio: `base: '/'`, sem caminho do repositório nas URLs; `public/CNAME` é a única fonte do hostname.
- `public/CNAME` começa com `REPLACE-WITH-DOMAIN.invalid` e deve ser substituído pelo hostname real antes de publicar.
- `<html lang="pt-BR">`; títulos em h1 → h2 → h3.
- Serviços exatamente: Marketing Digital, Design, Segurança da Informação, Desenvolvimento de Software sob Encomenda.
- Valores provisórios exatamente: Segurança, Qualidade, Transparência, Inovação.
- `projects: []`; nenhum sistema fictício ou de exemplo pode aparecer no HTML.
- Contato: e-mail e WhatsApp lidos de `site.contact`; valores reais pendentes, então links não podem ser gerados com strings vazias.
- Logo: único arquivo `public/logo.svg`, referenciado como `/logo.svg` com `alt` descritivo.
- Acessibilidade: contraste AA (4,5:1), foco visível, alvos de toque ≥ 44 px, skip link, `prefers-reduced-motion`.
- Largura máxima do conteúdo: ~1120 px. Sem fontes, ícones ou scripts carregados de serviços externos.
- `.gitignore` inclui `node_modules/`, `dist/`, `.astro/` e `.superpowers/`.
- Todo teste roda sobre o HTML gerado: `npm run build && node --test tests/*.test.mjs`.

## Review Focus

1. **Domínio próprio com `base` errado** gera assets 404 em produção mas build passa — teste em Task 1 Step 1: `astro.config.mjs` usa `base: '/'` e deriva `site` de `public/CNAME`.
2. **Logo ainda não existe no repo** e não pode quebrar o build nem deixar imagem sem descrição — teste em Task 5 Step 1: HTML contém `/logo.svg` com `alt` não vazio; Task 1 Step 4 verifica build sem o arquivo.
3. **Contato sem valores reais** pode gerar `mailto:`/`wa.me` inválidos — teste em Task 5 Step 1: HTML não contém `mailto:` nem `wa.me` enquanto `site.contact` estiver vazio.
4. **`projects` vazio** pode virar seção com texto de exemplo publicado como real — teste em Task 4 Step 1: HTML não contém `id="sistemas"`, "Sistema A" nem "Exemplo".
5. **Acessibilidade estrutural** (idioma, skip link, foco, alt) é fácil de perder em uma página só — teste em Task 6 Step 1: HTML tem `lang="pt-BR"`, "Pular para o conteúdo" e `:focus-visible` no CSS; checagem manual de contraste no Step 4.

## Estrutura de arquivos

- `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore` — projeto e build.
- `public/CNAME` — hostname do domínio próprio (único lugar para trocar).
- `src/data/site.ts` — conteúdo: empresa, valores, serviços, sistemas e contato.
- `src/layouts/BaseLayout.astro` — documento HTML, skip link, cabeçalho, rodapé, slot.
- `src/components/SiteHeader.astro`, `SiteFooter.astro`, `SectionHeading.astro`, `ValueCard.astro`, `ServiceCard.astro`, `ProjectCard.astro`, `ContactSection.astro` — uma responsabilidade cada.
- `src/pages/index.astro` — composição das seções.
- `src/styles/global.css` — tokens e estilos base.
- `.github/workflows/deploy.yml` — build e publicação no Pages.
- `tests/helpers.mjs` + `tests/*.test.mjs` — testes sobre `dist/index.html`.

---

### Task 1: Scaffold do projeto Astro e build estático

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `public/CNAME`, `src/pages/index.astro`, `src/layouts/BaseLayout.astro`, `src/styles/global.css`, `tests/helpers.mjs`, `tests/smoke.test.mjs`

**Interfaces:**
- Produces: scripts `dev`, `build`, `preview`; `dist/index.html` após `npm run build`; `readHtml()` em `tests/helpers.mjs` retorna o HTML compilado; `public/CNAME` com `REPLACE-WITH-DOMAIN.invalid`.

- [ ] **Step 1: Escrever o teste que falha**

```js
// tests/helpers.mjs
import { readFileSync } from 'node:fs';
export function readHtml() {
  return readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
}
```

```js
// tests/smoke.test.mjs
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
  assert.doesNotMatch(html, /\/KM_SITE\//);
  assert.match(config, /base:\s*['"]\/['"]/);
  assert.match(config, /public\/CNAME/);
  assert.match(config, /site:/);
  assert.ok(cname.length > 0);
});
```

- [ ] **Step 2: Rodar o teste e confirmar que falha**

Run: `node --test tests/smoke.test.mjs`
Expected: FAIL com erro de arquivo `dist/index.html` não encontrado.

- [ ] **Step 3: Criar o projeto**

`package.json`: dependência `astro` instalada com `npm install --save-dev astro`; scripts `dev`, `build`, `preview` chamando `astro`.
`astro.config.mjs`: importar `defineConfig` de `astro/config` e `readFileSync` de `node:fs`; ler `public/CNAME`, remover espaços; configurar `site: \`https://${domain}\``, `base: '/'`, `output: 'static'`.
`tsconfig.json`: estender `astro/tsconfigs/strict`.
`.gitignore`: `node_modules/`, `dist/`, `.astro/`, `.superpowers/`.
`public/CNAME`: uma linha, `REPLACE-WITH-DOMAIN.invalid`.
`src/layouts/BaseLayout.astro`: `<html lang="pt-BR">`, `<head>` com charset, viewport, título e descrição; importar `../styles/global.css` no frontmatter para o Astro injetar o CSS; no `<body>`, link "Pular para o conteúdo" apontando para `#conteudo` e `<main id="conteudo"><slot /></main>`.
`src/pages/index.astro`: importar `BaseLayout` e renderizar `<BaseLayout><h1>KM Technology</h1></BaseLayout>`.
`src/styles/global.css`: tokens mínimos de cor e uma regra base de fonte do sistema.

- [ ] **Step 4: Instalar, buildar e testar**

Run: `npm install && npm run build && node --test tests/smoke.test.mjs`
Expected: build termina sem erro (mesmo sem `public/logo.svg`) e teste PASS.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json .gitignore public/CNAME src tests && git commit -m "feat: scaffold static Astro site"
```

---

### Task 2: Modelo de conteúdo e seções Sobre e Valores

**Files:**
- Create: `src/data/site.ts`, `src/components/SectionHeading.astro`, `src/components/ValueCard.astro`, `tests/content.test.mjs`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `BaseLayout` (Task 1), `readHtml()` (Task 1).
- Produces: `site` exportado de `src/data/site.ts` com a forma `{ company: { name, headline, about }, values: { title, description }[], services: { title, description }[], projects: { name, description, technologies, image?, link? }[], contact: { email, whatsapp } }`; `SectionHeading` com props `{ id: string, title: string }`; `ValueCard` com prop `{ value: { title, description } }`.

- [ ] **Step 1: Escrever o teste que falha**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readHtml } from './helpers.mjs';

test('HTML traz Sobre e os quatro valores', () => {
  const html = readHtml();
  assert.match(html, /Somos uma software house/);
  for (const titulo of ['Segurança', 'Qualidade', 'Transparência', 'Inovação']) {
    assert.ok(html.includes(titulo), `falta o valor ${titulo}`);
  }
  assert.doesNotMatch(html, /Sistema A/);
});
```

- [ ] **Step 2: Rodar o teste e confirmar que falha**

Run: `npm run build && node --test tests/content.test.mjs`
Expected: FAIL em `Somos uma software house`.

- [ ] **Step 3: Implementar dados e seções**

`src/data/site.ts`: exportar `site` com `company.headline` = "Soluções de tecnologia sob medida", `company.about` começando com "Somos uma software house"; quatro valores com título e descrição curta em português; quatro serviços com os títulos exatos de Global Constraints e descrição curta; `projects: []`; `contact: { email: '', whatsapp: '' }`. Deixar um comentário acima de `projects` com o formato de uma entrada real, sem incluir entrada ativa.
`SectionHeading.astro`: `<section id={id}>` com `<h2>{title}</h2>` e slot.
`ValueCard.astro`: `<article>` com `<h3>` do título e `<p>` da descrição.
`src/pages/index.astro`: renderizar `<SectionHeading id="sobre" title="Sobre a empresa">` com `<p>{site.company.about}</p>` e `<SectionHeading id="valores" title="Valores">` com um `<ul>` de `ValueCard` para cada item de `site.values`.

- [ ] **Step 4: Rodar o teste e confirmar que passa**

Run: `npm run build && node --test tests/content.test.mjs`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src tests && git commit -m "feat: add content model and about/values sections"
```

---

### Task 3: Seção de serviços

**Files:**
- Create: `src/components/ServiceCard.astro`, `tests/services.test.mjs`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `site.services` (Task 2), `SectionHeading` (Task 2).
- Produces: `ServiceCard` com prop `{ service: { title, description } }`.

- [ ] **Step 1: Escrever o teste que falha**

```js
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
```

- [ ] **Step 2: Rodar o teste e confirmar que falha**

Run: `npm run build && node --test tests/services.test.mjs`
Expected: FAIL em `Marketing Digital`.

- [ ] **Step 3: Implementar a seção**

`ServiceCard.astro`: `<article>` com `<h3>{service.title}</h3>` e `<p>{service.description}</p>`.
`src/pages/index.astro`: adicionar `<SectionHeading id="servicos" title="Serviços de tecnologia">` com grade de `ServiceCard` para cada item de `site.services`.

- [ ] **Step 4: Rodar o teste e confirmar que passa**

Run: `npm run build && node --test tests/services.test.mjs`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src tests && git commit -m "feat: add technology services section"
```

---

### Task 4: Seção de sistemas com estado vazio

**Files:**
- Create: `src/components/ProjectCard.astro`, `tests/projects.test.mjs`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `site.projects` (Task 2), `SectionHeading` (Task 2).
- Produces: `ProjectCard` com prop `{ project: { name, description, technologies, image?, link? } }`.

- [ ] **Step 1: Escrever o teste que falha**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readHtml } from './helpers.mjs';

test('sem dados reais, a seção de sistemas não publica conteúdo de exemplo', () => {
  const html = readHtml();
  const page = readFileSync(new URL('../src/pages/index.astro', import.meta.url), 'utf8');
  assert.match(page, /ProjectCard/);
  assert.match(page, /site\.projects\.length/);
  assert.doesNotMatch(html, /id="sistemas"/);
  assert.doesNotMatch(html, /Sistema A|Exemplo/);
});
```

- [ ] **Step 2: Rodar o teste e confirmar que falha**

Run: `npm run build && node --test tests/projects.test.mjs`
Expected: FAIL em `ProjectCard`.

- [ ] **Step 3: Implementar a seção condicional**

`ProjectCard.astro`: `<article>` com `<h3>{project.name}</h3>`, descrição, lista de `technologies`, `<img>` opcional quando `project.image` existir e link opcional quando `project.link` existir.
`src/pages/index.astro`: renderizar `<SectionHeading id="sistemas" title="Sistemas já desenvolvidos">` somente quando `site.projects.length > 0`, com um `ProjectCard` por entrada. Não criar entradas no array.

- [ ] **Step 4: Rodar o teste e confirmar que continua passando**

Run: `npm run build && node --test tests/projects.test.mjs`
Expected: PASS — a seção continua ausente porque `projects` está vazio.

- [ ] **Step 5: Commit**

```bash
git add src tests && git commit -m "feat: add data-driven projects section with empty state"
```

---

### Task 5: Cabeçalho, rodapé, logo e contato

**Files:**
- Create: `src/components/SiteHeader.astro`, `src/components/SiteFooter.astro`, `src/components/ContactSection.astro`, `tests/navigation.test.mjs`
- Modify: `src/layouts/BaseLayout.astro`, `src/pages/index.astro`

**Interfaces:**
- Consumes: `BaseLayout` (Task 1), `site.company.name`, `site.contact` (Task 2).
- Produces: `SiteHeader`, `SiteFooter`, `ContactSection`; âncoras `#sobre`, `#valores`, `#servicos`, `#sistemas`, `#contato`; logo em `/logo.svg`.

- [ ] **Step 1: Escrever o teste que falha**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readHtml } from './helpers.mjs';

test('navegação, logo e contato sem links inválidos', () => {
  const html = readHtml();
  for (const id of ['sobre', 'valores', 'servicos', 'contato']) {
    assert.match(html, new RegExp(`href="#${id}"`));
  }
  assert.match(html, /src="\/logo\.svg"/);
  assert.match(html, /src="\/logo\.svg"[^>]*alt="[^"]+"/);
  assert.doesNotMatch(html, /mailto:|wa\.me/);
  assert.match(html, /id="contato"/);
});
```

- [ ] **Step 2: Rodar o teste e confirmar que falha**

Run: `npm run build && node --test tests/navigation.test.mjs`
Expected: FAIL em `href="#sobre"`.

- [ ] **Step 3: Implementar navegação e contato**

`SiteHeader.astro`: `<img src="/logo.svg" alt="Logo da KM Technology">` com fallback textual do nome caso a logo não exista ainda; usar `site.company.name` como texto ao lado da imagem e `site.company.headline` como tagline do cabeçalho; `<nav>` com links para `#sobre`, `#valores`, `#servicos`, `#sistemas`, `#contato`; link de `#sistemas` fica presente no menu mesmo quando a seção não existe (âncora inofensiva).
`SiteFooter.astro`: nome da empresa e ano atual.
`ContactSection.astro`: `<section id="contato">` com `<h2>Contato</h2>`; renderizar link `mailto:` apenas se `site.contact.email` não estiver vazio e link `https://wa.me/` apenas se `site.contact.whatsapp` não estiver vazio; se ambos estiverem vazios, mostrar o texto "Informações de contato em breve."
`src/layouts/BaseLayout.astro`: incluir `SiteHeader` antes de `<main>` e `SiteFooter` depois.
`src/pages/index.astro`: incluir `<ContactSection />` ao fim.

- [ ] **Step 4: Rodar o teste e confirmar que passa**

Run: `npm run build && node --test tests/navigation.test.mjs`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src tests && git commit -m "feat: add header, footer, logo slot and contact section"
```

---

### Task 6: Estilos, responsividade e acessibilidade

**Files:**
- Modify: `src/styles/global.css`, `src/layouts/BaseLayout.astro`
- Create: `tests/accessibility.test.mjs`

**Interfaces:**
- Consumes: HTML gerado por Tasks 1–5.
- Produces: CSS com tokens `--cor-fundo`, `--cor-texto`, `--cor-acento`, container com `max-width: 1120px`, regra `:focus-visible`, media queries para mobile e `@media (prefers-reduced-motion: reduce)`.

- [ ] **Step 1: Escrever o teste que falha**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readHtml } from './helpers.mjs';

test('marcações e CSS de acessibilidade estão presentes', () => {
  const html = readHtml();
  const css = readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8');
  assert.match(html, /<html lang="pt-BR">/);
  assert.match(html, /Pular para o conteúdo/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /1120px/);
  assert.match(css, /44px/);
});
```

- [ ] **Step 2: Rodar o teste e confirmar que falha**

Run: `npm run build && node --test tests/accessibility.test.mjs`
Expected: FAIL em `:focus-visible`.

- [ ] **Step 3: Completar o CSS**

`src/styles/global.css`: definir tokens de cor com contraste AA entre fundo e texto, cor de acento para ações, fonte do sistema, container centralizado com `max-width: 1120px`, grids de uma coluna em mobile e múltiplas colunas em desktop, `min-height: 44px` em links/botões de navegação, `:focus-visible` com contorno visível, `@media (prefers-reduced-motion: reduce)` desligando transições.
`src/layouts/BaseLayout.astro`: garantir que o link "Pular para o conteúdo" seja o primeiro elemento focável do `<body>`.

- [ ] **Step 4: Verificar teste, build e contraste manual**

Run: `npm run build && node --test tests/accessibility.test.mjs`
Expected: PASS. Conferir visualmente em `npm run preview` que texto sobre fundo e texto sobre acento têm contraste legível e que a navegação funciona por teclado.

- [ ] **Step 5: Commit**

```bash
git add src tests && git commit -m "feat: style responsive layout and accessibility basics"
```

---

### Task 7: Publicação no GitHub Pages

**Files:**
- Create: `.github/workflows/deploy.yml`, `tests/deploy.test.mjs`

**Interfaces:**
- Consumes: `public/CNAME` (Task 1), config de build (Task 1).
- Produces: workflow de deploy; `dist/CNAME` presente após o build.

- [ ] **Step 1: Escrever o teste que falha**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

test('deploy usa Pages e mantém o CNAME no build', () => {
  const workflow = readFileSync('.github/workflows/deploy.yml', 'utf8');
  assert.match(workflow, /actions\/deploy-pages/);
  assert.match(workflow, /actions\/upload-pages-artifact/);
  assert.match(workflow, /npm run build/);
  assert.ok(existsSync('dist/CNAME'));
  assert.match(readFileSync('dist/CNAME', 'utf8'), /^\S+\.\S+$/);
});
```

- [ ] **Step 2: Rodar o teste e confirmar que falha**

Run: `npm run build && node --test tests/deploy.test.mjs`
Expected: FAIL com arquivo `.github/workflows/deploy.yml` não encontrado.

- [ ] **Step 3: Criar o workflow**

`.github/workflows/deploy.yml`: gatilho em `push` para a branch principal e `workflow_dispatch`; permissões `pages: write` e `id-token: write`; job com `actions/checkout`, setup de Node com cache do npm, `npm ci`, `npm run build`, `actions/configure-pages`, `actions/upload-pages-artifact` apontando para `dist/`, `actions/deploy-pages`. Confirmar que `public/CNAME` é copiado para `dist/CNAME` pelo Astro.

- [ ] **Step 4: Rodar todos os testes e conferir o build**

Run: `npm run build && node --test tests/*.test.mjs`
Expected: todos PASS; `dist/CNAME` contém `REPLACE-WITH-DOMAIN.invalid` enquanto o domínio real não for informado.

- [ ] **Step 5: Commit**

```bash
git add .github tests && git commit -m "feat: deploy site to GitHub Pages with custom domain"
```

---

## Handoff

Antes de publicar, trocar `REPLACE-WITH-DOMAIN.invalid` em `public/CNAME` pelo hostname real e preencher `site.contact`, `site.company.about`, os valores e os serviços em `src/data/site.ts`. Ao receber a lista de sistemas reais, preencher `site.projects` — a seção aparece sozinha. A logo entra em `public/logo.svg`.
