/**
 * CloudShell command engine. Pure logic: every command receives a `ctx`
 * (print, clear, sleep, navigate, theme helpers…) so the UI stays dumb and
 * the commands stay testable.
 */
import { PERSONAL, SOCIAL_LINKS, FILES, ACHIEVEMENTS } from '../../data/profile';
import { PROJECTS, PROJECT_CATEGORIES, getProject } from '../../data/projects';
import { EXPERIENCE, VOLUNTEERING } from '../../data/experience';
import { FEATURED_CERT, CERTIFICATIONS } from '../../data/certifications';
import { SKILL_GROUPS } from '../../data/skills';
import { API_URL, BACKEND_ORIGIN, pingBackend } from '../../services/api';

const ROUTES = {
  home: '/',
  about: '/about',
  projects: '/projects',
  experience: '/experience',
  certifications: '/certifications',
  certs: '/certifications',
  blog: '/blogs',
  blogs: '/blogs',
  library: '/library',
  gallery: '/gallery',
  videos: '/videos',
  articles: '/blogs',
  business: '/business',
  work: '/business',
  resume: '/resume',
  cv: '/resume',
  contact: '/#contact',
  skills: '/#skills',
  architecture: '/#architecture',
};

const LINKS = {
  github: SOCIAL_LINKS.github,
  linkedin: SOCIAL_LINKS.linkedin,
  medium: SOCIAL_LINKS.medium,
  youtube: SOCIAL_LINKS.youtube,
  hackerrank: SOCIAL_LINKS.hackerrank,
  aws: SOCIAL_LINKS.awsBuilder,
  repo: SOCIAL_LINKS.repo,
  cv: '/resume',
  resume: '/resume',
  cert: FILES.awsCertificate,
  verify: FEATURED_CERT.credentialUrl,
};

const FORTUNES = [
  '"It works on my machine" is not a deployment strategy. Ship the machine: docker build.',
  'Automate it twice and you have a pipeline. Automate it once and you have a script nobody trusts.',
  'terraform plan is a conversation. terraform apply is a commitment.',
  'A green pipeline that never ran the test is just a very confident lie.',
  'Least privilege: grant what is needed today, not what might be needed someday.',
  'Every outage is a free lesson. Write it down, then fix it permanently.',
  'Cattle, not pets. Unless it is the Raspberry Pi under the desk.',
];

const pad = (s, n) => String(s).padEnd(n, ' ');
const NL = '';

/** Commands shown by `help`, and used for Tab completion. */
export const COMMAND_HELP = [
  ['help', 'show this list'],
  ['whoami', 'who is behind this portfolio'],
  ['about', 'the short story'],
  ['skills', 'the toolbox'],
  ['projects', 'list projects  ·  `project <n>` for details'],
  ['experience', 'internships & volunteering'],
  ['certs', 'certifications (hint: one is from AWS)'],
  ['status', 'live health check of this site and its backend'],
  ['terraform plan', 'what infrastructure runs this site'],
  ['deploy', 'ship a release through the pipeline'],
  ['kubectl get pods', 'skills, but make them pods'],
  ['aws sts get-caller-identity', 'who am I, according to IAM'],
  ['neofetch', 'system info, portfolio edition'],
  ['goto <page>', 'about · projects · experience · certs · blog · library · gallery · videos · business · contact'],
  ['open <n|github|linkedin|medium|cv>', 'open a project or link'],
  ['theme [dark|light]', 're-skin the whole site'],
  ['sudo hire-me', 'you know you want to'],
  ['fortune', 'a DevOps proverb'],
  ['clear / exit', 'tidy up / close the shell'],
];

export const COMPLETIONS = [
  'help', 'whoami', 'about', 'skills', 'projects', 'project', 'experience', 'certs',
  'status', 'terraform plan', 'terraform apply', 'deploy', 'kubectl get pods',
  'aws sts get-caller-identity', 'neofetch', 'goto', 'open', 'theme', 'sudo hire-me',
  'fortune', 'ls', 'cat', 'history', 'clear', 'exit', 'contact', 'date', 'echo',
];

export const SUGGESTIONS = ['help', 'whoami', 'projects', 'status', 'deploy', 'sudo hire-me'];

export function bootBanner() {
  return [
    { kind: 'accent', text: 'CloudShell v1.0  ·  Nimesha Yasith  ·  running on AWS Amplify + CloudFront' },
    { kind: 'dim', text: "Type 'help' to see what I can do. Tab completes, ↑/↓ recalls history." },
    { kind: 'out', text: NL },
  ];
}

