# infra/bootstrap/main.tf
#
# Este Terraform é especial: ele MESMO guarda seu estado localmente
# (um arquivo terraform.tfstate na sua máquina, não versionado no Git).
# Rodamos ele uma única vez, para criar a infraestrutura que vai
# guardar o estado de TODO O RESTO do projeto (o bucket S3).
#
# Depois de rodado, praticamente nunca mais mexemos nessa pasta.

terraform {
  required_version = ">= 1.7"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }

  # Sem bloco "backend" aqui de propósito — o estado fica local
  # (infra/bootstrap/terraform.tfstate). É a única exceção no projeto
  # inteiro; todo o resto do Terraform vai usar o bucket S3 que
  # criamos aqui como backend remoto.
}

provider "aws" {
  region = "us-east-1"

  # Não colocamos access_key/secret_key aqui — o Terraform usa
  # automaticamente as credenciais que já configuramos com
  # "aws configure" (guardadas em ~/.aws/credentials no seu Windows).
  # Nunca escreva credenciais direto no código Terraform: além do
  # risco de vazar se for commitado, fica difícil trocar de chave
  # sem editar arquivos versionados.

  default_tags {
    tags = {
      Projeto    = "kmup"
      GerenciadoPor = "terraform"
      Ambiente   = "bootstrap"
    }
  }
}
