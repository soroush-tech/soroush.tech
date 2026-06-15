export const languages: Array<{ name: string; level: string; accent: boolean }> = [
  { name: 'TypeScript', level: 'Expert', accent: true },
  { name: 'JavaScript (ES6+)', level: 'Legacy', accent: true },
  { name: 'Rust', level: 'Mid', accent: false },
  { name: 'Python', level: 'Mid', accent: false },
]

export const frameworks = [
  'React',
  'Next.js',
  'React Native',
  'Electron',
  'NestJs',
  'Node.js',
  'RabitMq',
  'Swagger',
] as const

export const deploymentTags = [
  'Github Actions',
  'Docker',
  'Kubernetes',
  'Terraform',
  'Ansible',
  'AWS/GCP',
  'Jenkins',
  'CircleCI',
  'Nginx',
] as const

export const qaTags = ['Vitest', 'Cypress', 'Playwright', 'Storybook', 'JMeter'] as const
