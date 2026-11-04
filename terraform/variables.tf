variable "aws_region" {
  description = "Region for the Amplify app. If you import an app you already created in the console, use ITS region."
  type        = string
  default     = "us-east-1"
}

variable "app_name" {
  description = "Name of the Amplify app."
  type        = string
  default     = "nimesha-portfolio"
}

variable "repository_url" {
  description = "GitHub repository that holds /frontend and /terraform."
  type        = string
  default     = "https://github.com/nimeshayasith/nimeshayasith"
}

variable "branch_name" {
  description = "Branch to deploy to production."
  type        = string
  default     = "main"
}

variable "app_root" {
  description = "Folder in the repo that contains the React app."
  type        = string
  default     = "frontend"
}

variable "github_access_token" {
  description = "GitHub PAT (repo + admin:repo_hook). Pass it with TF_VAR_github_access_token, never commit it. Null = use an app already connected in the console."
  type        = string
  default     = null
  sensitive   = true
}

variable "backend_origin" {
  description = "Backend that Amplify proxies /api/* to. Empty string disables the proxy."
  type        = string
  default     = "https://portfolio-6gcd.onrender.com"
}

variable "refresh_schedule" {
  description = "When to rebuild the site so new Medium / dev.to / AWS Builder articles and YouTube videos are bundled (EventBridge Scheduler expression). Empty string disables it."
  type        = string
  default     = "cron(0 3 * * ? *)" # every day, 03:00 UTC
}

variable "enable_security_headers" {
  description = "Add HSTS, nosniff, frame and referrer headers plus immutable caching for /assets."
  type        = bool
  default     = false
}

variable "domain_name" {
  description = "Optional custom domain, e.g. nimeshayasith.dev. Empty = use the amplifyapp.com URL."
  type        = string
  default     = ""
}

variable "budget_email" {
  description = "E-mail for monthly cost alerts. Empty string skips the budget."
  type        = string
  default     = ""
}

variable "monthly_budget_usd" {
  description = "Monthly cost threshold for the budget alert."
  type        = number
  default     = 5
}

variable "tags" {
  description = "Extra tags for every resource."
  type        = map(string)
  default     = {}
}
