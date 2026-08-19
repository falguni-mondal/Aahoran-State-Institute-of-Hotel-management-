import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function PlacementHero() {
  const sectionRef = useRef(null);
  
  // Dynamically fetches the current year for the metadata
  const currentYear = new Date().getFullYear();

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(min-width: 320px)", () => {
      // ==========================================
      // AMBIENT BACKGROUND ANIMATION (Infinite)
      // ==========================================
      gsap.to('.ambient-orb-1', {
        xPercent: 20, 
        yPercent: 30, 
        duration: 15, 
        ease: 'sine.inOut', 
        yoyo: true, 
        repeat: -1
      });
      
      gsap.to('.ambient-orb-2', {
        xPercent: -30, 
        yPercent: -20, 
        duration: 20, 
        ease: 'sine.inOut', 
        yoyo: true, 
        repeat: -1
      });

      // ==========================================
      // TEXT REVEAL ANIMATIONS
      // ==========================================
      const heroTl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      
      heroTl.fromTo('.hero-title-word', 
        { yPercent: 120, skewY: 4 }, 
        { yPercent: 0, skewY: 0, duration: 1.8, stagger: 0.15 }, 
        "+=0.2"
      )
      .fromTo('.hero-sub',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 1.2, stagger: 0.15 },
        "-=1.4"
      )
      .fromTo('.scroll-line-container',
        { scaleY: 0 },
        { scaleY: 1, duration: 1.2, transformOrigin: "top" },
        "-=1"
      );
    });

    return () => mm.revert();
  }, { scope: sectionRef });

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full h-[100dvh] min-h-[600px] flex flex-col justify-end overflow-hidden pb-12 md:pb-16 lg:pb-24 bg-[var(--background)] text-[var(--text-main)]"
    >
      
      {/* ==========================================
          CINEMATIC ABSTRACT BACKGROUND
      ========================================== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Soft dark gradient overlay */}
        {/* <div className="absolute inset-0 bg-gradient-to-b from-[var(--primary-base)] via-transparent to-[var(--primary-base)] z-10"></div> */}
        
        {/* Animated Orbs */}
        <div className="ambient-orb-1 absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-[var(--accent)]/10 blur-[80px] md:blur-[120px] mix-blend-screen"></div>
        <div className="ambient-orb-2 absolute top-[40%] -right-[10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-[var(--accent)]/15 blur-[80px] md:blur-[120px] mix-blend-screen"></div>
      </div>

      {/* ==========================================
          HERO CONTENT
      ========================================== */}
      <div className="relative z-10 w-full px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24 mx-auto max-w-[1800px] flex flex-col h-full pt-32 lg:pt-40">
        
        {/* Top Framing Context */}
        <div className="flex justify-between items-start w-full shrink-0">
          <span className="hero-sub block text-[9px] md:text-[10px] lg:text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)]">
            Executive Portfolio
          </span>
          <span className="hero-sub block text-[9px] md:text-[10px] lg:text-xs font-medium uppercase tracking-[0.2em] text-[var(--text-main)]/60 text-right max-w-[200px] md:max-w-xs">
            Class of {currentYear}
          </span>
        </div>

        {/* Massive Asymmetric Title */}
        <div className="flex flex-col w-full my-auto lg:mt-auto lg:mb-0 pb-12 lg:pb-0">
          <div className="overflow-hidden w-full flex justify-center md:justify-start">
            <h1 className="hero-title-word head-txt text-[16vw] md:text-[16vw] lg:text-[14vw] xl:text-[12rem] 2xl:text-[14rem] tracking-tighter leading-[0.85] text-[var(--text-main)] text-center md:text-left">
              STUDENT
            </h1>
          </div>
          <div className="overflow-hidden w-full flex justify-center md:justify-end mt-2 md:mt-0">
            <h1 className="hero-title-word head-txt text-[16vw] md:text-[16vw] lg:text-[14vw] xl:text-[12rem] 2xl:text-[14rem] tracking-tighter leading-[0.85] text-[var(--accent)] italic pr-0 md:pr-12 lg:pr-24 text-center md:text-right">
              PLACEMENTS.
            </h1>
          </div>
          
          <div className="overflow-hidden w-full flex justify-center md:justify-end mt-6 md:mt-8 pr-0 md:pr-12 lg:pr-24">
             <p className="hero-sub text-sm md:text-base lg:text-lg font-light text-[var(--text-main)]/60 max-w-sm text-center md:text-right">
               Launching careers in world-class hospitality and luxury brands across the globe.
             </p>
          </div>
        </div>

      </div>

      {/* ==========================================
          DELICATE SCROLL INDICATOR
      ========================================== */}
      {/* 
        FIX APPLIED HERE: 
        left-1/2 and -translate-x-1/2 center it on mobile. 
        md:left-8 and md:translate-x-0 snap it back to the left on tablet/desktop. 
      */}
      <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 md:left-8 md:translate-x-0 lg:left-12 xl:left-16 2xl:left-24 flex flex-col items-center gap-4 z-10">
        <span className="hero-sub text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-medium text-[var(--text-main)]/50">
          Scroll to view
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