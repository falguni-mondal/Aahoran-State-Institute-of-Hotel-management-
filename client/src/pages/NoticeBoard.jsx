import React, { useEffect } from 'react';
import NBHero from '../components/notice-board/NBHero';
import NBContent from '../components/notice-board/NBContent';

export default function NoticeBoard() {
  
  // Forces scroll reset on mount for smooth Lenis/GSAP integration
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="w-full bg-[var(--background)] min-h-screen selection:bg-[var(--accent)] selection:text-[var(--primary-base)]">
      
      {/* The Hero Section with Image Parallax and Title Reveal */}
      <NBHero />

      {/* The Interactive Tabbed Notice List */}
      <NBContent />
      
    </main>
  );
}