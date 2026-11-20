import type { ProjectItem, SkillItem } from '../lib/portfolioUtils';

export const PROFILE = {
  name: 'Tha Darinhil',
  role: 'Full-Stack Developer',
  // Roles the hero types and backspaces through, in order
  typedRoles: ['Full-Stack Developer', 'Frontend Developer', 'Backend Developer', 'REST API Developer'],
  headline: 'Building Digital Experiences From Frontend to Backend.',
  subheadline:
    'I design and develop modern, scalable, and user-focused digital experiences, combining creative frontend interfaces with reliable backend architecture.',
  education: 'Passerelles Numériques Cambodia (PNC)',
  internship: 'Live&Learn Cambodia',
  location: 'Phnom Penh, Cambodia',
  email: 'thadarinhil@gmail.com',
  githubUrl: 'https://github.com/thadarinhil',
  linkedinUrl: 'https://www.linkedin.com/in/tha-darinhil',
  workspaceImage: '/src/assets/images/picture.jpg',
  heroIllustration: '/src/assets/images/hero-3d.webp',
  aboutIllustration: '/src/assets/images/about-3d.webp',
  workIllustration: '/src/assets/images/work-3d.webp',
  skillsIllustration: '/src/assets/images/skill-3d.webp',
  experienceIllustration: '/src/assets/images/experience-3d.webp',
  servicesIllustration: '/src/assets/images/services-3d.webp',
} as const;

export const HERO_FLOATING_TECH = [
  { label: 'Vue.js', layer: 'Frontend', x: '6%', y: '14%', depth: 1.1 },
  { label: 'Laravel', layer: 'Backend', x: '70%', y: '10%', depth: 1.4 },
  { label: 'PHP', layer: 'Server', x: '78%', y: '48%', depth: 0.9 },
  { label: 'JavaScript', layer: 'Interactive', x: '8%', y: '68%', depth: 1.2 },
  { label: 'MySQL', layer: 'Database', x: '66%', y: '82%', depth: 1.0 },
  { label: 'Node.js', layer: 'Runtime', x: '22%', y: '86%', depth: 1.3 },
] as const;

// Ordered to match the section order on the page
export const NAV_LINKS = [
  { id: 'projects', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'services', label: 'Services' },
] as const;

