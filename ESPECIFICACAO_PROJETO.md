# Especificação — SaaS Financeiro para Motoristas de Aplicativo

> Documento de referência do projeto. Serve de base para o CLAUDE.md do monorepo
> e para os primeiros prompts de implementação no Claude Code.

## 1. Visão geral

SaaS para motoristas de aplicativo controlarem suas finanças (ganhos, gastos com
combustível, despesas extras) e visualizarem indicadores de rentabilidade.

Dois públicos / dois conjuntos de telas:

- **Admin** (você): gerencia planos, assinaturas, usuários, libera/bloqueia acesso
- **Motorista** (cliente final): usa o PWA no dia a dia, mobile-first

## 2. Modelo de domínio (entidades principais)

### Usuario
| Campo | Tipo | Observação |
|---|---|---|
| id | UUID/Long | |
| nome | String | |
| email | String | único, login |
| senhaHash | String | |
| role | Enum | ADMIN, MOTORISTA |
| status | Enum | TRIAL_ATIVO, TRIAL_EXPIRADO, ATIVO, BLOQUEADO |
| dataInicioTrial | LocalDate | preenchido no cadastro |
| dataFimTrial | LocalDate | dataInicioTrial + 7 dias |
| criadoEm | LocalDateTime | |

### Veiculo
| Campo | Tipo | Observação |
|---|---|---|
| id | Long | |
| usuario | FK Usuario | |
| apelido/modelo | String | ex: "Onix 2022" |
| placa | String | opcional |
| tipoCombustivel | Enum | GASOLINA, ETANOL, DIESEL, GNV, ELETRICO |
| autonomia | BigDecimal | km/l ou km/kWh dependendo do tipo |
| ativo | boolean | quantidade máxima de veículos ativos é limitada pelo plano do usuário (ver `Plano.limiteVeiculos`) |

### PrecoCombustivel (histórico!)
| Campo | Tipo | Observação |
|---|---|---|
| id | Long | |
| usuario | FK Usuario | |
| tipoCombustivel | Enum | |
| preco | BigDecimal | por litro ou por kWh |
| vigenteDesde | LocalDate | permite reconstituir custo de dias passados |

> Regra: ao calcular o gasto de um `RegistroDia`, usar o preço vigente **na data
> daquele registro**, não necessariamente o preço mais recente.

### RegistroDia
| Campo | Tipo | Observação |
|---|---|---|
| id | Long | |
| usuario | FK Usuario | |
| veiculo | FK Veiculo | |
| data | LocalDate | um registro por dia |
| kmRodado | BigDecimal | baseado no odômetro; valor único por dia (não por plataforma) |
| ganhoBrutoTotal | BigDecimal | campo derivado = soma dos GanhoPorPlataforma do dia |
| gastoCombustivelCalculado | BigDecimal | campo derivado, calculado no save |
| lucroLiquido | BigDecimal | campo derivado (ganhoBrutoTotal - combustível - despesas do dia) |

### GanhoPorPlataforma
| Campo | Tipo | Observação |
|---|---|---|
| id | Long | |
| registroDia | FK RegistroDia | um dia pode ter N lançamentos de plataforma |
| plataforma | Enum | UBER, NOVENTA_E_NOVE, IFOOD, INDRIVE, OUTRA |
| valor | BigDecimal | ganho bruto naquela plataforma naquele dia |

> Motivo de separar: motorista pode trabalhar em mais de um app no mesmo dia.
> O km rodado é um valor só (do odômetro do carro), mas o ganho é detalhado
> por plataforma — o que também permite comparar rentabilidade entre apps.

### Despesa
| Campo | Tipo | Observação |
|---|---|---|
| id | Long | |
| usuario | FK Usuario | |
| categoria | Enum | MANUTENCAO, ALIMENTACAO, LIMPEZA, SEGURO, OUTROS |
| descricao | String | |
| valor | BigDecimal | |
| data | LocalDate | |

### Plano
| Campo | Tipo | Observação |
|---|---|---|
| id | Long | |
| nome | String | Básico, Pro, Premium |
| valorMensal | BigDecimal | |
| limiteVeiculos | int | Básico = 1, Pro = 3, Premium = ilimitado (ex: -1 ou 999) |
| descricaoFuncionalidades | String/JSON | |
| ativo | boolean | |

**Diferenciação sugerida entre planos:**

| Funcionalidade | Básico | Pro | Premium/Frota |
|---|---|---|---|
| Veículos | 1 | até 3 | ilimitado + múltiplos motoristas |
| Registro diário, despesas, dashboard | ✅ | ✅ | ✅ |
| Exportação de relatórios (PDF/Excel) | ❌ | ✅ | ✅ |
| Comparativo de rentabilidade por plataforma | ❌ | ✅ | ✅ |
| Metas mensais | ❌ | ✅ | ✅ |
| Alertas de manutenção por KM | ❌ | ✅ | ✅ |
| Relatório fiscal anual consolidado | ❌ | ❌ | ✅ |
| Preço de combustível sugerido por região (API) | ❌ | ❌ | ✅ |
| Suporte prioritário | ❌ | ❌ | ✅ |

> Para o MVP, só o Básico precisa estar implementado. Manter o modelo de dados
> pronto para os demais (campo `limiteVeiculos`, flags de feature) evita
> retrabalho estrutural quando forem lançados.

