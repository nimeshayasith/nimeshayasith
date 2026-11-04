################################################################################
# Scheduled rebuild: new articles and videos appear without a git push.
#
# The build runs scripts/fetch-feeds.mjs, which bundles the latest Medium, dev.to,
# AWS Builder Center and YouTube content. EventBridge Scheduler starts that build
# through the Amplify API directly (a "universal target"), so there is no Lambda,
# no webhook URL and no secret to leak.
################################################################################

data "aws_caller_identity" "current" {}

resource "aws_iam_role" "refresh" {
  count = var.refresh_schedule == "" ? 0 : 1

  name = "${replace(var.app_name, "/[^a-zA-Z0-9+=,.@_-]/", "-")}-feed-refresh"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "scheduler.amazonaws.com" }
      Action    = "sts:AssumeRole"
      Condition = { StringEquals = { "aws:SourceAccount" = data.aws_caller_identity.current.account_id } }
    }]
  })

  tags = var.tags
}

# Least privilege: start a build of this one branch, nothing else.
resource "aws_iam_role_policy" "refresh" {
  count = var.refresh_schedule == "" ? 0 : 1

  name = "start-amplify-build"
  role = aws_iam_role.refresh[0].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = "amplify:StartJob"
      Resource = "${aws_amplify_app.this.arn}/branches/${aws_amplify_branch.main.branch_name}/jobs/*"
    }]
  })
}

resource "aws_scheduler_schedule" "refresh" {
  count = var.refresh_schedule == "" ? 0 : 1

  name                = "${replace(var.app_name, "/[^a-zA-Z0-9_.-]/", "-")}-refresh-feeds"
  description         = "Rebuild the portfolio so new articles and videos are bundled."
  schedule_expression = var.refresh_schedule

  flexible_time_window {
    mode = "OFF"
  }

  target {
    arn      = "arn:aws:scheduler:::aws-sdk:amplify:startJob"
    role_arn = aws_iam_role.refresh[0].arn

    input = jsonencode({
      AppId      = aws_amplify_app.this.id
      BranchName = aws_amplify_branch.main.branch_name
      JobType    = "RELEASE"
    })
  }
}
