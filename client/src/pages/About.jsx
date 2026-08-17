import React, { useEffect } from 'react';
import AboutHero from '../components/about/AboutHero';
import AboutVision from '../components/about/AboutVision';
import AboutIdentity from '../components/about/AboutIdentity';
import AboutFacilities from '../components/about/AboutFacilities';
import AboutFaculty from '../components/about/AboutFaculty';
import AboutRecognition from '../components/about/AboutRecognition';
import AboutCampusLife from '../components/about/AboutCampusLife';
import AboutRules from '../components/about/AboutRules';
import AboutTechTeaser from '../components/about/AboutTechTeaser';
import { useLocation } from 'react-router-dom';
import { useLenis } from 'lenis/react';

export default function About() {

  const { hash } = useLocation();
  const lenis = useLenis();

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


  return (
    <main className="w-full min-h-screen bg-[var(--background)] flex flex-col">
      <AboutHero />
      <AboutVision />
      <AboutIdentity />
      <AboutFacilities />
      <AboutFaculty />
      <AboutRecognition />
      <AboutCampusLife />
      <AboutTechTeaser />
      <AboutRules />
    </main>
  );
}