# infra/modules/database/variables.tf

variable "projeto" {
  type = string
}

variable "subnet_ids" {
  description = "IDs das subnets privadas (mínimo 2, em AZs diferentes) para o DB Subnet Group"
  type        = list(string)
}

variable "security_group_id" {
  description = "Security Group do RDS (já restringe acesso só à EC2)"
  type        = string
}

variable "db_name" {
  description = "Nome do banco de dados inicial"
  type        = string
  default     = "financas_db"
}

variable "db_username" {
  description = "Usuário administrador do banco"
  type        = string
  default     = "admin"
}

variable "db_password" {
  description = "Senha do banco — SEM default de propósito, vem do terraform.tfvars"
  type        = string
  sensitive   = true # impede o Terraform de imprimir esse valor em logs/plan/output por engano
}

variable "instance_class" {
  description = "Classe da instância RDS"
  type        = string
  default     = "db.t3.micro" # confirme com describe-orderable-db-instance-options se elegível
}
