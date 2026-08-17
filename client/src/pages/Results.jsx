import React, { useEffect } from 'react';
import ResultsHero from '../components/results/ResultsHero';
import ResultsContent from '../components/results/ResultsContent';

export default function Results() {

  return (
    <main className="w-full bg-[var(--background)] min-h-screen selection:bg-[var(--accent)] selection:text-[var(--primary-base)]">
      
      {/* The Cinematic Header */}
      <ResultsHero />

      {/* The Interactive Split-Screen Archive */}
      <ResultsContent />
      
    </main>
  );
}