export const SKILLS: SkillItem[] = [
  // Frontend
  {
    id: 'html5',
    name: 'HTML5',
    category: 'frontend',
    role: 'Semantic Markup',
    summary: 'Accessible document structure, landmarks, and SEO-friendly templates.',
  },
  {
    id: 'css3',
    name: 'CSS3',
    category: 'frontend',
    role: 'Layout & Motion',
    summary: 'Modern Grid, Flexbox, responsive systems, and hardware-accelerated styling.',
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    category: 'frontend',
    role: 'Core Scripting',
    summary: 'Asynchronous workflows, DOM orchestration, and modular ES2022+ logic.',
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'frontend',
    role: 'Type Safety',
    summary: 'Strict interfaces, predictable state contracts, and scalable codebases.',
  },
  {
    id: 'vuejs',
    name: 'Vue.js',
    category: 'frontend',
    role: 'Reactive UI',
    summary: 'Component-driven SPAs, composable logic, and reactive data binding.',
  },
  {
    id: 'reactjs',
    name: 'React.js',
    category: 'frontend',
    role: 'Interface Engineering',
    summary: 'Modular hooks, state architecture, and smooth animated user interfaces.',
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    category: 'frontend',
    role: 'Design Systems',
    summary: 'Utility-first styling with crisp spacing scales and consistent design tokens.',
  },
  {
    id: 'bootstrap',
    name: 'Bootstrap',
    category: 'frontend',
    role: 'Rapid UI',
    summary: 'Structured responsive grids and clean institutional interface components.',
  },

  // Backend
  {
    id: 'php',
    name: 'PHP',
    category: 'backend',
    role: 'Server Logic',
    summary: 'Object-oriented backend workflows, authentication, and MVC patterns.',
  },
  {
    id: 'laravel',
    name: 'Laravel',
    category: 'backend',
    role: 'Full-Stack Framework',
    summary: 'Eloquent ORM, RESTful controllers, migrations, middleware, and validation.',
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    category: 'backend',
    role: 'Server Runtime',
    summary: 'Event-driven backend services and full-stack JavaScript tooling.',
  },
  {
    id: 'expressjs',
    name: 'Express.js',
    category: 'backend',
    role: 'API Routing',
    summary: 'Lightweight middleware pipelines, structured routes, and JSON APIs.',
  },
  {
    id: 'rest-apis',
    name: 'REST APIs',
    category: 'backend',
    role: 'Service Integration',
    summary: 'Resource-oriented endpoints, status semantics, and token authentication.',
  },

  // Database
  {
    id: 'mysql',
    name: 'MySQL',
    category: 'database',
    role: 'Relational Modeling',
    summary: 'Normalized schemas, foreign-key integrity, and optimized SQL queries.',
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    category: 'database',
    role: 'Structured Storage',
    summary: 'Complex relational queries, constraints, and transactional reliability.',
  },
  {
    id: 'sqlite',
    name: 'SQLite',
    category: 'database',
    role: 'Embedded Data',
    summary: 'Fast local persistence for lightweight services and rapid prototyping.',
  },

  // Tools
  {
    id: 'git',
    name: 'Git',
    category: 'tools',
    role: 'Version Control',
    summary: 'Branching workflows, clean commit history, and conflict resolution.',
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'tools',
    role: 'Code Collaboration',
    summary: 'Pull requests, code reviews, issue tracking, and repository management.',
  },
  {
    id: 'gitlab',
    name: 'GitLab',
    category: 'tools',
    role: 'Team Workflows',
    summary: 'Merge request pipelines and structured academic & team delivery.',
  },
  {
    id: 'postman',
    name: 'Postman',
    category: 'tools',
    role: 'API Testing',
    summary: 'Endpoint collections, payload verification, and environment testing.',
  },
  {
    id: 'figma',
    name: 'Figma',
    category: 'tools',
    role: 'UI/UX Prototyping',
    summary: 'Wireframes, component systems, and developer-ready design handoffs.',
  },
  {
    id: 'docker',
    name: 'Docker',
    category: 'tools',
    role: 'Containerization',
    summary: 'Consistent local development environments and service orchestration.',
  },
  {
    id: 'vscode',
    name: 'VS Code',
    category: 'tools',
    role: 'Primary IDE',
    summary: 'Streamlined debugging, linting, and multi-stack workspace configuration.',
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'student-leave-management',
    title: 'Student Leave Management System',
    categoryLabel: 'Institutional Workflow App',
    roleSummary: 'CRUD Features, REST APIs & Responsive Pages',
    focus: 'backend',
    year: 'Jul 2026',
    shortDescription:
      'Submit, manage, and track student leave requests with full leave history.',
    architectureOverview:
      'CRUD modules for leave requests and leave types sit behind REST APIs for creating, updating, and retrieving requests. Responsive pages let students submit requests and review their leave history on any device.',
    stack: ['PHP', 'Laravel', 'JavaScript', 'MySQL', 'Bootstrap', 'REST APIs'],
    features: [
      'CRUD features for managing leave requests and leave types',
      'REST APIs for creating, updating, and retrieving leave requests',
      'Responsive pages for submitting leave requests and viewing leave history',
    ],
    imageUrl: '/src/assets/images/project_student_leave_1795070796555.jpg',
    imageAlt: 'Student Leave Management System web portal interface mockup',
    githubUrl: 'https://github.com/thadarinhil',
    liveUrl: '', // add the deployed link here
    demoMode: 'leave',
  },
  {
    id: 'mr-fixer',
    title: 'Mr. Fixer',
    categoryLabel: 'Home Services Booking Platform',
    roleSummary: 'Developer & QA Tester',
    focus: 'full-stack',
    year: 'Mar – Apr 2026',
    shortDescription:
      'Book home repair services: plumbing, electrical, cleaning, and maintenance.',
    architectureOverview:
      'A React.js frontend backed by a Node.js API with MySQL for data and Redis for fast access. Built as a team, working as both developer and QA tester, with Git, GitHub, Jira, Figma, Postman, and VS Code across the workflow.',
    stack: ['React.js', 'Node.js', 'MySQL', 'Redis', 'Jira', 'Figma', 'Postman'],
    features: [
      'Web app for booking home repair services: plumbing, electrical, cleaning, and maintenance',
      'Worked as both developer and QA tester',
      'Built with React.js, Node.js, MySQL, and Redis',
      'Collaborated with teammates using Git, GitHub, Jira, Figma, Postman, and VS Code',
    ],
    imageUrl: '/src/assets/images/projects/mr-fixer.svg',
    imageAlt: 'Mr. Fixer home repair booking app interface',
    githubUrl: 'https://github.com/thadarinhil',
    liveUrl: '', // add the deployed link here
    demoMode: 'booking',
  },
  {
    id: 'expense-tracker',
    title: 'Expense Tracker',
    categoryLabel: 'Team Web Application',
    roleSummary: 'Team Lead: Planning, Task Distribution & Development',
    focus: 'frontend',
    year: 'Jan 2026',
    shortDescription:
      'Track income and spending, led as a team from planning to delivery.',
    architectureOverview:
      'A client-side web application built with HTML, CSS, and JavaScript. As team lead, I handled project planning, distributed tasks across the team, and kept the development workflow on track.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    features: [
      'Led a team to develop an Expense Tracker web application',
      'Managed project planning, task distribution, and development workflow',
      'Built with HTML, CSS, and JavaScript',
    ],
    imageUrl: '/src/assets/images/projects/expense-tracker.svg',
    imageAlt: 'Expense Tracker dashboard interface',
    githubUrl: 'https://github.com/thadarinhil',
    liveUrl: '', // add the deployed link here
    demoMode: 'finance',
  },
  {
    id: 'anime-shop',
    title: 'Anime Shop',
    categoryLabel: 'Web Design Project',
    roleSummary: 'Responsive E-commerce UI & Reusable Components',
    focus: 'frontend',
    year: 'Sep – Oct 2025',
    shortDescription:
      'Responsive e-commerce interfaces for browsing and managing products.',
    architectureOverview:
      'A responsive storefront built from reusable UI components and flexible layouts, styled with modern CSS and Tailwind CSS so browsing and product management work smoothly on every screen size.',
    stack: ['HTML', 'CSS', 'Tailwind CSS'],
    features: [
      'Responsive e-commerce interfaces for browsing and managing products',
      'Reusable UI components and responsive layouts',
      'Modern CSS and Tailwind CSS techniques',
    ],
    imageUrl: '/src/assets/images/projects/anime-shop.svg',
    imageAlt: 'Anime Shop storefront interface',
    githubUrl: 'https://github.com/thadarinhil',
    liveUrl: '', // add the deployed link here
    demoMode: 'ecommerce',
  },
  {
    id: 'event-registration-system',
    title: 'Event Registration System',
    categoryLabel: 'Full-Stack Web Platform',
    roleSummary: 'End-to-End Full-Stack Architecture, UI & MySQL Schema',
    focus: 'full-stack',
    year: '2025',
    shortDescription:
      'Event discovery, attendee registration, and schedules with live capacity tracking.',
    architectureOverview:
      'Architected with a clear separation between the reactive frontend dashboard and a RESTful backend service. Handles attendee registration validation, seat availability checks, and organized schedule timelines backed by normalized MySQL tables.',
    stack: ['Vue.js', 'Laravel', 'PHP', 'MySQL', 'Tailwind CSS', 'REST APIs'],
    features: [
      'Event creation, schedule publishing, and attendee capacity limits',
      'Streamlined attendee registration flow with duplicate-entry protection',
      'Organizer dashboard with attendance status filtering and quick search',
      'Relational MySQL schema linking events, sessions, and registered participants',
    ],
    imageUrl: '/src/assets/images/project_event_registration_1795070796276.jpg',
    imageAlt: 'Event Registration System web application interface mockup',
    githubUrl: 'https://github.com/thadarinhil',
    liveUrl: '', // add the deployed link here
    demoMode: 'event',
  },
];

