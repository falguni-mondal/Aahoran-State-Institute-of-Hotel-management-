import React, { useEffect } from 'react';
import PlacementHero from '../components/placement/PlacementHero';
import PlacementMarquee from '../components/placement/PlacementMarquee';
import PlacementRoster from '../components/placement/PlacementRoster';
import PlacementStats from '../components/placement/PlacementStats';

export default function Placement() {
  
  // Forces scroll reset on mount for smooth Lenis/GSAP integration
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="w-full bg-[var(--background)] min-h-screen selection:bg-[var(--accent)] selection:text-[var(--primary-base)]">
      
      {/* The Immersive Executive Hero */}
      <PlacementHero />

      {/* The Infinite Industry Partners Marquee */}
      <PlacementMarquee />

      {/* The Interactive Hover-Reveal Roster */}
      <PlacementRoster />

      {/* The Animated Impact Metrics */}
      <PlacementStats />
      
    </main>
  );
}