/* ───────────────────────── individual commands ───────────────────────── */

const commands = {
  async help({ print }) {
    print({ kind: 'accent', text: 'Available commands' });
    COMMAND_HELP.forEach(([cmd, desc]) => print({ kind: 'out', text: `  ${pad(cmd, 36)}${desc}` }));
  },

  async whoami({ print }) {
    print({ kind: 'accent', text: 'nimesha-yasith' });
    print({ kind: 'out', text: `${PERSONAL.title} · ${PERSONAL.subtitle}` });
    print({ kind: 'dim', text: 'Computer Engineering graduate, University of Ruhuna (Sri Lanka)' });
    print({ kind: 'dim', text: PERSONAL.openTo });
  },

  async about({ print }) {
    print({ kind: 'out', text: PERSONAL.tagline });
    print({ kind: 'out', text: NL });
    print({ kind: 'dim', text: 'Two internships (DevOps + Software Engineering), projects across AWS and Azure,' });
    print({ kind: 'dim', text: 'and a habit of tracing every failure to its root cause and fixing it permanently.' });
    print({ kind: 'dim', text: "Try: 'projects', 'certs', or 'goto about'." });
  },

  async skills({ print }) {
    Object.entries(SKILL_GROUPS).forEach(([group, items]) => {
      print({ kind: 'accent', text: group });
      print({ kind: 'dim', text: `  ${items}` });
    });
  },

  async projects({ print }, args) {
    const wanted = args[0]?.toLowerCase();
    const cat = PROJECT_CATEGORIES.find((c) => c.slug === wanted);
    const list = PROJECTS.map((p, i) => ({ p, n: i + 1 })).filter(({ p }) => !cat || p.category.slug === cat.slug);
    print({ kind: 'accent', text: `${list.length} projects${cat ? ` in ${cat.name}` : ''} (newest first)` });
    list.forEach(({ p, n }) => {
      const aws = p.aws ? ' [AWS]' : '';
      print({ kind: 'out', text: `  ${pad(String(n).padStart(2, '0'), 4)}${p.title}${aws}` });
    });
    print({ kind: 'dim', text: NL });
    print({ kind: 'dim', text: "project <n> for details · open <n> to visit · filter: projects cloud-devops | data-streaming | security-research | ai-ml | software" });
  },

  async project({ print }, args) {
    const p = PROJECTS[Number(args[0]) - 1] || getProject(args[0]);
    if (!p) return print({ kind: 'err', text: `project: no such project '${args[0] ?? ''}'. Try 'projects'.` });
    print({ kind: 'accent', text: p.title });
    print({ kind: 'dim', text: `${p.period} · ${p.kind} · ${p.category.name}` });
    print({ kind: 'out', text: NL });
    print({ kind: 'out', text: p.description });
    if (p.myPart) {
      print({ kind: 'out', text: NL });
      print({ kind: 'accent', text: 'My part' });
      print({ kind: 'out', text: p.myPart });
    }
    print({ kind: 'out', text: NL });
    print({ kind: 'dim', text: `Stack: ${p.techStack.join(' · ')}` });
    if (p.githubUrl) print({ kind: 'link', text: `Code: ${p.githubUrl}`, href: p.githubUrl });
    if (p.liveUrl) print({ kind: 'link', text: `Live: ${p.liveUrl}`, href: p.liveUrl });
  },

  async experience({ print }) {
    EXPERIENCE.forEach((e) => {
      print({ kind: 'accent', text: `${e.role} · ${e.company}` });
      print({ kind: 'dim', text: `  ${e.period} · ${e.location}` });
      e.achievements.slice(0, 3).forEach((a) => print({ kind: 'out', text: `  - ${a}` }));
      print({ kind: 'out', text: NL });
    });
    print({ kind: 'accent', text: 'Volunteering' });
    VOLUNTEERING.forEach((v) => print({ kind: 'out', text: `  - ${v.role}, ${v.org} (${v.period})` }));
  },

  async certs({ print }) {
    print({ kind: 'aws', text: `★ ${FEATURED_CERT.title}` });
    print({ kind: 'dim', text: `  Issued 28 Oct 2026 · expires 28 Oct 2029` });
    print({ kind: 'dim', text: `  Validation number: ${FEATURED_CERT.validationNumber}` });
    print({ kind: 'link', text: `  Verify: ${FEATURED_CERT.credentialUrl}`, href: FEATURED_CERT.credentialUrl });
    print({ kind: 'out', text: NL });
    CERTIFICATIONS.filter((c) => !c.featured).forEach((c) =>
      print({ kind: 'out', text: `  - ${c.title} (${c.issuer.split('·')[0].trim()})` }),
    );
    print({ kind: 'out', text: NL });
    ACHIEVEMENTS.filter((a) => a.title.startsWith('IEEE')).forEach((a) =>
      print({ kind: 'dim', text: `  ${a.title}: ${a.detail}` }),
    );
  },

  async status({ print, sleep }) {
    print({ kind: 'accent', text: 'Checking the stack…' });
    await sleep(250);
    print({ kind: 'ok', text: `● frontend   active   AWS Amplify Hosting → CloudFront  (${window.location.host})` });
    print({ kind: 'dim', text: `→ GET ${API_URL}/health   (proxied to ${BACKEND_ORIGIN.replace('https://', '')})` });
    let hinted = false;
    const hint = setTimeout(() => {
      hinted = true;
      print({ kind: 'warn', text: '  …Render free tier may be cold-starting (up to ~50 s). Static content never waits for it.' });
    }, 3500);
    const res = await pingBackend();
    clearTimeout(hint);
    if (res.ok) {
      print({ kind: 'ok', text: `● backend    active   Render · HTTP 200 in ${res.ms} ms${hinted ? ' (cold start)' : ''}` });
      print({ kind: 'dim', text: `  ${JSON.stringify(res.data)}` });
    } else {
      print({ kind: 'warn', text: `● backend    degraded (${res.error}). The site still works: static data is bundled.` });
    }
  },

  async terraform({ print, sleep }, args) {
    const sub = args[0];
    if (sub !== 'plan' && sub !== 'apply') {
      return print({ kind: 'dim', text: 'Usage: terraform plan | terraform apply' });
    }
    print({ kind: 'dim', text: 'Initializing the backend…  Terraform v1.x · provider aws ~> 5.0' });
    await sleep(350);
    print({ kind: 'out', text: 'module.amplify_hosting.aws_amplify_app.this: Refreshing state…' });
    await sleep(300);
    print({ kind: 'out', text: NL });
    print({ kind: 'out', text: 'Terraform will perform the following actions:' });
    print({ kind: 'ok', text: '  + module.amplify_hosting.aws_amplify_app.this' });
    print({ kind: 'dim', text: '        repository = "github.com/nimeshayasith/nimeshayasith"' });
    print({ kind: 'dim', text: '        build_spec = <monorepo appRoot: frontend>' });
    print({ kind: 'ok', text: '  + module.amplify_hosting.aws_amplify_branch.main' });
    print({ kind: 'dim', text: '        enable_auto_build = true   # git push → deploy' });
    print({ kind: 'out', text: NL });
    print({ kind: 'accent', text: 'Plan: 2 to add, 0 to change, 0 to destroy.' });
    if (sub === 'plan') {
      print({ kind: 'dim', text: "Nothing was changed. Run 'terraform apply' to see it happen (it's a demo, I promise)." });
      return undefined;
    }
    await sleep(500);
    print({ kind: 'out', text: 'aws_amplify_app.this: Creating…' });
    await sleep(700);
    print({ kind: 'out', text: 'aws_amplify_app.this: Creation complete after 2s' });
    print({ kind: 'out', text: 'aws_amplify_branch.main: Creating…' });
    await sleep(600);
    print({ kind: 'out', text: 'aws_amplify_branch.main: Creation complete after 1s' });
    print({ kind: 'out', text: NL });
    print({ kind: 'ok', text: 'Apply complete! Resources: 2 added, 0 changed, 0 destroyed.' });
    print({ kind: 'link', text: `site_url = "${window.location.origin}"`, href: window.location.origin });
    return 'confetti';
  },

  async deploy({ print, sleep }) {
    const steps = [
      ['git push origin main', 'remote: Amplify webhook triggered'],
      ['npm ci', 'added 312 packages, audited in 6s'],
      ['npm run build', 'vite build ✓  built in 4.1s'],
      ['smoke-test', 'routes ✓  links ✓  a11y ✓'],
      ['amplify publish', 'CloudFront invalidated · edge locations updated'],
    ];
    for (const [cmd, out] of steps) {
      print({ kind: 'out', text: `$ ${cmd}` });
      await sleep(520);
      print({ kind: 'ok', text: `  ✔ ${out}` });
    }
    print({ kind: 'out', text: NL });
    print({ kind: 'accent', text: '🚀 Deployed. Every push to main ships like this, automatically.' });
    return 'confetti';
  },

  async kubectl({ print }, args) {
    if (args.join(' ') !== 'get pods') return print({ kind: 'dim', text: "Usage: kubectl get pods" });
    const rows = [
      ['aws-architect-0', '1/1', 'Running', '0', '2026'],
      ['terraform-7d9f6', '1/1', 'Running', '0', '2025'],
      ['github-actions-0', '1/1', 'Running', '0', '2025'],
      ['docker-6c8b4', '1/1', 'Running', '0', '2025'],
      ['kubernetes-5f7d9', '1/1', 'Running', '1', '2025'],
      ['prometheus-0', '1/1', 'Running', '0', '2026'],
      ['grafana-0', '1/1', 'Running', '0', '2026'],
      ['coffee-0', '0/1', 'CrashLoopBackOff', '42', '∞'],
    ];
    print({ kind: 'dim', text: `${pad('NAME', 20)}${pad('READY', 8)}${pad('STATUS', 20)}${pad('RESTARTS', 10)}SINCE` });
    rows.forEach(([n, r, s, x, a]) =>
      print({ kind: s === 'Running' ? 'out' : 'warn', text: `${pad(n, 20)}${pad(r, 8)}${pad(s, 20)}${pad(x, 10)}${a}` }),
    );
  },

  async aws({ print }, args) {
    const sub = args.join(' ');
    if (sub === 'sts get-caller-identity') {
      print({ kind: 'out', text: '{' });
      print({ kind: 'out', text: '  "UserId": "NIMESHA-YASITH",' });
      print({ kind: 'out', text: '  "Account": "portfolio",' });
      print({ kind: 'out', text: '  "Arn": "arn:aws:sts::portfolio:assumed-role/SolutionsArchitectAssociate/nimesha"' });
      print({ kind: 'out', text: '}' });
      print({ kind: 'aws', text: '# AWS Certified Solutions Architect – Associate · 28 Oct 2026 → 28 Oct 2029' });
      print({ kind: 'link', text: `# verify: ${FEATURED_CERT.validationNumber}`, href: FEATURED_CERT.credentialUrl });
      return undefined;
    }
    if (sub === '--version') return print({ kind: 'out', text: 'aws-cli/2.x CloudShell/1.0 (portfolio edition)' });
    return print({ kind: 'dim', text: "Try: aws sts get-caller-identity" });
  },

  async neofetch({ print }) {
    [
      '███╗   ██╗██╗   ██╗',
      '████╗  ██║╚██╗ ██╔╝',
      '██╔██╗ ██║ ╚████╔╝ ',
      '██║╚██╗██║  ╚██╔╝  ',
      '██║ ╚████║   ██║   ',
      '╚═╝  ╚═══╝   ╚═╝   ',
    ].forEach((l) => print({ kind: 'accent', text: l }));
    print({ kind: 'out', text: NL });
    [
      ['nimesha', 'aws-portfolio'],
      ['OS', 'AWS Amplify Hosting + CloudFront'],
      ['Host', `${window.location.host}`],
      ['CI/CD', 'GitHub → Amplify (auto-build on push)'],
      ['IaC', 'Terraform'],
      ['Backend', 'Node/Express on Render (live: Medium, library, credentials)'],
      ['Frontend', 'React · Vite · Tailwind · Framer Motion'],
      ['Cert', 'AWS Certified Solutions Architect – Associate'],
      ['Shell', 'CloudShell 1.0'],
    ].forEach(([k, v]) => print({ kind: 'out', text: `${pad(k, 10)}${v}` }));
  },

  async goto({ print, navigate, close }, args) {
    const key = (args[0] || '').toLowerCase();
    const route = ROUTES[key];
    if (!route) return print({ kind: 'err', text: `goto: unknown page '${key}'. Try: ${Object.keys(ROUTES).join(' · ')}` });
    print({ kind: 'ok', text: `→ ${route}` });
    close();
    navigate(route);
    const hash = route.split('#')[1];
    if (hash) setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' }), 450);
    return undefined;
  },

  async open({ print }, args) {
    const key = (args[0] || '').toLowerCase();
    let href = LINKS[key];
    const p = PROJECTS[Number(key) - 1];
    if (!href && p) href = p.liveUrl || p.githubUrl;
    if (!href) return print({ kind: 'err', text: `open: nothing to open for '${key}'. Try a project number, github, linkedin, medium, cv.` });
    print({ kind: 'link', text: `opening ${href}`, href });
    window.open(href, '_blank', 'noopener');
    return undefined;
  },

  async theme({ print, theme, setTheme }, args) {
    const want = args[0] === 'light' || args[0] === 'dark' ? args[0] : theme === 'dark' ? 'light' : 'dark';
    setTheme(want);
    print({ kind: 'ok', text: `theme → ${want}` });
  },

  async contact({ print }) {
    print({ kind: 'link', text: `email     ${PERSONAL.email}`, href: `mailto:${PERSONAL.email}` });
    print({ kind: 'link', text: `linkedin  ${SOCIAL_LINKS.linkedin}`, href: SOCIAL_LINKS.linkedin });
    print({ kind: 'link', text: `github    ${SOCIAL_LINKS.github}`, href: SOCIAL_LINKS.github });
    print({ kind: 'link', text: `medium    ${SOCIAL_LINKS.medium}`, href: SOCIAL_LINKS.medium });
  },

  async sudo({ print, sleep }, args) {
    const what = args.join(' ');
    if (what === 'hire-me' || what === 'hire me' || what === 'hire') {
      print({ kind: 'out', text: '[sudo] checking IAM policy…' });
      await sleep(500);
      print({ kind: 'out', text: '  Effect: Allow · Action: interview:Schedule · Resource: *' });
      await sleep(500);
      print({ kind: 'ok', text: '  ✔ Permission granted. Opening your mail client…' });
      await sleep(500);
      window.location.href = `mailto:${PERSONAL.email}?subject=${encodeURIComponent('Let\'s talk: Cloud / DevOps role')}`;
      return 'confetti';
    }
    if (/rm\s+-rf\s+\/?\*?/.test(what)) {
      return print({ kind: 'err', text: 'nimesha is not in the sudoers file. This incident will be reported (to CloudWatch).' });
    }
    return print({ kind: 'err', text: 'nimesha is not in the sudoers file. Try: sudo hire-me' });
  },

  async rm({ print }) {
    print({ kind: 'err', text: 'rm: Permission denied. Least-privilege IAM is in effect.' });
  },

  async ls({ print }) {
    print({ kind: 'accent', text: 'about.md  projects/  experience/  certifications/  blog/  library/  contact.txt  resume (read-only)' });
  },

  async cat({ print }, args) {
    const f = args[0];
    if (f === 'about.md') return commands.about({ print });
    if (f === 'contact.txt') return commands.contact({ print });
    if (f === 'resume' || f === 'cv.pdf') return commands.open({ print }, ['cv']);
    return print({ kind: 'err', text: `cat: ${f ?? ''}: No such file. Try 'ls'.` });
  },

  async fortune({ print }) {
    print({ kind: 'accent', text: FORTUNES[Math.floor(Math.random() * FORTUNES.length)] });
  },

  async date({ print }) {
    print({ kind: 'out', text: new Date().toString() });
  },

  async echo({ print }, args) {
    print({ kind: 'out', text: args.join(' ') });
  },
};

