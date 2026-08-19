import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Dummy Data for the Documentary Gallery
const galleryImages = [
  { src: '/anti_ragging_1.jpg', title: 'Open Forum Discussions', date: 'August 2025' },
  { src: '/anti_ragging_2.jpg', title: 'Faculty & Student Committee', date: 'September 2025' },
  { src: '/anti_ragging_3.jpg', title: 'Awareness Seminar', date: 'January 2026' },
  { src: '/anti_ragging_4.jpg', title: 'Safety Pledge Ceremony', date: 'March 2026' },
];

export default function ARGallery() {
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
      // THEME: Switched from primary-base to background
      className="relative w-full h-[100dvh] bg-[var(--background)] text-[var(--primary-base)] overflow-hidden"
    >
      {/* 
          =========================================
          DISTINCTION: THE "GALLERY TRACK" & WATERMARK
          Instead of borders, we use a massive faint typographic watermark 
          and a razor-thin architectural "rail" line across the exact center 
          of the screen to make it feel like a physical exhibition gallery.
          ========================================= 
      */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <span className="text-[25vw] font-serif font-bold tracking-tighter text-[var(--primary-base)]/[0.03] select-none whitespace-nowrap">
          Archive.
        </span>
      </div>
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[var(--primary-base)]/10 -translate-y-1/2 pointer-events-none z-0"></div>

      {/* 
        The flex container that holds all horizontal items.
        It must be wider than the viewport (w-max) to allow horizontal scrolling.
      */}
      <div 
        ref={galleryRef} 
        className="flex h-full w-max items-center px-5 md:px-12 lg:px-24 relative z-10"
      >
        
        {/* ==========================================
            ITEM 1: TITLE SLIDE (The Introduction)
        ========================================== */}
        <div className="w-[85vw] md:w-[50vw] lg:w-[35vw] flex flex-col shrink-0 pr-12 md:pr-24">
          <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)] mb-6 md:mb-8">
            Documentary Evidence
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light tracking-tighter leading-[1.1] mb-6">
            Active <br/> Engagement.
          </h2>
          {/* THEME: text-light changed to primary-base */}
          <p className="text-sm md:text-base lg:text-lg text-[var(--primary-base)]/60 font-light leading-relaxed max-w-sm">
            We don't just put policies on paper. We conduct regular seminars, open forums, and committee meetings to ensure the dialogue around campus safety remains active, transparent, and strictly enforced.
          </p>
        </div>

        {/* ==========================================
            ITEMS 2+: THE FILMSTRIP IMAGES
        ========================================== */}
        {galleryImages.map((item, index) => (
          <div 
            key={index} 
            className="w-[85vw] md:w-[60vw] lg:w-[45vw] shrink-0 h-[60vh] md:h-[65vh] lg:h-[70vh] px-4 md:px-8 lg:px-12 group"
          >
            {/* THEME: bg-[var(--background)]/5 changed to bg-[var(--primary-base)]/5, added subtle shadow */}
            <div className="relative w-full h-full overflow-hidden bg-[var(--primary-base)]/5 cursor-pointer shadow-xl">
              {/* Image with Grayscale Filter & Hover Color Reveal */}
              <img 
                src={item.src} 
                alt={item.title} 
                className="absolute inset-0 w-full h-full object-cover grayscale-[0.8] opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] scale-105 group-hover:scale-100"
              />
              
              {/* Metadata Overlay 
                  THEME: Gradient now fades to the light background so the primary-base text stands out cleanly 
              */}
              <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 lg:p-10 flex justify-between items-end bg-gradient-to-t from-[var(--background)]/90 via-[var(--background)]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0">
                {/* THEME: text-light changed to primary-base */}
                <h3 className="text-lg md:text-xl lg:text-2xl font-light tracking-tight text-[var(--primary-base)]">
                  {item.title}
                </h3>
                <span className="text-[9px] md:text-[10px] font-semibold uppercase tracking-widest text-[var(--accent)]">
                  {item.date}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {/* End padding for a smooth stop */}
        <div className="w-[10vw] shrink-0"></div>

      </div>
    </section>
  );
}