import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function SyllabusHero() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(min-width: 320px)", () => {
      const heroTl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      
      heroTl.fromTo('.hero-title-word', 
        { yPercent: 120, skewY: 3 }, 
        { yPercent: 0, skewY: 0, duration: 1.6, stagger: 0.15 }, 
        "+=0.2"
      )
      .fromTo('.hero-sub',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.1 },
        "-=1.2"
      )
      .fromTo('.scroll-line-container',
        { scaleY: 0 },
        { scaleY: 1, duration: 1.2, transformOrigin: "top" },
        "-=0.8"
      );
    });

    return () => mm.revert();
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="hero-section relative w-full h-[100dvh] min-h-[600px] flex flex-col justify-end overflow-hidden pb-12 md:pb-16 lg:pb-24 bg-[var(--background)] text-[var(--primary-base)]">
      
      <div className="relative z-10 w-full px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24 mx-auto max-w-[1800px] flex flex-col h-full pt-32 lg:pt-40">
        
        <div className="flex justify-between items-start w-full shrink-0">
          <span className="hero-sub block text-[9px] md:text-[10px] lg:text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)]">
            Academic Archives
          </span>
          <span className="hero-sub block text-[9px] md:text-[10px] lg:text-xs font-medium uppercase tracking-[0.2em] text-[var(--primary-base)]/60 text-right max-w-[200px] md:max-w-xs">
            Document Repository
          </span>
        </div>

        <div className="flex flex-col w-full my-auto lg:mt-auto lg:mb-0 pb-12 lg:pb-0">
          <div className="overflow-hidden w-full flex justify-center md:justify-start">
            <h1 className="hero-title-word head-txt text-[16vw] md:text-[16vw] lg:text-[14vw] xl:text-[12rem] 2xl:text-[14rem] tracking-tighter leading-[0.85] text-[var(--primary-base)] text-center md:text-left">
              YOUR COURSE
            </h1>
          </div>
          <div className="overflow-hidden w-full flex justify-center md:justify-end">
            <h1 className="hero-title-word head-txt text-[16vw] md:text-[16vw] lg:text-[14vw] xl:text-[12rem] 2xl:text-[14rem] tracking-tighter leading-[0.85] text-[var(--accent)] italic pr-0 md:pr-12 lg:pr-24 text-center md:text-right">
              SYLLABUS.
            </h1>
          </div>
        </div>

      </div>

      <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 lg:-translate-x-0 lg:left-12 xl:left-16 2xl:left-24 flex flex-col items-center gap-4 z-10">
        <span className="hero-sub text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-medium opacity-50">
          Scroll to explore
        </span>
        
        <div className="scroll-line-container w-[1px] h-12 md:h-16 bg-[var(--primary-base)]/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-[var(--primary-base)] animate-[scrollDown_2s_ease-in-out_infinite]"></div>
        </div>
      </div>
      
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