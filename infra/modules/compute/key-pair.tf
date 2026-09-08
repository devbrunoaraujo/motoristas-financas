# infra/modules/compute/key-pair.tf
#
# Isso NÃO gera uma chave nova — só registra na AWS a chave PÚBLICA
# que você já gerou localmente (ssh-keygen). A AWS guarda essa chave
# pública e a "grava" dentro da instância EC2 no momento da criação;
# só quem tiver a privada correspondente consegue conectar via SSH.

resource "aws_key_pair" "ec2" {
  key_name   = "${var.projeto}-ec2-key"
  public_key = var.chave_publica_ssh
}
