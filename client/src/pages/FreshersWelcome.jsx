import React, { useEffect } from 'react';
import GalleryHero from '../components/gallery/GalleryHero';
import GalleryGrid from '../components/gallery/GalleryGrid';

/* =========================================
   MOCK DATA: FRESHERS WELCOME IMAGES
   (Replace urls with your actual image paths)
========================================= */
const freshersImages = [
  { id: 1, url: '/freshers_1.webp', alt: 'Student Orientation Session', aspect: 'vertical' },
  { id: 2, url: '/freshers_2.webp', alt: 'Ice-Breaking Activities', aspect: 'horizontal' },
  { id: 3, url: '/freshers_3.webp', alt: 'Seniors Welcoming Juniors', aspect: 'vertical' },
  { id: 4, url: '/freshers_4.webp', alt: 'Campus Tour for New Batches', aspect: 'horizontal' },
  { id: 5, url: '/freshers_5.webp', alt: 'Interactive Culinary Workshop', aspect: 'square' },
  { id: 6, url: '/freshers_6.webp', alt: 'Freshers Cultural Night', aspect: 'vertical' },
  { id: 7, url: '/freshers_7.webp', alt: 'Welcome Address by the Principal', aspect: 'horizontal' },
  { id: 8, url: '/freshers_8.webp', alt: 'Candid Student Interactions', aspect: 'vertical' },
  { id: 9, url: '/freshers_9.webp', alt: 'Group Photograph', aspect: 'square' },
];

export default function FreshersWelcome() {
  
  // Hard reset scroll to top on mount for GSAP/Lenis accuracy
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="w-full bg-[var(--background)] min-h-screen selection:bg-[var(--accent)] selection:text-[var(--primary-base)]">
      
      {/* 
        Reusable Hero Component 
        Passing specific Freshers Welcome details.
      */}
      <GalleryHero 
        subtitle="Welcoming the Future"
        title="Freshers Welcome."
        bgImage="/freshers_hero.webp" 
      />

      {/* 
        Reusable Grid Component
        Passing the freshers-specific image array.
      */}
      <GalleryGrid images={freshersImages} />
      
    </main>
  );
}