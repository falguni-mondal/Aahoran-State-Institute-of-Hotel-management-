import React, { useEffect } from 'react';
import STHero from '../components/short-term/STHero';
import STOverview from '../components/short-term/STOverview';
import STCourseList from '../components/short-term/STCourseList';

export default function ShortTermCourses() {
  
  // Forces scroll reset on mount for smooth Lenis/GSAP integration
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="w-full bg-[var(--background)] min-h-screen selection:bg-[var(--accent)] selection:text-[var(--primary-base)]">
      
      {/* Cinematic Dark Hero */}
      <STHero />

      {/* Light Theme Universal Data Grid */}
      <STOverview />

      {/* Dark Theme Interactive Parallax Lookbook */}
      <STCourseList />
      
    </main>
  );
}