### Assinatura
| Campo | Tipo | Observação |
|---|---|---|
| id | Long | |
| usuario | FK Usuario | |
| plano | FK Plano | |
| status | Enum | AGUARDANDO_PAGAMENTO, ATIVA, EXPIRADA, CANCELADA |
| dataInicio | LocalDate | |
| dataExpiracao | LocalDate | |
| confirmadoPor | FK Usuario (admin) | quem confirmou o pagamento manual |
| confirmadoEm | LocalDateTime | |

## 3. Regras de negócio centrais

### Cálculo de gasto com combustível (por RegistroDia)
```
precoVigente = preço de PrecoCombustivel para o tipo do veículo, vigente na data do registro
gastoCombustivel = (kmRodado / autonomia) × precoVigente
ganhoBrutoTotal = soma(GanhoPorPlataforma do dia)
lucroLiquido = ganhoBrutoTotal − gastoCombustivel − soma(despesas da mesma data, se aplicável)
```

### Ciclo de vida de acesso (trial → pago → bloqueio)
```
Cadastro do motorista
  → status = TRIAL_ATIVO, dataFimTrial = hoje + 7 dias

A cada requisição autenticada (filtro/interceptor no backend):
  se status == TRIAL_ATIVO e hoje > dataFimTrial:
      status = TRIAL_EXPIRADO → bloquear acesso às telas, redirecionar para "assinar"
  se status == ATIVO e hoje > assinatura.dataExpiracao:
      status = BLOQUEADO → bloquear acesso

Admin confirma pagamento manual:
  cria/atualiza Assinatura (status = ATIVA, dataExpiracao = hoje + 30 dias)
  usuario.status = ATIVO
```
Sugestão para v2: job `@Scheduled` diário para varrer usuários e atualizar status
proativamente (não depender só do acesso do usuário), útil para notificações.

### Indicadores do dashboard do motorista
- Ganho bruto (dia / semana / mês)
- Gasto com combustível (dia / semana / mês)
- Despesas extras (mês)
- Lucro líquido (dia / semana / mês)
- KM rodado total
- Ganho médio por KM (ganhoBruto / kmRodado)

## 4. Módulos e telas

### App do motorista (PWA, mobile-first)
1. Onboarding / cadastro (trial automático de 7 dias)
2. Cadastro de veículo (com tipo de combustível e autonomia)
3. Cadastro de preço de combustível
4. Registro do dia (km rodado do odômetro + lançamento de ganho por
   plataforma, podendo adicionar várias linhas: Uber, 99, iFood, etc.)
5. Cadastro de despesas
6. Dashboard (indicadores + gráficos)
7. Tela de assinatura/plano (status do trial, botão "quero assinar" que gera
   pedido para o admin confirmar)

### Painel admin
1. Login admin
2. Lista de usuários (status, trial, assinatura)
3. Gestão de planos (CRUD simples)
4. Confirmação manual de pagamento (muda status da assinatura)
5. Visão geral (quantos usuários em trial, ativos, bloqueados)

## 5. Requisitos não-funcionais

- **PWA**: manifest.json, service worker, instalável, funcional offline pelo
  menos para visualizar o último dashboard carregado
- **Responsivo mobile-first**: motorista usa no celular; admin pode ser
  desktop-first
- **Autenticação**: JWT stateless, refresh token
- **Autorização**: por role (ADMIN / MOTORISTA) + por status de acesso
  (trial/ativo/bloqueado) via interceptor

## 6. Stack técnica

- Backend: Java 17, Spring Boot 3.x, Spring Security, Spring Data JPA, MySQL 8, Maven
- Frontend: React (Vite) + TypeScript, consumindo API REST via Axios
- Infra local: Docker Compose (mysql + backend + frontend)
- Documentação de API: springdoc-openapi (Swagger UI)

## 7. Ordem sugerida de implementação (fatias verticais)

1. Setup do monorepo, Docker Compose, esqueleto Spring Boot + esqueleto React
2. Cadastro/login de usuário + JWT + trial automático (sem bloqueio ainda)
3. CRUD de Veículo
4. CRUD de Preço de Combustível (com histórico de vigência)
5. Registro do dia + cálculo de gasto/lucro
6. CRUD de Despesa
7. Dashboard com indicadores (backend agregando, frontend exibindo)
8. Bloqueio por trial expirado (interceptor + tela de "assine")
9. Painel admin: usuários, planos, confirmação manual de pagamento
10. PWA (manifest, service worker, ajustes de responsividade)

## 8. Decisões confirmadas

- **Limite de veículo**: Básico permite 1 veículo ativo; limite fica no
  campo `Plano.limiteVeiculos`, validado no backend ao cadastrar veículo
- **Registro do dia**: km rodado é um valor único por dia (odômetro); ganho é
  detalhado por plataforma via `GanhoPorPlataforma` (N por dia)
- **Planos**: ver tabela de diferenciação na seção 2 (Plano). MVP implementa
  só o Básico, mas o modelo já suporta os demais

## 9. Pontos ainda em aberto

- Notificação (email/push/WhatsApp) quando o trial está acabando (ex: aviso
  no dia 5 de 7)?
- Se o motorista trocar de veículo (vender o carro, trocar de plano), o que
  acontece com o veículo antigo — inativar ou excluir?
- Moeda/mercado único (BRL/Brasil) por enquanto, certo? Afeta formatação e
  cálculo de imposto no relatório fiscal do plano Premium
