import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function ARHero() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(min-width: 320px)", () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } });

      // Draw Structural Grid Lines
      tl.fromTo('.grid-line-v', 
        { scaleY: 0 }, 
        { scaleY: 1, duration: 2, stagger: 0.2, ease: 'expo.inOut' }
      )
      .fromTo('.grid-line-h', 
        { scaleX: 0 }, 
        { scaleX: 1, duration: 2, ease: 'expo.inOut' }, 
        "-=2.0"
      )
      
      // Slow Center-Out Unmasking of the Main Text
      .fromTo('.hero-manifesto-text',
        { clipPath: 'inset(0% 50% 0% 50%)', opacity: 0, scale: 0.98 },
        { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, scale: 1, duration: 2.5, ease: 'expo.out', stagger: 0.2 },
        "-=2.0"
      )
      
      // Fade in Labels and Subtitle
      .fromTo('.hero-fade-item',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 1.5, stagger: 0.2, ease: 'power2.out' },
        "-=1.8"
      );

      // Infinite CSS Scroll Line GSAP Trigger
      gsap.fromTo('.scroll-line-container', 
        { scaleY: 0 },
        { scaleY: 1, duration: 1.2, ease: "expo.out", delay: 2, transformOrigin: "top" }
      );
    });

    return () => mm.revert();
  }, { scope: sectionRef });

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full h-[100dvh] min-h-[600px] bg-[var(--background)] flex flex-col items-center justify-center overflow-hidden pt-20"
    >
      {/* ==========================================
          STRUCTURAL GRID (The "Document" Frame)
          z-0 ensures they sit behind the text
      ========================================== */}
      {/* Center Vertical Line */}
      <div className="grid-line-v absolute left-1/2 top-0 w-[1px] h-full bg-[var(--primary-base)]/10 origin-top -translate-x-1/2 z-0"></div>
      
      {/* Center Horizontal Line */}
      <div className="grid-line-h absolute top-[55%] left-0 w-full h-[1px] bg-[var(--primary-base)]/10 origin-left -translate-y-1/2 z-0"></div>
      
      {/* Outer Framing Lines */}
      <div className="grid-line-v absolute left-5 md:left-12 lg:left-24 top-0 w-[1px] h-full bg-[var(--primary-base)]/10 origin-bottom z-0"></div>
      <div className="grid-line-v absolute right-5 md:right-12 lg:right-24 top-0 w-[1px] h-full bg-[var(--primary-base)]/10 origin-bottom z-0"></div>

      {/* ==========================================
          CENTERED AUTHORITATIVE TYPOGRAPHY
      ========================================== */}
      <div className="relative z-10 flex flex-col items-center text-center w-full max-w-[1800px] px-5 md:px-12 lg:px-24">
        
        {/* Top Label */}
        <span className="hero-fade-item text-[9px] md:text-[10px] lg:text-xs font-semibold uppercase tracking-[0.4em] text-[var(--accent)] mb-8 md:mb-12">
          [ Institutional Pledge ]
        </span>

        {/* Massive Manifesto Text */}
        <div className="flex flex-col items-center pb-2 md:pb-4">
          <div className="overflow-hidden w-full flex justify-center pb-2 md:pb-4">
            <h1 className="hero-manifesto-text head-txt text-[18vw] md:text-[14vw] lg:text-[10rem] xl:text-[12rem] 2xl:text-[14rem] tracking-[0.05em] text-[var(--text-main)] uppercase leading-[0.85] w-full text-center">
              ZERO
            </h1>
          </div>
          <div className="overflow-hidden w-full flex justify-center pb-2 md:pb-4">
            <h1 className="hero-manifesto-text head-txt text-[18vw] md:text-[14vw] lg:text-[10rem] xl:text-[12rem] 2xl:text-[14rem] tracking-[0.05em] text-[var(--text-main)] uppercase leading-[0.85] w-full text-center">
              TOLERANCE.
            </h1>
          </div>
        </div>

        {/* Subtitle (Removed solid background mask and reduced top margin) */}
        <div className="hero-fade-item mt-2 md:mt-4">
          <h2 className="text-xl md:text-3xl lg:text-4xl xl:text-5xl italic font-light tracking-tight text-[var(--text-main)]/70">
            Towards Ragging.
          </h2>
        </div>
        
      </div>

      {/* ==========================================
          DELICATE SCROLL INDICATOR
      ========================================== */}
      {/* Removed solid background mask so it doesn't overlap on smaller screens */}
      <div className="absolute bottom-6 md:bottom-10 flex flex-col items-center gap-4 z-10">
        <span className="hero-fade-item text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-medium text-[var(--text-main)]/50">
          Read Our Stance
        </span>
        
        <div className="scroll-line-container w-[1px] h-12 md:h-16 bg-[var(--primary-base)]/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-[var(--primary-base)] animate-[scrollDown_2s_ease-in-out_infinite]"></div>
        </div>
      </div>
      
      {/* CSS Animation for Scroll Line */}
      <style>{`
        @keyframes scrollDown {
          0% { transform: translateY(-100%); }
          50% { transform: translateY(100%); }
          100% { transform: translateY(200%); }
        }
      `}</style>
      
    </section>
  );
}