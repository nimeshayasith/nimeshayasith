variable "app_name" {
  description = "Name of the Amplify app."
  type        = string
}

variable "repository_url" {
  description = "HTTPS URL of the GitHub repository, e.g. https://github.com/nimeshayasith/nimeshayasith"
  type        = string
}

variable "branch_name" {
  description = "Git branch that Amplify deploys to production."
  type        = string
  default     = "main"
}

variable "app_root" {
  description = "Folder inside the repository that contains the web app (monorepo layout)."
  type        = string
  default     = "frontend"
}

variable "github_access_token" {
  description = "GitHub personal access token used to connect the repository. Leave null if the app was already connected in the console."
  type        = string
  default     = null
  sensitive   = true
}

variable "backend_origin" {
  description = "Origin of the backend that /api/* is proxied to (no trailing slash). Empty string disables the proxy rule."
  type        = string
  default     = ""
}

variable "enable_youtube_proxy" {
  description = "Add the /yt/* rewrite to youtube.com (lets the site read the public channel feed)."
  type        = bool
  default     = true
}

variable "refresh_schedule" {
  description = "EventBridge Scheduler expression that rebuilds the site so new articles/videos are picked up, e.g. \"cron(0 3 * * ? *)\" (daily 03:00 UTC). Empty string disables it."
  type        = string
  default     = ""
}

variable "build_spec" {
  description = "Override the default monorepo build spec. Null uses the module default."
  type        = string
  default     = null
}

variable "enable_security_headers" {
  description = "Attach HSTS / nosniff / frame / referrer headers and long-lived caching for /assets."
  type        = bool
  default     = false
}

variable "environment_variables" {
  description = "Extra build-time environment variables (e.g. VITE_* values)."
  type        = map(string)
  default     = {}
}

variable "domain_name" {
  description = "Optional custom domain (e.g. example.com). Empty string skips the domain association."
  type        = string
  default     = ""
}

variable "tags" {
  description = "Tags applied to every resource."
  type        = map(string)
  default     = {}
}
