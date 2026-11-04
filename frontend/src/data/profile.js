/**
 * Static profile data — bundled into the build, so it renders instantly
 * with zero network calls. Source of truth: CV (Associate DevOps Engineer),
 * GitHub profile README and LinkedIn.
 */

export const PERSONAL = {
  name: 'Nimesha Yasith',
  firstName: 'Nimesha',
  lastName: 'Yasith',
  initials: 'NY',
  email: 'nimeshayasith@gmail.com',
  phone: '+94 77 692 7203',
  location: 'Sri Lanka',
  title: 'Cloud & DevOps Engineer',
  subtitle: 'AWS Certified Solutions Architect – Associate',
  tagline:
    'Replacing manual setup with automation that is reliable and repeatable: Terraform, Kubernetes and CI/CD pipelines that verify success instead of assuming it.',
  openTo: 'Open to DevOps, Cloud and Platform / SRE roles',
};

export const SOCIAL_LINKS = {
  github: 'https://github.com/nimeshayasith',
  linkedin: 'https://www.linkedin.com/in/nimesha-yasith/',
  medium: 'https://medium.com/@nimeshayasith',
  awsBuilder: 'https://builder.aws.com?inviteId=cbdfb049-27aa-4269-99f7-78127e901eba',
  hackerrank: 'https://www.hackerrank.com/profile/EG_2021_4624',
  youtube: 'https://www.youtube.com/channel/UCKlC_6m88sM4wse36rB1Zxw',
  repo: 'https://github.com/nimeshayasith/nimeshayasith',
};

export const FILES = {
  awsCertificate: '/docs/AWS_Solutions_Architect_Associate.pdf',
};

/** The role words that cycle in the hero typewriter. */
export const ROLES = [
  'Cloud & DevOps Engineer',
  'AWS Certified Solutions Architect',
  'Platform / SRE Enthusiast',
  'Terraform · Kubernetes · CI/CD',
];

export const BIO = [
  "I'm a Computer Engineering graduate from the University of Ruhuna, Sri Lanka, focused on cloud infrastructure, DevOps and Site Reliability Engineering. I like replacing manual setup with automation that is reliable and repeatable: Terraform for infrastructure, Docker and Kubernetes for workloads, and CI/CD pipelines that verify success instead of assuming it.",
  'I completed two internships (DevOps and Software Engineering) and build projects across AWS and Azure. I enjoy tracing a failure to its root cause and fixing it permanently, whether that is Kubernetes networking, IAM permissions or database connectivity.',
  "Right now I'm building cloud and AI-assisted DevOps tools, finishing my Final Year Project (TETA-Guard), and writing about cloud and DevOps on Medium.",
];

export const HIGHLIGHTS = [
  { icon: 'Cloud', label: 'AWS & Azure', desc: 'EC2 · EKS · Lambda · S3 · RDS', color: '#f59e0b' },
  { icon: 'Layers', label: 'Infrastructure as Code', desc: 'Terraform · Ansible', color: '#818cf8' },
  { icon: 'GitBranch', label: 'CI/CD', desc: 'GitHub Actions · Azure DevOps', color: '#a8cc00' },
  { icon: 'Box', label: 'Containers', desc: 'Docker · Kubernetes · Helm', color: '#22d3ee' },
  { icon: 'Activity', label: 'Observability', desc: 'Prometheus · Grafana · CloudWatch', color: '#fb923c' },
  { icon: 'Terminal', label: 'Linux & Scripting', desc: 'Bash · Python · Go', color: '#34d399' },
];

export const ACHIEVEMENTS = [
  {
    title: 'IEEE Xtreme 18.0',
    detail: '29th in Sri Lanka and 377th of 8,700+ teams worldwide (24-hour global coding competition)',
  },
  {
    title: 'AWS Certified Solutions Architect – Associate',
    detail: 'Earned October 2026, valid until October 2029',
  },
  {
    title: 'Cisco Networking Academy',
    detail: 'Network Technician coursework (Jan 2025)',
  },
];
