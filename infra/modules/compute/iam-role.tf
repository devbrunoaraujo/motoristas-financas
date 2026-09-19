# infra/modules/compute/iam-role.tf
#
# Diferente do usuário kmup-github-actions (que precisa de Access
# Keys porque o GitHub Actions roda FORA da AWS), a EC2 roda DENTRO
# da AWS — então ela pode receber uma "Role" (papel) anexada
# diretamente, sem nenhuma chave fixa. É o método mais seguro que
# existe: a AWS gerencia credenciais temporárias automaticamente por
# trás dos panos, renovadas sozinhas, nunca gravadas em disco.

# "assume_role_policy" define QUEM pode "vestir" essa role — aqui,
# especificamente o serviço EC2 (não qualquer usuário ou aplicação).
resource "aws_iam_role" "ec2_ecr_pull" {
  name = "${var.projeto}-ec2-ecr-pull"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
      Action = "sts:AssumeRole"
    }]
  })

  tags = {
    Name = "${var.projeto}-ec2-ecr-pull"
  }
}

# A permissão em si: só PUXAR (pull) imagens do ECR — nada de push,
# delete, ou qualquer outra coisa. A instância só precisa consumir
# imagens, nunca publicar.
resource "aws_iam_role_policy" "ecr_pull" {
  name = "${var.projeto}-ecr-pull"
  role = aws_iam_role.ec2_ecr_pull.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid      = "ECRAuth"
        Effect   = "Allow"
        Action   = ["ecr:GetAuthorizationToken"]
        Resource = "*"
      },
      {
        Sid    = "ECRPull"
        Effect = "Allow"
        Action = [
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
        ]
        Resource = "*" # simplificado aqui; poderia restringir aos 2 ARNs específicos, igual fizemos no módulo cicd
      }
    ]
  })
}

# "Instance Profile" é a "ponte" entre uma IAM Role e uma instância
# EC2 — tecnicamente, uma EC2 nunca recebe uma Role diretamente, ela
# recebe um Instance Profile que "carrega" a Role dentro.
resource "aws_iam_instance_profile" "ec2_ecr_pull" {
  name = "${var.projeto}-ec2-ecr-pull"
  role = aws_iam_role.ec2_ecr_pull.name
}
