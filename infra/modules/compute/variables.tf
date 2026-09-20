# infra/modules/compute/variables.tf

variable "projeto" {
  type = string
}

variable "subnet_id" {
  description = "Subnet onde a EC2 será lançada (a pública, do módulo network)"
  type        = string
}

variable "security_group_id" {
  description = "Security Group da EC2 (do módulo network)"
  type        = string
}

variable "chave_publica_ssh" {
  description = "Conteúdo da chave pública SSH (o arquivo .pub inteiro, como texto)"
  type        = string
}

variable "instance_type" {
  description = "Tipo da instância EC2"
  type        = string
  default     = "t3.micro" # contas AWS criadas mais recentemente costumam ter
                             # Free Tier no t3.micro em vez do t2.micro antigo —
                             # confirme com "aws ec2 describe-instance-types
                             # --filters Name=free-tier-eligible,Values=true"
}
