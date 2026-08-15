import React, { useEffect } from 'react';
import GalleryHero from '../components/gallery/GalleryHero';
import GalleryGrid from '../components/gallery/GalleryGrid';

/* =========================================
   MOCK DATA: INAUGURAL PROGRAMME IMAGES
   (Replace urls with your actual image paths)
========================================= */
const inauguralImages = [
  { id: 1, url: '/inaugural_1.webp', alt: 'Lighting of the Lamp Ceremony', aspect: 'vertical' },
  { id: 2, url: '/inaugural_2.webp', alt: 'Chief Guest Keynote Address', aspect: 'horizontal' },
  { id: 3, url: '/inaugural_3.webp', alt: 'Ribbon Cutting at the Main Entrance', aspect: 'vertical' },
  { id: 4, url: '/inaugural_4.webp', alt: 'Audience and Dignitaries', aspect: 'horizontal' },
  { id: 5, url: '/inaugural_5.webp', alt: 'Unveiling the Foundation Stone', aspect: 'square' },
  { id: 6, url: '/inaugural_6.webp', alt: 'Cultural Performance', aspect: 'vertical' },
  { id: 7, url: '/inaugural_7.webp', alt: 'Felicitation of Guests', aspect: 'horizontal' },
  { id: 8, url: '/inaugural_8.webp', alt: 'Campus Tour with Dignitaries', aspect: 'vertical' },
  { id: 9, url: '/inaugural_9.webp', alt: 'Catering Showcase', aspect: 'square' },
];

export default function InauguralProgramme() {
  
  // Hard reset scroll to top on mount for GSAP/Lenis accuracy
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="w-full bg-[var(--background)] min-h-screen selection:bg-[var(--accent)] selection:text-[var(--primary-base)]">
      
      {/* 
        Reusable Hero Component 
        Passing specific Inauguration details.
      */}
      <GalleryHero 
        subtitle="A New Beginning"
        title="Inaugural Programme."
        bgImage="/inaugural_hero.webp" 
      />

      {/* 
        Reusable Grid Component
        Passing the inauguration-specific image array.
      */}
      <GalleryGrid images={inauguralImages} />
      
    </main>
  );
}