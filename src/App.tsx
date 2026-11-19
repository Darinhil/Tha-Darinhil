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
import { useLenisScroll } from './hooks/useLenisScroll';
import { useMotionProfile } from './hooks/useMotionProfile';
import type { ProjectItem } from './lib/portfolioUtils';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const motionProfile = useMotionProfile();
  const reducedMotion = motionProfile.tier === 'reduced';
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const mainRef = useRef<HTMLElement>(null);

  const lenisRef = useLenisScroll(
    !reducedMotion && motionProfile.tier !== 'mobile' && !selectedProject
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
      <div className="relative min-h-screen bg-[#06070A] text-[#F4F6F9]">
        {/* Very light ambient grain texture */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-30 opacity-[0.025] bg-grain-texture"
        />

        <CustomCursor enabled={motionProfile.enableCustomCursor && !selectedProject} />
        <ScrollProgress />

        <Navbar reducedMotion={reducedMotion} onNavigate={handleNavigate} />

        <main ref={mainRef}>
          <HeroSection
            ready
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
