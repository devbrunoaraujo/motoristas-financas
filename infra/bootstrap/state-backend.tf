# infra/bootstrap/state-backend.tf
#
# Cria os dois recursos que vão guardar o estado (state) de todo o
# resto da infraestrutura do projeto: um bucket S3 (armazena o
# arquivo de estado em si) e uma tabela DynamoDB (trava o estado
# durante um "apply", evitando que duas execuções simultâneas
# corrompam o arquivo).

# "random_id" gera um sufixo aleatório para o nome do bucket.
# Por quê? Nomes de bucket S3 são ÚNICOS EM TODO O MUNDO (não só na
# sua conta) — se eu usar "kmup-terraform-state" alguém em outro
# canto do planeta pode já ter esse nome. O sufixo aleatório evita
# esse conflito.
resource "random_id" "sufixo_bucket" {
  byte_length = 4
}

resource "aws_s3_bucket" "terraform_state" {
  bucket = "kmup-terraform-state-${random_id.sufixo_bucket.hex}"

  # Trava de segurança do próprio Terraform: impede um "terraform
  # destroy" acidental de apagar esse bucket específico (ele guarda
  # o estado de tudo — apagá-lo por engano seria catastrófico).
  lifecycle {
    prevent_destroy = true
  }
}

# Versionamento: cada mudança no arquivo de estado gera uma nova
# "versão" dentro do bucket, em vez de sobrescrever. Se algo corromper
# o state (acontece), dá pra voltar pra uma versão anterior.
resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id
  versioning_configuration {
    status = "Enabled"
  }
}

# Criptografia em repouso: o conteúdo do state pode incluir dados
# sensíveis (ex: endpoints de banco, IDs de recursos) — nunca custa
# criptografar por padrão.
resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Bloqueia QUALQUER acesso público a esse bucket. Nunca deveria ser
# público, mas a AWS permite buckets públicos por padrão em contas
# antigas — isso aqui garante que essa porta nem existe.
resource "aws_s3_bucket_public_access_block" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Tabela DynamoDB usada exclusivamente para "lock" do state.
# Quando você roda "terraform apply", ele grava uma linha nessa
# tabela dizendo "estou mexendo no state agora" — se você (ou um
# colega, ou um pipeline de CI) tentar rodar outro "apply" ao mesmo
# tempo, o Terraform vê o lock e recusa, evitando dois processos
# escrevendo no mesmo arquivo de estado simultaneamente.
resource "aws_dynamodb_table" "terraform_lock" {
  name         = "kmup-terraform-lock"
  billing_mode = "PAY_PER_REQUEST" # sem custo fixo — cobra só pelo uso, e o uso aqui é mínimo
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S" # S = String
  }
}
