# infra/environments/prod/provider.tf

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Projeto       = "kmup"
      GerenciadoPor = "terraform"
      Ambiente      = "prod"
    }
  }
}
