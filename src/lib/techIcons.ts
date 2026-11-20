import {
  siBootstrap,
  siCss,
  siDocker,
  siExpress,
  siFigma,
  siGit,
  siGithub,
  siGitlab,
  siHtml5,
  siJira,
  siJavascript,
  siLaravel,
  siMysql,
  siNodedotjs,
  siPhp,
  siPostgresql,
  siPostman,
  siReact,
  siRedis,
  siSqlite,
  siTailwindcss,
  siTypescript,
  siVuedotjs,
  type SimpleIcon,
} from 'simple-icons';

/** Lowercase alphanumerics only, so "Vue.js", "vuejs" and "Vue JS" all match. */
export function normalizeTechName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

const BRAND_ICONS: Record<string, SimpleIcon> = {
  html5: siHtml5,
  html: siHtml5,
  css3: siCss,
  css: siCss,
  javascript: siJavascript,
  typescript: siTypescript,
  vuejs: siVuedotjs,
  vue: siVuedotjs,
  react: siReact,
  reactjs: siReact,
  tailwind: siTailwindcss,
  tailwindcss: siTailwindcss,
  bootstrap: siBootstrap,
  php: siPhp,
  laravel: siLaravel,
  nodejs: siNodedotjs,
  node: siNodedotjs,
  express: siExpress,
  expressjs: siExpress,
  mysql: siMysql,
  redis: siRedis,
  jira: siJira,
  postgresql: siPostgresql,
  pgsql: siPostgresql,
  sqlite: siSqlite,
  git: siGit,
  github: siGithub,
  gitlab: siGitlab,
  postman: siPostman,
  figma: siFigma,
  docker: siDocker,
};

export function getBrandIcon(name: string): SimpleIcon | null {
  return BRAND_ICONS[normalizeTechName(name)] ?? null;
}

/**
 * Brand colours like Express (#0A0A0A) or GitHub (#181717) vanish on the dark
 * background, so dark hues are blended toward white until they read clearly.
 */
export function readableBrandColor(hex: string): string {
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  if (luminance >= 0.5) return `#${hex}`;
  const mix = Math.min(0.85, 0.5 - luminance + 0.3);
  const blend = (c: number) => Math.round(c + (255 - c) * mix);
  return `rgb(${blend(r)}, ${blend(g)}, ${blend(b)})`;
}

/**
 * Brand colour for the current light/dark mode: the true brand hex on light
 * surfaces, the lightened variant on dark ones (resolved via `color-scheme`).
 */
export function brandColorForMode(hex: string): string {
  return `light-dark(#${hex}, ${readableBrandColor(hex)})`;
}
