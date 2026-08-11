import React, { useEffect } from 'react';
import SyllabusHero from '../components/syllabus/SyllabusHero';
import SyllabusList from '../components/syllabus/SyllabusList';

export default function Syllabus() {
  
  // Forces scroll reset on mount for smooth Lenis/GSAP integration
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="w-full bg-[var(--background)] min-h-screen selection:bg-[var(--accent)] selection:text-[var(--primary-base)]">
      
      {/* 1. Cinematic Editorial Hero */}
      <SyllabusHero />

      {/* 2. Interactive Academic Archive List */}
      <SyllabusList />
      
    </main>
  );
}