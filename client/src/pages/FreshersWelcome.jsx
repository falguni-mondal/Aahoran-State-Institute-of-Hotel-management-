import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GalleryHero from '../components/gallery/GalleryHero';
import GalleryGrid from '../components/gallery/GalleryGrid';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* =========================================
   MOCK DATA: FRESHERS WELCOME IMAGES (Grouped by Year)
   (Continuous from 2026 down to 2022)
========================================= */
const freshersDataByYear = [
  {
    year: "2026",
    date: "August 18, 2026", // Placeholder Date added
    title: "Batch of 2026-29",
    description: "Welcoming the newest members of the SIHM family. A day filled with vibrant cultural performances, inspiring addresses, and the beginning of lifelong friendships.",
    images: [
      { id: '26-1', url: '/freshers_1.webp', alt: 'Student Orientation Session', aspect: 'vertical' },
      { id: '26-2', url: '/freshers_2.webp', alt: 'Ice-Breaking Activities', aspect: 'horizontal' },
    ]
  },
  {
    year: "2025",
    date: "August 22, 2025", // Placeholder Date added
    title: "Batch of 2025-28",
    description: "An incredible start to the academic journey. The orientation featured interactive sessions with industry experts and a grand welcome banquet.",
    images: [
      { id: '25-1', url: '/freshers_3.webp', alt: 'Seniors Welcoming Juniors', aspect: 'vertical' },
      { id: '25-2', url: '/freshers_4.webp', alt: 'Campus Tour for New Batches', aspect: 'horizontal' },
      { id: '25-3', url: '/freshers_10.webp', alt: 'Freshers Talent Showcase', aspect: 'square' },
    ]
  },
  {
    year: "2024",
    date: "August 14, 2024", // Placeholder Date added
    title: "Batch of 2024-27",
    description: "An unforgettable evening where creativity took center stage. The class of 2024 set the bar high with their incredible culinary showcases and collaborative spirit.",
    images: [
      { id: '24-1', url: '/freshers_5.webp', alt: 'Interactive Culinary Workshop', aspect: 'square' },
      { id: '24-2', url: '/freshers_6.webp', alt: 'Freshers Cultural Night', aspect: 'vertical' },
    ]
  },
  {
    year: "2023",
    date: "August 20, 2023", // Placeholder Date added
    title: "Batch of 2023-26",
    description: "Marking a year of immense talent and enthusiasm. The 2023 welcome event highlighted the diverse backgrounds of our incoming students.",
    images: [
      { id: '23-1', url: '/freshers_7.webp', alt: 'Welcome Address by the Principal', aspect: 'horizontal' },
      { id: '23-2', url: '/freshers_11.webp', alt: 'Traditional Dance Performance', aspect: 'vertical' },
    ]
  },
  {
    year: "2022",
    date: "August 25, 2022", // Placeholder Date added
    title: "Batch of 2022-25",
    description: "Marking the return to full campus life. The 2022 orientation focused on building resilience, teamwork, and foundational hospitality skills.",
    images: [
      { id: '22-1', url: '/freshers_8.webp', alt: 'Candid Student Interactions', aspect: 'vertical' },
      { id: '22-2', url: '/freshers_9.webp', alt: 'Group Photograph', aspect: 'square' },
    ]
  }
];

export default function FreshersWelcome() {
  const containerRef = useRef(null);

  useGSAP(() => {
    // Reveal animations for the year headers
    gsap.utils.toArray('.year-header').forEach((header) => {
      gsap.fromTo(header, 
        { opacity: 0, y: 40 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1.2, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: header,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });
  }, { scope: containerRef });

  return (
    <main ref={containerRef} className="w-full bg-[var(--background)] min-h-screen selection:bg-[var(--accent)] selection:text-[var(--primary-base)]">
      
      {/* 
        Reusable Hero Component 
        Passing specific Freshers Welcome details.
      */}
      <GalleryHero 
        subtitle="The Fresher's Welcome"
        title="Nabayon"
        bgImage="/freshers_hero.webp" 
      />

      {/* ==========================================
          YEAR-BASED GALLERY SECTIONS
      ========================================== */}
      <div className="w-full flex flex-col">
        {freshersDataByYear.map((section, index) => (
          <section key={section.year} className={`w-full pt-20 md:pt-32 pb-24 ${index !== 0 ? 'border-t border-[var(--primary-base)]/10' : ''}`}>
            
            <div className="w-full max-w-[1800px] mx-auto px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
              
              {/* Year Header Layout */}
              <div className="year-header flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16 md:mb-24">
                
                <div className="flex flex-col max-w-3xl relative z-10">
                  {/* Large background watermark of the year */}
                  <span className="absolute -top-12 md:-top-20 -left-4 md:-left-8 font-sans text-[120px] md:text-[180px] lg:text-[220px] font-bold leading-none text-[var(--text-main)]/5 select-none pointer-events-none tracking-tighter -z-10">
                    {section.year}
                  </span>
                  
                  {/* Added Date nicely integrated with the Tag */}
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
                      Orientation Gallery
                    </span>
                    <span className="w-1 h-1 rounded-full bg-[var(--text-main)]/30"></span>
                    <span className="text-[10px] md:text-xs tracking-widest text-[var(--text-main)] font-medium uppercase">
                      {section.date}
                    </span>
                  </div>
                  
                  <h2 className="head-txt text-4xl md:text-5xl lg:text-6xl tracking-tighter text-[var(--text-main)] mb-6">
                    {section.title}
                  </h2>
                  
                  <p className="text-base md:text-lg font-light leading-[1.8] md:leading-[1.9] text-[var(--text-main)]/70 max-w-2xl text-justify">
                    {section.description}
                  </p>
                </div>

                {/* Sub-indicator */}
                <div className="shrink-0 flex items-center gap-3 opacity-50 pb-2">
                  <span className="w-12 h-[1px] bg-[var(--text-main)]"></span>
                  <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-[var(--text-main)]">
                    {section.images.length} Captures
                  </span>
                </div>

              </div>

            </div>

            {/* 
              Reusable Grid Component
              Passing the specific image array for this year.
            */}
            <GalleryGrid images={section.images} />

          </section>
        ))}
      </div>
      
    </main>
  );
}