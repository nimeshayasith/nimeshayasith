# Deploy runbook

Goal: `git push` → live at `https://main.d3ag7vu427q7y9.amplifyapp.com`.

## Why the site was empty

The Amplify app is connected to the repo correctly (authorization is fine), but:

1. the repo only contained `README.md`, so there was nothing to build; and
2. the app's build spec is the console default (`baseDirectory: /`, empty command), which publishes the
   repo **root**. With the app now in `/frontend` and built to `dist/`, Amplify needs the monorepo build spec
   in [`amplify.yml`](../amplify.yml) and `AMPLIFY_MONOREPO_APP_ROOT=frontend`.

## 1. Push the project

```bash
git clone https://github.com/nimeshayasith/nimeshayasith.git portfolio-repo
# copy frontend/, terraform/, docs/, amplify.yml, README.md, .github/ and .gitignore from this folder
# into portfolio-repo/, overwriting README.md (the new one keeps your profile README and adds the AWS section)
cd portfolio-repo
git add . && git commit -m "Portfolio on AWS: frontend, Terraform, Amplify build spec"
git push origin main
```

> `node_modules/` and `dist/` are git-ignored. Never commit `terraform.tfvars` or any token.

## 2. Fix and deploy the Amplify app (pick ONE)

### A. Terraform (recommended: this is the IaC story)

See [`terraform/README.md`](../terraform/README.md): `cp import.tf.example import.tf`, `terraform plan`, `terraform apply`.
The plan imports the existing app and branch and updates the build spec, the `/api` proxy and SPA rewrites,
and the monorepo environment variables.

### B. Console only

1. **App settings → Environment variables:** `AMPLIFY_MONOREPO_APP_ROOT` = `frontend`.
2. **App settings → Rewrites and redirects:** add **first** `/api/<*>` → `https://portfolio-6gcd.onrender.com/api/<*>` as
   **200 (Rewrite)**; keep `/<*>` → `/index.html` as **404-200**.
3. The build spec comes from `amplify.yml` in the repo; nothing to edit in the console.

Then trigger a build: push a commit, or *main → Redeploy this version*, or
`aws amplify start-job --app-id d3ag7vu427q7y9 --branch-name main --job-type RELEASE --region us-east-1`.

## 3. Verify

* `https://main.d3ag7vu427q7y9.amplifyapp.com/` loads, the pipeline loader plays once, and the AWS badge shows.
* A deep link works: `…/projects/lankaresilience`.
* Open CloudShell (press the backtick key) → `status` → both lines green.
* The *Blog* section badge says **live from Medium via my backend**. If it says "bundled snapshot", the `/api` rewrite is
  missing or the backend is asleep.

## Content refresh

The plan also creates an EventBridge schedule (`refresh_schedule`, default daily 03:00 UTC) that starts a build so new
articles and videos are bundled. Change or disable it in `terraform.tfvars` (`refresh_schedule = ""` turns it off).
To see what the next build would pick up, run `npm run feeds -- --dry` in `frontend/`.
AWS Builder Center articles: paste each link into `awsBuilder.articleUrls` in `frontend/src/data/feeds.config.js`.

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Blank page / 404 at the root | Build spec still the default (`baseDirectory: /`). Use A or B above and redeploy |
| Build fails at `npm ci` | `AMPLIFY_MONOREPO_APP_ROOT` missing, so Amplify built the repo root |
| `/projects` shows 404 | Missing SPA rewrite rule; `dist/404.html` softens this, but add the rule |
| Videos badge says "bundled at last build" | The `/yt/<*>` rewrite is missing (Terraform adds it) or YouTube's feed was briefly unavailable |
| Live badges say "bundled snapshot" | `/api` proxy rule missing or after the SPA rule, or the Render backend is asleep (retry in a minute) |
| Library page: "isn't answering" | Same as above; Render free-tier cold start |
