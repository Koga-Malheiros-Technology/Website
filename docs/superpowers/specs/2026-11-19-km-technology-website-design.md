# Site institucional — KM Technology

**Data:** 2026-11-19
**Status:** proposto — aguardando aprovação

## Intenção e por quê

A KM Technology é uma software house que precisa de um site para se apresentar a potenciais clientes. O visitante deve sair do site sabendo **quem é a empresa, quais são seus valores, quais serviços de tecnologia ela oferece e quais sistemas já desenvolveu**, e com um caminho claro para entrar em contato. O site será publicado no GitHub Pages a partir deste repositório (hoje vazio), usando um domínio próprio.

## Objetivos

- Uma página única e responsiva com: topo, Sobre a empresa, Valores, Serviços de tecnologia, Sistemas já desenvolvidos e Contato.
- Deixar claro o que a empresa faz e como falar com ela.
- Usar um framework JavaScript (Astro) com componentes e conteúdo separados do layout, para facilitar alterações futuras.
- Publicar no GitHub Pages com build reproduzível a partir do repositório.
- Permitir que a logo seja adicionada depois, trocando um único arquivo.

## Não-objetivos

- Backend, banco de dados, CMS, autenticação ou área de clientes.
- Formulário de contato com envio (o contato será por links diretos).
- E-commerce, blog, multi-idioma ou páginas de produto.
- Consultoria de identidade visual — a identidade existe, só falta o arquivo da logo no repo.

## Anti-objetivos

- Site visualmente bom, mas que não deixa claro o serviço oferecido e como contatar.
- Apresentar sistemas ou clientes inventados como se fossem reais.
- Exigir configuração manual repetida ou serviços pagos para publicar.
- Conteúdo de exemplo deixado no ar como se fosse definitivo.

## Restrições

- Repositório recém-criado, sem código ou convenções prévias.
- A logo será fornecida pelo usuário e adicionada ao diretório depois; formato ainda não confirmado (assumir SVG em `public/logo.svg`).
- GitHub Pages serve arquivos estáticos e o usuário vai usar domínio próprio: `base` deve ser `/`, com `site` apontando para o domínio e um arquivo CNAME no build. O repositório remoto é `Koga-Malheiros-Technology/Website`; com domínio próprio, o nome do repo não entra nos caminhos.
- Os textos definitivos de Sobre, os dados dos sistemas e as informações de contato ainda não foram fornecidos.

## Abordagens consideradas

1. **HTML + CSS + JavaScript puro** — zero dependências e nenhum build. Descartada: o usuário pediu explicitamente um framework JavaScript.
2. **React + Vite** — SPA leve, build simples e publicação do `dist` via GitHub Actions. Boa opção, mas mais adequada a aplicações do que a um site de conteúdo; exige roteador se o site crescer.
3. **Next.js com export estático** — estrutura pronta para várias páginas, porém mais configuração (`output: 'export'`, `basePath`, imagens sem otimização) e build mais pesado do que o necessário para uma página.
4. **Astro — escolhida** — componentes, conteúdo separado do layout e saída estática com praticamente nenhum JavaScript no navegador. Atende ao pedido de framework JS, é a melhor ferramenta para um site institucional e permite criar páginas de projeto depois sem trocar de stack.
5. **WordPress** — descartada: exige PHP (incompatível com GitHub Pages) e não é um framework JavaScript.

## Decisões de implementação

### Estrutura

