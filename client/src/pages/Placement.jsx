import React, { useEffect } from 'react';
import PlacementHero from '../components/placement/PlacementHero';
import PlacementMarquee from '../components/placement/PlacementMarquee';
import PlacementRoster from '../components/placement/PlacementRoster';
import PlacementStats from '../components/placement/PlacementStats';
import { useLocation } from 'react-router-dom';
import { useLenis } from 'lenis/react';

export default function Placement() {

  const { hash } = useLocation();
  const lenis = useLenis(); // Hook into your global smooth scroller

  useEffect(() => {
    // Wait for Lenis to be ready
    if (!lenis) return;

    // ONLY execute if a hash exists. Leave normal visits to the ScrollManager!
    if (hash) {
      const timer = setTimeout(() => {
        lenis.scrollTo(hash, {
          offset: -100, 
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
        });
      }, 500); 

      return () => clearTimeout(timer);
    }
  }, [hash, lenis]);
  
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