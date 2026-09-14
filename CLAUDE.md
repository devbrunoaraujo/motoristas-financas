# KmUp — Monorepo

SaaS para motoristas de aplicativo organizarem suas finanças (ganhos por
plataforma, gasto estimado com combustível, despesas, dashboard de
indicadores). Ver `ESPECIFICACAO_PROJETO.md` para o modelo de domínio e
regras de negócio completas.

## Estrutura
- `backend/`: API REST em Java 17 + Spring Boot 3, MySQL — ver `backend/CLAUDE.md`
- `frontend/`: PWA em React consumindo a API — ver `frontend/CLAUDE.md`

## Regra arquitetural importante
Backend e frontend são totalmente desacoplados. O frontend **nunca** acessa
o banco de dados diretamente — toda interação passa pela API REST do
backend, via HTTP/JSON, autenticada com JWT.

## Dois públicos
- **Motorista**: usa o PWA (mobile-first) no dia a dia
- **Admin**: gerencia planos, assinaturas e confirma pagamentos manuais no
  painel administrativo

## Rodando localmente

Com Docker (recomendado — sobe tudo de uma vez):
```
docker compose up -d
```
- Backend: http://localhost:8080 (docs em http://localhost:8080/docs)
- Frontend: http://localhost:5173
- MySQL: localhost:3306

Sem Docker (rodando backend e frontend manualmente):
```
# terminal 1 — sobe só o banco
docker compose up -d mysql

# terminal 2 — backend
cd backend && ./mvnw spring-boot:run

# terminal 3 — frontend
cd frontend && npm install && npm run dev
```

## Ordem de implementação (fatias verticais)
Ver seção 7 de `ESPECIFICACAO_PROJETO.md`. Resumo:
1. ✅ Setup do monorepo (este esqueleto)
2. Cadastro/login de usuário + JWT + trial automático
3. CRUD de Veículo (com limite por plano)
4. CRUD de Preço de Combustível (com histórico de vigência)
5. Registro do dia + GanhoPorPlataforma + cálculo de gasto/lucro
6. CRUD de Despesa
7. Dashboard com indicadores
8. Bloqueio por trial expirado / assinatura vencida
9. Painel admin (usuários, planos, confirmação de pagamento)
10. PWA (manifest, service worker, ajustes finos de responsividade)

## Convenção de trabalho
Este projeto é usado para aprender Java, Spring, Docker, Git/GitHub e o uso
agentic do Claude Code. Prefira passos pequenos, explique decisões de
arquitetura antes de implementar, e sugira quando algo vale ser escrito
manualmente para fins de aprendizado.
