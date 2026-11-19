import type { ProjectItem, SkillItem } from '../lib/portfolioUtils';

export const PROFILE = {
  name: 'Tha Darinhil',
  role: 'Full-Stack Developer',
  headline: 'Building Digital Experiences From Frontend to Backend.',
  subheadline:
    'I design and develop modern, scalable, and user-focused digital experiences, combining creative frontend interfaces with reliable backend architecture.',
  education: 'Passerelles Numériques Cambodia (PNC)',
  internship: 'Live&Learn Cambodia',
  location: 'Phnom Penh, Cambodia',
  email: 'darinhil.tha@student.passerellesnumeriques.org',
  githubUrl: 'https://github.com/thadarinhil',
  linkedinUrl: 'https://www.linkedin.com/in/tha-darinhil',
  workspaceImage: '/src/assets/images/developer_workspace_portrait_1795070796272.jpg',
} as const;

export const HERO_FLOATING_TECH = [
  { label: 'Vue.js', layer: 'Frontend', x: '6%', y: '14%', depth: 1.1 },
  { label: 'Laravel', layer: 'Backend', x: '70%', y: '10%', depth: 1.4 },
  { label: 'PHP', layer: 'Server', x: '78%', y: '48%', depth: 0.9 },
  { label: 'JavaScript', layer: 'Interactive', x: '8%', y: '68%', depth: 1.2 },
  { label: 'MySQL', layer: 'Database', x: '66%', y: '82%', depth: 1.0 },
  { label: 'Node.js', layer: 'Runtime', x: '22%', y: '86%', depth: 1.3 },
] as const;

export const NAV_LINKS = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
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
    id: 'event-registration-system',
    title: 'Event Registration System',
    categoryLabel: 'Full-Stack Web Platform',
    roleSummary: 'End-to-End Full-Stack Architecture, UI & MySQL Schema',
    focus: 'full-stack',
    year: '2025',
    shortDescription:
      'End-to-end event discovery, attendee registration, and schedule management platform built for seamless organizer workflows and real-time capacity tracking.',
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
    demoMode: 'event',
  },
  {
    id: 'student-leave-management',
    title: 'Student Leave Management System',
    categoryLabel: 'Institutional Workflow App',
    roleSummary: 'Backend Workflow Logic, Role Permissions & Database Design',
    focus: 'backend',
    year: '2025',
    shortDescription:
      'Role-based academic portal streamlining student leave requests, advisor review queues, and transparent approval tracking.',
    architectureOverview:
      'Designed around structured state transitions for leave applications (Submitted, Under Review, Approved, Declined). Implements role-aware views for students and academic coordinators with clear audit trails and leave balance summaries.',
    stack: ['PHP', 'Laravel', 'JavaScript', 'MySQL', 'Bootstrap', 'REST APIs'],
    features: [
      'Structured student leave request form with date-range and category validation',
      'Multi-stage review workflow for academic advisors and administrators',
      'Instant status visibility and personal leave balance breakdown',
      'Centralized request table with status filtering and history logs',
    ],
    imageUrl: '/src/assets/images/project_student_leave_1795070796555.jpg',
    imageAlt: 'Student Leave Management System web portal interface mockup',
    githubUrl: 'https://github.com/thadarinhil',
    demoMode: 'leave',
  },
  {
    id: 'ecommerce-application',
    title: 'E-commerce Application',
    categoryLabel: 'Full-Stack Commerce Experience',
    roleSummary: 'Responsive Storefront UI, Cart State & REST API Integration',
    focus: 'frontend',
    year: '2024',
    shortDescription:
      'Modern digital storefront combining responsive product discovery, interactive cart state management, and structured backend order processing.',
    architectureOverview:
      'Combines a fluid, component-driven storefront UI with an Express and relational database backend. Focuses on fast category filtering, persistent cart calculations, and clean checkout validation.',
    stack: ['Vue.js', 'Node.js', 'Express.js', 'MySQL', 'Tailwind CSS'],
    features: [
      'Responsive product catalog grid with category filtering and search',
      'Real-time cart drawer with quantity controls and subtotal calculation',
      'REST API endpoints for product inventory and order submission',
      'Clean UI/UX focused on visual clarity and frictionless checkout',
    ],
    imageUrl: '/src/assets/images/project_ecommerce_app_1795070796462.jpg',
    imageAlt: 'E-commerce web application storefront interface mockup',
    githubUrl: 'https://github.com/thadarinhil',
    demoMode: 'ecommerce',
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
      'Intensive technical and professional training in full-stack software engineering, relational databases, and agile team collaboration.',
    highlights: [
      'Frontend engineering with HTML5, CSS3, JavaScript, TypeScript, Vue.js, and React',
      'Backend architecture & REST APIs using PHP, Laravel, Node.js, and Express.js',
      'Database modeling, normalization, and querying across MySQL and PostgreSQL',
    ],
  },
  {
    id: 'live-and-learn',
    period: 'Internship',
    title: 'Full-Stack Developer Intern',
    organization: 'Live&Learn Cambodia',
    type: 'Experience',
    description:
      'Contributed to real-world web application development, bridging user-centered UI/UX design with dependable backend functionality.',
    highlights: [
      'Collaborated with team members to build, test, and refine production features',
      'Translated Figma layouts into responsive, accessible frontend interfaces',
      'Integrated frontend views with backend APIs and relational database records',
    ],
  },
  {
    id: 'fullstack-craft',
    period: 'Ongoing Focus',
    title: 'Full-Stack Architecture & UI/UX Craft',
    organization: 'Independent Projects & Engineering',
    type: 'Craft',
    description:
      'Designing and shipping complete web systems—from database schema design and API contracts to smooth, interactive frontend experiences.',
    highlights: [
      'End-to-end delivery across Event Registration, Leave Management, and E-commerce systems',
      'Clean code practices using Git, GitHub, GitLab, Postman, and Docker',
      'Focused on performance, responsiveness, and thoughtful motion design',
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
      'Complete web applications engineered from database schema to polished user interface, built for maintainability and real-world scale.',
    deliverables: 'Laravel · Vue.js / React · MySQL',
  },
  {
    id: 'frontend-dev',
    index: '02.',
    title: 'Frontend Development',
    description:
      'Modular single-page applications with clean component architecture, reactive state management, and refined motion interactions.',
    deliverables: 'Vue.js · React.js · JavaScript · TypeScript',
  },
  {
    id: 'backend-dev',
    index: '03.',
    title: 'Backend Development',
    description:
      'Dependable server-side architecture covering authentication, role-based permissions, business workflows, and structured validation.',
    deliverables: 'PHP · Laravel · Node.js · Express.js',
  },
  {
    id: 'rest-api',
    index: '04.',
    title: 'REST API Development',
    description:
      'Resource-oriented JSON endpoints with predictable status semantics, middleware pipelines, and thorough Postman verification.',
    deliverables: 'REST APIs · Laravel · Express.js · Postman',
  },
  {
    id: 'database-design',
    index: '05.',
    title: 'Database Design',
    description:
      'Normalized relational data models, foreign-key integrity, and optimized query patterns tailored to application workflows.',
    deliverables: 'MySQL · PostgreSQL · SQLite',
  },
  {
    id: 'responsive-ui',
    index: '06.',
    title: 'Responsive UI Implementation',
    description:
      'Translating Figma wireframes and design systems into accessible, mobile-ready interfaces with consistent spacing and contrast.',
    deliverables: 'Figma · Tailwind CSS · Bootstrap · HTML5 / CSS3',
  },
];
