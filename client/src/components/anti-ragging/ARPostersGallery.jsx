import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* =========================================
   UPDATED DATA: PORTRAIT POSTER CONTENT
   Based on the provided UGC Anti-Ragging posters
========================================= */
const posterImages = [
  { 
    src: '/images/anti-ragging/posters/anti_ragging_poster_1.webp', 
    title: 'Think of the Consequences', 
    subtitle: 'Mandate 01' 
  },
  { 
    src: '/images/anti-ragging/posters/anti_ragging_poster_2.webp', 
    title: "Don't Rag, Just Interact", 
    subtitle: 'Mandate 02' 
  },
  { 
    src: '/images/anti-ragging/posters/anti_ragging_poster_3.webp', 
    title: 'Yes to Joyful Campus', 
    subtitle: 'Mandate 03' 
  },
  { 
    src: '/images/anti-ragging/posters/anti_ragging_poster_4.webp', 
    title: 'Protect Your Future', 
    subtitle: 'Mandate 04' 
  },
];

export default function ARPostersGallery() {
  const sectionRef = useRef(null);
  const galleryRef = useRef(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    // Horizontal Scroll Animation
    mm.add("(min-width: 320px)", () => {
      // Calculate how far we need to move horizontally
      const getScrollAmount = () => -(galleryRef.current.scrollWidth - window.innerWidth);

      const tween = gsap.to(galleryRef.current, {
        x: getScrollAmount,
        ease: "none"
      });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${galleryRef.current.scrollWidth}`, // The scroll distance matches the width of the content
        pin: true,
        animation: tween,
        scrub: 1,
        invalidateOnRefresh: true // Recalculates on window resize
      });
    });

    return () => mm.revert();
  }, { scope: sectionRef });

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full h-[100dvh] bg-[var(--background)] text-[var(--primary-base)] overflow-hidden flex flex-col justify-center pt-24 md:pt-32 pb-10"
    >
      {/* 
        The flex container that holds all horizontal items.
        It must be wider than the viewport (w-max) to allow horizontal scrolling.
      */}
      <div 
        ref={galleryRef} 
        className="flex w-max items-center px-5 md:px-12 lg:px-24 xl:px-32 relative z-10"
      >
        
        {/* ==========================================
            ITEM 1: TITLE SLIDE (The Introduction)
        ========================================== */}
        <div className="w-[85vw] md:w-[50vw] lg:w-[35vw] flex flex-col shrink-0 pr-12 md:pr-24">
          <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)] mb-6 md:mb-8">
            Awareness Campaign
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light tracking-tighter leading-[1.1] mb-6">
            Campus <br/> Directives
          </h2>
          <p className="text-sm md:text-base lg:text-lg xl:text-xl text-[var(--primary-base)]/60 font-light leading-relaxed max-w-sm text-justify">
            Visual mandates establishing our strict zero-tolerance policy. These directives are prominently displayed across the institution to reinforce student safety, encourage healthy interaction, and explicitly state the severe legal consequences of ragging.
          </p>
        </div>

        {/* ==========================================
            ITEMS 2+: THE PORTRAIT POSTERS (DOWNLOADABLE)
        ========================================== */}
        {posterImages.map((item, index) => (
          <a 
            key={index} 
            href={item.src}
            download={`SIHM_AntiRagging_${item.subtitle.replace(/\s+/g, '')}.webp`}
            title="Click to Download Poster"
            className="shrink-0 h-[50vh] md:h-[55vh] lg:h-[60vh] xl:h-[65vh] 2xl:h-[70vh] aspect-[7/10] mr-10 md:mr-16 lg:mr-24 group block cursor-pointer"
          >
            <div className="relative w-full h-full overflow-hidden bg-[var(--primary-base)]/5 shadow-xl border border-[var(--primary-base)]/10">
              
              {/* Image with Grayscale Filter & Hover Color Reveal */}
              <img 
                src={item.src} 
                alt={item.title} 
                className="absolute inset-0 w-full h-full object-cover grayscale-[0.4] opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] scale-105 group-hover:scale-100"
              />
              
              {/* Metadata & Download Overlay */}
              <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 flex justify-between items-end bg-gradient-to-t from-[var(--background)]/95 via-[var(--background)]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0">
                
                <div className="flex flex-col gap-1 pr-4">
                  <span className="text-[9px] md:text-[10px] font-semibold uppercase tracking-widest text-[var(--accent)] shrink-0">
                    {item.subtitle}
                  </span>
                  <h3 className="text-lg md:text-xl lg:text-2xl font-light tracking-tight text-[var(--primary-base)]">
                    {item.title}
                  </h3>
                </div>

                {/* Download Icon Indicator */}
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-[var(--primary-base)]/20 bg-[var(--background)]/10 backdrop-blur-sm flex items-center justify-center shrink-0 group-hover:bg-[var(--accent)] group-hover:border-[var(--accent)] transition-colors duration-300">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary-base)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-[var(--background)] transition-colors duration-300">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                </div>

              </div>
              
            </div>
          </a>
        ))}
        
        {/* End padding for a smooth stop */}
        <div className="w-[10vw] shrink-0"></div>

      </div>
    </section>
  );
}