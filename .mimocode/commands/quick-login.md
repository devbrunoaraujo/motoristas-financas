---
description: >
  Faz login rápido na API e retorna o JWT. Use para testar endpoints
  autenticados. Argumento: "motorista" (padrão) ou "admin".
---

# Quick Login

Faça login na API REST e exiba o token JWT.

## Conta: $ARGUMENTS

Se `$ARGUMENTS` for "admin", use credenciais de admin. Caso contrário, use
credenciais de motorista.

### Motorista (padrão):
```powershell
$body = '{"email":"motorista@motoristas.com","senha":"123456"}'
$result = Invoke-RestMethod -Uri "http://localhost:8080/auth/login" -Method POST -ContentType "application/json" -Body $body
Write-Output "Token: $($result.token.Substring(0, [Math]::Min(30, $result.token.Length)))..."
Write-Output "Status: $($result.status)"
Write-Output "Nome: $($result.nome)"
$result
```

### Admin:
```powershell
$body = '{"email":"admin@motoristas.com","senha":"123456"}'
$result = Invoke-RestMethod -Uri "http://localhost:8080/auth/login" -Method POST -ContentType "application/json" -Body $body
Write-Output "Token: $($result.token.Substring(0, [Math]::Min(30, $result.token.Length)))..."
Write-Output "Status: $($result.status)"
Write-Output "Nome: $($result.nome)"
$result
```

## Nota

Se o login falhar com "credenciais inválidas", verifique se o Docker está
rodando: `docker compose ps`. Se os usuários ainda não existem, crie-os via
`POST /auth/cadastro` primeiro.
