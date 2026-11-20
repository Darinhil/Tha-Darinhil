import { hasTechIcon, TechIcon } from './TechIcon';

interface TechChipProps {
  /** A technology name, or a pair like "Vue.js / React" */
  label: string;
  as?: 'li' | 'span';
}

export function TechChip({ label, as: Tag = 'li' }: TechChipProps) {
  const iconNames = label.split(' / ').filter(hasTechIcon);

  return (
    <Tag
      className={`group/chip inline-flex items-center gap-1.5 rounded-full bg-white/[0.045] py-1 pr-2.5 text-xs text-slate-300 ring-1 ring-inset ring-white/[0.06] transition-colors duration-300 hover:bg-white/[0.08] hover:text-white ${
        iconNames.length > 0 ? 'pl-2' : 'pl-2.5'
      }`}
    >
      {iconNames.length > 0 && (
        <span className="flex items-center -space-x-0.5">
          {iconNames.map((name) => (
            <TechIcon key={name} name={name} colored className="h-3.5 w-3.5" />
          ))}
        </span>
      )}
      {label}
    </Tag>
  );
}
