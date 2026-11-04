################################################################################
# Portfolio hosting on AWS
#
#   GitHub (push to main) -> AWS Amplify (build + deploy) -> CloudFront -> visitor
#
# The React app in /frontend is a static site. Amplify builds it on every push,
# serves it through CloudFront and issues the HTTPS certificate. /api/* is
# proxied to the backend on Render so live data (Medium feed, library) works
# without touching the backend's CORS settings.
################################################################################

module "amplify_hosting" {
  source = "./modules/amplify_hosting"

  app_name                = var.app_name
  repository_url          = var.repository_url
  branch_name             = var.branch_name
  app_root                = var.app_root
  github_access_token     = var.github_access_token
  backend_origin          = var.backend_origin
  refresh_schedule        = var.refresh_schedule
  enable_security_headers = var.enable_security_headers
  domain_name             = var.domain_name

  tags = var.tags
}

# Cost guardrail: a competition prize is AWS credits, not a surprise invoice.
resource "aws_budgets_budget" "monthly" {
  count    = var.budget_email == "" ? 0 : 1
  provider = aws.us_east_1

  name         = "${var.app_name}-monthly"
  budget_type  = "COST"
  limit_amount = tostring(var.monthly_budget_usd)
  limit_unit   = "USD"
  time_unit    = "MONTHLY"

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 80
    threshold_type             = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = [var.budget_email]
  }
}
