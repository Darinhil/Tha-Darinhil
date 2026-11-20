import { Code2 } from 'lucide-react';

const FACES = ['front', 'back', 'right', 'left', 'top', 'bottom'] as const;
const SIDES = new Set<string>(['front', 'back', 'right', 'left']);

// Twinkling stars scattered around the cube (positions in % of the scene box)
const STARS = [
  { x: 6, y: 18, d: 0 },
  { x: 88, y: 10, d: 0.8 },
  { x: 18, y: 78, d: 1.6 },
  { x: 94, y: 64, d: 2.4 },
  { x: 52, y: 4, d: 1.2 },
  { x: 72, y: 90, d: 2 },
  { x: 2, y: 50, d: 2.8 },
];

/**
 * Decorative 3D "dev crystal": a glass cube with a glowing core spinning the other way,
 * circled by an orbit ring. Floats in a loop, coloured by the active theme.
 */
export function FloatingCube({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`cube-scene force-dark pointer-events-none relative ${className}`}>
      {STARS.map((star) => (
        <span
          key={`${star.x}-${star.y}`}
          className="cube-star absolute h-1 w-1 rounded-full bg-brand-300"
          style={{ left: `${star.x}%`, top: `${star.y}%`, animationDelay: `${star.d}s` }}
        />
      ))}

      {/* Light bloom behind the crystal */}
      <div className="cube-glow absolute inset-[14%] rounded-full" />

      <div className="cube-float absolute inset-0 flex items-center justify-center">
        <div className="cube-orbit">
          <span className="cube-orbit-dot" />
        </div>

        <div className="cube">
          {FACES.map((face) => (
            <div key={face} className={`cube-face cube-face--${face}`} />
          ))}

          <div className="cube-core">
            {FACES.map((face) => (
              <div key={face} className={`cube-core-face cube-face--${face}`}>
                {SIDES.has(face) && <Code2 className="h-1/2 w-1/2 text-white" strokeWidth={2.5} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Soft shadow that breathes with the float */}
      <div className="cube-shadow absolute bottom-0 left-1/2 h-3 w-1/2 -translate-x-1/2 rounded-[50%] bg-brand-600/40 blur-md" />
    </div>
  );
}
