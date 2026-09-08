# infra/modules/database/outputs.tf

output "endpoint" {
  description = "Endereço de conexão do RDS (host:porta)"
  value       = aws_db_instance.mysql.endpoint
}

output "db_name" {
  value = aws_db_instance.mysql.db_name
}
