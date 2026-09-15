# Markdown Editor Web

<img src="dist/favicon.svg" alt="Descrição da imagem" width="300">


Editor Markdown executado inteiramente no navegador, com preview em tempo real, atalhos de formatação e exportação para `.md`.

## Funcionalidades

- Editor e preview sincronizados lado a lado em telas grandes.
- Alternância exclusiva entre Editor e Preview no celular, começando pelo Editor.
- GitHub Flavored Markdown: tabelas, listas de tarefas e texto tachado.
- Syntax highlighting com cópia integral de blocos de código.
- Atalhos de teclado para negrito, itálico e links.
- Temas claro e escuro com persistência da preferência.
- Título e conteúdo salvos automaticamente no `localStorage`.
- Download em `.md` e cópia do Markdown ou HTML renderizado.
- JetBrains Mono servida pelo próprio aplicativo, sem Google Fonts.

## Segurança e privacidade

O aplicativo não possui backend, contas ou analytics. O título e o conteúdo do documento ficam no `localStorage` do navegador e não são enviados pelo aplicativo.

HTML inserido no Markdown não é executado. Links e imagens com protocolos perigosos são bloqueados; links aceitam `http`, `https` e `mailto`, enquanto imagens aceitam apenas `http` e `https`, além de caminhos locais.

Imagens externas referenciadas explicitamente no Markdown são carregadas diretamente pelo navegador. Nesse caso, o servidor que hospeda a imagem recebe a requisição HTTP correspondente.

## Tecnologias

- React 18, TypeScript e Vite 6
- Tailwind CSS e `@tailwindcss/typography`
- `react-markdown`, `remark-gfm`, `rehype-highlight` e `highlight.js`
- Vitest 5 e React Testing Library

## Executar localmente

Pré-requisitos: Node.js 24 e npm 10.

```bash
npm ci
npm run dev
```

Abra [http://localhost:5173](http://localhost:5173).

### Verificações

```bash
npm run lint
npm test
npm run build
npm audit
```

O build estático é gerado em `dist/`.

## Licenças

O código deste projeto é distribuído sob a [licença MIT](LICENSE), copyright © 2026 ChrisG.

As licenças e atribuições das dependências incluídas no aplicativo estão em [THIRD-PARTY-NOTICES.txt](public/THIRD-PARTY-NOTICES.txt). Para regenerar o arquivo após atualizar dependências:

```bash
npx --yes generate-license-file@4.2.5 \
  --input package.json \
  --output public/THIRD-PARTY-NOTICES.txt \
  --overwrite \
  --eol lf \
  --no-spinner
```
