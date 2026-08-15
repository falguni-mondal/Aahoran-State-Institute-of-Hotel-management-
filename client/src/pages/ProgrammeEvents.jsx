import React, { useEffect } from 'react';
import GalleryHero from '../components/gallery/GalleryHero';
import EventsShowcase from '../components/gallery/EventsShowcase';

export default function ProgrammeEvents() {
  
  // Hard reset scroll to top on mount for GSAP/Lenis accuracy
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="w-full bg-[var(--background)] min-h-screen selection:bg-[var(--accent)] selection:text-[var(--primary-base)]">
      
      <GalleryHero 
        subtitle="Campus Life & Culture"
        title="Programme and Events."
        bgImage="/programme-and-events.webp" 
      />

      {/* The new Continuous Scroll Exhibition Engine */}
      <EventsShowcase />
      
    </main>
  );
}