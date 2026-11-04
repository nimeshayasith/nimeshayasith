output "site_url" {
  description = "Live URL of the portfolio."
  value       = module.amplify_hosting.site_url
}

output "amplify_app_id" {
  description = "Amplify app ID (needed for `terraform import` and the CLI)."
  value       = module.amplify_hosting.app_id
}

output "amplify_console_url" {
  description = "Open the app in the Amplify console."
  value       = "https://${var.aws_region}.console.aws.amazon.com/amplify/apps/${module.amplify_hosting.app_id}"
}

output "start_first_build" {
  description = "Run this once if you do not want to wait for the next git push."
  value       = "aws amplify start-job --app-id ${module.amplify_hosting.app_id} --branch-name ${module.amplify_hosting.branch_name} --job-type RELEASE --region ${var.aws_region}"
}

output "custom_domain_dns" {
  description = "DNS records to add at your registrar (only when domain_name is set)."
  value       = module.amplify_hosting.custom_domain_verification
}
