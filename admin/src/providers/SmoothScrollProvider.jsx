import React, { createContext, useContext, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLocation } from 'react-router-dom';

// Register ScrollTrigger globally across GSAP
gsap.registerPlugin(ScrollTrigger);

const LenisContext = createContext(null);

// Custom hook to access the active Lenis instance from any page or modal
export const useLenis = () => {
  return useContext(LenisContext);
};

export const SmoothScrollProvider = ({ children }) => {
  const lenisRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    // Respect system accessibility preferences for reduced motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // Initialize Lenis with Awwwards-grade settings
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential deceleration curve
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: !prefersReducedMotion,
      touchMultiplier: 1, // Retains native touch physics to prevent mobile scroll-hijacking
      infinite: false,
    });

    lenisRef.current = lenis;

    // Synchronize Lenis scroll coordinates directly with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis off GSAP's internal ticker for a single, synchronized frame loop
    const updateTicker = (time) => {
      lenis.raf(time * 1000); // GSAP measures in seconds; Lenis requires milliseconds
    };

    gsap.ticker.add(updateTicker);
    // Disable GSAP lag smoothing to eliminate stutter when returning from idle tabs
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Reset scroll position and recalculate ScrollTrigger markers on every route transition
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => clearTimeout(refreshTimer);
  }, [location.pathname]);

  return (
    <LenisContext.Provider value={lenisRef.current}>
      {children}
    </LenisContext.Provider>
  );
};

export default SmoothScrollProvider;