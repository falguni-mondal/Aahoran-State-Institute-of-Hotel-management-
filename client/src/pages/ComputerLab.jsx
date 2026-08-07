import React, { useEffect } from 'react';
import LabHero from '../components/computer-lab/LabHero';
import LabHorizontalScroll from '../components/computer-lab/LabHorizontalScroll';
import LabOutro from '../components/computer-lab/LabOutro';

export default function ComputerLab() {
  
  // Force scroll to top on mount for perfect GSAP ScrollTrigger calculations
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="w-full bg-[var(--primary-base)] min-h-screen selection:bg-[var(--accent)] selection:text-[var(--primary-base)]">
      
      {/* Cinematic Dark Hero */}
      <LabHero />

      {/* Light Theme Pinned Horizontal Scroll */}
      <LabHorizontalScroll />

      {/* Dark Theme Magnetic Outro */}
      {/* <LabOutro /> */}
      
    </main>
  );
}