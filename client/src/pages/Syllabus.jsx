import React, { useEffect } from 'react';
import SyllabusHero from '../components/syllabus/SyllabusHero';
import SyllabusList from '../components/syllabus/SyllabusList';

export default function Syllabus() {

  return (
    <main className="w-full bg-[var(--background)] min-h-screen selection:bg-[var(--accent)] selection:text-[var(--primary-base)]">
      
      {/* 1. Cinematic Editorial Hero */}
      <SyllabusHero />

      {/* 2. Interactive Academic Archive List */}
      <SyllabusList />
      
    </main>
  );
}