# infra/modules/compute/eip.tf
#
# Até agora a EC2 usava o IP público "dinâmico" padrão da AWS — que
# pode mudar a cada apply que mexa na instância, ou a cada
# stop/start. Isso já quebrou o frontend duas vezes (ele guarda o IP
# do backend gravado dentro da própria imagem, no build).
#
# Um Elastic IP é um endereço público FIXO, que fica reservado pra
# sua conta até você soltar (release) ele de propósito. A gente
# "amarra" ele nesta instância — daqui pra frente, mexer na EC2 não
# muda mais o IP público.

resource "aws_eip" "app" {
  instance = aws_instance.app.id
  domain   = "vpc"

  tags = {
    Name = "${var.projeto}-eip"
  }

  # Garante que o EIP só seja criado depois que a instância já
  # existir — evita corrida de criação.
  depends_on = [aws_instance.app]
}
