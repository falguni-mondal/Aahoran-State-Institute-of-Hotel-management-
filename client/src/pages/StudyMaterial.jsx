import React, { useEffect } from 'react';
import StudyMaterialHero from '../components/study-material/StudyMaterialHero';
import StudyMaterialList from '../components/study-material/StudyMaterialList';

export default function StudyMaterial() {
  
  return (
    <main className="w-full bg-[var(--background)] min-h-screen selection:bg-[var(--accent)] selection:text-[var(--primary-base)]">
      
      {/* Cinematic Editorial Hero */}
      <StudyMaterialHero />

      {/* Interactive Interactive Tabbed Archive List */}
      <StudyMaterialList />
      
    </main>
  );
}