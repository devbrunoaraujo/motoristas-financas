# Frontend — Motoristas Finanças

## Stack
React 18 + Vite + TypeScript, Axios, React Router, vite-plugin-pwa.

## Comunicação com a API
- Toda chamada HTTP fica em `src/services/*.ts`, nunca dentro de componentes.
- Base URL vem de `VITE_API_URL` (ver `.env.example`).
- Token JWT é interceptado automaticamente em `src/services/api.ts`.

## Duas áreas da aplicação
- `pages/motorista/*`: PWA mobile-first — cadastro de veículo, combustível,
  registro do dia, despesas, dashboard
- `pages/admin/*`: painel administrativo — usuários, planos, confirmação de
  pagamento (pode ser desktop-first, menos prioridade visual)

## PWA e responsividade
- Mobile-first é prioridade máxima — a maioria dos motoristas vai acessar
  pelo celular.
- Manifest e ícones configurados em `vite.config.ts` / `public/`.
- Testar sempre em viewport mobile antes de considerar uma tela pronta.

## Convenções
- Componentes funcionais + hooks
- Tipagem forte (evitar `any`); tipos de domínio em `src/types/`
- Nomes de variáveis/funções em inglês; textos de UI em português

## Objetivo de aprendizado
Estou usando este projeto também para aprender o fluxo agentic do Claude
Code. Ao propor uma tela nova, explique brevemente a decisão de estrutura
antes de implementar.

## Comandos
```
npm install
npm run dev
npm run build
```
