# Especificação — KmUp: SaaS Financeiro para Motoristas de Aplicativo

> Documento de referência do projeto. Serve de base para o CLAUDE.md do monorepo
> e para os primeiros prompts de implementação no Claude Code.

## 1. Visão geral

SaaS para motoristas de aplicativo controlarem suas finanças (ganhos, gastos com
combustível, despesas extras) e visualizarem indicadores de rentabilidade.

Dois públicos / dois conjuntos de telas:

- **Admin** (você): gerencia planos, assinaturas, usuários, libera/bloqueia acesso
- **Motorista** (cliente final): usa o PWA no dia a dia, mobile-first

## 2. Modelo de domínio (entidades principais)

### Usuario ✅ Implementado
| Campo | Tipo | Observação |
|---|---|---|
| id | Long | |
| nome | String | |
| email | String | único, login |
| senhaHash | String | |
| role | Enum | ADMIN, MOTORISTA |
| status | Enum | TRIAL_ATIVO, TRIAL_EXPIRADO, ATIVO, BLOQUEADO |
| dataInicioTrial | LocalDate | preenchido no cadastro |
| dataFimTrial | LocalDate | dataInicioTrial + 7 dias |
| criadoEm | LocalDateTime | |

### Veiculo ✅ Implementado
| Campo | Tipo | Observação |
|---|---|---|
| id | Long | |
| usuario | FK Usuario | |
| apelido/modelo | String | ex: "Onix 2022" |
| placa | String | opcional |
| tipoCombustivel | Enum | GASOLINA, ETANOL, DIESEL, GNV, ELETRICO |
| autonomia | BigDecimal | km/l ou km/kWh dependendo do tipo |
| ativo | boolean | quantidade máxima de veículos ativos é limitada pelo plano do usuário (ver `Plano.limiteVeiculos`) |

### PrecoCombustivel ✅ Implementado
| Campo | Tipo | Observação |
|---|---|---|
| id | Long | |
| usuario | FK Usuario | |
| tipoCombustivel | Enum | |
| preco | BigDecimal | por litro ou por kWh |
| vigenteDesde | LocalDate | permite reconstituir custo de dias passados |

### RegistroDia ✅ Implementado
| Campo | Tipo | Observação |
|---|---|---|
| id | Long | |
| usuario | FK Usuario | |
| veiculo | FK Veiculo | |
| data | LocalDate | um registro por dia (upsert) |
| kmRodado | BigDecimal | baseado no odômetro |
| ganhoBrutoTotal | BigDecimal | campo derivado = soma dos GanhoPorPlataforma |
| gastoCombustivelCalculado | BigDecimal | campo derivado |
| lucroLiquido | BigDecimal | campo derivado |

### GanhoPorPlataforma ✅ Implementado
| Campo | Tipo | Observação |
|---|---|---|
| id | Long | |
| registroDia | FK RegistroDia | N por dia |
| plataforma | Enum | UBER, NOVENTA_E_NOVE, IFOOD, INDRIVE, OUTRA |
| valor | BigDecimal | ganho bruto na plataforma |

### Despesa ✅ Implementado
| Campo | Tipo | Observação |
|---|---|---|
| id | Long | |
| usuario | FK Usuario | |
| categoria | Enum | MANUTENCAO, ALIMENTACAO, LIMPEZA, SEGURO, OUTROS |
| descricao | String | |
| valor | BigDecimal | |
| data | LocalDate | |

### Plano ✅ Implementado
| Campo | Tipo | Observação |
|---|---|---|
| id | Long | |
| nome | String | Básico, Pro, Premium |
| valorMensal | BigDecimal | |
| limiteVeiculos | int | Básico = 1, Pro = 3, Premium = -1 (ilimitado) |
| descricaoFuncionalidades | String | |
| ativo | boolean | |

### Assinatura ✅ Implementado
| Campo | Tipo | Observação |
|---|---|---|
| id | Long | |
| usuario | FK Usuario | |
| plano | FK Plano | |
| status | Enum | AGUARDANDO_PAGAMENTO, ATIVA, EXPIRADA, CANCELADA |
| dataInicio | LocalDate | |
| dataExpiracao | LocalDate | |
| confirmadoPor | FK Usuario (admin) | |
| confirmadoEm | LocalDateTime | |

### Meta ✅ Implementado
| Campo | Tipo | Observação |
|---|---|---|
| id | Long | |
| usuario | FK Usuario | |
| metaMensal | BigDecimal | meta de lucro mensal |
| vigenteDesde | LocalDate | semanal/diária calculadas automaticamente |

### Configuracao ✅ Implementado
| Campo | Tipo | Observação |
|---|---|---|
| id | Long | |
| chave | String | único |
| valor | String | |
| descricao | String | |

---

## 3. Regras de negócio centrais

### Cálculo de gasto com combustível ✅
```
precoVigente = preço vigente na data do registro
gastoCombustivel = (kmRodado / autonomia) × precoVigente
lucroLiquido = ganhoBrutoTotal − gastoCombustivel − despesasDoDia
```

### Ciclo de vida de acesso ✅
- Cadastro → TRIAL_ATIVO (7 dias)
- Job @Scheduled (1 min) → TRIAL_EXPIRADO automático
- AcessoInterceptor → 403 para TRIAL_EXPIRADO/BLOQUEADO
- Admin confirma pagamento → ATIVO + Assinatura ATIVA (30 dias)

