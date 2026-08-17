import React, { useEffect } from 'react';
import GalleryHero from '../components/gallery/GalleryHero';
import GalleryGrid from '../components/gallery/GalleryGrid';

/* =========================================
   MOCK DATA: CAMPUS IMAGES
   (Replace urls with your actual image paths)
========================================= */
const campusImages = [
  { id: 1, url: '/campus_1.webp', alt: 'SIHM Main Facade', aspect: 'vertical' },
  { id: 2, url: '/campus_2.webp', alt: 'Advanced Culinary Lab', aspect: 'horizontal' },
  { id: 3, url: '/campus_3.webp', alt: 'Student Lounge Architecture', aspect: 'vertical' },
  { id: 4, url: '/campus_4.webp', alt: 'Library Archives', aspect: 'horizontal' },
  { id: 5, url: '/campus_5.webp', alt: 'Lecture Theater', aspect: 'square' },
  { id: 6, url: '/campus_6.webp', alt: 'Front Office Training Area', aspect: 'vertical' },
  { id: 7, url: '/campus_7.webp', alt: 'Training Restaurant', aspect: 'horizontal' },
  { id: 8, url: '/campus_8.webp', alt: 'Campus Courtyard', aspect: 'vertical' },
  { id: 9, url: '/campus_9.webp', alt: 'Mock Guest Room', aspect: 'square' },
];

export default function OurCampus() {

  return (
    <main className="w-full bg-[var(--background)] min-h-screen selection:bg-[var(--accent)] selection:text-[var(--primary-base)]">
      
      {/* 
        Reusable Hero Component 
        We pass the specific page details as props.
      */}
      <GalleryHero 
        subtitle="Institution Infrastructure"
        title="Our Campus."
        bgImage="/campus_hero.webp" 
      />

      {/* 
        Reusable Grid Component
        We pass our structured image data array.
      */}
      <GalleryGrid images={campusImages} />
      
    </main>
  );
}