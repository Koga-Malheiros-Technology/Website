# Design: refresh visual da KM Technology

Data: 2026-11-20
Status: aguardando aprovação

## Intenção

O site institucional já está funcional, mas visualmente é uma página brança com azul único, sem hierarquia visual marcante nem identidade. O pedido é melhorar o design e usar cores que remetam a tecnologia, mantendo a sobriedade de uma software house e a acessibilidade já conquistada.

## Objetivos

- Paleta com identidade tecnológica: azul profundo, azul elétrico e ciano, sobre fundo claro.
- Hierarquia visual mais clara: herói, seções ritmadas, cards com peso visual consistente.
- Ícones embutidos (SVG inline), sem dependências externas, nos cards e no contato.
- Manter integralmente contraste AA, foco visível, alvos de 44 px, skip link e reduced-motion.

## Não objetivos

- Novas páginas, backend, formulário de contato ou CMS.
- Fontes, ícones ou scripts vindos de CDN/serviços externos.
- Novas dependências de produção.
- Conteúdo fictício de sistemas ou contato.
- Alterar o domínio, o `base: '/'` ou o fluxo de deploy.

## Anti-objetivos (o que tornaria essa mudança um erro)

- Trocar a sobriedade por um visual "neon/gamer" que conflite com a natureza corporativa.
- Quebrar os marcadores que os testes de acessibilidade verificam (`:focus-visible`, `prefers-reduced-motion`, `1120px`, `44px`).
- Deixar texto com contraste abaixo de 4,5:1.

## Restrições

- Astro estático, uma única página, conteúdo centralizado em `src/data/site.ts`.
- `public/CNAME` continua sendo a única fonte de hostname; `public/logo.svg` continua referenciado como `/logo.svg` com `alt` não vazio (arquivo ainda pendente do usuário).
- Sem bibliotecas de ícones: SVGs inline em componente Astro.
- Testes rodam sobre o HTML/CSS gerados: `npm run build && node --test tests/*.test.mjs`.

## Abordagens consideradas

### Paleta
- **A · Tech escuro** — fundo azul-noite com ciano. Mais impactante, porém mais agressivo e mais difícil de manter contraste AA em todos os estados.
- **B · Tech claro (escolhida)** — fundo claro com azul profundo `#0b1f3a`, azul `#2563eb` e ciano `#06b6d4`. Sóbria, profissional, contraste alto e coerente com o spec original de "paleta sóbria".
- **C · Híbrido** — cabeçalho escuro, corpo claro. Bom equilíbrio, mas cria duas identidades e mais exceções de cor.

### Ícones
- **A · Contorno em selo suave (escolhida)** — traço de 1,75 px em azul/ciano dentro de quadrado arredondado com fundo claro. Leve, moderno e discreto.
- **B · Preenchido em círculo** — mais peso visual, tende a dominar os cards.
- **C · Sem selo** — mais enxuto, porém menos ritmo visual na grade.

### Estrutura
- **Só recolorir (descartada)** — não atende "melhore o design"; deixaria a hierarquia fraca atual.
- **Refinar a página atual com herói e cards reritimados (escolhida)** — melhora percepção sem mudar rotas, dados ou contratos de teste.
- **Multipágina (descartada)** — o spec define site de uma página.

## Decisões de implementação (chamadas do designer)

Tokens em `src/styles/global.css`:

| Token | Valor | Uso |
|---|---|---|
| `--cor-fundo` | `#f8fbff` | fundo da página |
| `--cor-texto` | `#0b1f3a` | texto principal e títulos |
| `--cor-texto-suave` | `#5b6b82` | textos secundários (≈5,2:1 no fundo) |
| `--cor-acento` | `#2563eb` | links, foco, detalhes (≈5,1:1 no branco) |
| `--cor-ciano` | `#0e7490` | ícones/texto ciano (≈5,3:1 no branco) |
| `--cor-ciano-vivo` | `#06b6d4` | barras e gradientes decorativos (nunca texto) |
| `--cor-superficie` | `#ffffff` | cards e cabeçalho |
| `--cor-borda` | `#dbe7f5` | bordas |
| `--cor-selo-azul` / `--cor-selo-ciano` | `#e8f0fe` / `#e0f7fb` | fundo dos selos de ícone |

- `header`: superfície branca com borda inferior; marca com monograma SVG inline decorativo ao lado do `<img src="/logo.svg">`; navegação com pílula "Fale conosco" apontando para `#contato`.
- Herói no lugar do `<h1>` isolado: padrão de grade sutil feito só com gradientes CSS, `h1` com `clamp(2rem, 5vw, 3,25rem)`, texto de apoio vindo de `site.company.headline` e barra de acento em gradiente azul→ciano.
- Seções: rótulo pequeno em maiúsculas + `h2`, espaçamento generoso, cards brancos com barra superior azul/ciano alternada, selo de ícone, `h3` e descrição. Hover com elevação suave, desligada por `prefers-reduced-motion`.
- Valores e serviços usam o mesmo padrão de card; tecnologias em `ProjectCard` viram etiquetas discretas quando houver projetos reais.
- Contato: ícones de e-mail e WhatsApp (quando preenchidos) dentro do mesmo padrão de selo; estado vazio continua exibindo "Informações de contato em breve."
- Rodapé com linha superior e monograma discreto.
- Novo componente `Icon.astro`: recebe `name`, devolve SVG inline com `aria-hidden="true"`, `stroke-width="1.75"`, `viewBox="0 0 24 24"`, 24 px. Nomes: `shield`, `palette`, `megaphone`, `code`, `check`, `eye`, `lightbulb`, `mail`, `whatsapp`, `mark`.
- Manter `max-width: 1120px`, `:focus-visible` com contorno de 3 px, links com `min-height: 44px`, skip link primeiro elemento focável e a regra de `prefers-reduced-motion`.

## Fora do escopo do builder

- Textos de conteúdo, ordem das seções e dados de `site.ts` permanecem os mesmos, exceto onde o herói passa a consumir `site.company.headline` (que já existe).
- `public/logo.svg`, hostname real, contato e projetos continuam pendentes do usuário.
- Decisões acima são chamadas do designer; se alguma se mostrar inviável no código, registrar e retornar antes de mudar a direção visual.