export interface TimelineEntry {
  id: string;
  period: string;
  title: string;
  organization: string;
  type: 'Education' | 'Experience' | 'Craft';
  description: string;
  highlights: string[];
}

export const TIMELINE_ENTRIES: TimelineEntry[] = [
  {
    id: 'pnc-education',
    period: 'Education',
    title: 'Web & Software Development Program',
    organization: 'Passerelles Numériques Cambodia (PNC)',
    type: 'Education',
    description:
      'Intensive training in full-stack engineering, databases, and agile teamwork.',
    highlights: [
      'Frontend: HTML, CSS, JavaScript, TypeScript, Vue.js, React',
      'Backend & REST APIs: PHP, Laravel, Node.js, Express.js',
      'Databases: MySQL and PostgreSQL modeling',
    ],
  },
  {
    id: 'live-and-learn',
    period: 'Internship',
    title: 'Full-Stack Developer Intern',
    organization: 'Live&Learn Cambodia',
    type: 'Experience',
    description:
      'Built real-world web features, from UI/UX design to backend logic.',
    highlights: [
      'Built, tested, and shipped features with the team',
      'Turned Figma designs into responsive, accessible UI',
      'Connected frontend views to APIs and databases',
    ],
  },
  {
    id: 'fullstack-craft',
    period: 'Ongoing Focus',
    title: 'Full-Stack Architecture & UI/UX Craft',
    organization: 'Independent Projects & Engineering',
    type: 'Craft',
    description:
      'Designing and shipping complete web systems, from schema to interface.',
    highlights: [
      'Leave management, home-service booking, and e-commerce builds',
      'Clean workflows with Git, Postman, and Docker',
      'Focused on performance and responsive design',
    ],
  },
];

