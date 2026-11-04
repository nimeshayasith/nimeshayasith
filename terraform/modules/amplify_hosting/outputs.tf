output "app_id" {
  description = "Amplify app ID."
  value       = aws_amplify_app.this.id
}

output "default_domain" {
  description = "Amplify default domain (without the branch prefix)."
  value       = aws_amplify_app.this.default_domain
}

output "app_arn" {
  description = "Amplify app ARN."
  value       = aws_amplify_app.this.arn
}

output "refresh_schedule_arn" {
  description = "ARN of the scheduled rebuild (empty when disabled)."
  value       = try(aws_scheduler_schedule.refresh[0].arn, "")
}

output "branch_name" {
  description = "Deployed branch."
  value       = aws_amplify_branch.main.branch_name
}

output "site_url" {
  description = "Live URL of the production branch."
  value       = "https://${aws_amplify_branch.main.branch_name}.${aws_amplify_app.this.default_domain}"
}

output "custom_domain_verification" {
  description = "DNS records to create for the custom domain (empty when none is configured)."
  value       = try(aws_amplify_domain_association.this[0].certificate_verification_dns_record, "")
}
