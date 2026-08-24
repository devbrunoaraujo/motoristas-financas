# KmUp

SaaS para motoristas de aplicativo controlarem ganhos, gastos com
combustível e despesas, com dashboard de indicadores e metas.

## Funcionalidades

### Para Motoristas
- **Registro do Dia** — ganhos por plataforma (Uber, 99, iFood, etc.)
- **Gasto com Combustível** — cálculo automático baseado na autonomia do veículo
- **Despesas** — controle de gastos variáveis (manutenção, alimentação, etc.)
- **Custos Fixos** — aluguel, seguro, IPVA e outros gastos mensais
- **Dashboard** — gráficos de ganhos, gastos e lucro por período
- **Metas** — defina metas de lucro mensal e acompanhe o progresso
- **Ponto de Equilíbrio** — saiba quanto precisa faturar para cobrir custos
- **Manutenção Preventiva** — agende e receba alertas de manutenção
- **Exportação** — gere relatórios em Excel e PDF

### Para Administradores
- **Gestão de Usuários** — criar, editar, bloquear/reativar usuários
- **Gestão de Planos** — Básico, Pro, Premium com limites diferentes
- **Confirmação de Pagamento** — ativar assinaturas manualmente
- **Configurações** — WhatsApp do admin e outras configs

## Stack Tecnológica

### Backend
| Tecnologia | Finalidade |
|------------|------------|
| Java 17 | Linguagem principal |
| Spring Boot 3.3 | Framework web |
| Spring Security | Autenticação JWT e autorização por role |
| Spring Data JPA | Acesso a dados (Hibernate) |
| MySQL 8 | Banco de dados |
| Maven | Gerenciamento de dependências |
| jjwt | Geração e validação de JWT |
| Lombok | Redução de boilerplate |
| springdoc-openapi | Documentação Swagger |

### Frontend (Web)
| Tecnologia | Finalidade |
|------------|------------|
| React 18 | Biblioteca UI |
| TypeScript 5.5 | Tipagem estática |
| Vite 5.4 | Build tool e dev server |
| Axios | Requisições HTTP |
| React Router 6 | Navegação SPA |
| Recharts | Gráficos |
| Lucide React | Ícones |
| vite-plugin-pwa | PWA (Progressive Web App) |

### Mobile (Android)
| Tecnologia | Finalidade |
|------------|------------|
| Capacitor 8 | Bridge para nativo (Android) |
| React 19 | Biblioteca UI |
| TypeScript 6 | Tipagem estática |
| Vite 8.2 | Build tool |
| CapacitorHttp | Requisições HTTP nativas |

### Infraestrutura
| Tecnologia | Finalidade |
|------------|------------|
| Docker | Containerização |
| Docker Compose | Orquestração de containers |

## Estrutura do Projeto

```
motoristas-financas/
├── backend/                    # API REST (Java + Spring Boot)
│   ├── src/main/java/.../api/
│   │   ├── config/             # Configurações (SecurityConfig)
│   │   ├── controller/         # Endpoints REST (22 controllers)
│   │   ├── dto/                # Objetos de transferência de dados
│   │   ├── exception/          # Tratamento de exceções
│   │   ├── model/              # Entidades JPA
│   │   │   └── enums/          # Enumerações (Role, Status, etc.)
│   │   ├── repository/         # Interfaces de acesso a dados
│   │   ├── security/           # Autenticação e autorização
│   │   │   ├── JwtService.java           # Geração/validação JWT
│   │   │   ├── JwtAuthFilter.java        # Filtro de autenticação
│   │   │   ├── CustomUserDetailsService  # Carregamento de usuário
│   │   │   ├── AcessoInterceptor.java    # Bloqueio por status
│   │   │   ├── RequireAdmin.java         # Anotação @RequireAdmin
│   │   │   └── AdminSecurityAspect.java  # Verificação de role ADMIN
│   │   └── service/            # Lógica de negócio
│   └── pom.xml
│
├── frontend/                   # PWA Web (React + Vite)
│   ├── src/
│   │   ├── components/         # Componentes reutilizáveis
│   │   ├── contexts/           # React Contexts (Auth)
│   │   ├── pages/              # Páginas (motorista/ e admin/)
│   │   ├── services/           # Serviços para API
│   │   ├── styles/             # Estilos CSS
│   │   └── types/              # Tipos TypeScript
│   └── package.json
│
├── mobile/                     # App Android (React + Capacitor)
│   ├── src/
│   │   ├── api/                # Configuração do CapacitorHttp
│   │   ├── components/         # Componentes UI
│   │   ├── contexts/           # React Contexts (Auth)
│   │   ├── navigation/         # Rotas e navegação
│   │   ├── screens/            # Telas do app
│   │   ├── services/           # Serviços para API
│   │   └── types/              # Tipos TypeScript
│   ├── android/                # Projeto Android nativo
│   ├── capacitor.config.ts     # Configuração do Capacitor
│   └── package.json
│
├── docker-compose.yml          # Orquestração dos containers
├── ESPECIFICACAO_PROJETO.md    # Especificação e regras de negócio
├── DOCUMENTACAO_TECNICA.md     # Documentação técnica detalhada
└── README.md                   # Este arquivo
```

