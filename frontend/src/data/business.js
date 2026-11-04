import { withMedia } from './media';
import { FEATURED_PROJECTS, PROJECTS } from './projects';

/**
 * "Business Work": how I can help a small team or company, plus delivered client work.
 *
 * SERVICES and PROCESS are static. BUSINESS_WORK holds delivered engagements: add an entry
 * here (and a cover image src/media/business/<_id>.png) or add it through the backend's
 * /api/freelance and it shows up on /business. Until then the page honestly shows the
 * closest public work instead of inventing clients.
 */
export const SERVICES = [
  {
    icon: 'Boxes',
    title: 'Infrastructure as Code',
    body: 'Repeatable AWS and Azure environments in Terraform: remote state, modules, per-environment config, and import of what you already built by hand.',
    tags: ['Terraform', 'AWS', 'Azure'],
  },
  {
    icon: 'GitBranch',
    title: 'CI/CD pipelines',
    body: 'Push-to-deploy with GitHub Actions or Azure DevOps. Builds, tests and releases that verify success instead of assuming it, with keyless OIDC auth to the cloud.',
    tags: ['GitHub Actions', 'Azure DevOps', 'OIDC'],
  },
  {
    icon: 'Container',
    title: 'Containers & Kubernetes',
    body: 'Dockerise the app, then run it on AKS/Kubernetes with health checks, Dev, Stage and Prod from identical code, and secrets kept in a vault.',
    tags: ['Docker', 'Kubernetes', 'AKS'],
  },
  {
    icon: 'Cloud',
    title: 'Websites & static apps on AWS',
    body: 'Fast, cheap hosting for portfolios, landing pages and React apps: Amplify or S3 + CloudFront, HTTPS, custom domain, automatic deploys from GitHub.',
    tags: ['Amplify', 'CloudFront', 'S3'],
  },
  {
    icon: 'ShieldCheck',
    title: 'Security & cost review',
    body: 'A least-privilege IAM review, budget alerts and a short list of fixes ranked by risk and by money, so the cloud bill and the attack surface both shrink.',
    tags: ['IAM', 'AWS Budgets', 'Least privilege'],
  },
  {
    icon: 'Activity',
    title: 'Monitoring & reliability',
    body: 'Dashboards, alerts and runbooks so you hear about a problem before your users do. Prometheus and Grafana, or the cloud-native equivalent.',
    tags: ['Prometheus', 'Grafana', 'CloudWatch'],
  },
];

export const PROCESS = [
  { step: '01', title: 'Discover', body: 'A short call to understand what you run today, what hurts and what "done" looks like.' },
  { step: '02', title: 'Design', body: 'A one-page plan: architecture, cost estimate, risks. You approve it before I build.' },
  { step: '03', title: 'Build', body: 'Everything as code in your repository, in small reviewed steps you can follow.' },
  { step: '04', title: 'Hand over', body: 'Docs, a runbook and a walkthrough, so your team can run it without me.' },
];

/**
 * Delivered engagements. Template:
 * {
 *   _id: 'acme-landing',            // also the cover image name: src/media/business/acme-landing.png
 *   title: 'Landing page on AWS',
 *   client: 'Acme (Pvt) Ltd',
 *   year: 2026,
 *   description: 'What the problem was and what changed.',
 *   deliverables: ['Terraform for S3 + CloudFront', 'GitHub Actions deploy'],
 *   techStack: ['Terraform', 'CloudFront'],
 *   url: 'https://example.com',     // optional live link
 * }
 */
const BUSINESS_WORK_LIST = [];

export const BUSINESS_WORK = withMedia(BUSINESS_WORK_LIST, 'business');

/** Shown while BUSINESS_WORK is empty: the closest real, public examples of the same services. */
export const RELATED_PROJECTS = [
  ...FEATURED_PROJECTS.filter((p) => p.category?.slug === 'cloud-devops'),
  ...PROJECTS.filter((p) => p.category?.slug === 'cloud-devops' && !p.featured),
].slice(0, 3);

/** Accepts whatever shape the backend stores for a freelance / business entry. */
export function normalizeBusinessItem(raw) {
  if (!raw?.title) return null;
  const img = raw.imageUrl || raw.image?.url || raw.image || raw.thumbnail || raw.images?.[0]?.url || raw.images?.[0];
  const when = raw.completedAt || raw.createdAt;
  return {
    _id: String(raw._id || raw.id || raw.title),
    title: raw.title,
    client: raw.client || raw.clientName || raw.company || '',
    year: raw.year || (when ? new Date(when).getFullYear() : ''),
    description: raw.description || raw.summary || '',
    deliverables: raw.deliverables || raw.features || raw.highlights || [],
    techStack: raw.techStack || raw.technologies || raw.tags || raw.skills || [],
    url: raw.url || raw.liveUrl || raw.projectUrl || '',
    image: typeof img === 'string' ? img : undefined,
  };
}

export const mergeBusiness = (bundled, live) => {
  const items = live.map(normalizeBusinessItem).filter(Boolean);
  const seen = new Set(items.map((i) => i.title.toLowerCase()));
  return [...items, ...bundled.filter((b) => !seen.has(b.title.toLowerCase()))];
};
