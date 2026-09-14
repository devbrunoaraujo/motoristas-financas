# infra/modules/compute/outputs.tf

output "instance_id" {
  value = aws_instance.app.id
}

output "ip_publico" {
  description = "IP público da EC2 — vamos usar pra SSH e pra acessar a aplicação"
  value       = aws_instance.app.public_ip
}
