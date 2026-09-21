import React, { useEffect } from 'react';
import ARHero from '../components/anti-ragging/ARHero';
import ARPromise from '../components/anti-ragging/ARPromise';
import ARUgcBanner from '../components/anti-ragging/ARUgcBanner';
import ARContent from '../components/anti-ragging/ARContent';
import ARGallery from '../components/anti-ragging/ARGallery';
import ARPostersGallery from '../components/anti-ragging/ARPostersGallery';

export default function AntiRagging() {

  return (
    <main className="w-full bg-[var(--background)] min-h-screen selection:bg-[var(--accent)] selection:text-[var(--primary-base)]">
      
      {/* The Institutional Manifesto Hero */}
      <ARHero />

      {/* The Guarantee to Parents and Students */}
      <ARPromise />

      <ARUgcBanner/>

      {/* The Sticky Editorial Brief (Laws & Penalties) */}
      <ARContent />

      {/* The Horizontal Documentary Filmstrip Gallery */}
      {/* <ARGallery /> */}
      <ARPostersGallery />
      
    </main>
  );
}