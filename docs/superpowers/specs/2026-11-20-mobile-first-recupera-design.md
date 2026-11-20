# Design: responsividade mobile-first e sistema Recupera

## Intenção

O site já está publicado em `main` com `CNAME = kmtechnology.com.br`. Queremos melhorar a experiência em celular com uma base mobile-first e, aproveitando, publicar o primeiro sistema real na seção Sistemas: o **Recupera**, com um print da aplicação.

## Objetivos

- Fazer do celular o cenário-base do CSS, com melhorias progressivas em telas maiores.
- Manter hierarquia, contraste AA, alvos de toque de 44 px, skip link, `:focus-visible` de 3 px e `prefers-reduced-motion`.
- Adicionar `Recupera` em `src/data/site.ts` com descrição, tecnologias, link e print.
- Exibir o print sem estourar o card, com proporção controlada e texto alternativo útil.

## Não-objetivos

- Trocar Astro, adicionar dependências, fontes, ícones ou scripts externos.
- Converter a logo para SVG nesta rodada (conversão pendente de decisão separada).
- Alterar dados de contato, textos institucionais ou o workflow de deploy.

## Restrições

- `src/data/site.ts` continua sendo a única fonte de conteúdo.
- `public/CNAME` continua sendo a única fonte de hostname.
- Nenhum `<style>` scoped; estilos permanecem em `src/styles/global.css`.
- Testes Node existentes em `tests/*.test.mjs`; toda mudança de comportamento começa com teste que falha.

## Abordagens consideradas

1. **Mobile-first de verdade (escolhida)** — base de uma coluna, `clamp()` para tipografia/espaçamento, `min-width` progressivo, cabeçalho reorganizado para toque e imagem responsiva no card. Corrige a causa do aperto no celular preservando a identidade aprovada.
2. Ajustes pontuais — apenas corrigir estouros no mobile. Mais rápido, mas não melhora hierarquia nem aproveitamento de espaço.
3. Redesign do cabeçalho com menu colapsável — mudança visual maior que a pedida e com risco de acessibilidade.

## Decisões tomadas

- **Breakpoints:** base de 1 coluna; 2 colunas a partir de `640px`; 3 colunas a partir de `1024px`. Container segue em `1120px`.
- **Cabeçalho:** marca e CTA empilhados no mobile, com navegação quebrando em linhas e alvos de 44 px; em telas maiores, volta a uma linha. Logo permanece PNG, entre 56 px no mobile e 72 px no desktop, com `object-fit: contain`.
- **Herói:** padding e tipografia fluidos via `clamp()`, evitando blocos gigantes em telas de 360 px.
- **Cards:** `aspect-ratio: 16 / 9`, `width: 100%`, `object-fit: cover` para a imagem do projeto; chips quebram linha sem estourar.
- **Recupera:** nome `Recupera`, link `https://recupera.kmtechnology.com.br`, descrição confirmada pelo usuário: software de recuperação tributária de ICMS, com módulos da CAT 42 e da CAT 207. Tecnologias inferidas do bundle: `React`, `Material UI`, `Axios` (decisão do editor, sujeita a correção).
- **Print:** captura da tela de login do Recupera (1280×900), gerada via Chrome headless, salva em `public/images/recupera.png`. Texto alternativo descritivo via campo opcional `imageAlt` no `Project`.
- A descrição do Recupera foi confirmada pelo usuário; as tecnologias e o print da tela de login são decisões do editor, sujeitas a correção.

## Pendências para o implementador

- Escrever testes RED para `CNAME`/conteúdo do projeto, imagem e regras responsivas antes do código.
- Otimizar o PNG do print sem perder legibilidade.
- Rodar `npm run build && node --test tests/*.test.mjs`, commitar e fazer push para `main` e `feature/km-technology-site`.
- A publicação no Pages continua dependendo da política do ambiente `github-pages` aceitar a branch `main`; isso é configuração do repositório, não código.
