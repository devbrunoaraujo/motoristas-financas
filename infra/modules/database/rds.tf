# infra/modules/database/rds.tf

# O RDS precisa saber EM QUAIS subnets ele pode ser colocado. Como
# exige pelo menos 2 AZs diferentes, agrupamos as duas subnets
# privadas que o módulo network já criou nesse "DB Subnet Group".
resource "aws_db_subnet_group" "principal" {
  name       = "${var.projeto}-db-subnet-group"
  subnet_ids = var.subnet_ids

  tags = {
    Name = "${var.projeto}-db-subnet-group"
  }
}

resource "aws_db_instance" "mysql" {
  identifier     = "${var.projeto}-mysql"
  engine         = "mysql"
  engine_version = "8.0"
  instance_class = var.instance_class

  # Armazenamento: 20GB é o limite do Free Tier, e "gp2" (não "gp3")
  # é o tipo específico coberto por ele — usar gp3 aqui sairia do
  # Free Tier mesmo dentro do limite de 20GB.
  allocated_storage = 20
  storage_type       = "gp2"

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password

  db_subnet_group_name   = aws_db_subnet_group.principal.name
  vpc_security_group_ids = [var.security_group_id]

  # NUNCA público — o único caminho até esse banco é através da EC2,
  # via o Security Group que já restringe a origem da conexão.
  publicly_accessible = false

  # Multi-AZ (réplica automática em outra zona) custa o DOBRO e não
  # está no Free Tier — deixamos desligado por enquanto. É algo pra
  # ligar quando o projeto for pra produção de verdade com usuários
  # reais, não durante o aprendizado.
  multi_az = false

  # Backups automáticos — contas novas dentro do Free Tier têm uma
  # restrição adicional (além do limite de 20GB): retenção máxima de
  # 1 dia. Contas mais antigas / fora do Free Tier aceitam até 35
  # dias. Se sua conta permitir mais, pode aumentar esse valor depois.
  backup_retention_period = 1
  backup_window           = "03:00-04:00"

  # ATENÇÃO — isto é uma escolha DELIBERADA para fins de aprendizado:
  # skip_final_snapshot = true faz o "terraform destroy" apagar o
  # banco sem criar um snapshot final. Em um projeto real com dados
  # de usuários de verdade, isso NUNCA deveria ser true — você
  # sempre quer um snapshot de segurança antes de destruir um banco
  # de produção. Vamos revisitar isso quando o projeto crescer.
  skip_final_snapshot = true

  # Impede "terraform destroy" acidental (precisa desabilitar essa
  # proteção manualmente antes de conseguir destruir) — uma segunda
  # camada de segurança, independente do ponto acima.
  deletion_protection = false # true seria o ideal em produção real; false aqui para facilitar o aprendizado

  tags = {
    Name = "${var.projeto}-mysql"
  }
}
