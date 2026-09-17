import React, { useEffect } from 'react';
import HSRTHero from '../components/hunar-se-rozgar/HSRTHero';
import HSRTHeading from '../components/hunar-se-rozgar/HSRTHeading';
import HSRTRules from '../components/hunar-se-rozgar/HSRTRules';
import HSRTGallery from '../components/hunar-se-rozgar/HSRTGallery';

export default function HunarSeRozgar() {

  return (
    <main className="w-full bg-[var(--background)] min-h-screen selection:bg-[var(--accent)] selection:text-[var(--primary-base)]">
      
      {/* Cinematic Editorial Hero */}
      <HSRTHero />

      {/* Cinematic Editorial Heading */}
      <HSRTHeading/>

      {/* Light Theme Scrolling Manifesto */}
      <HSRTRules />

      {/* Parallax Art Gallery */}
      <HSRTGallery />
      
    </main>
  );
}