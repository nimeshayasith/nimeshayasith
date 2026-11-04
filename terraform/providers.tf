provider "aws" {
  region = var.aws_region

  default_tags {
    tags = merge(
      {
        Project   = var.app_name
        ManagedBy = "Terraform"
        Owner     = "nimeshayasith"
      },
      var.tags,
    )
  }
}

# AWS Budgets is a global service served from us-east-1.
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}
