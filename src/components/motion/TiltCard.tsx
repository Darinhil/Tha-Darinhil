import { useRef, useState, type ReactNode } from 'react';
import { calculateTiltTransform } from '../../lib/motionConfig';

interface TiltCardProps {
  children: ReactNode;
  enabled: boolean;
  className?: string;
  maxTiltDeg?: number;
  onClick?: () => void;
  cursorType?: 'project' | 'button' | 'link';
  cursorLabel?: string;
}

export function TiltCard({
  children,
  enabled,
  className = '',
  maxTiltDeg = 6,
  onClick,
  cursorType,
  cursorLabel,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const normY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setTilt(calculateTiltTransform(normX, normY, maxTiltDeg));
  };

  const handleMouseEnter = () => {
    if (enabled) setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      data-cursor={cursorType}
      data-cursor-label={cursorLabel}
      className={`relative transition-transform duration-300 ease-out will-change-transform ${className}`}
      style={
        enabled
          ? {
              transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
            }
          : undefined
      }
    >
      {enabled && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
          style={{
            opacity: hovered ? 1 : 0,
            background: `radial-gradient(420px circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(59, 130, 246, 0.12), transparent 60%)`,
          }}
        />
      )}
      {children}
    </div>
  );
}