/** Aliases that map to an existing command with injected args. */
const ALIASES = {
  '?': ['help'],
  ll: ['ls'],
  projs: ['projects'],
  ping: ['status'],
  curl: ['status'],
  health: ['status'],
  certifications: ['certs'],
  certificates: ['certs'],
  exp: ['experience'],
  'hire-me': ['sudo', 'hire-me'],
  hire: ['sudo', 'hire-me'],
};

/**
 * Parse and run one line. Returns an optional effect string ('confetti').
 * `history` is handled by the UI because it needs the history array.
 */
export async function runCommand(line, ctx) {
  const parts = line.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return undefined;
  let [cmd, ...args] = parts;
  cmd = cmd.toLowerCase();

  if (ALIASES[cmd]) {
    const [aliasCmd, ...aliasArgs] = ALIASES[cmd];
    cmd = aliasCmd;
    args = [...aliasArgs, ...args];
  }

  const fn = commands[cmd];
  if (!fn) {
    ctx.print({ kind: 'err', text: `${cmd}: command not found. Type 'help'.` });
    const near = COMPLETIONS.find((c) => c.startsWith(cmd.slice(0, 2)));
    if (near) ctx.print({ kind: 'dim', text: `Did you mean '${near}'?` });
    return undefined;
  }
  return fn(ctx, args);
}
