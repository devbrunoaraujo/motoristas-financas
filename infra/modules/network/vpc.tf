# infra/modules/network/vpc.tf
#
# Este módulo é reutilizável: poderia, no futuro, ser chamado de novo
# para criar um ambiente de staging idêntico, só mudando os valores
# de entrada (variables). Por enquanto, só o ambiente prod vai usá-lo.

# A VPC em si: o "prédio". O cidr_block define o intervalo de IPs
# internos disponíveis (10.0.0.0/16 = 65.536 endereços, muito mais
# do que precisamos, mas é o tamanho convencional de VPC).
resource "aws_vpc" "principal" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "${var.projeto}-vpc"
  }
}

# Internet Gateway: o "portão" que conecta a VPC à internet. Sem ele,
# NENHUMA subnet consegue falar com o mundo externo, nem a pública.
resource "aws_internet_gateway" "principal" {
  vpc_id = aws_vpc.principal.id

  tags = {
    Name = "${var.projeto}-igw"
  }
}

# Subnet pública: um "pedaço" da VPC, com seu próprio intervalo de
# IPs (10.0.1.0/24 = 256 endereços). É aqui que a EC2 vai morar.
resource "aws_subnet" "publica" {
  vpc_id                  = aws_vpc.principal.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true # instâncias criadas aqui recebem IP público automaticamente

  tags = {
    Name = "${var.projeto}-subnet-publica"
  }
}

# Route table: a "tabela de rotas" que diz pra onde o tráfego de rede
# deve ir. Esta rota específica diz: "qualquer destino (0.0.0.0/0,
# ou seja, a internet inteira) passa pelo Internet Gateway".
resource "aws_route_table" "publica" {
  vpc_id = aws_vpc.principal.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.principal.id
  }

  tags = {
    Name = "${var.projeto}-rt-publica"
  }
}

# Associa a subnet pública a essa tabela de rotas. Sem essa
# associação explícita, a subnet usaria a "tabela de rotas padrão"
# da VPC, que não tem rota pra internet — e nada funcionaria.
resource "aws_route_table_association" "publica" {
  subnet_id      = aws_subnet.publica.id
  route_table_id = aws_route_table.publica.id
}
