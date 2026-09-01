# infra/environments/prod/main.tf
#
# Este arquivo "monta" a infraestrutura, conectando os módulos.
# Por enquanto só temos o módulo network — compute e database vêm
# nos próximos passos.

module "network" {
  # "source" aponta pro caminho relativo do módulo dentro do
  # repositório. O Terraform vai ler todos os arquivos .tf daquela
  # pasta como se fossem um "pacote".
  source = "../../modules/network"

  # Aqui passamos os valores das variáveis que o módulo declarou
  # (variables.tf dele) — é assim que "conversamos" com um módulo.
  projeto    = var.projeto
  aws_region = var.aws_region
}
