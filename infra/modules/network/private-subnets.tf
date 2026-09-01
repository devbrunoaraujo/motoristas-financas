# infra/modules/network/private-subnets.tf
#
# O RDS exige um "DB Subnet Group" com subnets em pelo menos 2 AZs
# diferentes — mesmo rodando uma única instância (é uma exigência de
# disponibilidade da AWS, não uma escolha nossa). Por isso duas
# subnets privadas, cada uma numa AZ diferente.

resource "aws_subnet" "privada_a" {
  vpc_id            = aws_vpc.principal.id
  cidr_block        = "10.0.10.0/24"
  availability_zone = "${var.aws_region}a"

  tags = {
    Name = "${var.projeto}-subnet-privada-a"
  }
}

resource "aws_subnet" "privada_b" {
  vpc_id            = aws_vpc.principal.id
  cidr_block        = "10.0.11.0/24"
  availability_zone = "${var.aws_region}b"

  tags = {
    Name = "${var.projeto}-subnet-privada-b"
  }
}

# Repare: NENHUMA route table customizada aqui, nem associação com
# Internet Gateway. Essas subnets usam a "route table padrão" da VPC,
# que não tem rota pra internet — exatamente o comportamento que
# queremos (isoladas por padrão, sem precisar de configuração extra
# pra bloquear).
