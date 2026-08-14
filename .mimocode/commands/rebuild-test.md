---
description: >
  Rebuild completo do backend (Docker) + frontend + health check + login de teste.
  Use após implementar uma feature para verificar que tudo funciona.
---

# Rebuild & Test

Execute os seguintes passos em sequência. Se qualquer passo falhar, pare e reporte o erro.

## 1. Compilar backend

```powershell
.\mvnw.cmd clean compile -q 2>&1
```

Workdir: `backend/`

Se falhar, reporte os erros de compilação Java e pare.

## 2. Compilar frontend

```powershell
npm run build 2>&1
```

Workdir: `frontend/`

Se falhar, reporte os erros TypeScript e pare.

## 3. Rebuild Docker

```powershell
docker compose up -d --build backend; docker compose restart frontend
```

Workdir: raiz do projeto

Timeout: 5 minutos.

## 4. Health check

Aguardar 15 segundos, então:

```powershell
Start-Sleep -Seconds 15; Invoke-RestMethod -Uri "http://localhost:8080/health" -Method GET
```

## 5. Login de teste

### Motorista:
```powershell
$body = '{"email":"motorista@motoristas.com","senha":"123456"}'
Invoke-RestMethod -Uri "http://localhost:8080/auth/login" -Method POST -ContentType "application/json" -Body $body
```

### Admin:
```powershell
$body = '{"email":"admin@motoristas.com","senha":"123456"}'
Invoke-RestMethod -Uri "http://localhost:8080/auth/login" -Method POST -ContentType "application/json" -Body $body
```

## Resultado

Reporte:
- ✅ ou ❌ para cada passo
- Se ❌, o erro completo
- Token JWT retornado (primeiros 20 chars + "...")
