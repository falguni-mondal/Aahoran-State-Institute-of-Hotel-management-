import React from 'react';
import AboutHero from '../components/about/AboutHero';
import AboutVision from '../components/about/AboutVision';
import AboutIdentity from '../components/about/AboutIdentity';
import AboutFacilities from '../components/about/AboutFacilities';
import AboutFaculty from '../components/about/AboutFaculty';
import AboutRecognition from '../components/about/AboutRecognition';
import AboutCampusLife from '../components/about/AboutCampuslife';
import AboutRules from '../components/about/AboutRules';

export default function About() {
  return (
    <main className="w-full min-h-screen bg-[var(--background)] flex flex-col">
      <AboutHero />
      <AboutVision />
      <AboutIdentity />
      <AboutFacilities />
      <AboutFaculty />
      <AboutRecognition />
      <AboutCampusLife />
      <AboutRules />
    </main>
  );
}