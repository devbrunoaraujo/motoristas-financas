# infra/modules/network/variables.tf

variable "projeto" {
  description = "Nome do projeto, usado como prefixo em nomes de recursos"
  type        = string
}

variable "aws_region" {
  description = "Região AWS (usada para montar o nome da availability zone)"
  type        = string
}
