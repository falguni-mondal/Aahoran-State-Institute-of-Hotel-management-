import React, { useEffect } from "react";
import CFHero from "../components/campus-facilities/CFHero";
import CFGallery from "../components/campus-facilities/CFGallery";
import { useLocation } from "react-router-dom";
import { useLenis } from 'lenis/react';

// Structured data mapping for the facilities based on your screenshots
const facilitiesData = [
  {
    id: "library",
    title: "Library",
    images: [
      {
        src: "/library_1.jpg",
        alt: "Students studying at desks in the library",
      },
      {
        src: "/library_2.jpg",
        alt: "Student reading newspaper in the library",
      },
      { src: "/library_3.jpg", alt: "Students researching in the library" },
    ],
  },
  {
    id: "activities",
    title: "Activities",
    images: [
      {
        src: "/activities_1.jpg",
        alt: "Students participating in extracurricular activities",
      },
      {
        src: "/activities_2.jpg",
        alt: "Students engaged in a group discussion",
      },
      {
        src: "/activities_3.jpg",
        alt: "Students participating in a sports event",
      },
    ],
  },
];

export default function CampusFacilities() {
  const { hash } = useLocation();
  const lenis = useLenis(); // Hook into your global smooth scroller

  useEffect(() => {
    // Wait for Lenis to be ready
    if (!lenis) return;

    // ONLY execute if a hash exists. Leave normal visits to the ScrollManager!
    if (hash) {
      const timer = setTimeout(() => {
        lenis.scrollTo(hash, {
          offset: -100, 
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
        });
      }, 500); 

      return () => clearTimeout(timer);
    }
  }, [hash, lenis]);

  return (
    <main className="w-full bg-[var(--background)] min-h-screen selection:bg-[var(--accent)] selection:text-[var(--primary-base)]">
      {/* 1. Immersive Cinematic Hero */}
      <CFHero />

      {/* 2. Editorial Gallery Sections */}
      <div className="flex flex-col">
        {facilitiesData.map((facility, index) => (
          <CFGallery
            key={facility.id}
            id={facility.id}
            title={facility.title}
            images={facility.images}
            index={index}
          />
        ))}
      </div>
    </main>
  );
}
