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

  // 1. Prevent browser from interfering with scroll position on back/forward navigation
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // 2. Synchronize Lenis with GSAP Ticker
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

  // 3. Handle Route Changes (The Bulletproof SPA Reset)
  useEffect(() => {
    if (lenisRef.current?.lenis) {
      
      // A. Instantly jump back to the top of the page on route change
      lenisRef.current.lenis.scrollTo(0, { immediate: true });
      
      // B. Tell GSAP to forget where it was scrolled to on the previous page
      ScrollTrigger.clearScrollMemory("manual");

      const scrollTimeout = setTimeout(() => {
        // C. FORCE Lenis to recalculate the exact pixel height of the NEW DOM
        lenisRef.current.lenis.resize();
        
        // D. Force GSAP to apply pinned sections and trigger math based on the new height
        ScrollTrigger.refresh();
      }, 150);

      return () => clearTimeout(scrollTimeout);
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