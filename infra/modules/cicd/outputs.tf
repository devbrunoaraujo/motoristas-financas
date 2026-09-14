# infra/modules/cicd/outputs.tf

output "github_actions_username" {
  value = aws_iam_user.github_actions.name
}

# Propositalmente NÃO criamos um output com Access Key/Secret aqui.
# Gerar credenciais via Terraform faria a Secret Key ficar GRAVADA
# dentro do state (mesmo criptografado no S3, é uma exposição
# desnecessária). Por isso, a chave de acesso desse usuário vai ser
# gerada manualmente no console AWS, só uma vez — veja o próximo
# passo no chat.
