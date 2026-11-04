# Challenge write-up: AWS Builder Center · Student Portfolio Challenge

> Draft for the "your project" entry. Paste the sections into the Builder Center form and attach the
> screenshots from [`docs/screenshots/`](screenshots). Items marked **TODO** need your final check
> after the first successful Amplify deploy.

**Live site:** https://main.d3ag7vu427q7y9.amplifyapp.com
**GitHub:** https://github.com/nimeshayasith/nimeshayasith  (`/frontend`, `/terraform`, `/docs`)
**Builder:** Nimesha Yasith · Cloud & DevOps Engineer · AWS Certified Solutions Architect – Associate

---

## 1. The creative feature: a Chaos Monkey you can fight

A portfolio usually *describes* reliability engineering. This one lets you practise it.

Click **break something** (bottom-left of every page, and in the hero: *"prod looks stable. break something"*).
Three real components of the page you are looking at (a heading, a card, a button) go down with Kubernetes-style
failures: `CrashLoopBackOff`, `ImagePullBackOff`, `OOMKilled`, `Evicted`. The status pill turns into an incident
with a running **MTTR** (mean time to recovery) clock. Click each broken component to restart its pod, or press
*Restart all*. Leave it alone and the controller **self-heals** everything after 30 seconds: the same idea as the
self-healing and `ImagePullBackOff` fixes in my AWS/Kubernetes projects. Your best recovery time is kept for the visit.

It is keyboard accessible (broken components take focus, Enter restarts them), respects reduced motion, and only
toggles `data-chaos` attributes, so it can't corrupt page state. Screenshots: `06-chaos-incident.png`, `07-chaos-recovered.png`.

**The rest of the experience is built around the same idea, "the site is a running system":**

| Piece | What it does |
|---|---|
| **Entry sequence** | *Ready to deploy.* One click (**Enter** or **Enter with sound**; it continues silently after a few seconds, so nobody gets stuck). A big counter climbs 0 → 100 while the real build log of this site streams: commit, `terraform apply`, how many articles and videos were synced. Then the screen splits open. |
| **Sound** | Optional. Synthesised in the browser with Web Audio (no audio files): counter ticks, a boot chord, hover ticks, a page-change whoosh, an alarm and a recovery chime for the Chaos Monkey. Off until chosen; a speaker button stays in the navbar. |
| **Demo reel** | In the Projects section the project videos play on a laptop: the screen changes channel every few seconds, an *Up next* list picks any demo, and a click opens the player. Projects with a video also get a **Demo** button on their card. Matching is by video title, so a new upload links itself. |
| **Live status strip** | Under the hero: deployed time and commit of *this build*, a live latency probe of my backend, the newest article and video. Every figure is real. |
| **Cursor spotlight** | Cards light up under the pointer. |
| **Experience as a git history** | Each role, degree and volunteering stint is a *commit* on a branch (`main`, `education`, `community`) with the achievements written as green `+` diff lines. |
| **CloudShell** | A working terminal easter egg (backtick, or the `>_ shell` button): `status` pings the real backend, `terraform plan` lists real resources. Kept deliberately quiet. |

## 2. Core sections

* **About Me**: home-page summary plus a full story at `/about`.
* **Skills / Tech Superpowers**: filterable by category.
* **Projects & Achievements**: 26 projects with detail pages (two built for AWS Builder weekend challenges: CloudFix Buddy, LankaResilience), a demo video on each project that has one, Experience, Certifications (with the AWS certificate), Library, **Gallery**, **Business Work**, **Articles** and **Videos**.
* **One type scale** across every page (`.t-display`, `.section-title`, `.t-h3`, `.t-lead`, `.t-body`, `.t-small`, `.t-label`) and one heading component, so h1/h2/h3 sizes are identical page to page (verified by script: h1 60 px, h2 36 px, h3 17 px everywhere).

## 3. Content that updates itself

| Source | How it arrives |
|---|---|
| **Medium**, **DEV (dev.to)**, **AWS Builder Center**, **YouTube** | `scripts/fetch-feeds.mjs` bundles them at build time (YouTube through the official Data API v3 with the key held as an Amplify environment variable, RSS as fallback). **EventBridge Scheduler** starts an Amplify build every day (`amplify:StartJob`, least-privilege role, no Lambda or secret). In the browser, Medium (via my backend), DEV and YouTube are asked again and merged, so a post published an hour ago shows up without any redeploy. |

Honest limits: AWS Builder Center has no public per-author feed, so its article links live in `feeds.config.js`
(the build also scans the site-wide RSS for posts authored by me). DEV currently has no published posts.

## 4. AWS services and how they are used

