---
name: vertical-slice
description: >
  Implementa uma nova feature vertical (backend + frontend) seguindo as convenções
  estabelecidas do projeto motoristas-financas. Use quando o usuário pedir para
  implementar uma nova entidade, CRUD, ou funcionalidade que envolva
  Controller/Service/Repository no backend e Service/Página no frontend.
---

# Vertical Slice — Guia de Implementação

Este skill codifica o padrão repetido de implementação de features neste projeto.
Siga cada seção na ordem.

## 1. Preparação

- Leia `ESPECIFICACAO_PROJETO.md` para entender o escopo da feature.
- Leia `backend/CLAUDE.md` e `frontend/CLAUDE.md` para convenções.
- Verifique se a feature exige plano específico (Pro/Premium). Se sim, use
  `PlanoAcessoService.exigirPro()` no service.

## 2. Backend (Java 17 + Spring Boot 3)

### Ordem de criação de arquivos:

1. **Entity** (`model/`) — JPA com `@Entity`, `@Table`, campos com `BigDecimal`
   para valores monetários/km (nunca `double`/`float`). Relacionamentos
   `@ManyToOne` com `FetchType.LAZY`. Getters/setters via Lombok
   `@Getter @Setter`.
2. **Enum** (`model/enums/`) — Se aplicável. Valores em MAIÚSCULAS.
3. **Repository** (`repository/`) — Interface `JpaRepository<Entity, Long>`.
   Métodos custom com `findBy*` ou `@Query`.
4. **DTOs** (`dto/`) — Separar Request e Response. `@Valid` em todos os campos
   de input. Nunca expor Entity diretamente.
5. **Service** (`service/`) — Lógica de negócio. Métodos que acessam
   relacionamentos lazy DEVEM ser `@Transactional(readOnly = true)`. Usar
   `RoundingMode.HALF_UP`, scale 2 para BigDecimal.
6. **Controller** (`controller/`) — `@RestController`, `@RequestMapping`. Usar
   `@AuthenticationPrincipal User user` → `getUsuarioId(user)` helper.
   Retornar `ResponseEntity`.

### Regras obrigatórias:

- DTOs na boundary da API — nunca expor Entity.
- `@Valid` em todos os DTOs de input.
- `BigDecimal` para todos os valores monetários e de KM.
- `@Transactional` em métodos que acessam lazy loading.
- Endpoints de motorista usam `getUsuarioId(user)` para resolver o usuário.

## 3. Frontend (React 18 + Vite + TypeScript)

### Ordem de criação de arquivos:

1. **Types** (`src/types/`) — Interface TypeScript correspondente ao DTO de
   response. Tipos fortes, evitar `any`.
2. **Service** (`src/services/`) — Funções que chamam a API via Axios. Nunca
   usar fetch/axios diretamente em componentes. Exportar funções async.
3. **Page** (`src/pages/motorista/`) — Componente funcional com `useState` +
   `useEffect`. Carregar dados no mount. UI em português.
4. **Route + NavBar** (`src/App.tsx`) — Adicionar import, entrada no array
   `motoristaLinks` com ícone do `lucide-react`, e `<Route>`.

### Regras obrigatórias:

- HTTP calls apenas via `src/services/*.ts`.
- Imports individuais do `lucide-react` (tree-shaking).
- Texto da UI em português, código em inglês.
- Botão de voltar em todas as páginas secundárias (seta SVG + `Link`).
- Dark theme: `#0a0a1a` bg, `#00b894` accent.
- `<option>` elements com `background-color: #1a1a2e` para selects.

## 4. Build e Teste

Após implementar:

1. Compilar backend: `.\mvnw.cmd clean compile -q` (workdir: `backend/`)
2. Compilar frontend: `npm run build` (workdir: `frontend/`)
3. Rebuild Docker: `docker compose up -d --build backend; docker compose restart frontend`
4. Verificar health: `Invoke-RestMethod http://localhost:8080/health`
5. Testar login: `POST /auth/login` com credenciais de teste.

## 5. Commit

- Um commit por feature, formato convencional.
- Exemplo: `feat: CRUD de Manutenção (Pro) — entity, service, controller, frontend`
- Verificar `git status` antes de commitar.
- Não commitar `.env`, credenciais, ou arquivos temporários.

## 6. Checklist de Validação

- [ ] Backend compila sem erros (`mvnw clean compile`)
- [ ] Frontend compila sem erros (`npm run build`)
- [ ] Endpoint retorna JSON correto (testar com Invoke-RestMethod)
- [ ] Validação funciona (testar com dados inválidos)
- [ ] Feature bloqueada para plano errado (se Pro/Premium)
- [ ] Commit feito com mensagem convencional
