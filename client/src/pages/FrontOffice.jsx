import React, { useEffect } from 'react';
import FOHero from '../components/front-office/FOHero';
import FOOverview from '../components/front-office/FOOverview';
import FOCurriculum from '../components/front-office/FOCurriculum';
import FOGallery from '../components/front-office/FOGallery';

export default function FrontOffice() {
  
  // Forces scroll reset on mount for smooth Lenis/GSAP integration
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="w-full bg-[var(--background)] min-h-screen selection:bg-[var(--accent)] selection:text-[var(--primary-base)]">
      
      {/* Cinematic Dark Hero */}
      <FOHero />

      {/* Light Theme Narrative Hook */}
      <FOOverview />

      {/* Divided Layout Curriculum */}
      <FOCurriculum />

      {/* Parallax Masonry Gallery */}
      <FOGallery />
      
    </main>
  );
}