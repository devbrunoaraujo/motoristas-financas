# Motoristas Finanças

SaaS para motoristas de aplicativo controlarem ganhos, gastos com
combustível e despesas, com dashboard de indicadores. PWA mobile-first.

## Stack
- Backend: Java 17, Spring Boot 3, Spring Security, Spring Data JPA, MySQL 8
- Frontend: React + Vite + TypeScript, PWA
- Infra: Docker Compose

## Documentação
- `ESPECIFICACAO_PROJETO.md`: modelo de domínio e regras de negócio
- `CLAUDE.md`: instruções gerais do projeto para o Claude Code
- `backend/CLAUDE.md` e `frontend/CLAUDE.md`: instruções específicas de cada camada

## Como rodar
1. Copie o arquivo de variáveis de ambiente e ajuste os valores (principalmente `JWT_SECRET`):
   ```
   cp .env.example .env
   ```
2. Suba os containers:
   ```
   docker compose up -d
   ```
Backend em http://localhost:8080 (Swagger em `/docs`), frontend em
http://localhost:5173.
