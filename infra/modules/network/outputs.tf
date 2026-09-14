# infra/modules/network/outputs.tf
#
# Outputs de um MÓDULO funcionam diferente dos outputs que vimos no
# bootstrap: ali eles só apareciam no terminal. Aqui, eles servem
# para que OUTROS módulos (compute, database) consigam "enxergar"
# esses valores quando o módulo network for referenciado no main.tf
# do ambiente prod. É assim que módulos se comunicam entre si no
# Terraform.

output "vpc_id" {
  description = "ID da VPC criada"
  value       = aws_vpc.principal.id
}

output "subnet_publica_id" {
  description = "ID da subnet pública (onde a EC2 vai morar)"
  value       = aws_subnet.publica.id
}

output "subnets_privadas_ids" {
  description = "IDs das subnets privadas (usadas pelo DB Subnet Group do RDS)"
  value       = [aws_subnet.privada_a.id, aws_subnet.privada_b.id]
}

output "security_group_ec2_id" {
  description = "ID do Security Group da EC2"
  value       = aws_security_group.ec2.id
}

output "security_group_rds_id" {
  description = "ID do Security Group do RDS"
  value       = aws_security_group.rds.id
}
