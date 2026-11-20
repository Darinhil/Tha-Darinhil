/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionConfig } from 'motion/react';
import { CustomCursor } from './components/motion/CustomCursor';
import { ScrollProgress } from './components/motion/ScrollProgress';
import { AboutSection } from './components/sections/AboutSection';
import { ContactSection } from './components/sections/ContactSection';
import { Footer } from './components/sections/Footer';
import { HeroSection } from './components/sections/HeroSection';
import { Navbar } from './components/sections/Navbar';
import { ProjectModal } from './components/sections/ProjectModal';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { ServicesSection } from './components/sections/ServicesSection';
import { SkillsSection } from './components/sections/SkillsSection';
import { TimelineSection } from './components/sections/TimelineSection';
import { WELCOME_SEEN_KEY, WelcomeScreen } from './components/welcome/WelcomeScreen';
import { useLenisScroll } from './hooks/useLenisScroll';
import { useMotionProfile } from './hooks/useMotionProfile';
import type { ProjectItem } from './lib/portfolioUtils';

gsap.registerPlugin(ScrollTrigger);

/** Show the terminal welcome once per browser session (skip with ?autostart=1). */
function shouldShowWelcome(): boolean {
  if (new URLSearchParams(window.location.search).get('autostart') === '1') return false;
  try {
    return window.sessionStorage.getItem(WELCOME_SEEN_KEY) !== '1';
  } catch {
    return true;
  }
}

export default function App() {
  const motionProfile = useMotionProfile();
  const reducedMotion = motionProfile.tier === 'reduced';
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const mainRef = useRef<HTMLElement>(null);
  const [welcomeOpen, setWelcomeOpen] = useState(shouldShowWelcome);
  // The hero entrance plays as the welcome screen starts closing
  const [heroReady, setHeroReady] = useState(() => !welcomeOpen);

  const lenisRef = useLenisScroll(
    !reducedMotion && motionProfile.tier !== 'mobile' && !selectedProject && !welcomeOpen
  );

  useEffect(() => {
    const node = mainRef.current;
    if (!node) return;
    let rafId = 0;
    const observer = new ResizeObserver(() => {
      if (rafId) window.cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    });
    observer.observe(node);
    return () => {
      observer.disconnect();
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  // Feed pointer position to `.spotlight` cards for the cursor-following glow
  useEffect(() => {
    if (reducedMotion) return;
    const handlePointerMove = (e: PointerEvent) => {
      const target = e.target instanceof Element ? e.target : null;
      const card = target?.closest<HTMLElement>('.spotlight');
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [reducedMotion]);

  const handleNavigate = useCallback(
    (sectionId: string) => {
      const target = document.getElementById(sectionId);
      if (!target) return;

      if (lenisRef.current) {
        lenisRef.current.scrollTo(target, { offset: -20 });
      } else {
        target.scrollIntoView({
          behavior: reducedMotion ? 'auto' : 'smooth',
          block: 'start',
        });
      }
    },
    [lenisRef, reducedMotion]
  );

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen bg-canvas text-ink">
        <CustomCursor enabled={motionProfile.enableCustomCursor && !selectedProject} />
        <ScrollProgress />

        {welcomeOpen && (
          <WelcomeScreen
            reducedMotion={reducedMotion}
            onExitStart={() => setHeroReady(true)}
            onExitComplete={() => setWelcomeOpen(false)}
          />
        )}

        <Navbar reducedMotion={reducedMotion} onNavigate={handleNavigate} />

        <main ref={mainRef}>
          <HeroSection
            ready={heroReady}
            motionProfile={motionProfile}
            onNavigate={handleNavigate}
          />
          <ProjectsSection
            motionProfile={motionProfile}
            onSelectProject={setSelectedProject}
          />
          <AboutSection motionProfile={motionProfile} />
          <SkillsSection motionProfile={motionProfile} />
          <TimelineSection motionProfile={motionProfile} />
          <ServicesSection motionProfile={motionProfile} />
          <ContactSection motionProfile={motionProfile} />
        </main>

        <Footer onNavigate={handleNavigate} />

        <ProjectModal
          project={selectedProject}
          reducedMotion={reducedMotion}
          onClose={() => setSelectedProject(null)}
          onSelectProject={setSelectedProject}
        />
      </div>
    </MotionConfig>
  );
}
