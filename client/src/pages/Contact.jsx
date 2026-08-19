import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Contact() {
  const containerRef = useRef(null);

  // Hard reset scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Cinematic Editorial Entrance Animations
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

    // 1. Structural Lines Expand
    tl.fromTo('.struct-line', 
      { scaleX: 0 }, 
      { scaleX: 1, duration: 1.5, stagger: 0.1, transformOrigin: 'left center' }
    )
    // 2. Massive Title Reveal (Keeping the mask here because we gave it pb-4 to protect descenders)
    .fromTo('.reveal-title',
      { y: '110%', rotateX: -10 },
      { y: '0%', rotateX: 0, duration: 1.5, stagger: 0.05 },
      "-=1.2"
    )
    // 3. Small Labels Fade & Slide
    .fromTo('.reveal-label',
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 1, stagger: 0.05 },
      "-=1"
    )
    // 4. Links Drift Up (No longer restricted by overflow-hidden)
    .fromTo('.reveal-link',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.2, stagger: 0.1 },
      "-=1"
    );

  }, { scope: containerRef });

  return (
    <main 
      ref={containerRef} 
      className="w-full min-h-screen bg-[var(--background)] text-[var(--text-main)] selection:bg-[var(--accent)] selection:text-[var(--text-main)] pt-32 pb-32 md:pt-40 flex flex-col justify-center overflow-hidden"
    >
      <div className="w-full max-w-[1800px] mx-auto px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        
        {/* ==========================================
            MASSIVE TYPOGRAPHIC HEADER
        ========================================== */}
        <div className="w-full mb-16 md:mb-24 flex flex-col">
          {/* We keep overflow-hidden ONLY on the massive title, but with pb-4 to protect the tails */}
          <div className="overflow-hidden pb-4 md:pb-8">
            <h1 className="reveal-title head-txt italic text-6xl md:text-8xl lg:text-[9rem] xl:text-[11rem] 2xl:text-[13rem] font-light tracking-tighter leading-[0.8] uppercase text-[var(--text-main)]">
              Get In Touch.
            </h1>
          </div>
        </div>

        {/* ==========================================
            EDITORIAL GRID LAYOUT
        ========================================== */}
        <div className="flex flex-col w-full">
          
          {/* ROW 1: General Inquiry & Phones */}
          <div className="w-full relative py-12 md:py-16 lg:py-20 flex flex-col lg:flex-row gap-12 lg:gap-24">
            <div className="struct-line absolute top-0 left-0 w-full h-[1px] bg-[var(--primary-base)]/20"></div>
            
            {/* Label Column */}
            <div className="w-full lg:w-[25%] shrink-0">
              <span className="reveal-label font-sans text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
                Direct Lines & General
              </span>
            </div>

            {/* Content Column */}
            <div className="w-full lg:w-[75%] flex flex-col gap-6 md:gap-8">
              
              <div className="w-full">
                <a href="mailto:sihmdurgapur@gmail.com" className="reveal-link group relative inline-block text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight hover:text-[var(--accent)] transition-colors duration-500 outline-none break-all pb-2 md:pb-4">
                  sihmdurgapur@gmail.com
                  <div className="absolute bottom-0 left-0 h-[2px] bg-[var(--accent)] w-0 group-hover:w-full transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"></div>
                </a>
              </div>

              <div className="flex flex-col md:flex-row gap-6 md:gap-12 mt-4 md:mt-8 flex-wrap">
                <a href="tel:+917086097304" className="reveal-link inline-block text-2xl md:text-3xl lg:text-4xl font-light tracking-tight hover:text-[var(--accent)] hover:translate-x-2 transition-all duration-500 outline-none">
                  +91 7086097304
                </a>
                
                <span className="reveal-link text-2xl md:text-3xl lg:text-4xl font-light opacity-30 hidden md:block">/</span>
                
                <a href="tel:+917477464730" className="reveal-link inline-block text-2xl md:text-3xl lg:text-4xl font-light tracking-tight hover:text-[var(--accent)] hover:translate-x-2 transition-all duration-500 outline-none">
                  +91 7477464730
                </a>
                
                <span className="reveal-link text-2xl md:text-3xl lg:text-4xl font-light opacity-30 hidden lg:block">/</span>
                
                <a href="tel:+917001975939" className="reveal-link inline-block text-2xl md:text-3xl lg:text-4xl font-light tracking-tight hover:text-[var(--accent)] hover:translate-x-2 transition-all duration-500 outline-none">
                  +91 7001975939
                </a>
              </div>
            </div>
          </div>

          {/* ROW 2: Official Desks */}
          <div className="w-full relative py-12 md:py-16 lg:py-20 flex flex-col lg:flex-row gap-12 lg:gap-24">
            <div className="struct-line absolute top-0 left-0 w-full h-[1px] bg-[var(--primary-base)]/20"></div>
            
            {/* Label Column */}
            <div className="w-full lg:w-[25%] shrink-0">
              <span className="reveal-label font-sans text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
                Department Desks
              </span>
            </div>

            {/* Content Column */}
            <div className="w-full lg:w-[75%] flex flex-col gap-10 md:gap-16">
              
              <div className="flex flex-col md:flex-row gap-4 md:gap-12 items-start md:items-baseline">
                <span className="reveal-label w-32 shrink-0 font-sans text-[10px] opacity-40 uppercase tracking-[0.2em]">Principal</span>
                <a href="mailto:principal@wbsihm.in" className="reveal-link group relative inline-block text-2xl md:text-4xl lg:text-5xl font-light tracking-tight hover:text-[var(--accent)] transition-colors duration-500 outline-none break-all pb-1 md:pb-2">
                  principal@wbsihm.in
                  <div className="absolute bottom-0 left-0 h-[1px] bg-[var(--accent)] w-0 group-hover:w-full transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"></div>
                </a>
              </div>

              <div className="flex flex-col md:flex-row gap-4 md:gap-12 items-start md:items-baseline">
                <span className="reveal-label w-32 shrink-0 font-sans text-[10px] opacity-40 uppercase tracking-[0.2em]">HOD</span>
                <a href="mailto:hod.sihmdgp@gmail.com" className="reveal-link group relative inline-block text-2xl md:text-4xl lg:text-5xl font-light tracking-tight hover:text-[var(--accent)] transition-colors duration-500 outline-none break-all pb-1 md:pb-2">
                  hod.sihmdgp@gmail.com
                  <div className="absolute bottom-0 left-0 h-[1px] bg-[var(--accent)] w-0 group-hover:w-full transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"></div>
                </a>
              </div>

              <div className="flex flex-col md:flex-row gap-4 md:gap-12 items-start md:items-baseline">
                <span className="reveal-label w-32 shrink-0 font-sans text-[10px] opacity-40 uppercase tracking-[0.2em]">Placement</span>
                <a href="mailto:tpocell.sihmdgp@gmail.com" className="reveal-link group relative inline-block text-2xl md:text-4xl lg:text-5xl font-light tracking-tight hover:text-[var(--accent)] transition-colors duration-500 outline-none break-all pb-1 md:pb-2">
                  tpocell.sihmdgp@gmail.com
                  <div className="absolute bottom-0 left-0 h-[1px] bg-[var(--accent)] w-0 group-hover:w-full transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"></div>
                </a>
              </div>

            </div>
          </div>

          {/* ROW 3: Address & Hours */}
          <div className="w-full relative py-12 md:py-16 lg:py-20 flex flex-col lg:flex-row gap-12 lg:gap-24">
            <div className="struct-line absolute top-0 left-0 w-full h-[1px] bg-[var(--primary-base)]/20"></div>
            <div className="struct-line absolute bottom-0 left-0 w-full h-[1px] bg-[var(--primary-base)]/20"></div>
            
            {/* Label Column */}
            <div className="w-full lg:w-[25%] shrink-0">
              <span className="reveal-label font-sans text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
                Location & Hours
              </span>
            </div>

            {/* Content Column */}
            <div className="w-full lg:w-[75%] grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
              
              {/* Address */}
              <div className="flex flex-col gap-6">
                <p className="reveal-link text-xl md:text-2xl lg:text-3xl font-light tracking-tight leading-relaxed opacity-90">
                  State Institute of Hotel Management,<br />
                  Fuljhore, Durgapur - 713206<br />
                  West Bengal, India.
                </p>
              </div>

              {/* Hours */}
              <div className="flex flex-col gap-4">
                <p className="reveal-link text-xl md:text-2xl lg:text-3xl font-light tracking-tight leading-relaxed opacity-90">
                  <span className="block mb-4"><span className="opacity-40 text-sm tracking-widest uppercase mr-4">Mon - Fri</span> 9:00 AM — 5:30 PM</span>
                  <span className="block"><span className="opacity-40 text-sm tracking-widest uppercase mr-4">Sat & Sun</span> Closed</span>
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </main>
  );
}