| Service | Role |
|---|---|
| **AWS Amplify Hosting** | Connects to GitHub, builds the Vite app on every push to `main` (monorepo `appRoot: frontend`), deploys atomically, hosts the static site |
| **Amazon CloudFront** (managed by Amplify) | Global edge delivery and caching, HTTPS |
| **AWS Certificate Manager** (managed by Amplify) | TLS certificate |
| **Amazon EventBridge Scheduler** | Daily rebuild through the Amplify `StartJob` API so new articles and videos are bundled |
| **AWS IAM** | A scheduler role that may only start builds of this one branch |
| **Terraform** | Defines the Amplify app, branch, rewrite rules, env vars and the schedule; imported the console-created app instead of recreating it |
| **Amplify rewrites** | `/api/*` → my backend, `/yt/*` → YouTube (both reverse-proxied, so no CORS to manage), plus the SPA fallback |
| **AWS Budgets** *(optional, in Terraform)* | Monthly cost alert |

Pipeline: `git push` → GitHub → Amplify (`npm ci` → `fetch-feeds` → `vite build`) → CloudFront → visitor.
Diagram in [ARCHITECTURE.md](ARCHITECTURE.md). GitHub Actions also builds the frontend and runs `terraform fmt` / `validate` on every PR.

## 5. Challenges and what I learned

1. **A green connection that deployed nothing.** Amplify was authorised to my GitHub repo but the site returned an empty
   404. Two causes: the repo only contained a README, and the app's default build spec publishes the repo *root*
   (`baseDirectory: /`, empty build command). Fix: a monorepo build spec and `AMPLIFY_MONOREPO_APP_ROOT`.
   Lesson: "connected" and "built correctly" are different things; read the build spec.
2. **CORS silently blocking my own backend, and YouTube having none.** The backend's allow-list only had my previous
   frontend's origin, and YouTube's feed sends no CORS headers at all. Fix: proxy `/api/*` and `/yt/*` through Amplify
   200-rewrites so the browser stays same-origin. Lesson: understand where a boundary is before reaching for config.
3. **Free-tier cold starts.** Render sleeps when idle (about a minute to wake). Fix: static-first rendering, a warm-up ping,
   and honest status badges. Lesson: design for the slow path.
4. **A site that goes stale.** Posting a new article or video shouldn't need a code change. Fix: a build-time sync plus a
   scheduled rebuild plus live refresh. YouTube's feed also fails intermittently (500/404 on consecutive calls), so the
   script retries and keeps the previous snapshot rather than breaking the build.
5. **A bug only the animation could cause.** The entry counter crashed the whole app once: `requestAnimationFrame` hands
   you a timestamp slightly *before* a `performance.now()` taken earlier, so progress went negative and indexed `STAGES[-1]`.
   Found by driving the page with a headless browser; fixed by clamping.
6. **Consistency is a system, not a pass.** Page headers had drifted (h1 sizes, h2 from 20 to 48 px, three container widths).
   Fix: one type scale plus one heading component used everywhere, then an automated check of computed sizes on every route.
7. **Import, don't recreate.** `terraform plan` against the real account showed exactly two in-place updates, so I adopted the
   existing app (same URL) instead of destroying it.

## 6. Screenshots to attach

| File | Shows |
|---|---|
| [01-entry-gate.png](screenshots/01-entry-gate.png) | "Ready to deploy." entry screen (Enter / Enter with sound) |
| [02-deploy-counter.png](screenshots/02-deploy-counter.png) | The counter with this site's real build log |
| [03-curtain-reveal.png](screenshots/03-curtain-reveal.png) | The screen splitting open |
| [04-home.png](screenshots/04-home.png) · [05-live-status-strip.png](screenshots/05-live-status-strip.png) | Home and the live status strip |
| [06-chaos-incident.png](screenshots/06-chaos-incident.png) | Chaos Monkey: three components down, incident pill with MTTR |
| [07-chaos-recovered.png](screenshots/07-chaos-recovered.png) | Recovered, with the measured MTTR |
| [08-articles-multi-source.png](screenshots/08-articles-multi-source.png) | Articles from Medium / DEV / AWS Builder with source filters |
| [09-videos.png](screenshots/09-videos.png) | YouTube demos synced from the channel |
| [10-architecture.png](screenshots/10-architecture.png) | "Built & shipped on AWS" section |
| [11-certifications.png](screenshots/11-certifications.png) · [12-projects.png](screenshots/12-projects.png) · [13-business-work.png](screenshots/13-business-work.png) | Core pages |
| [14-mobile-videos.png](screenshots/14-mobile-videos.png) · [15-light-theme.png](screenshots/15-light-theme.png) | Mobile and light theme |
| [16-demo-reel-laptop.png](screenshots/16-demo-reel-laptop.png) | Project demos on a laptop with the Up next list |
| [17-experience-git-log.png](screenshots/17-experience-git-log.png) | Experience as a git history |

**TODO before submitting (deadline Fri 6 Nov):**
* [ ] Add 2–3 screenshots of the **AWS console** (Amplify build history showing a green deploy; rewrites; the EventBridge schedule; the Terraform `apply` output).
* [ ] Paste your AWS Builder Center article links into `awsBuilder.articleUrls` (`frontend/src/data/feeds.config.js`) so they show in Articles.
* [ ] Re-take screenshots from the live URL if you prefer (these were captured from the same code running locally).
* [ ] Confirm on the live URL: the Articles and Videos badges say *"checked live just now"* / *"synced with YouTube"*.
