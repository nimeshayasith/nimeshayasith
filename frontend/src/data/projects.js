/**
 * Static project catalogue (newest first). Built from the GitHub profile
 * README and the CV. No backend needed — this is what makes the portfolio
 * load instantly even when the Render service is asleep.
 */

import { withMedia } from './media';

const gh = (repo) => `https://github.com/nimeshayasith/${repo}`;

export const PROJECT_CATEGORIES = [
  { _id: 'cloud-devops', slug: 'cloud-devops', name: 'Cloud & DevOps' },
  { _id: 'data-streaming', slug: 'data-streaming', name: 'Data & Streaming' },
  { _id: 'security-research', slug: 'security-research', name: 'Security & Research' },
  { _id: 'ai-ml', slug: 'ai-ml', name: 'AI / ML' },
  { _id: 'software', slug: 'software', name: 'Software & Embedded' },
];

const CAT = Object.fromEntries(PROJECT_CATEGORIES.map((c) => [c.slug, c]));

const PROJECT_LIST = [
  /* ───────────────────────── 2026 ───────────────────────── */
  {
    _id: 'lankaresilience',
    title: 'LankaResilience: Flood Map of Sri Lanka',
    year: 2026,
    period: 'Nov 2026',
    kind: 'AWS Builder weekend challenge · Individual',
    category: CAT['cloud-devops'],
    featured: true,
    aws: true,
    description:
      "An interactive map of Sri Lanka's 25 districts showing how often historical flood events were reported in each district (1974–2020), with a year-range filter and per-district detail panel.",
    myPart:
      'Built the React + MapLibre app and shipped it as a static site: private S3 bucket behind CloudFront (Origin Access Control), Amazon Location Service for the base map, and a GitHub Actions pipeline that deploys with short-lived OIDC credentials, so no AWS keys live in GitHub.',
    highlights: [
      'Choropleth map with feature-state colouring and a From/To year filter',
      'Private S3 + CloudFront (OAC), HTTPS everywhere, no public bucket',
      'Keyless deployments: GitHub Actions → IAM role via OIDC, scoped to one repo and branch',
      'Cache invalidation on every deploy; data files kept out of the repository',
    ],
    techStack: ['AWS', 'CloudFront', 'S3', 'Amazon Location Service', 'IAM OIDC', 'GitHub Actions', 'React', 'MapLibre GL'],
    githubUrl: gh('LankaResilience'),
    liveUrl: 'https://d2dp41607pvuh1.cloudfront.net',
  },
  {
    _id: 'cloudfix-buddy',
    title: 'CloudFix Buddy: AWS Troubleshooting Agent',
    year: 2026,
    period: 'Oct 2026',
    kind: 'AWS Builder weekend challenge · Individual',
    category: CAT['cloud-devops'],
    featured: true,
    aws: true,
    description:
      'A guided "one fix at a time" assistant for common AWS problems (EC2 SSH, S3 AccessDenied, IAM permissions, Lambda timeouts, Docker deployment). Amazon Bedrock tool use runs read-only diagnostic checks, so the agent never changes a live account.',
    myPart:
      'Designed and built solo: React/Vite chat UI, API Gateway + Python Lambda backend, and Bedrock tool use. Defined the infrastructure in Terraform (S3 remote state, private S3 + CloudFront, CloudWatch logs) with a read-only, input-validated design.',
    highlights: [
      'Bedrock decides when a diagnostic tool is needed; the tool returns structured findings',
      'Read-only by design: no shell access, no AWS account access, never asks for credentials',
      'Five tested diagnostic paths: EC2 SSH, S3 AccessDenied, IAM, Lambda timeout, Docker',
      'Terraform-managed: remote state, private bucket behind CloudFront, CloudWatch logging',
    ],
    techStack: ['AWS Bedrock', 'Lambda', 'API Gateway', 'CloudFront', 'Terraform', 'React', 'Python'],
    githubUrl: gh('cloudfix_buddy_agent'),
  },
  {
    _id: 'gridpulse',
    title: 'GridPulse: Real-Time Smart Grid Monitoring & Billing',
    year: 2026,
    period: 'Sep 2026',
    kind: 'Team of 3',
    category: CAT['data-streaming'],
    featured: true,
    description:
      'A Kappa-architecture pipeline for live grid-load monitoring, renewable-shortfall alerts and daily household billing, running as 13 Docker services from a single command.',
    myPart:
      'Owned the infrastructure and DevOps side: Docker Compose stack with health checks, Kafka topic design, Airflow DAG, Spark deployment and checkpointing, and the Prometheus + Grafana observability stack (consumer lag, API latency).',
    highlights: [
      '13 services brought up with one command, ordered by health checks',
      'Kafka → Spark Structured Streaming → PostgreSQL, scheduled with Airflow',
      'Prometheus + Grafana dashboards for consumer lag and API latency',
    ],
    techStack: ['Kafka', 'Spark Structured Streaming', 'Airflow', 'PostgreSQL', 'FastAPI', 'Prometheus', 'Grafana', 'Docker'],
    githubUrl: gh('smart_grid_energy_monitoring'),
  },
  {
    _id: 'kafka-orders',
    title: 'Kafka Order Processing System',
    year: 2026,
    period: 'Sep 2026',
    kind: 'Individual',
    category: CAT['data-streaming'],
    description: 'A producer/consumer pair exchanging Avro-serialised Order messages over Kafka.',
    techStack: ['Kafka', 'Avro', 'Python'],
    githubUrl: gh('Kafka_based_order_processing_system'),
  },
  {
    _id: 'teta-guard',
    title: 'TETA-Guard: Blockchain-Secured Attack Detection for SDVN',
    year: 2026,
    period: 'Dec 2025 – Sep 2026',
    kind: 'Final Year Project · Team of 4',
    category: CAT['security-research'],
    featured: true,
    description:
      'A framework to detect and mitigate three topology-poisoning attacks (Topology Time-Warp, Beacon State Heartbeat Hijack, Multipath Echo) in software-defined vehicular networks.',
    myPart:
      'Designed and built the Hyperledger Fabric network (trust-weighted PBFT endorsement, OBU ledger replicas, TemporalEchoMitigator chaincode), the NS-3 vehicular simulation, and an automated attack-simulation test suite that checks each attack is detected and blocked.',
    highlights: [
      'Tamper-evident audit trail of attack detection and mitigation on Hyperledger Fabric',
      'NS-3 vehicular simulation of three topology-poisoning attacks',
      'Automated test suite: every attack must be detected and blocked',
    ],
    techStack: ['Hyperledger Fabric', 'Go', 'Node.js', 'NS-3', 'Python', 'CouchDB'],
    githubUrl: gh('SDVN-Temporal-Attacks'),
  },
  {
    _id: 'pq-channel',
    title: 'Post-Quantum Secure Channel for SDVN',
    year: 2026,
    period: 'May 2026',
    kind: 'Information Security module',
    category: CAT['security-research'],
    description:
      'A vehicle-to-roadside secure channel using hybrid post-quantum key exchange (Kyber), HMAC-authenticated beacons, a ±5 s timestamp window and a nonce store. An attack test suite shows replay, duplication and tampering are blocked.',
    techStack: ['Python', 'Kyber / ML-KEM', 'HMAC', 'Falcon'],
    githubUrl: gh('Information_Security'),
  },
  {
    _id: 'autotrust-bank',
    title: 'AutoTrust Bank: RAG-Based Banking Chatbot',
    year: 2026,
    period: 'Jun 2026',
    kind: 'Team',
    category: CAT['ai-ml'],
    description:
      'BERT (fine-tuned on Banking77) classifies 77 intents, DistilBERT detects distress and routes users to a human before any LLM call, and a FAISS retrieval layer grounds answers from FAQ documents. Llama 3.2 runs locally through Ollama, so no data leaves the machine.',
    techStack: ['BERT', 'DistilBERT', 'FAISS', 'LangChain', 'Ollama', 'Flask'],
    githubUrl: gh('ai_chatbot'),
  },
  {
    _id: 'clickbait-vision',
    title: 'Visual Detection of Deceptive Clickbait UI Elements',
    year: 2026,
    period: '2026',
    kind: 'Computer Vision mini project',
    category: CAT['ai-ml'],
    description:
      'A computer-vision approach to flag fake download buttons, misleading ads and intrusive pop-ups from webpage screenshots, using transfer learning on CNN/ViT feature extractors.',
    techStack: ['Python', 'OpenCV', 'Deep Learning'],
    githubUrl: gh('min_vision_project'),
  },
  {
    _id: 'securestay',
    title: 'SecureStay: Cloud-Native Hotel Booking Microservices',
    year: 2026,
    period: 'Apr 2026',
    kind: 'Team of 4',
    category: CAT['cloud-devops'],
    aws: true,
    description:
      'Microservices (auth, booking, payment, notification, gateway, frontend) with RabbitMQ events, deployed through Docker Compose, Minikube and AWS EKS with a GitHub Actions pipeline.',
    techStack: ['Node.js', 'PostgreSQL', 'RabbitMQ', 'Docker', 'Kubernetes', 'Helm', 'AWS'],
    githubUrl: gh('SecureStay'),
  },
  {
    _id: 'securestay-infra',
    title: 'SecureStay Infrastructure Pipeline',
    year: 2026,
    period: 'Apr 2026',
    kind: 'Team of 4',
    category: CAT['cloud-devops'],
    featured: true,
    aws: true,
    description:
      'The AWS platform as code: VPC, EKS, RDS, ECR and IAM with S3/DynamoDB remote state, plus a plan-on-PR, apply-on-merge pipeline with a manual production approval gate.',
    myPart:
      'Built the Terraform platform and the GitHub Actions pipeline (plan on PR, apply on merge, manual production approval, EKS health check after apply). Diagnosed an EKS pod-scheduling outage as VPC CNI IP exhaustion and fixed it by scaling nodes from 2 to 3 and enabling prefix delegation.',
    highlights: [
      'VPC, EKS, RDS, ECR and IAM defined entirely in Terraform',
      'S3 + DynamoDB remote state with locking',
      'PR → plan, merge → apply, manual approval gate for production',
      'Root-caused an outage to VPC CNI IP exhaustion and fixed it permanently',
    ],
    techStack: ['Terraform', 'AWS EKS', 'RDS', 'ECR', 'GitHub Actions'],
    githubUrl: gh('Securestay_infra-pipeline'),
  },
  {
    _id: 'devops-ai-playbook',
    title: 'DevOps AI Playbook',
    year: 2026,
    period: 'Apr 2026',
    kind: 'Individual',
    category: CAT['cloud-devops'],
    description: 'Notes and tooling that explore using AI assistance in DevOps workflows.',
    techStack: ['TypeScript'],
    githubUrl: gh('devops-ai-playbook'),
  },

  /* ───────────────────────── 2025 ───────────────────────── */
  {
    _id: 'aks-platform',
    title: 'AKS Multi-Environment Platform',
    year: 2025,
    period: 'Dec 2025',
    kind: 'The CloudAdvisory internship',
    category: CAT['cloud-devops'],
    featured: true,
    description:
      'A reusable Terraform platform on Azure Kubernetes Service where Dev, Stage and Prod deploy from identical code using workspaces and shared modules. It integrates ACR, Key Vault and a private-endpoint-only MySQL database, and every change runs through GitHub Actions.',
    myPart:
      'Modular Terraform (workspaces, shared VNet/NSG/NAT/private-endpoint modules) validated across all 3 environments. Fixed an ImagePullBackOff at the root with an AcrPull role binding in Terraform.',
    highlights: [
      'Dev, Stage and Prod from identical code via workspaces and shared modules',
      'ACR, Key Vault and a private-endpoint-only MySQL database',
      'Every change runs through GitHub Actions',
    ],
    techStack: ['Terraform', 'Azure AKS', 'ACR', 'Key Vault', 'GitHub Actions'],
    githubUrl: gh('aks-terraform-project'),
  },
  {
    _id: 'dmi-work',
    title: 'DevOps Micro Internship Labs',
    year: 2025,
    period: 'Oct – Nov 2025',
    kind: "The CloudAdvisory's DevOps Micro Internship",
    category: CAT['cloud-devops'],
    description:
      'Hands-on repositories from the internship covering Terraform, CI/CD, Docker and Kubernetes, plus interview notes.',
    techStack: ['Terraform', 'Docker', 'Kubernetes', 'GitHub Actions'],
    githubUrl: gh('DevOps-Micro-Internship'),
    links: [
      { label: 'Terraform', url: gh('DMI_Terraform') },
      { label: 'CI/CD', url: gh('DMI_CI_CD') },
      { label: 'Docker demo', url: gh('Docker-Demo') },
      { label: 'Kubernetes', url: gh('kubernetes_practise') },
      { label: 'Interview notes', url: gh('devops-micro-internship-interviews') },
    ],
  },
  {
    _id: 'groomease',
    title: 'GroomEase SaaS Platform',
    year: 2025,
    period: 'May – Nov 2025',
    kind: 'Boffo System Labs internship',
    category: CAT['software'],
    description:
      'Multi-tenant salon-management platform with 5 user roles (Angular, .NET 8, PostgreSQL). Company repository, private.',
    myPart:
      'Role-based access and navigation, Docker containerisation, Terraform / Ansible / Azure DevOps pipelines, and a Selenium + TestNG UI regression suite (11+ cases, all 5 roles).',
    techStack: ['Angular', '.NET', 'PostgreSQL', 'Docker', 'Terraform', 'Ansible', 'Selenium'],
  },
  {
    _id: 'fullstack-blog',
    title: 'Fullstack Blog App: Terraform + Docker on AWS',
    year: 2025,
    period: 'Apr 2025',
    kind: 'Individual',
    category: CAT['cloud-devops'],
    aws: true,
    description:
      'Terraform provisions an EC2 instance and security group, a user_data script installs Docker, and Docker Compose runs the React, Express and MongoDB containers as one unit.',
    myPart:
      'Root-caused Vite env vars "not working" (compile-time, not runtime) and fixed it with Docker build ARGs.',
    techStack: ['Terraform', 'AWS EC2', 'Docker Compose', 'React', 'Express', 'MongoDB'],
    githubUrl: gh('Fullstack_Blog_Application'),
  },
  {
    _id: 'calm-mind',
    title: 'Stress Management System: Calm Mind',
    year: 2025,
    period: 'May 2025',
    kind: 'Software project',
    category: CAT['software'],
    description:
      'Web and mobile apps sharing one backend, with time-management tools and an admin panel. I led the Figma design, built backend APIs and coordinated sprints in Jira.',
    techStack: ['Node.js', 'React', 'Flutter', 'MongoDB', 'Render'],
    githubUrl: gh('StressfreeZone_Web'),
    links: [
      { label: 'Mobile', url: gh('StressFreeZone_mobile') },
      { label: 'Figma', url: 'https://www.figma.com/design/sFPOhTnwgbLJ8LL4O13wAo/Figma-design?m=auto&t=AZPlJ5lml3tD6DfL-1' },
      { label: 'Jira', url: 'https://cyber-junction.atlassian.net/jira/software/projects/SFZ/summary' },
    ],
  },
  {
    _id: 'antisleep',
    title: 'AntiSleep Alarm & Smart Glasses for Blind People',
    year: 2025,
    period: 'Jan 2025',
    kind: 'Eminance 4.0 competition',
    category: CAT['software'],
    description: 'Arduino device that detects a sleeping driver and sounds an alert.',
    techStack: ['Arduino Nano', 'IR sensor', 'Ultrasonic sensor'],
    githubUrl: gh('Eminance-4.0_competition'),
  },

  /* ───────────────── More projects (2024 – 2025) ───────────────── */
  {
    _id: 'quiz-app',
    title: 'Online Quiz App',
    year: 2025,
    period: '2025–26',
    kind: 'Individual',
    category: CAT['software'],
    description: 'Online quiz platform with a Spring Boot API and React front end.',
    techStack: ['Java', 'Spring Boot', 'MySQL', 'React'],
    githubUrl: gh('Online_quiz_App'),
  },
  {
    _id: 'selenium-cucumber',
    title: 'Selenium + Cucumber Test Automation',
    year: 2025,
    period: '2025',
    kind: 'Individual',
    category: CAT['software'],
    description: 'BDD-style UI test automation suite.',
    techStack: ['Java', 'Selenium', 'Cucumber'],
    githubUrl: gh('selenium_cucumber_test_automation'),
  },
  {
    _id: 'epicbook',
    title: 'The EpicBook & Book Review Infra',
    year: 2025,
    period: '2025',
    kind: 'DevOps Micro Internship',
    category: CAT['cloud-devops'],
    description: 'A sample application plus the Terraform infrastructure that hosts it.',
    techStack: ['Handlebars', 'Terraform'],
    githubUrl: gh('theepicbook'),
    links: [{ label: 'Book Review Infra', url: gh('book-review-infra') }],
  },
  {
    _id: 'todo-app',
    title: 'To-Do App',
    year: 2025,
    period: '2025',
    kind: 'Individual',
    category: CAT['software'],
    description: 'JavaScript CRUD to-do application.',
    techStack: ['JavaScript'],
    githubUrl: gh('todo_App'),
  },
  {
    _id: 'exam-system',
    title: 'Network Programming: Online Examination System',
    year: 2025,
    period: '2025',
    kind: 'University module',
    category: CAT['software'],
    description: 'Client/server online examination system built with Java networking.',
    techStack: ['Java'],
    githubUrl: gh('Network-programming-Online-Examination-System'),
  },
  {
    _id: 'finance-tracker',
    title: 'Personal Finance Tracker',
    year: 2024,
    period: '2024',
    kind: 'Individual',
    category: CAT['software'],
    description: 'Track income and expenses in the browser.',
    techStack: ['HTML', 'CSS', 'JavaScript'],
    githubUrl: gh('trackme'),
  },
  {
    _id: 'student-registration',
    title: 'Student Registration System',
    year: 2024,
    period: '2024',
    kind: 'University module',
    category: CAT['software'],
    description: 'Desktop registration system built with WPF and MVVM.',
    techStack: ['C#', 'WPF', 'MVVM', 'SQLite'],
    githubUrl: gh('Student_Registration_System-WPF-4624-4608-'),
  },
  {
    _id: 'supermarket-db',
    title: 'Supermarket Management Database',
    year: 2024,
    period: '2024',
    kind: 'University module',
    category: CAT['software'],
    description: 'Graph-database design for a supermarket, modelled in Neo4j.',
    techStack: ['Neo4j', 'Cypher'],
    githubUrl: gh('Supermarket-management-System-Database-Project-'),
  },
  {
    _id: 'ipl-prediction',
    title: 'IPL Win Prediction',
    year: 2024,
    period: '2024',
    kind: 'Machine learning project',
    category: CAT['ai-ml'],
    description: 'Match-winner prediction model reaching 80%+ accuracy.',
    techStack: ['Python', 'scikit-learn'],
    githubUrl: 'https://github.com/Parakkrama24/machinelaerningProject',
  },
];

/** Adds any images dropped into src/media/projects (see src/media/README.md). */
export const PROJECTS = withMedia(PROJECT_LIST, 'projects');

export const getProject = (id) => PROJECTS.find((p) => p._id === id);

export const FEATURED_PROJECTS = PROJECTS.filter((p) => p.featured);
