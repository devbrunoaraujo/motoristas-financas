# infra/bootstrap/outputs.tf
#
# "outputs" são valores que o Terraform imprime no final do apply.
# Vamos precisar copiar esses dois valores manualmente para configurar
# o backend remoto da próxima parte da infraestrutura (o ambiente
# "prod" de verdade, que vai usar este bucket para guardar SEU state).

output "bucket_state" {
  description = "Nome do bucket S3 que guarda o Terraform state"
  value       = aws_s3_bucket.terraform_state.bucket
}

output "tabela_lock" {
  description = "Nome da tabela DynamoDB usada para lock do state"
  value       = aws_dynamodb_table.terraform_lock.name
}
