# Plano: App Mobile com Capacitor (React + Android)

## Contexto

O React Native (Expo) falhou por incompatibilidade Java/CMake/NDK. A solução é **Capacitor**: transforma o app React web em um APK nativo para Android, rodando no Android Studio.

**Vantagens:**
- Reutiliza 100% do código React web (components, services, types)
- Sem problemas de CMake/NDK
- Build nativo simples via Android Studio
- Acesso a APIs nativas (câmera, notificações, etc.) se necessário no futuro

---

## Pré-requisitos

- Node.js 18+ ✅
- Android Studio instalado ✅
- Java 17 instalado ✅
- Backend rodando em Docker ✅

---

## Etapas

### Etapa 1: Criar o projeto React mobile

Criar `mobile/` com React + Vite + TypeScript, reutilizando a mesma estrutura do frontend web.

**Dependências:**
- react, react-dom, react-router-dom
- axios
- recharts (gráficos)
- lucide-react (ícones)
- @capacitor/core, @capacitor/cli
- @capacitor/geolocation (GPS)
- @capacitor/preferences (armazenamento nativo)

**Arquivos base:**
- `mobile/package.json`
- `mobile/vite.config.ts`
- `mobile/tsconfig.json`
- `mobile/index.html`
- `mobile/capacitor.config.ts`

### Etapa 2: Copiar e adaptar a camada de API e tipos

Copiar do frontend web:
- `src/api/api.ts` — Axios com interceptor JWT (adaptar baseURL para IP do PC)
- `src/types/` — todos os tipos TypeScript
- `src/services/` — todos os services
- `src/contexts/AuthContext.tsx`

Adaptações:
- Usar `localStorage` para token (funciona no WebView do Capacitor)
- URL da API: `http://10.0.2.2:8080` (emulador) ou IP do PC (dispositivo real)

### Etapa 3: Implementar telas mobile-first

Criar as telas com design mobile nativo (sem NavBar de desktop, com bottom tabs):

| Tela | Rota | Descrição |
|------|------|-----------|
| Login | `/login` | Formulário de login |
| Cadastro | `/cadastro` | Formulário de cadastro |
| Dashboard | `/` | KPIs + gráfico + metas |
| RegistroDia | `/registros` | CRUD com date picker |
| Veiculos | `/veiculos` | CRUD de veículos |
| Despesas | `/despesas` | CRUD de despesas |
| Combustivel | `/combustivel` | Preços de combustível |
| Metas | `/metas` | Configurar meta mensal |
| Manutencao | `/manutencao` | Histórico + alertas |
| Financeiro | `/financeiro` | Custos fixos + ponto de equilíbrio |

**Navegação:** Bottom tab bar com ícones Lucide (igual ao frontend web).

### Etapa 4: Configurar Capacitor para Android

```bash
cd mobile
npx cap init "Motoristas Finanças" com.motoristasfinancas.app --web-dir dist
npx cap add android
```

Isso cria a pasta `mobile/android/` com o projeto Android nativo.

### Etapa 5: Build e teste

```bash
# 1. Build do React
npm run build

# 2. Sync com Android
npx cap sync android

# 3. Abrir no Android Studio
npx cap open android
```

No Android Studio:
- Clicar ▶ Run para testar no emulador
- Build → Build APK para gerar o APK

---

## Estrutura do projeto

```
mobile/
├── capacitor.config.ts
├── package.json
├── vite.config.ts
├── tsconfig.json
├── index.html
├── android/                    # Gerado pelo Capacitor
├── src/
│   ├── api/
│   │   └── api.ts             # Axios + interceptors
│   ├── contexts/
│   │   └── AuthContext.tsx     # Estado de autenticação
│   ├── services/
│   │   ├── authService.ts
│   │   ├── dashboardService.ts
│   │   ├── registroService.ts
│   │   ├── veiculoService.ts
│   │   ├── combustivelService.ts
│   │   ├── despesaService.ts
│   │   ├── metaService.ts
│   │   ├── financeiroService.ts
│   │   ├── manutencaoService.ts
│   │   ├── plataformaService.ts
│   │   └── notificacaoService.ts
│   ├── types/
│   │   └── index.ts           # Todos os tipos
│   ├── components/
│   │   └── ui.tsx             # Card, Button, Input, etc.
│   ├── screens/
│   │   ├── Login.tsx
│   │   ├── Cadastro.tsx
│   │   ├── Dashboard.tsx
│   │   ├── RegistroDia.tsx
│   │   ├── Veiculos.tsx
│   │   ├── Combustivel.tsx
│   │   ├── Despesas.tsx
│   │   ├── Metas.tsx
│   │   ├── Manutencao.tsx
│   │   └── Financeiro.tsx
│   └── navigation/
│       └── AppNavigator.tsx   # React Router + bottom tabs
```

---

## Uso do GPS (Opcional)

O Capacitor dá acesso nativo ao GPS via `@capacitor/geolocation`:

```typescript
import { Geolocation } from '@capacitor/geolocation'

// Solicitar permissão e obter posição
const position = await Geolocation.getCurrentPosition()
// position.coords.latitude, position.coords.longitude
```

**Uso no app:** Ao iniciar um turno, registrar a posição GPS inicial. Útil para rastrear rotas no futuro.

---

## Verificação

1. `cd mobile && npm install && npm run build`
2. `npx cap sync android`
3. `npx cap open android` — abre no Android Studio
4. Clicar ▶ Run → app abre no emulador
5. Testar login, criar registro, ver dashboard
6. Build → Build APK → gerar APK para instalar no celular
