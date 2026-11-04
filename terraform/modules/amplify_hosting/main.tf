################################################################################
# AWS Amplify Hosting for a static single-page app that lives in a monorepo
# subfolder (e.g. /frontend).
#
# Amplify gives us: a managed CI/CD pipeline (build on every push), global
# delivery through CloudFront, a free HTTPS certificate, and atomic deploys.
################################################################################

locals {
  # Build spec for a monorepo: `appRoot` tells Amplify which folder to build.
  default_build_spec = <<-YAML
    version: 1
    applications:
      - appRoot: ${var.app_root}
        frontend:
          phases:
            preBuild:
              commands:
                - npm ci
            build:
              commands:
                - npm run build
          artifacts:
            baseDirectory: dist
            files:
              - '**/*'
          cache:
            paths:
              - node_modules/**/*
  YAML

  # Optional hardening headers (monorepo format). Off by default; see README.
  default_custom_headers = <<-YAML
    applications:
      - appRoot: ${var.app_root}
        customHeaders:
          - pattern: '**'
            headers:
              - key: Strict-Transport-Security
                value: max-age=31536000; includeSubDomains
              - key: X-Content-Type-Options
                value: nosniff
              - key: X-Frame-Options
                value: SAMEORIGIN
              - key: Referrer-Policy
                value: strict-origin-when-cross-origin
          - pattern: '/assets/**'
            headers:
              - key: Cache-Control
                value: public, max-age=31536000, immutable
  YAML

  # Rewrite rules are evaluated top to bottom.
  #  1. /api/*  -> the backend (reverse proxy, so the browser stays same-origin
  #                and the backend's CORS allow-list is irrelevant)
  #  2. /yt/*   -> YouTube (public channel feed)
  #  3. any extensionless path -> /index.html (client-side routing for
  #                /projects, /about, /projects/<id> ... so deep links work)
  proxy_rules = var.backend_origin == "" ? [] : [
    {
      source = "/api/<*>"
      target = "${var.backend_origin}/api/<*>"
      status = "200"
    }
  ]

  # /yt/* -> youtube.com, so the browser can read my channel's public Atom feed without CORS.
  youtube_rules = var.enable_youtube_proxy ? [
    {
      source = "/yt/<*>"
      target = "https://www.youtube.com/<*>"
      status = "200"
    }
  ] : []

  spa_rules = [
    {
      source = "</^[^.]+$|\\.(?!(css|gif|ico|jpg|jpeg|js|png|txt|svg|woff|woff2|ttf|map|json|webp|mp4|pdf|mjs|webmanifest)$)([^.]+$)/>"
      target = "/index.html"
      status = "200"
    }
  ]

  custom_rules = concat(local.proxy_rules, local.youtube_rules, local.spa_rules)
}

resource "aws_amplify_app" "this" {
  name       = var.app_name
  repository = var.repository_url
  platform   = "WEB"

  # A GitHub personal access token lets Terraform connect the repo and register
  # the webhook. Optional: leave null when importing an app you already
  # connected in the console through the AWS Amplify GitHub App.
  access_token = var.github_access_token

  build_spec     = coalesce(var.build_spec, local.default_build_spec)
  custom_headers = var.enable_security_headers ? local.default_custom_headers : null

  enable_branch_auto_build    = true
  enable_auto_branch_creation = false

  environment_variables = merge(
    {
      AMPLIFY_MONOREPO_APP_ROOT = var.app_root
      AMPLIFY_DIFF_DEPLOY       = "false"
    },
    var.environment_variables,
  )

  dynamic "custom_rule" {
    for_each = local.custom_rules
    content {
      source = custom_rule.value.source
      target = custom_rule.value.target
      status = custom_rule.value.status
    }
  }

  tags = var.tags

  # The token is only needed to create the connection; don't churn on it.
  lifecycle {
    ignore_changes = [access_token]
  }
}

resource "aws_amplify_branch" "main" {
  app_id      = aws_amplify_app.this.id
  branch_name = var.branch_name
  stage       = "PRODUCTION"
  framework   = "React"

  enable_auto_build = true # every `git push` to this branch deploys

  tags = var.tags
}

# Optional custom domain. Amplify provisions the ACM certificate and the
# CloudFront distribution; you add the DNS records it prints.
resource "aws_amplify_domain_association" "this" {
  count = var.domain_name == "" ? 0 : 1

  app_id      = aws_amplify_app.this.id
  domain_name = var.domain_name

  sub_domain {
    branch_name = aws_amplify_branch.main.branch_name
    prefix      = ""
  }

  sub_domain {
    branch_name = aws_amplify_branch.main.branch_name
    prefix      = "www"
  }
}
