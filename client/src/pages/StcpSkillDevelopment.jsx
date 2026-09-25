import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GalleryHero from '../components/gallery/GalleryHero';
import GalleryGrid from '../components/gallery/GalleryGrid';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* =========================================
   MOCK DATA: STCP & SKILL DEVELOPMENT
========================================= */
const stcpDataByYear = [
  {
    year: "2026",
    date: "March 15, 2026",
    title: "Advanced Culinary Workshop",
    description: "A specialized Short Term Certification Program (STCP) focusing on advanced culinary techniques, modern plating, and international cuisines. Designed to upskill aspiring chefs and local youth for the global hospitality sector.",
    images: [
      { id: '26-stcp1', url: '/stcp_1.webp', alt: 'Chef Demonstrating Plating Techniques', aspect: 'vertical' },
      { id: '26-stcp2', url: '/stcp_2.webp', alt: 'Students Practicing Culinary Skills', aspect: 'horizontal' },
    ]
  },
  {
    year: "2025",
    date: "July 22, 2025",
    title: "Front Office & Communication Mastery",
    description: "An intensive skill development drive aimed at polishing guest interaction, crisis management, and software proficiency using industry-standard Property Management Systems (PMS).",
    images: [
      { id: '25-stcp1', url: '/stcp_3.webp', alt: 'Roleplaying Guest Check-in', aspect: 'square' },
      { id: '25-stcp2', url: '/stcp_4.webp', alt: 'Communication Skills Lecture', aspect: 'horizontal' },
      { id: '25-stcp3', url: '/stcp_5.webp', alt: 'Computer Lab Training', aspect: 'vertical' },
    ]
  },
  {
    year: "2024",
    date: "November 10, 2024",
    title: "Bakery & Patisserie Certification",
    description: "A hands-on short course dedicated to the science of baking. Participants mastered artisanal bread making, classical French pastries, and intricate cake decoration techniques under expert guidance.",
    images: [
      { id: '24-stcp1', url: '/stcp_6.webp', alt: 'Artisanal Bread Baking', aspect: 'vertical' },
      { id: '24-stcp2', url: '/stcp_7.webp', alt: 'Cake Decoration Masterclass', aspect: 'horizontal' },
    ]
  },
  {
    year: "2023",
    date: "April 05, 2023",
    title: "Accommodation Operations Drive",
    description: "Empowering the workforce through rigorous training in modern housekeeping standards, sustainability practices, and floral arrangements for premium luxury resorts.",
    images: [
      { id: '23-stcp1', url: '/stcp_8.webp', alt: 'Bed Making Time Challenge', aspect: 'horizontal' },
      { id: '23-stcp2', url: '/stcp_9.webp', alt: 'Towel Art and Floral Setup', aspect: 'square' },
    ]
  }
];

export default function StcpSkillDevelopment() {
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
      */}
      <GalleryHero 
        subtitle="Empowering Futures"
        title="STCP & Skill Development"
        bgImage="/images/stcp/stcp-hero.webp" 
      />

      {/* ==========================================
          YEAR-BASED GALLERY SECTIONS
      ========================================== */}
      <div className="w-full flex flex-col">
        {stcpDataByYear.map((section, index) => (
          <section key={section.year} className={`w-full pt-20 md:pt-32 pb-24 ${index !== 0 ? 'border-t border-[var(--primary-base)]/10' : ''}`}>
            
            <div className="w-full max-w-[1800px] mx-auto px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
              
              {/* Year Header Layout */}
              <div className="year-header flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16 md:mb-24">
                
                <div className="flex flex-col max-w-3xl relative z-10">
                  {/* Large background watermark of the year */}
                  <span className="absolute -top-12 md:-top-20 -left-4 md:-left-8 font-sans text-[120px] md:text-[180px] lg:text-[220px] font-bold leading-none text-[var(--text-main)]/5 select-none pointer-events-none tracking-tighter -z-10">
                    {section.year}
                  </span>
                  
                  {/* Date nicely integrated with the Tag */}
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
                      Skill Development
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
            */}
            <GalleryGrid images={section.images} />

          </section>
        ))}
      </div>
      
    </main>
  );
}