## Como Rodar

### Pré-requisitos
- Docker e Docker Compose instalados
- (Opcional) Java 17 e Maven para rodar backend sem Docker
- (Opcional) Node.js 18+ para rodar frontend sem Docker

### Com Docker (Recomendado)

1. Clone o repositório:
   ```bash
   git clone <url-do-repositorio>
   cd motoristas-financas
   ```

2. Copie o arquivo de variáveis de ambiente:
   ```bash
   cp .env.example .env
   ```
   Ajuste os valores, principalmente `JWT_SECRET`.

3. Suba os containers:
   ```bash
   docker compose up -d
   ```

4. Acesse:
   - **Backend (API)**: http://localhost:8080
   - **Swagger (Documentação)**: http://localhost:8080/docs
   - **Frontend (Web)**: http://localhost:5173
   - **MySQL**: localhost:3306

### Sem Docker

```bash
# Terminal 1 — Suba apenas o banco
docker compose up -d mysql

# Terminal 2 — Backend
cd backend
./mvnw spring-boot:run

# Terminal 3 — Frontend
cd frontend
npm install
npm run dev
```

### App Mobile (Android)

```bash
# 1. Instale as dependências
cd mobile
npm install

# 2. Build do web assets
npm run build

# 3. Sincronize com Capacitor
npx cap sync android

# 4. Build do APK (requer Java 17+)
cd android
./gradlew assembleDebug

# 5. O APK estará em:
# mobile/android/app/build/outputs/apk/debug/app-debug.apk

# 6. Instale no celular via ADB:
adb install app/build/outputs/apk/debug/app-debug.apk
```

## Sistema de Autenticação

### JWT (JSON Web Token)
- Tokens stateless com expiração configurável
- Claims: email, role (ADMIN/MOTORISTA), usuarioId
- Assinatura HMAC-SHA256

### Fluxo de Autenticação
1. **Cadastro**: Cria usuário com trial de 7 dias
2. **Login**: Valida credenciais e retorna JWT
3. **Requisições**: Token no header `Authorization: Bearer <token>`

### Autorização por Role
- **MOTORISTA**: Acesso às funcionalidades do app
- **ADMIN**: Acesso ao painel administrativo
- Anotação `@RequireAdmin` protege endpoints admin

### Bloqueio por Status
- **TRIAL_ATIVO**: Acesso completo (7 dias)
- **TRIAL_EXPIRADO**: Acesso bloqueado (precisa assinar)
- **ATIVO**: Acesso completo (assinatura ativa)
- **BLOQUEADO**: Acesso bloqueado (pelo admin)

## Sistema de Planos

| Plano | Veículos | Preço | Funcionalidades |
|-------|----------|-------|-----------------|
| Básico | 1 | R$ 19,90/mês | Funcionalidades básicas |
| Pro | 3 | R$ 39,90/mês | + Metas, Financeiro, Manutenção |
| Premium | Ilimitado | R$ 69,90/mês | + Exportação, Relatórios |

## Documentação Adicional

- **`ESPECIFICACAO_PROJETO.md`** — Modelo de domínio e regras de negócio completas
- **`DOCUMENTACAO_TECNICA.md`** — Documentação técnica detalhada do backend
- **`CLAUDE.md`** — Instruções gerais do projeto
- **`backend/CLAUDE.md`** — Instruções específicas do backend
- **`frontend/CLAUDE.md`** — Instruções específicas do frontend

## API Endpoints

### Autenticação (Públicas)
```
POST /auth/cadastro      — Cadastrar novo usuário
POST /auth/login         — Login e gerar JWT
GET  /auth/trial-info    — Informações do trial
```

### Motorista (Autenticadas)
```
GET/POST    /veiculos              — CRUD de veículos
GET/POST    /registros             — Registro do dia
GET/POST    /despesas              — CRUD de despesas
GET/POST    /metas                 — Metas de lucro
GET         /dashboard             — Resumo financeiro
GET/POST    /financeiro/custos-fixos — Custos fixos
GET         /financeiro/ponto-equilibrio — Ponto de equilíbrio
GET/POST    /manutencao/*          — Manutenções
GET         /relatorios/mensal     — Exportar relatório
```

### Admin (Autenticadas + Role ADMIN)
```
GET/POST    /admin/usuarios        — Gestão de usuários
PUT         /admin/usuarios/{id}/plano/{planoId} — Alterar plano
POST        /admin/confirmar-pagamento — Confirmar pagamento
GET/POST    /admin/planos          — Gestão de planos
GET/POST    /admin/plataformas     — Gestão de plataformas
GET/PUT     /admin/configuracoes   — Configurações
```

## Contribuição

Este projeto é usado para aprender Java, Spring, Docker, Git/GitHub e o uso
agentic do Claude Code. Prefira passos pequenos, explique decisões de
arquitetura antes de implementar, e sugira quando algo vale ser escrito
manualmente para fins de aprendizado.

## Licença

Projeto privado — uso interno.
