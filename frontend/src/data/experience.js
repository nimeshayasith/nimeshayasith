import { withMedia } from './media';

/** Work, education and volunteering — from the CV. Newest first. */

const EXPERIENCE_LIST = [
  {
    _id: 'exp-cloudadvisory',
    company: 'The CloudAdvisory',
    role: 'Intern DevOps Engineer',
    location: 'Remote',
    type: 'internship',
    period: 'Aug 2025 – Jan 2026',
    description:
      'Delivered 4 Azure infrastructure projects covering Terraform, Docker, Kubernetes and CI/CD, including a 3-environment AKS platform deployed through GitHub Actions.',
    achievements: [
      'Delivered 4 Azure infrastructure projects (Terraform, Docker, Kubernetes, CI/CD)',
      'Built a 3-environment AKS platform where Dev, Stage and Prod deploy from identical code',
      'Fixed an ImagePullBackOff at the root with an AcrPull role binding in Terraform',
      'Integrated ACR, Key Vault and a private-endpoint-only MySQL database',
    ],
    techStack: ['Terraform', 'Azure AKS', 'Docker', 'Kubernetes', 'GitHub Actions', 'Key Vault'],
  },
  {
    _id: 'exp-boffo',
    company: 'Boffo System Labs',
    role: 'Software Engineer Intern',
    location: 'Colombo, Sri Lanka',
    type: 'internship',
    period: 'May 2025 – Nov 2025',
    description:
      'Worked in Agile sprints on a multi-tenant Angular/.NET Core SaaS platform, adding role-based access and supporting the DevOps toolchain.',
    achievements: [
      'Built role-based access for 5 user roles and nested-route navigation',
      'Fixed JWT, CORS, referential-integrity and routing-guard defects',
      'Containerised the stack with Docker using health-check startup ordering',
      'Supported Terraform, Ansible and Azure DevOps CI/CD pipelines',
      'Built a Selenium/TestNG regression suite (11+ cases, all 5 roles)',
    ],
    techStack: ['Angular', '.NET', 'Docker', 'Terraform', 'Ansible', 'Azure DevOps', 'Selenium'],
  },
];

const VOLUNTEERING_LIST = [
  {
    _id: 'vol-axiom',
    role: 'Technical Team Member',
    org: 'Axiom 2.0 Coding Challenge',
    period: 'Sep – Oct 2024',
    detail: 'Designed and reviewed technical challenges and supported live sessions.',
    url: 'https://github.com/nimeshayasith/Axiom-2.0',
  },
  {
    _id: 'vol-xbotics',
    role: 'Organizing Committee Member',
    org: 'Xbotics Competition',
    period: 'Aug – Oct 2023',
    detail: 'Coordinated the school-category team and event arrangements.',
  },
  {
    _id: 'vol-mehewara',
    role: 'Volunteer',
    org: 'Mehewara',
    period: 'Mar 2023 – Mar 2024',
    detail: "University outreach programme supporting O/L students in the district.",
  },
];

const EDUCATION_LIST = [
  {
    _id: 'edu-uor',
    year: 'Feb 2022 – Sep 2026',
    title: 'B.Sc. Engineering (Hons), Computer Engineering',
    org: 'University of Ruhuna, Sri Lanka',
  },
  {
    _id: 'edu-al',
    year: '2016 – 2019',
    title: 'G.C.E. Advanced Level (A, B, C)',
    org: 'Kalutara Vidyalaya National School',
  },
  {
    _id: 'edu-primary',
    year: '2004 – 2015',
    title: 'Primary & Ordinary Level',
    org: 'K/Aluthgama National School',
  },
];

/** Flat, dated list for the home-page timeline grid (newest first). Four items fit its snake layout. */
export const TIMELINE_EXPERIENCE = [
  { _id: 't-ca', year: 'Aug 2025 – Jan 2026', title: 'Intern DevOps Engineer', org: 'The CloudAdvisory (Remote)' },
  { _id: 't-boffo', year: 'May 2025 – Nov 2025', title: 'Software Engineer Intern', org: 'Boffo System Labs, Colombo' },
  { _id: 't-axiom', year: 'Sep – Oct 2024', title: 'Technical Team Member', org: 'Axiom 2.0 Coding Challenge' },
  { _id: 't-mehewara', year: 'Mar 2023 – Mar 2024', title: 'Volunteer', org: 'Mehewara outreach programme' },
];

// Drop a logo or photo named after the id (e.g. exp-cloudadvisory.png) into src/media/experience.
export const EXPERIENCE = withMedia(EXPERIENCE_LIST, 'experience');
export const VOLUNTEERING = withMedia(VOLUNTEERING_LIST, 'experience');
export const EDUCATION = withMedia(EDUCATION_LIST, 'experience');
