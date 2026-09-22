# infra/modules/network/security-groups.tf
#
# Cada Security Group tem regras de INGRESS (tráfego entrando) e
# EGRESS (tráfego saindo). Por padrão, tudo é bloqueado — só liberamos
# exatamente o que precisamos.

resource "aws_security_group" "ec2" {
  name        = "${var.projeto}-sg-ec2"
  description = "Permite SSH, HTTP e a porta da API"
  vpc_id      = aws_vpc.principal.id

  # SSH — pra você conseguir entrar na instância via terminal.
  # ATENÇÃO: 0.0.0.0/0 aqui significa "qualquer IP do mundo pode
  # tentar". Isso é aceitável por enquanto (estamos aprendendo, e o
  # acesso continua exigindo a chave SSH privada) mas na Fase 7
  # (hardening) vamos restringir isso só ao SEU IP.
  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTP — usado só para redirecionar para HTTPS e para o Certbot
  # validar a emissão/renovação do certificado (desafio HTTP-01).
  ingress {
    description = "HTTP (redirect + Certbot)"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTPS — a partir de agora, TUDO (frontend, API, Grafana) passa
  # por aqui, através do Nginx rodando na própria EC2. Por isso as
  # portas 8080 (API) e 3000 (Grafana) não precisam mais estar
  # abertas publicamente — o Nginx fala com elas via localhost.
  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Egress: tráfego SAINDO da EC2. Liberamos tudo (padrão comum) —
  # a instância precisa baixar imagens Docker, atualizações do
  # sistema, falar com o RDS, etc. Restringir egress é uma prática
  # mais avançada que raramente compensa o esforço fora de ambientes
  # de alta segurança.
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1" # -1 = todos os protocolos
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.projeto}-sg-ec2"
  }
}

resource "aws_security_group" "rds" {
  name        = "${var.projeto}-sg-rds"
  description = "Permite MySQL apenas vindo da EC2"
  vpc_id      = aws_vpc.principal.id

  # A regra mais importante de toda a infraestrutura de banco: em vez
  # de liberar um cidr_blocks (um range de IPs), apontamos
  # "security_groups" — ou seja, "só aceita conexão na porta 3306se
  # ela vier de algo que pertence ao Security Group da EC2". Isso é
  # muito mais seguro que liberar por IP: mesmo que a EC2 mude de IP
  # (o que acontece se ela for recriada), a regra continua válida
  # automaticamente.
  ingress {
    description     = "MySQL apenas da EC2"
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.ec2.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.projeto}-sg-rds"
  }
}
