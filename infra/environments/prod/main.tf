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

module "compute" {
  source = "../../modules/compute"

  projeto = var.projeto
  # Repare: aqui usamos "module.network.XXX" — é assim que um módulo
  # consome o OUTPUT de outro módulo. É a "cola" que conecta as peças:
  # a EC2 nasce dentro da subnet e do security group que o módulo
  # network já criou.
  subnet_id         = module.network.subnet_publica_id
  security_group_id = module.network.security_group_ec2_id
  chave_publica_ssh = var.chave_publica_ssh
}
