import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function FTSnapshot() {
  const containerRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });

    // Fade in the section header
    tl.fromTo('.snapshot-header', 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    );

    // Stagger in the data grid items
    tl.fromTo('.stat-box',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power2.out" },
      "-=0.6"
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full bg-[var(--background)] text-[var(--primary-base)] py-20 md:py-28 lg:py-36 overflow-hidden">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24 mx-auto max-w-[1800px]">
        
        {/* Section Header */}
        <div className="snapshot-header flex flex-col mb-16 md:mb-24 max-w-4xl">
          <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)] mb-4 block">
            Programme Overview
          </span>
          <h2 className="head-txt text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-[var(--primary-base)] tracking-tighter leading-[1.05]">
            B.Sc. in Hospitality & Hotel Administration
          </h2>
        </div>

        {/* Elegant Data Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 border-t border-l border-[var(--primary-base)]/10">
          
          {/* Stat 1: Duration */}
          <div className="stat-box flex flex-col justify-between p-8 lg:p-12 border-r border-b border-[var(--primary-base)]/10 aspect-square xl:aspect-auto xl:h-[350px]">
            <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary-base)]/50">
              Duration
            </span>
            <div>
              <div className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tighter mb-2">
                3
              </div>
              <span className="text-lg md:text-xl font-light text-[var(--primary-base)]/90 block mb-1">Years</span>
              <span className="text-sm font-light text-[var(--primary-base)]/60 block">(Six semesters) full-time regular course</span>
            </div>
          </div>

          {/* Stat 2: Accreditation (Spans 2 columns on extra-large screens) */}
          <div className="stat-box flex flex-col justify-between p-8 lg:p-12 border-r border-b border-[var(--primary-base)]/10 xl:col-span-2 xl:h-[350px]">
            <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary-base)]/50">
              Accreditation
            </span>
            
            <div className="mt-8 xl:mt-0 flex flex-col gap-5 md:gap-6">
              
              {/* NCHMCT Accreditation */}
              <div className="flex flex-row items-center gap-4 md:gap-6">
                <img 
                  src="/nchmct.png" 
                  alt="NCHMCT Logo" 
                  className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 object-contain shrink-0"
                />
                <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-light text-[var(--primary-base)] leading-[1.3] tracking-tight">
                  National Council for Hotel Management and Catering Technology, Noida
                </p>
              </div>

              {/* The dividing line dynamically aligns with the typography, skipping the width of the logo + gap */}
              <div className="w-12 h-[1px] bg-[var(--primary-base)]/20 ml-[3.5rem] md:ml-[5rem] lg:ml-[5.5rem]"></div>

              {/* JNU Accreditation */}
              <div className="flex flex-row items-center gap-4 md:gap-6">
                <img 
                  src="/jnu.svg" 
                  alt="JNU Logo" 
                  className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 object-contain shrink-0"
                />
                <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-light text-[var(--primary-base)] leading-[1.3] tracking-tight">
                  Jawaharlal Nehru University, New Delhi
                </p>
              </div>

            </div>
          </div>

          {/* Stat 3: Age Limit */}
          <div className="stat-box flex flex-col justify-between p-8 lg:p-12 border-r border-b border-[var(--primary-base)]/10 aspect-square xl:aspect-auto xl:h-[350px]">
            <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary-base)]/50">
              Age Limit
            </span>
            <div>
              <div className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tighter mb-2">
                None
              </div>
              <span className="text-lg md:text-xl font-light text-[var(--primary-base)]/70">No age bar</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}