# infra/environments/prod/versions.tf
#
# Mesma lógica do bootstrap: trava as versões do Terraform e dos
# providers, pra garantir builds reprodutíveis (mesmo raciocínio do
# package-lock.json, lá na Fase 0).

terraform {
  required_version = ">= 1.7"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}
