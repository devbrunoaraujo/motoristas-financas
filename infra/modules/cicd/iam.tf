# infra/modules/cicd/iam.tf
#
# Usuário IAM dedicado ao GitHub Actions. Diferente do seu usuário
# pessoal (que tem AdministratorAccess), esse usuário só pode fazer
# EXATAMENTE o que o pipeline de CI precisa: autenticar e enviar
# imagens para os dois repositórios ECR. Nada de VPC, EC2, RDS, etc.

resource "aws_iam_user" "github_actions" {
  name = "${var.projeto}-github-actions"

  tags = {
    Name = "${var.projeto}-github-actions"
  }
}

# "data" para pegar o Account ID atual — usado para montar o ARN dos
# repositórios ECR de forma dinâmica (sem hardcodar o número da conta).
data "aws_caller_identity" "atual" {}

resource "aws_iam_user_policy" "ecr_push" {
  name = "${var.projeto}-ecr-push"
  user = aws_iam_user.github_actions.name

  # Uma policy JSON — cada "Statement" descreve UMA regra: quais
  # ações são permitidas, em quais recursos.
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        # "GetAuthorizationToken" é uma ação especial do ECR que só
        # funciona com Resource = "*" (não dá pra restringir a um
        # repositório específico — é assim que a AWS desenhou essa
        # API). As outras ações abaixo SIM são restritas por repo.
        Sid      = "ECRAuth"
        Effect   = "Allow"
        Action   = ["ecr:GetAuthorizationToken"]
        Resource = "*"
      },
      {
        Sid    = "ECRPush"
        Effect = "Allow"
        Action = [
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:PutImage",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload",
        ]
        Resource = [
          "arn:aws:ecr:${var.aws_region}:${data.aws_caller_identity.atual.account_id}:repository/${var.projeto}-backend",
          "arn:aws:ecr:${var.aws_region}:${data.aws_caller_identity.atual.account_id}:repository/${var.projeto}-frontend",
        ]
      }
    ]
  })
}
