import React, { useEffect } from 'react';
import ResultsHero from '../components/results/ResultsHero';
import ResultsContent from '../components/results/ResultsContent';

export default function Results() {
  
  // Forces a hard scroll reset on mount so Lenis and GSAP ScrollTrigger 
  // calculate their start/end markers perfectly from the absolute top.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="w-full bg-[var(--background)] min-h-screen selection:bg-[var(--accent)] selection:text-[var(--primary-base)]">
      
      {/* The Cinematic Header */}
      <ResultsHero />

      {/* The Interactive Split-Screen Archive */}
      <ResultsContent />
      
    </main>
  );
}