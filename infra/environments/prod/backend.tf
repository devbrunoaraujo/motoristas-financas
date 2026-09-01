# infra/environments/prod/backend.tf
#
# Aqui é onde este Terraform (o de infraestrutura REAL) aponta pro
# bucket S3 que criamos no bootstrap, dizendo "guarde seu state aqui,
# não localmente".

terraform {
  backend "s3" {
    # O nome exato do bucket que apareceu no output do bootstrap.
    # Precisa ser digitado à mão aqui — blocos "backend" no Terraform
    # não podem referenciar variáveis ou outputs de outro projeto,
    # por isso o bootstrap é sempre um projeto separado.
    bucket = "kmup-terraform-state-8249dc5e"

    # "key" é o CAMINHO do arquivo de state DENTRO do bucket — como o
    # bucket pode guardar states de vários ambientes/projetos no
    # futuro (staging, homolog, etc.), organizamos por pasta lógica.
    key = "prod/terraform.tfstate"

    region = "us-east-1"

    # Nome da tabela DynamoDB para o lock, também do output do
    # bootstrap.
    dynamodb_table = "kmup-terraform-lock"

    encrypt = true
  }
}