- Astro em modo estático (`output: 'static'`), JavaScript no cliente apenas se algum componente precisar; o site institucional não precisa de nenhum.
- `astro.config.mjs` com `site: 'https://<dominio-do-usuario>'` e `base: '/'`, já que há domínio próprio.
- `src/pages/index.astro` — página única.
- `src/layouts/BaseLayout.astro` — `<html lang="pt-BR">`, metadados, cabeçalho, rodapé e slot do conteúdo.
- `src/components/` — `SiteHeader.astro`, `SiteFooter.astro`, `SectionHeading.astro`, `ValueCard.astro`, `ServiceCard.astro`, `ProjectCard.astro`, `ContactSection.astro`.
- `src/data/site.ts` — **único lugar de conteúdo**: empresa, valores, serviços, sistemas e contato. Alterar textos não exige mexer no layout.
- `src/styles/global.css` — tokens de cor/espaçamento/tipografia e estilos base.
- `public/logo.svg` — arquivo único da logo; o cabeçalho e o rodapé referenciam este caminho.
- `public/CNAME` — uma linha com o hostname exato do domínio próprio; precisa ser copiado para `dist/` no build.
- `.github/workflows/deploy.yml` — build e publicação no GitHub Pages usando as actions oficiais (`configure-pages`, `upload-pages-artifact`, `deploy-pages`), preservando o CNAME. Detalhes exatos do workflow ficam com quem implementar.
- `.gitignore` — incluir `node_modules/`, `dist/`, `.astro/` e `.superpowers/`.

### Conteúdo

- **Serviços (definidos pelo usuário):** Marketing Digital, Design, Segurança da Informação e Desenvolvimento de Software sob Encomenda. Cada serviço vira um card com título e descrição curta; descrições podem ser escritas pelo implementador e revisadas depois.
- **Valores (autorização do usuário para propor):** Segurança, Qualidade, Transparência e Inovação, cada um com uma frase curta. São propostas provisórias, fáceis de trocar em `site.ts`.
- **Sobre a empresa:** texto curto em primeira pessoa do plural, baseado no fato de que a KM é uma software house. Texto provisório, a revisar.
- **Sistemas já desenvolvidos:** seção orientada a dados. Cada entrada de `projects[]` tem nome, descrição, tecnologias e, se houver, imagem e link. O array começa vazio e a seção só aparece quando houver entradas reais — um exemplo de formato fica comentado no arquivo. Nenhum projeto fictício será publicado como real.
- **Contato:** links de e-mail e WhatsApp lidos de `site.ts`. Os valores reais ainda não foram informados e devem ser preenchidos antes da publicação (ver itens em aberto).

### UX, visual e acessibilidade

- Layout de uma coluna em mobile e grade em desktop, com largura máxima por volta de 1120 px e espaçamento consistente.
- Ordem das seções: topo → Sobre → Valores → Serviços → Sistemas → Contato. Cada seção tem um `id` e o menu do topo usa âncoras.
- Contraste mínimo AA (4,5:1 para texto normal), foco visível em links e botões, alvos de toque de pelo menos 44 px, `alt` descritivo na logo e hierarquia de títulos h1 → h2 → h3.
- Link "Pular para o conteúdo" no início da página, navegação utilizável por teclado e suporte a `prefers-reduced-motion`.
- Paleta sóbria de software house em CSS custom properties, com cor de acento para chamadas de ação; pode ser ajustada quando a logo chegar. Sem fontes ou ícones carregados de serviços externos.
- Sem animações que atrasem a leitura; transições sutis, no máximo.

## Itens em aberto (dependem do usuário)

1. Hostname exato do domínio próprio (para `site` e `public/CNAME`).
2. Informações reais de contato (e-mail e WhatsApp/telefone).
3. Lista dos sistemas já desenvolvidos que podem aparecer publicamente e o que cada um faz.
4. Arquivo da logo (nome e formato) e, se houver, cores oficiais da marca.
5. Revisão dos textos provisórios de Sobre, valores e serviços.

## Critério de pronto

- `npm run build` gera `dist/` sem erros e `npm run preview` mostra a página corretamente em larguras de mobile e desktop.
- Navegação por âncoras, links de contato e logo funcionam; nenhum conteúdo de exemplo aparece como real.
- Publicação no GitHub Pages pelo workflow, com o domínio próprio e o CNAME corretos, sem caminho do repositório nas URLs.
- Checklist básico de acessibilidade: contraste, foco, `alt`, títulos e uso por teclado.
