# Terraform: portfolio hosting on AWS

Provisions the AWS side of the portfolio: an **AWS Amplify Hosting** app wired to this GitHub repo,
the production branch, SPA + `/api` rewrite rules, and (optionally) a custom domain and a cost alert.

```
terraform/
├── versions.tf            # Terraform + AWS provider constraints
├── providers.tf           # default tags, plus us-east-1 alias for AWS Budgets
├── variables.tf           # every knob, with descriptions
├── main.tf                # calls the module, optional budget alert
├── outputs.tf             # site URL, app id, console URL, "start first build" command
├── terraform.tfvars.example
├── backend.tf.example     # optional S3 remote state
├── import.tf.example      # adopt the Amplify app you already created in the console
└── modules/amplify_hosting/
    ├── main.tf            # aws_amplify_app, aws_amplify_branch, aws_amplify_domain_association
    ├── variables.tf
    ├── outputs.tf
    └── versions.tf
```

## What it creates

| Resource | Why |
|---|---|
| `aws_amplify_app` | The hosting app: repo connection, monorepo **build spec** (`appRoot: frontend`, output `dist`), env vars, rewrite rules |
| `aws_amplify_branch` | `main` as the PRODUCTION branch with auto-build, so `git push` = deploy |
| `aws_scheduler_schedule` + IAM role | Daily rebuild (`refresh_schedule`) through the `amplify:StartJob` universal target, so new articles and videos get bundled. The role may only start builds of this one branch |
| `aws_amplify_domain_association` *(optional)* | Custom domain + free ACM certificate |
| `aws_budgets_budget` *(optional)* | Monthly cost alert at 80% of a threshold |

Amplify manages the CloudFront distribution and the HTTPS certificate behind the scenes.

### Rewrite rules (order matters)

1. `/api/<*>` → `https://portfolio-6gcd.onrender.com/api/<*>` **(200 rewrite = reverse proxy)**.
   The browser only talks to its own origin, so the backend's CORS allow-list is irrelevant.
2. `/yt/<*>` → `https://www.youtube.com/<*>` **(200 rewrite)**, so the browser can read the channel's public Atom feed (it sends no CORS headers).
3. Any extension-less path → `/index.html` **(200)**, which is what makes deep links such as
   `/projects/lankaresilience` work in a single-page app.

## Use it

You already created the app in the console (`d3ag7vu427q7y9`, us-east-1), but its build spec is the
console default (`baseDirectory: /`, empty build command). That publishes the repo root, which has no
`index.html`, hence the empty page. Importing it lets Terraform fix it in place, keeping the same URL.

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
cp import.tf.example import.tf          # adopt the existing app + branch
terraform init
terraform plan                           # review: 2 imports, 2 in-place updates, nothing destroyed
terraform apply
# trigger the first build now instead of waiting for a push:
terraform output -raw start_first_build | bash
```

New app instead? Skip the `import.tf` step and export a GitHub token first
(`export TF_VAR_github_access_token=ghp_…`, scopes: `repo`, `admin:repo_hook`).

## Optional hardening

* `enable_security_headers = true`: HSTS, `nosniff`, frame and referrer headers, immutable caching for `/assets`.
* `backend.tf.example`: move state to S3 with locking.
* `budget_email = "you@example.com"`: monthly cost alert.

## CI

`.github/workflows/ci.yml` runs `terraform fmt -check`, `init -backend=false` and `validate` on every PR.
