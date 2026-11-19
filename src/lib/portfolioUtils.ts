export type SkillCategory = 'all' | 'frontend' | 'backend' | 'database' | 'tools';
export type ProjectFocusFilter = 'all' | 'full-stack' | 'frontend' | 'backend';

export interface SkillItem {
  id: string;
  name: string;
  category: Exclude<SkillCategory, 'all'>;
  role: string;
  summary: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  categoryLabel: string;
  roleSummary: string;
  focus: Exclude<ProjectFocusFilter, 'all'>;
  year: string;
  shortDescription: string;
  architectureOverview: string;
  stack: string[];
  features: string[];
  imageUrl: string;
  imageAlt: string;
  githubUrl: string;
  demoMode: 'event' | 'leave' | 'ecommerce';
}

export interface ContactFormValues {
  name: string;
  email: string;
  topic: string;
  message: string;
}

export interface ContactValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof ContactFormValues, string>>;
}

export interface SectionBound {
  id: string;
  top: number;
  height: number;
}

export function filterSkillsByCategory(
  skills: SkillItem[],
  category: SkillCategory
): SkillItem[] {
  if (category === 'all') {
    return skills;
  }
  return skills.filter((skill) => skill.category === category);
}

export function filterProjectsByFocus(
  projects: ProjectItem[],
  focus: ProjectFocusFilter
): ProjectItem[] {
  if (focus === 'all') {
    return projects;
  }
  return projects.filter((project) => project.focus === focus);
}

export function validateContactForm(values: ContactFormValues): ContactValidationResult {
  const errors: Partial<Record<keyof ContactFormValues, string>> = {};
  const trimmedName = values.name.trim();
  const trimmedEmail = values.email.trim();
  const trimmedMessage = values.message.trim();

  if (trimmedName.length < 2) {
    errors.name = 'Please enter your name (at least 2 characters).';
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(trimmedEmail)) {
    errors.email = 'Please provide a valid email address.';
  }

  if (!values.topic.trim()) {
    errors.topic = 'Please select a project topic.';
  }

  if (trimmedMessage.length < 12) {
    errors.message = 'Please share a brief message (at least 12 characters).';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function resolveActiveSection(
  scrollY: number,
  sections: SectionBound[],
  headerOffset = 140
): string {
  if (sections.length === 0) {
    return '';
  }

  const sorted = [...sections].sort((a, b) => a.top - b.top);
  const probe = scrollY + headerOffset;
  let activeId = sorted[0].id;

  for (const section of sorted) {
    if (probe >= section.top) {
      activeId = section.id;
    }
  }

  return activeId;
}
