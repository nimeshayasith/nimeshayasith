const dev = (name, file) =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${name}/${file || `${name}-original`}.svg`;

export const SKILL_CATEGORIES = [
  'All',
  'Cloud',
  'IaC & CI/CD',
  'Containers',
  'Observability',
  'Languages',
  'Data & Web',
];

export const SKILLS = [
  /* Cloud */
  { name: 'AWS', level: 85, icon: dev('amazonwebservices'), category: 'Cloud' },
  { name: 'Azure', level: 75, icon: dev('azure'), category: 'Cloud' },
  { name: 'Linux', level: 82, icon: dev('linux'), category: 'Cloud' },

  /* IaC & CI/CD */
  { name: 'Terraform', level: 85, icon: dev('terraform'), category: 'IaC & CI/CD' },
  { name: 'Ansible', level: 70, icon: dev('ansible'), category: 'IaC & CI/CD' },
  { name: 'GitHub Actions', level: 85, icon: dev('githubactions'), category: 'IaC & CI/CD' },
  { name: 'Azure DevOps', level: 72, icon: dev('azuredevops'), category: 'IaC & CI/CD' },
  { name: 'Git', level: 88, icon: dev('git'), category: 'IaC & CI/CD' },

  /* Containers */
  { name: 'Docker', level: 88, icon: dev('docker'), category: 'Containers' },
  { name: 'Kubernetes', level: 78, icon: dev('kubernetes', 'kubernetes-plain'), category: 'Containers' },
  { name: 'Helm', level: 70, icon: dev('helm'), category: 'Containers' },

  /* Observability */
  { name: 'Prometheus', level: 75, icon: dev('prometheus'), category: 'Observability' },
  { name: 'Grafana', level: 75, icon: dev('grafana'), category: 'Observability' },

  /* Languages */
  { name: 'Python', level: 85, icon: dev('python'), category: 'Languages' },
  { name: 'Bash', level: 82, icon: dev('bash'), category: 'Languages' },
  { name: 'Go', level: 60, icon: dev('go'), category: 'Languages' },
  { name: 'Java', level: 70, icon: dev('java'), category: 'Languages' },
  { name: 'JavaScript', level: 82, icon: dev('javascript'), category: 'Languages' },

  /* Data & Web */
  { name: 'Kafka', level: 72, icon: dev('apachekafka'), category: 'Data & Web' },
  { name: 'Spark', level: 65, icon: dev('apachespark'), category: 'Data & Web' },
  { name: 'Airflow', level: 68, icon: dev('apacheairflow'), category: 'Data & Web' },
  { name: 'PostgreSQL', level: 78, icon: dev('postgresql'), category: 'Data & Web' },
  { name: 'React', level: 80, icon: dev('react'), category: 'Data & Web' },
  { name: 'Node.js', level: 80, icon: dev('nodejs'), category: 'Data & Web' },
];

/** Plain-English grouping used by the CloudShell `skills` / `kubectl` commands. */
export const SKILL_GROUPS = {
  'Cloud Platforms': 'AWS (EC2, EKS, Lambda, API Gateway, S3, RDS, ECR, VPC, IAM, CloudWatch) · Azure (AKS, ACR, Key Vault, MySQL, Azure DevOps)',
  'CI/CD & Automation': 'Git, GitHub Actions, Azure DevOps, PR-based plan/apply pipelines, manual approval gates, post-deploy verification',
  'Infrastructure as Code': 'Terraform (remote state, modules, workspaces), Ansible',
  'Containers & Orchestration': 'Docker, Docker Compose, Kubernetes (EKS, AKS), Helm',
  'Monitoring & Observability': 'Prometheus, Grafana, CloudWatch, health checks, alerting, structured logging',
  'Networking & Security': 'VPC/VNet design, security groups, NSGs, private endpoints, least-privilege IAM, secrets management',
  'Scripting & Linux': 'Python, Bash, Go, Linux (Ubuntu, WSL2), REST APIs',
  'Data': 'Kafka, Spark, Airflow, PostgreSQL',
};
