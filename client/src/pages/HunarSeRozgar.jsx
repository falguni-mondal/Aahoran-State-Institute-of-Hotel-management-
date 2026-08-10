import React, { useEffect } from 'react';
import HSRTHero from '../components/hunar-se-rozgar/HSRTHero';
import HSRTRules from '../components/hunar-se-rozgar/HSRTRules';
import HSRTGallery from '../components/hunar-se-rozgar/HSRTGallery';

export default function HunarSeRozgar() {
  
  // Forces scroll reset on mount for smooth Lenis/GSAP integration
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="w-full bg-[var(--background)] min-h-screen selection:bg-[var(--accent)] selection:text-[var(--primary-base)] pt-14">
      
      {/* Cinematic Editorial Hero */}
      <HSRTHero />

      {/* Light Theme Scrolling Manifesto */}
      <HSRTRules />

      {/* Parallax Art Gallery */}
      <HSRTGallery />
      
    </main>
  );
}