import React, { useEffect } from 'react';
import FTHero from '../components/full-term/FTHero';
import FTSnapshot from '../components/full-term/FTSnapshot'; // Your renamed snapshot component
import FTCourseList from '../components/full-term/FTCourseList';

export default function FullTermCourses() {

  return (
    <main className="w-full bg-[var(--background)] min-h-screen selection:bg-[var(--accent)] selection:text-[var(--primary-base)]">
      
      {/* Cinematic Dark Hero */}
      <FTHero/>

      {/* Light Theme Prestige Snapshot (Renamed by you) */}
      <FTSnapshot/>

      {/* Light Theme Sticky Editorial Text */}
      <FTCourseList/>
      
    </main>
  );
}