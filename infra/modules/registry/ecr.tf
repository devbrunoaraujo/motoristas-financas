# infra/modules/registry/ecr.tf

resource "aws_ecr_repository" "backend" {
  name                 = "${var.projeto}-backend"
  image_tag_mutability = "MUTABLE" # permite reutilizar a tag "latest" — comum em projetos pequenos/solo

  image_scanning_configuration {
    scan_on_push = true # a AWS escaneia a imagem em busca de vulnerabilidades conhecidas a cada push
  }

  tags = {
    Name = "${var.projeto}-backend"
  }
}

resource "aws_ecr_repository" "frontend" {
  name                 = "${var.projeto}-frontend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name = "${var.projeto}-frontend"
  }
}

# Lifecycle policy: sem isso, TODA imagem que você já mandou (push)
# fica guardada pra sempre, comendo o limite de 500MB do Free Tier
# rapidinho. Essa regra diz: "guarde só as 5 imagens mais recentes,
# apague o resto automaticamente".
resource "aws_ecr_lifecycle_policy" "backend" {
  repository = aws_ecr_repository.backend.name

  policy = jsonencode({
    rules = [{
      rulePriority = 1
      description  = "Manter só as 5 imagens mais recentes"
      selection = {
        tagStatus   = "any"
        countType   = "imageCountMoreThan"
        countNumber = 5
      }
      action = {
        type = "expire"
      }
    }]
  })
}

resource "aws_ecr_lifecycle_policy" "frontend" {
  repository = aws_ecr_repository.frontend.name

  policy = jsonencode({
    rules = [{
      rulePriority = 1
      description  = "Manter só as 5 imagens mais recentes"
      selection = {
        tagStatus   = "any"
        countType   = "imageCountMoreThan"
        countNumber = 5
      }
      action = {
        type = "expire"
      }
    }]
  })
}
