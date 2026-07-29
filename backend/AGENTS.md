# Backend — API Motoristas Finanças

## Stack
Java 17, Spring Boot 3.3, Spring Data JPA, Spring Security, MySQL 8, Maven,
jjwt (JWT), springdoc-openapi (Swagger em `/docs`).

## Arquitetura
Controller -> Service -> Repository -> Entity
DTOs para entrada/saída (nunca expor Entity direto na API).
Pacotes: `controller`, `service`, `repository`, `model` (+ `model.enums`),
`dto`, `security`, `config`, `exception`.

## Autenticação e autorização
- JWT stateless. Endpoints públicos: `/auth/**`, `/health`, `/docs/**`.
- Demais endpoints exigem `Authorization: Bearer <token>`.
- Roles: `ADMIN`, `MOTORISTA`.
- Interceptor/filtro adicional verifica `Usuario.status` (TRIAL_ATIVO,
  TRIAL_EXPIRADO, ATIVO, BLOQUEADO) e bloqueia acesso às rotas de MOTORISTA
  quando o trial expirou ou a assinatura está vencida.

## Modelo de domínio (referência completa: ESPECIFICACAO_PROJETO.md na raiz)

- **Usuario**: role, status de acesso, datas de trial
- **Veiculo**: pertence a um Usuario; quantidade ativa limitada por
  `Plano.limiteVeiculos`
- **PrecoCombustivel**: histórico por tipo de combustível, com `vigenteDesde`
  — ao calcular gasto de um dia, usar o preço vigente NA DATA do registro,
  não o mais recente
- **RegistroDia**: um por dia; `kmRodado` é valor único (odômetro);
  `ganhoBrutoTotal` é derivado da soma de `GanhoPorPlataforma`
- **GanhoPorPlataforma**: N por RegistroDia (Uber, 99, iFood, InDrive, Outra)
- **Despesa**: categorizada, por data
- **Plano**: nome, valorMensal, limiteVeiculos, funcionalidades habilitadas
- **Assinatura**: status, datas, confirmação manual de pagamento pelo admin

## Regra de cálculo (não alterar sem avisar)
```
gastoCombustivel = (kmRodado / veiculo.autonomia) × precoVigenteNaData
ganhoBrutoTotal = soma(GanhoPorPlataforma do dia)
lucroLiquido = ganhoBrutoTotal - gastoCombustivel - soma(despesas da mesma data)
```

## Convenções
- Bean Validation (`@Valid`) em todo DTO de entrada
- Tratamento de erro centralizado via `@ControllerAdvice`
- BigDecimal para todo valor monetário e de KM (nunca double/float)
- Testes: JUnit 5 + Mockito para service; `@SpringBootTest` para integração
- Commits pequenos, um recurso por vez (ex: "feat: cadastro de veículo")

## Objetivo de aprendizado
Estou aprendendo Java e Spring. Ao implementar algo novo:
- Explique o "porquê" da decisão antes de codar (ex: por que DTO, por que
  essa anotação)
- Vá em passos pequenos — uma entidade/camada por vez, não tudo de uma vez
- Aponte quando algo for boa prática "de mercado" que vale eu entender bem

## Comandos
```
./mvnw clean install
./mvnw spring-boot:run
./mvnw test
```