export interface ServiceItem {
  id: string;
  index: string;
  title: string;
  description: string;
  deliverables: string;
}

export const SERVICES: ServiceItem[] = [
  {
    id: 'full-stack-web',
    index: '01.',
    title: 'Full-Stack Web Development',
    description:
      'Complete web apps, from database schema to polished UI.',
    deliverables: 'Laravel · Vue.js / React · MySQL',
  },
  {
    id: 'frontend-dev',
    index: '02.',
    title: 'Frontend Development',
    description:
      'Component-driven SPAs with clean state and smooth motion.',
    deliverables: 'Vue.js · React.js · JavaScript · TypeScript',
  },
  {
    id: 'backend-dev',
    index: '03.',
    title: 'Backend Development',
    description:
      'Secure server logic: auth, roles, workflows, validation.',
    deliverables: 'PHP · Laravel · Node.js · Express.js',
  },
  {
    id: 'rest-api',
    index: '04.',
    title: 'REST API Development',
    description:
      'Predictable JSON APIs, tested end to end.',
    deliverables: 'REST APIs · Laravel · Express.js · Postman',
  },
  {
    id: 'database-design',
    index: '05.',
    title: 'Database Design',
    description:
      'Normalized data models with fast, reliable queries.',
    deliverables: 'MySQL · PostgreSQL · SQLite',
  },
  {
    id: 'responsive-ui',
    index: '06.',
    title: 'Responsive UI Implementation',
    description:
      'Figma designs turned into accessible, mobile-ready UI.',
    deliverables: 'Figma · Tailwind CSS · Bootstrap · HTML5 / CSS3',
  },
];
