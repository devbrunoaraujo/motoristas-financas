# infra/environments/prod/outputs.tf
#
# Outputs de um módulo (ex: module.compute) ficam "escondidos" dentro
# dele por padrão — só aparecem no terminal se o nível acima (aqui, o
# ambiente prod) também declarar um output, repassando o valor. É
# como uma cadeia: módulo → ambiente → você.

output "ec2_ip_publico" {
  description = "IP público da EC2, para SSH e acesso à aplicação"
  value       = module.compute.ip_publico
}

output "ec2_instance_id" {
  value = module.compute.instance_id
}
