# Documentação Técnica — KmUp

## Índice
1. [Visão Geral da Aplicação](#visão-geral)
2. [Stack Tecnológica](#stack)
3. [Arquitetura do Backend](#arquitetura-backend)
4. [Pacote Security (Detalhado)](#security)
5. [Pacote Model (Entidades)](#model)
6. [Pacote Controller (Endpoints)](#controller)
7. [Pacote Service (Lógica de Negócio)](#service)
8. [Pacote DTO (Transferência de Dados)](#dto)
9. [Pacote Repository (Acesso a Dados)](#repository)
10. [Pacote Config (Configurações)](#config)
11. [Pacote Exception (Tratamento de Erros)](#exception)
12. [Fluxo de Autenticação](#fluxo-auth)
13. [Fluxo de Autorização por Plano](#fluxo-plano)
14. [Mobile (Capacitor)](#mobile)

---

## 1. Visão Geral da Aplicação {#visão-geral}

**Motoristas Finanças** é um SaaS para motoristas de aplicativo organizarem suas finanças.

### Funcionalidades Principais
- **Ganhos por plataforma** (Uber, 99, iFood, etc.)
- **Gasto estimado com combustível** (baseado na autonomia do veículo)
- **Despesas variáveis** (manutenção, alimentação, etc.)
- **Custos fixos** (aluguel, seguro, IPVA)
- **Dashboard com indicadores** (lucro, gastos, performance por KM)
- **Metas de lucro** (diária, semanal, mensal)
- **Ponto de equilíbrio financeiro**
- **Sistema de planos** (Básico, Pro, Premium)

### Dois Públicos
- **Motorista**: usa o PWA (mobile-first) no dia a dia
- **Admin**: gerencia planos, assinaturas e confirma pagamentos

---

## 2. Stack Tecnológica {#stack}

### Backend
| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| Java | 17 | Linguagem principal |
| Spring Boot | 3.3 | Framework web |
| Spring Security | - | Autenticação e autorização |
| Spring Data JPA | - | Acesso a dados (Hibernate) |
| MySQL | 8 | Banco de dados |
| Maven | 3.9 | Gerenciamento de dependências |
| jjwt | - | Geração e validação de JWT |
| Lombok | - | Redução de boilerplate |
| springdoc-openapi | - | Documentação Swagger |

### Frontend
| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| React | 18 | Biblioteca UI |
| TypeScript | 5.5 | Tipagem estática |
| Vite | 5.4 | Build tool |
| Axios | 1.7 | Requisições HTTP |
| React Router | 6.26 | Navegação |
| Recharts | - | Gráficos |
| Lucide React | - | Ícones |

### Mobile
| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| Capacitor | 8.5 | Bridge para nativo |
| React | 19 | Biblioteca UI |
| TypeScript | 6.0 | Tipagem estática |
| Vite | 8.2 | Build tool |

### Infraestrutura
| Tecnologia | Finalidade |
|------------|------------|
| Docker | Containerização |
| Docker Compose | Orquestração de containers |

---

## 3. Arquitetura do Backend {#arquitetura-backend}

```
backend/
├── src/main/java/com/motoristasfinancas/api/
│   ├── ApiApplication.java          # Ponto de entrada
│   ├── config/                      # Configurações
│   │   └── SecurityConfig.java      # Configuração de segurança
│   ├── controller/                  # Endpoints REST (22 controllers)
│   ├── dto/                         # Objetos de transferência de dados
│   ├── exception/                   # Tratamento de exceções
│   ├── model/                       # Entidades JPA
│   │   └── enums/                   # Enumerações
│   ├── repository/                  # Interfaces de acesso a dados
│   ├── security/                    # Autenticação e autorização
│   └── service/                     # Lógica de negócio
└── src/main/resources/
    └── application.properties       # Configurações da aplicação
```

### Camadas da Arquitetura

```
Controller → Service → Repository → Entity
    ↓           ↓          ↓          ↓
  @RestController  Lógica    JPA     @Entity
  Endpoints REST   negócio   Query   Tabela DB
```

**Fluxo de uma requisição:**
1. **Controller** recebe a requisição HTTP
2. **Service** executa a lógica de negócio
3. **Repository** acessa o banco de dados
4. **Entity** representa a tabela no banco

---

## 4. Pacote Security (Detalhado) {#security}

O pacote `security` é responsável pela **autenticação** (quem é o usuário) e **autorização** (o que ele pode fazer).

### 4.1 JwtService.java

**Responsabilidade:** Gerar e validar tokens JWT.

```java
@Service
public class JwtService {
    @Value("${jwt.secret}")
    private String secret;              // Chave secreta para assinar tokens

    @Value("${jwt.expiration-minutes}")
    private long expirationMinutes;     // Tempo de expiração do token

    // Métodos principais:
    public String gerarToken(String email, String role, Long usuarioId)
    public Claims validarToken(String token)
    public String extrairEmail(String token)
    public boolean tokenValido(String token)
}
```

**Como funciona:**
1. `gerarToken()`: Cria um JWT com:
   - `subject` = email do usuário
   - `claim("role")` = papel do usuário (ADMIN/MOTORISTA)
   - `claim("usuarioId")` = ID do usuário
   - `expiration` = data de expiração
   - Assinatura HMAC-SHA256

2. `validarToken()`: Verifica se o token é válido (não expirado, assinatura correta)

3. `extrairEmail()`: Extrai o email do token sem validar (usado antes da validação)

**Exemplo de token JWT:**
```
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyQGVtYWlsLmNvbSIsInJvbGUiOiJNT1RPUklTVEEiLCJ1c3VhcmlvSWQiOjEsImlhdCI6MTY5...
```

### 4.2 JwtAuthFilter.java

**Responsabilidade:** Filtrar requisições e autenticar via JWT.

```java
@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, ...) {
        // 1. Extrair token do header Authorization: Bearer <token>
        // 2. Extrair email do token
        // 3. Carregar UserDetails do banco
        // 4. Validar token
        // 5. Se válido, criar Authentication no SecurityContext
    }
}
```

**Fluxo detalhado:**
```
Requisição → Extrair header "Authorization"
           → Verificar se começa com "Bearer "
           → Extrair token (remover "Bearer ")
           → Extrair email do token
           → Carregar usuário do banco via UserDetailsService
           → Validar token (assinatura + expiração)
           → Se válido: criar UsernamePasswordAuthenticationToken
           → Setar no SecurityContextHolder
           → Continuar cadeia de filtros
```

### 4.3 CustomUserDetailsService.java

**Responsabilidade:** Carregar dados do usuário para o Spring Security.

```java
@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String email) {
        // 1. Buscar usuário no banco por email
        // 2. Retornar UserDetails com:
        //    - email (username)
        //    - senhaHash (password)
        //    - role (authority: ROLE_ADMIN ou ROLE_MOTORISTA)
    }
}
```

**Por que existe?**
O Spring Security precisa de um `UserDetails` para fazer autenticação. Esta classe adapta nossa entidade `Usuario` para o formato esperado pelo Spring.

### 4.4 AcessoInterceptor.java

**Responsabilidade:** Bloquear acesso de usuários com trial expirado ou bloqueado.

```java
@Component
public class AcessoInterceptor extends OncePerRequestFilter {
    private final UsuarioRepository usuarioRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, ...) {
        // 1. Verificar se usuário está autenticado
        // 2. Carregar status do usuário do banco
        // 3. Se TRIAL_ATIVO e dataFimTrial passou → atualizar para TRIAL_EXPIRADO
        // 4. Se TRIAL_EXPIRADO ou BLOQUEADO:
        //    - Se rota não é /auth/** nem /health → retornar 403
        //    - Se é rota liberada → permitir acesso
    }
}
```

**Lógica de bloqueio:**
```
Status do Usuário → TRIAL_ATIVO? 
    → Verificar se trial expirou
    → Se expirou: atualizar para TRIAL_EXPIRADO

Status → TRIAL_EXPIRADO ou BLOQUEADO?
    → Rota é /auth/* ou /health? → PERMITIR
    → Outra rota? → BLOQUEAR (403 Forbidden)
```

### 4.5 SecurityConfig.java

**Responsabilidade:** Configurar toda a segurança da aplicação.

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) {
        return http
            .cors(...)                    // Configurar CORS
            .csrf(csrf -> csrf.disable()) // Desabilitar CSRF (API stateless)
            .sessionManagement(...)       // Sessão stateless (sem HttpSession)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**").permitAll()      // Rotas públicas
                .requestMatchers("/health").permitAll()
                .anyRequest().authenticated()                 // Demais: autenticadas
            )
            .addFilterBefore(jwtAuthFilter, ...)     // Filtro JWT antes do padrão
            .addFilterAfter(acessoInterceptor, ...)  // Filtro de acesso após JWT
            .build();
    }
}
```

**Ordem dos filtros:**
```
Requisição HTTP
    ↓
1. JwtAuthFilter (autentica via JWT)
    ↓
2. AcessoInterceptor (verifica status do usuário)
    ↓
3. Controller (executa a lógica)
```

**Endpoints públicos (não precisam de token):**
- `/auth/**` — cadastro, login, trial-info
- `/health` — status da aplicação
- `/planos` — listar planos
- `/plataformas` — listar plataformas
- `/configuracoes/chave/**` — configurações públicas
- `/docs/**`, `/swagger-ui/**` — documentação

**CORS configurado:**
- `http://localhost:5173` — frontend web
- `capacitor://localhost` — app Android
- `https://localhost` — app Android (HTTPS)
- `http://10.0.0.230:5173` — rede local

---

## 5. Pacote Model (Entidades) {#model}

### Entidades Principais

#### Usuario
```java
@Entity
@Table(name = "usuarios")
public class Usuario {
    Long id;
    String nome;
    String email;
    String senhaHash;           // Senha criptografada com BCrypt
    Role role;                  // ADMIN ou MOTORISTA
    StatusUsuario status;       // TRIAL_ATIVO, TRIAL_EXPIRADO, ATIVO, BLOQUEADO
    LocalDate dataInicioTrial;
    LocalDate dataFimTrial;
    LocalDateTime criadoEm;
}
```

#### Veiculo
```java
@Entity
@Table(name = "veiculos")
public class Veiculo {
    Long id;
    Usuario usuario;            // Dono do veículo
    String apelido;
    String placa;
    TipoCombustivel tipoCombustivel;  // GASOLINA, ETANOL, DIESEL, GNV, ELETRICO
    BigDecimal autonomia;       // Km por litro (ou Km por KW para elétricos)
    boolean ativo;
    BigDecimal valorCompra;     // Para cálculo de depreciação
    LocalDate dataAquisicao;
}
```

#### RegistroDia
```java
@Entity
@Table(name = "registros_dia")
public class RegistroDia {
    Long id;
    Usuario usuario;
    Veiculo veiculo;
    LocalDate data;
    BigDecimal kmRodado;
    BigDecimal ganhoBrutoTotal;         // Soma dos ganhos por plataforma
    BigDecimal gastoCombustivelCalculado; // (kmRodado / autonomia) × preço
    BigDecimal lucroLiquido;            // ganhoBruto - gastoCombustivel - despesas
    List<GanhoPorPlataforma> ganhos;
}
```

#### Despesa
```java
@Entity
@Table(name = "despesas")
public class Despesa {
    Long id;
    Usuario usuario;
    CategoriaDespesa categoria;  // MANUTENCAO, ALIMENTACAO, LIMPEZA, SEGURO, OUTROS
    String descricao;
    BigDecimal valor;
    LocalDate data;
}
```

#### Plano
```java
@Entity
@Table(name = "planos")
public class Plano {
    Long id;
    String nome;                // "Básico", "Pro", "Premium"
    BigDecimal valorMensal;
    int limiteVeiculos;         // -1 = ilimitado
    String descricaoFuncionalidades;
    boolean ativo;
}
```

#### Assinatura
```java
@Entity
@Table(name = "assinaturas")
public class Assinatura {
    Long id;
    Usuario usuario;
    Plano plano;
    StatusAssinatura status;    // AGUARDANDO_PAGAMENTO, ATIVA, EXPIRADA, CANCELADA
    LocalDate dataInicio;
    LocalDate dataExpiracao;
    Usuario confirmadoPor;      // Admin que confirmou
    LocalDateTime confirmadoEm;
}
```

### Enumerações

```java
enum Role { ADMIN, MOTORISTA }

enum StatusUsuario { 
    TRIAL_ATIVO,      // Período gratuito ativo (7 dias)
    TRIAL_EXPIRADO,   // Trial acabou, precisa assinar
    ATIVO,            // Assinatura ativa
    BLOQUEADO         // Bloqueado pelo admin
}

enum TipoCombustivel { 
    GASOLINA, ETANOL, DIESEL, GNV, ELETRICO 
}

enum CategoriaDespesa { 
    MANUTENCAO, ALIMENTACAO, LIMPEZA, SEGURO, OUTROS 
}

enum StatusAssinatura { 
    AGUARDANDO_PAGAMENTO, ATIVA, EXPIRADA, CANCELADA 
}
```

---

## 6. Pacote Controller (Endpoints) {#controller}

### AuthController (`/auth`)
| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/auth/cadastro` | Cadastrar novo usuário | Pública |
| POST | `/auth/login` | Login e gerar JWT | Pública |
| GET | `/auth/trial-info` | Informações do trial | Autenticada |

### VeiculoController (`/veiculos`)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/veiculos` | Listar veículos do usuário |
| POST | `/veiculos` | Criar veículo |
| PUT | `/veiculos/{id}` | Atualizar veículo |
| DELETE | `/veiculos/{id}` | Inativar veículo |

### RegistroDiaController (`/registros`)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/registros` | Listar registros |
| POST | `/registros` | Criar/atualizar registro do dia |
| DELETE | `/registros/{id}` | Excluir registro |

### DespesaController (`/despesas`)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/despesas` | Listar despesas |
| POST | `/despesas` | Criar despesa |
| PUT | `/despesas/{id}` | Atualizar despesa |
| DELETE | `/despesas/{id}` | Excluir despesa |

### DashboardController (`/dashboard`)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/dashboard` | Resumo financeiro (ganhos, gastos, lucro) |
| GET | `/dashboard/ultimos-dias` | Últimos 7 dias para gráfico |

### MetaController (`/metas`)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/metas` | Buscar meta do usuário |
| POST | `/metas` | Criar/atualizar meta |
| GET | `/metas/progresso` | Progresso das metas |

### FinanceiroController (`/financeiro`)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/financeiro/custos-fixos` | Listar custos fixos |
| POST | `/financeiro/custos-fixos` | Criar custo fixo |
| DELETE | `/financeiro/custos-fixos/{id}` | Excluir custo fixo |
| GET | `/financeiro/ponto-equilibrio` | Calcular ponto de equilíbrio |

### AdminController (`/admin`)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/admin/dashboard` | Dashboard admin |
| GET | `/admin/usuarios` | Listar todos os usuários |
| POST | `/admin/usuarios` | Criar usuário |
| PUT | `/admin/usuarios/{id}` | Editar usuário |
| PUT | `/admin/usuarios/{id}/inativar` | Bloquear usuário |
| PUT | `/admin/usuarios/{id}/reativar` | Reativar usuário |
| POST | `/admin/confirmar-pagamento` | Confirmar pagamento |
| PUT | `/admin/usuarios/{id}/plano/{planoId}` | Alterar plano |

---

## 7. Pacote Service (Lógica de Negócio) {#service}

### AuthService
- `cadastrar()`: Cria usuário com trial de 7 dias
- `login()`: Valida credenciais e retorna JWT

### RegistroDiaService
- `criarOuAtualizar()`: 
  1. Busca veículo e preço vigente
  2. Calcula gasto: `(kmRodado / autonomia) × precoCombustivel`
  3. Calcula lucro: `ganhoBruto - gastoCombustivel`
  4. Salva registro com ganhos por plataforma

### DashboardService
- `getDashboard()`: Calcula métricas do dia, semana e mês
- `getUltimosDias()`: Retorna últimos N dias para gráfico

### PlanoAcessoService
- `getPlanoAtual()`: Retorna nome do plano do usuário
- `isPro()`: Verifica se tem acesso Pro/Premium
- `exigirPro()`: Lança exceção se não tiver acesso Pro

### AdminService
- `alterarPlano()`: Cancela assinatura anterior, cria nova
- `confirmarPagamento()`: Cria assinatura ativa

---

## 8. Pacote DTO (Transferência de Dados) {#dto}

### Request DTOs (entrada)
```java
record LoginRequest(String email, String senha) {}
record CadastroRequest(String nome, String email, String senha) {}
record RegistroDiaRequest(Long veiculoId, LocalDate data, BigDecimal kmRodado, 
                          List<GanhoPlataformaRequest> ganhos) {}
record DespesaRequest(CategoriaDespesa categoria, String descricao, 
                      BigDecimal valor, LocalDate data) {}
```

### Response DTOs (saída)
```java
record AuthResponse(String token, String nome, String email, Role role, StatusUsuario status) {}
record DashboardResponse(BigDecimal ganhoBrutoDia, BigDecimal gastoCombustivelDia, ...) {}
record RegistroDiaResponse(Long id, Long veiculoId, String veiculoApelido, ...) {}
```

**Por que usar DTOs?**
1. **Segurança**: Não expõe a entidade diretamente (evita vazar senhaHash)
2. **Flexibilidade**: Pode combinar dados de múltiplas entidades
3. **Versionamento**: Pode mudar a API sem mudar o banco

---

## 9. Pacote Repository (Acesso a Dados) {#repository}

Interfaces que estendem `JpaRepository` para acesso ao banco.

```java
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    boolean existsByEmail(String email);
}

@Repository
public interface RegistroDiaRepository extends JpaRepository<RegistroDia, Long> {
    List<RegistroDia> findByUsuarioIdOrderByDataDesc(Long usuarioId);
    List<RegistroDia> findByUsuarioIdAndDataBetween(Long usuarioId, LocalDate inicio, LocalDate fim);
}
```

**Spring Data JPA** gera automaticamente as implementações a partir das assinaturas dos métodos.

---

## 10. Pacote Config (Configurações) {#config}

### SecurityConfig
Configura:
- **CORS**: Quais origens podem acessar a API
- **CSRF**: Desabilitado (API stateless)
- **Sessão**: Stateless (não usa HttpSession)
- **Rotas públicas**: /auth/**, /health, etc.
- **Filtros**: JwtAuthFilter + AcessoInterceptor
- **PasswordEncoder**: BCrypt para senhas

---

## 11. Pacote Exception (Tratamento de Erros) {#exception}

### GlobalExceptionHandler
Captura exceções e retorna JSON padronizado:

```java
@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntime(RuntimeException ex) {
        return ResponseEntity.badRequest()
            .body(new ErrorResponse(400, ex.getMessage()));
    }
}
```

---

## 12. Fluxo de Autenticação {#fluxo-auth}

### Cadastro
```
1. POST /auth/cadastro {nome, email, senha}
2. AuthService.cadastrar()
   → Verificar se email já existe
   → Criptografar senha com BCrypt
   → Criar usuário com status TRIAL_ATIVO
   → Definir dataInicioTrial = hoje
   → Definir dataFimTrial = hoje + 7 dias
   → Gerar JWT
3. Retornar AuthResponse {token, nome, email, role, status}
```

### Login
```
1. POST /auth/login {email, senha}
2. AuthService.login()
   → Buscar usuário por email
   → Verificar senha com BCrypt.matches()
   → Gerar JWT
3. Retornar AuthResponse {token, nome, email, role, status}
```

### Requisição Autenticada
```
1. GET /dashboard
   Header: Authorization: Bearer eyJhbG...
2. JwtAuthFilter.doFilterInternal()
   → Extrair token do header
   → Extrair email do token
   → Carregar UserDetails do banco
   → Validar token (assinatura + expiração)
   → Criar Authentication no SecurityContext
3. AcessoInterceptor.doFilterInternal()
   → Verificar status do usuário
   → Se TRIAL_EXPIRADO ou BLOQUEADO → 403
   → Se ATIVO ou TRIAL_ATIVO → continuar
4. Controller.executar()
   → @AuthenticationPrincipal User user
   → Extrair usuarioId do banco
   → Executar lógica
```

---

## 13. Fluxo de Autorização por Plano {#fluxo-plano}

### Verificação de Acesso
```java
// Em qualquer service que precisa verificar o plano:
@Service
public class SomeService {
    private final PlanoAcessoService planoAcessoService;
    
    public void funcionalidadePro(Long usuarioId) {
        planoAcessoService.exigirPro(usuarioId); // Lança exceção se não for Pro
        // ... lógica
    }
}
```

### PlanoAcessoService
```java
public String getPlanoAtual(Long usuarioId) {
    // Se TRIAL → retorna "BASICO"
    // Se ATIVO → busca assinatura ativa mais recente
    // Se não tem assinatura → retorna "BASICO"
}

public boolean isPro(Long usuarioId) {
    String plano = getPlanoAtual(usuarioId);
    return plano.contains("PRO") || plano.contains("PREMIUM");
}
```

### Hierarquia de Planos
```
Básico (Trial) → Acesso básico
Pro            → Acesso Pro + básico
Premium        → Acesso Premium + Pro + básico
```

---

## 14. Mobile (Capacitor) {#mobile}

### Estrutura
```
mobile/
├── src/
│   ├── api/api.ts              # Configuração do CapacitorHttp
│   ├── components/ui.tsx       # Componentes UI reutilizáveis
│   ├── contexts/AuthContext.tsx # Contexto de autenticação
│   ├── screens/                # Telas do app
│   ├── services/               # Serviços para API
│   ├── types/                  # Tipos TypeScript
│   └── navigation/             # Rotas e navegação
├── android/                    # Projeto Android nativo
├── capacitor.config.ts         # Configuração do Capacitor
└── package.json
```

### Configuração HTTP (CapacitorHttp)
```typescript
// api.ts - Usa CapacitorHttp em vez de axios
import { CapacitorHttp } from '@capacitor/core'

const API_URL = 'http://10.0.0.230:8080'

async function request<T>(method, path, data?) {
    const token = localStorage.getItem('token')
    const headers = { 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`
    
    const response = await CapacitorHttp[method]({
        url: `${API_URL}${path}`,
        headers,
        data
    })
    
    return { data: response.data as T }
}
```

### Por que CapacitorHttp em vez de Axios?
O WebView do Android tem restrições de CORS que impedem o Axios de funcionar. O `CapacitorHttp` faz as requisições nativamente, bypassando o WebView.

---

## Glossário

| Termo | Significado |
|-------|-------------|
| JWT | JSON Web Token - token de autenticação stateless |
| BCrypt | Algoritmo de hash para senhas |
| CORS | Cross-Origin Resource Sharing - controle de acesso entre origens |
| CSRF | Cross-Site Request Forgery - ataque que falsifica requisições |
| DTO | Data Transfer Object - objeto para transferência de dados |
| JPA | Java Persistence API - ORM para banco de dados |
| Stateless | Sem estado - servidor não guarda sessão do cliente |
| Interceptor | Filtro que intercepta requisições antes do controller |
