import React, { useEffect, useRef } from 'react';
import { ReactLenis } from 'lenis/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLocation } from 'react-router-dom';

// Register ScrollTrigger globally
gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);
  const location = useLocation();

  // 1. Synchronize Lenis with GSAP Ticker
  useEffect(() => {
    function update(time) {
      // time is in seconds from GSAP, Lenis needs milliseconds
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    // Add Lenis to the GSAP animation loop
    gsap.ticker.add(update);
    
    // Disable GSAP's lag smoothing to prevent scroll jumps 
    // when the user switches browser tabs and comes back
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  // 2. Handle Route Changes (Scroll Reset & Animation Recalculation)
  useEffect(() => {
    if (lenisRef.current?.lenis) {
      // Instantly jump back to the top of the page on route change
      lenisRef.current.lenis.scrollTo(0, { immediate: true });
      
      // Force ScrollTrigger to recalculate all trigger positions 
      // based on the new page layout
      ScrollTrigger.refresh();
    }
  }, [location.pathname]);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        autoRaf: false, // Important: We are manually driving it via GSAP
        lerp: 0.1, // The interpolation amount. 0.1 is buttery smooth. Lower = heavier
        duration: 1.5, // Scroll animation duration
        syncTouch: true, // Replaces the deprecated smoothTouch. Smooths touchpads/mobiles.
      }}
    >
      {children}
    </ReactLenis>
  );
}