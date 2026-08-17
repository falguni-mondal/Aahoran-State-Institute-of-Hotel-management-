import React, { useEffect } from 'react';
import NBHero from '../components/notice-board/NBHero';
import NBContent from '../components/notice-board/NBContent';

export default function NoticeBoard() {

  return (
    <main className="w-full bg-[var(--background)] min-h-screen selection:bg-[var(--accent)] selection:text-[var(--primary-base)]">
      
      {/* The Hero Section with Image Parallax and Title Reveal */}
      <NBHero />

      {/* The Interactive Tabbed Notice List */}
      <NBContent />
      
    </main>
  );
}