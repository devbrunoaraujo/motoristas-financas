// frontend/eslint.config.js
//
// A partir do ESLint 9, a configuração mudou de formato: antes era
// um arquivo .eslintrc (JSON/YAML), agora é um arquivo JS de verdade
// que EXPORTA um array de configurações — chamado de "flat config".
// Isso é o que faltava no projeto (só o pacote "eslint" estava
// instalado, sem esse arquivo nem os plugins).

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  // Pastas que o ESLint nunca deve analisar — "dist" é gerada pelo
  // build (Fase 0), não faz sentido lintar código já compilado.
  { ignores: ['dist'] },
  {
    // "extends" combina conjuntos de regras prontos: as recomendadas
    // do ESLint em si, mais as recomendadas do plugin de TypeScript.
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser, // reconhece variáveis globais do navegador (window, document, etc.) como válidas
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // Regras recomendadas para uso correto de Hooks do React
      // (ex: não chamar useState dentro de um if).
      ...reactHooks.configs.recommended.rules,

      // Regra específica do Vite: avisa se um arquivo de componente
      // também exporta outras coisas (quebra o Fast Refresh/HMR).
      // "warn" em vez de "error" para não travar o build por causa
      // disso — é um alerta de boas práticas, não um bug.
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // DÍVIDA TÉCNICA RASTREADA: o projeto usa "any" em vários
      // pontos (principalmente em blocos catch de chamadas HTTP).
      // O ideal é tipar esses erros corretamente (ex: com o tipo de
      // erro do axios), mas isso é um trabalho de refatoração maior.
      // Por ora, rebaixamos de "error" para "warning" — o CI segue
      // passando, mas o alerta continua visível a cada build,
      // lembrando que isso precisa ser corrigido com calma.
      '@typescript-eslint/no-explicit-any': 'warn',

      // Permite "catch {}" vazio DE PROPÓSITO (usado em alguns
      // pontos do projeto para ignorar um erro específico sem
      // tratamento) — mas continua barrando blocos {} vazios em
      // outros contextos (if, for, function), que geralmente são
      // sinal de código esquecido pela metade.
      'no-empty': ['error', { allowEmptyCatch: true }],
    },
  },
)
