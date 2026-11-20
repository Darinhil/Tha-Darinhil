import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterProjectsByFocus,
  filterSkillsByCategory,
  resolveActiveSection,
  validateContactForm,
} from './portfolioUtils';
import { PROJECTS, SKILLS } from '../data/portfolioData';

test('filterSkillsByCategory returns all skills or specific category subset', () => {
  const all = filterSkillsByCategory(SKILLS, 'all');
  assert.equal(all.length, SKILLS.length);

  const frontend = filterSkillsByCategory(SKILLS, 'frontend');
  assert.ok(frontend.length > 0);
  assert.ok(frontend.every((s) => s.category === 'frontend'));
  assert.ok(frontend.some((s) => s.name === 'Vue.js'));
  assert.ok(frontend.some((s) => s.name === 'React.js'));

  const database = filterSkillsByCategory(SKILLS, 'database');
  assert.deepEqual(
    database.map((s) => s.name),
    ['MySQL', 'PostgreSQL', 'SQLite']
  );
});

test('filterProjectsByFocus filters projects accurately', () => {
  const all = filterProjectsByFocus(PROJECTS, 'all');
  assert.equal(all.length, 5);

  const fullStack = filterProjectsByFocus(PROJECTS, 'full-stack');
  assert.deepEqual(
    fullStack.map((p) => p.id),
    ['mr-fixer', 'event-registration-system']
  );
});

test('validateContactForm rejects empty or invalid inputs and accepts valid submissions', () => {
  const invalid = validateContactForm({
    name: 'A',
    email: 'not-an-email',
    topic: '',
    message: 'Short',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.name);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.topic);
  assert.ok(invalid.errors.message);

  const valid = validateContactForm({
    name: 'Sokha Chan',
    email: 'sokha@example.com',
    topic: 'Full-Stack Web Development',
    message: 'We would love to collaborate on a web platform.',
  });
  assert.equal(valid.valid, true);
  assert.deepEqual(valid.errors, {});
});

test('resolveActiveSection picks the deepest section above scroll probe even when unsorted', () => {
  const sections = [
    { id: 'hero', top: 0, height: 800 },
    { id: 'about', top: 1700, height: 700 },
    { id: 'projects', top: 800, height: 900 },
    { id: 'skills', top: 2400, height: 900 },
  ];

  assert.equal(resolveActiveSection(0, sections, 140), 'hero');
  assert.equal(resolveActiveSection(700, sections, 140), 'projects');
  assert.equal(resolveActiveSection(1600, sections, 140), 'about');
  assert.equal(resolveActiveSection(2300, sections, 140), 'skills');
});