### Metas ✅
- Meta mensal de lucro cadastrada pelo motorista
- Semanal e diária calculadas proporcionalmente
- Barra de progresso no Dashboard

---

## 4. Módulos e telas

### App do motorista (PWA, mobile-first) ✅
1. Login/Cadastro ✅
2. Dashboard (indicadores + gráficos + metas + trial card) ✅
3. Registro do Dia (calendário, edição, múltiplas plataformas) ✅
4. Veículos (CRUD) ✅
5. Combustível (histórico de preços) ✅
6. Despesas (CRUD) ✅
7. Metas (configuração) ✅
8. Assinatura (tela com WhatsApp) ✅

### Painel admin ✅
1. Dashboard admin ✅
2. Usuários (CRUD, filtros, dias restantes) ✅
3. Planos (CRUD) ✅
4. Confirmação de pagamento ✅
5. Configurações (WhatsApp admin) ✅

---

## 5. Stack técnica

- Backend: Java 17, Spring Boot 3.3.4, Spring Security, Spring Data JPA, MySQL 8, Maven
- Frontend: React 18, Vite, TypeScript, Axios, React Router, recharts, lucide-react
- Infra: Docker Compose (MySQL + backend + frontend)
- API Docs: springdoc-openapi (Swagger UI)
- PWA: vite-plugin-pwa

---

## 6. Implementações concluídas ✅

| # | Feature | Commit |
|---|---------|--------|
| 1 | Setup monorepo + Docker | — |
| 2 | Auth (JWT + cadastro/login + trial) | 139f81f |
| 3 | CRUD Veículo | e58bd02 |
| 4 | CRUD Preço Combustível | 7fc854c |
| 5 | Registro do Dia + cálculo | 5ed5dcf |
| 6 | CRUD Despesa | 084d47f |
| 7 | Dashboard + indicadores | a786055 |
| 8 | Bloqueio por trial expirado | 0cce509 |
| 9 | Painel admin | edc4f2f |
| 10 | PWA + Design redesign | 5542a6a |
| 11 | CORS fix | 6663165 |
| 12 | Redirect por role | d675f82 |
| 13 | @Transactional fix | a58ac79 |
| 14 | Calendário + edição registros | 97e86af |
| 15 | Gráfico barras empilhadas | 420178a |
| 16 | Sistema de metas | 0dc4a56 |
| 17 | Simplificação metas | a079182 |
| 18 | Admin CRUD + Trial auto + Config | f9b13f2 |

---

## 7. Plano Pro — Features a implementar

### Fase 1: Gestão de Frota Avançada
- Controle de Manutenção (troca de óleo, pneus, revisões)
- Alertas por KM/Data
- Cálculo de Depreciação do veículo

### Fase 2: Análises Avançadas
- Turnos (início/fim de jornada) → lucro por hora
- Lucro real por KM e por hora
- Comparativo de ganhos por plataforma (Uber vs 99 vs iFood)
- Ponto de equilíbrio
- Consumo médio e custo por veículo
- Comparação entre períodos

### Fase 3: Financeiro e Planejamento
- Metas avançadas (ganho/hora, economia, custo/km)
- Financiamento/consórcio do veículo
- Provisão IR/MEI
- Reserva para manutenção

### Fase 4: Relatórios e Exportação
- PDF (relatório mensal consolidado)
- Excel (dados brutos)
- Relatório anual para IR

### Fase 5: Produtividade
- Notificações inteligentes
- Widget PWA

### Fase 6: Conveniência
- Backup/sincronização (exportar/importar JSON)

---

## 8. Diferenciação por plano

| Funcionalidade | Básico | Pro | Premium |
|---|---|---|---|
| Veículos | 1 | até 3 | ilimitado |
| Registro diário, despesas, dashboard | ✅ | ✅ | ✅ |
| Metas mensais | ✅ | ✅ | ✅ |
| Gestão de frota (manutenção, depreciação) | ❌ | ✅ | ✅ |
| Turnos e lucro por hora/km | ❌ | ✅ | ✅ |
| Comparativo por plataforma | ❌ | ✅ | ✅ |
| Ponto de equilíbrio | ❌ | ✅ | ✅ |
| Financiamento/consórcio | ❌ | ✅ | ✅ |
| Exportação PDF/Excel | ❌ | ✅ | ✅ |
| Notificações inteligentes | ❌ | ✅ | ✅ |
| Relatório fiscal anual | ❌ | ❌ | ✅ |
| Preço sugerido por região | ❌ | ❌ | ✅ |
| Suporte prioritário | ❌ | ❌ | ✅ |

---

## 9. Novas entidades (Plano Pro)

| Entidade | Fase | Campos |
|----------|------|--------|
| Manutencao | 1 | veiculo, tipo, kmReferencia, data, valor, proximoKm, proximaData |
| AlertaManutencao | 1 | veiculo, tipo, condicao, valorKm, valorData, ativo |
| Turno | 2 | usuario, veiculo, data, horaInicio/Fim, kmInicio/Fim |
| CustoFixo | 3 | usuario, descricao, valorMensal |
| MetaAvancada | 3 | usuario, tipo, titulo, valorAlvo, valorAtual, dataLimite |
| Financiamento | 3 | usuario, veiculo, tipo, valorTotal, parcela, totalParcelas |
| Notificacao | 5 | usuario, tipo, titulo, mensagem, lida |
