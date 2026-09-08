# infra/modules/compute/ec2.tf
#
# "data" (diferente de "resource") NÃO cria nada — só CONSULTA algo
# que já existe. Aqui, perguntamos à AWS: "qual é a imagem (AMI) mais
# recente do Ubuntu 22.04 disponível?" — em vez de fixar um ID de AMI
# manualmente (que fica desatualizado e pode até deixar de existir).
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical (dona oficial do Ubuntu) — sempre esse ID fixo

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

resource "aws_instance" "app" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type
  subnet_id     = var.subnet_id
  key_name      = aws_key_pair.ec2.key_name

  vpc_security_group_ids = [var.security_group_id]

  # "user_data" é um script que roda AUTOMATICAMENTE na primeira vez
  # que a instância liga — sem precisar você entrar via SSH pra
  # instalar nada manualmente. Aqui instalamos o Docker.
  user_data = <<-EOF
    #!/bin/bash
    set -e
    apt-get update -y
    apt-get install -y ca-certificates curl gnupg

    # Adiciona o repositório oficial do Docker (o pacote "docker.io"
    # do Ubuntu costuma vir desatualizado; o repositório oficial
    # garante a versão mais recente com o plugin "docker compose").
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
    chmod a+r /etc/apt/keyrings/docker.asc
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

    apt-get update -y
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

    # Permite rodar "docker" sem precisar de "sudo" toda vez,
    # usando o usuário padrão "ubuntu" da AMI.
    usermod -aG docker ubuntu
  EOF

  # Tamanho do disco. 20GB cabe dentro do Free Tier (limite de 30GB
  # de armazenamento EBS por mês).
  root_block_device {
    volume_size = 20
    volume_type = "gp3"
  }

  tags = {
    Name = "${var.projeto}-ec2-app"
  }
}
