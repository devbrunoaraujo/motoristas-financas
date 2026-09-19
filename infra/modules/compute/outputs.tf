# infra/modules/compute/outputs.tf

output "instance_id" {
  value = aws_instance.app.id
}

output "ip_publico" {
  description = "IP público FIXO da EC2 (Elastic IP) — não muda mais em applies ou restarts"
  value       = aws_eip.app.public_ip
}
