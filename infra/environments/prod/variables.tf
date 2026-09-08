# infra/environments/prod/variables.tf
#
# "variables" são os PARÂMETROS de entrada deste Terraform — valores
# que podem mudar sem precisar editar o código dos recursos em si.
# Cada uma tem um "type" (o Terraform valida o valor contra esse tipo)
# e pode ter um "default" (usado se você não informar nada).

variable "aws_region" {
  description = "Região AWS onde os recursos serão criados"
  type        = string
  default     = "us-east-1"
}

variable "projeto" {
  description = "Nome do projeto, usado como prefixo em nomes de recursos"
  type        = string
  default     = "kmup"
}

variable "chave_publica_ssh" {
  description = "Conteúdo da chave pública SSH (arquivo .pub), para acesso à EC2"
  type        = string
  # SEM default de propósito: isso obriga você a fornecer o valor
  # via terraform.tfvars (arquivo local, ignorado pelo Git) ou -var
  # na linha de comando. Nunca escrevemos isso fixo no código.
}
