import React, { useEffect } from 'react';
import RulesHero from '../components/rules/RulesHero';
import RulesGeneral from '../components/rules/RulesGeneral';
import RulesPolicies from '../components/rules/RulesPolicies';

export default function Rules() {
  
  // Forces the browser to start at the top of the page on route change.
  // This is crucial for GSAP ScrollTrigger to calculate starting positions accurately.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="w-full bg-[var(--background)] min-h-screen selection:bg-[var(--accent)] selection:text-[var(--primary-base)]">
      
      {/* The Stark Typographic Hero */}
      <RulesHero />

      {/* The Dark Sticky General Guidelines */}
      <RulesGeneral />

      {/* The Light Scroll-Spy Policies & Uniform Split */}
      <RulesPolicies />
      
    </main>
  );
}