import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function STOverview() {
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
    tl.fromTo('.overview-header', 
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
    <section ref={containerRef} className="w-full bg-[var(--background)] text-[var(--text-main)] py-20 md:py-28 lg:py-36 overflow-hidden">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24 mx-auto max-w-[1800px]">
        
        {/* Section Header */}
        <div className="overview-header flex flex-col items-center text-center mb-16 md:mb-24">
          <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)] mb-4 block">
            Common Structure
          </span>
          <h2 className="head-txt text-4xl md:text-5xl lg:text-6xl text-[var(--text-main)] tracking-tighter">
            Program Eligibility
          </h2>
          <p className="mt-6 text-sm md:text-base font-light text-[var(--text-main)]/60 max-w-lg">
            The following duration, intake, and qualification criteria apply universally across all five short-term diploma courses.
          </p>
        </div>

        {/* Elegant Data Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 border-t border-l border-[var(--primary-base)]/10">
          
          {/* Stat 1: Duration */}
          <div className="stat-box flex flex-col justify-between p-8 lg:p-12 border-r border-b border-[var(--primary-base)]/10 aspect-square xl:aspect-auto xl:h-[350px]">
            <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-main)]/50">
              Duration
            </span>
            <div>
              <div className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tighter mb-2">
                18
              </div>
              <span className="text-lg md:text-xl font-light text-[var(--text-main)]/70">Months</span>
            </div>
          </div>

          {/* Stat 2: Qualification */}
          <div className="stat-box flex flex-col justify-between p-8 lg:p-12 border-r border-b border-[var(--primary-base)]/10 aspect-square xl:aspect-auto xl:h-[350px]">
            <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-main)]/50">
              Qualification
            </span>
            <div>
              <div className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tighter mb-2">
                12<span className="text-3xl md:text-4xl">th</span>
              </div>
              <span className="text-lg md:text-xl font-light text-[var(--text-main)]/70">Pass Required</span>
            </div>
          </div>

          {/* Stat 3: Intake */}
          <div className="stat-box flex flex-col justify-between p-8 lg:p-12 border-r border-b border-[var(--primary-base)]/10 aspect-square xl:aspect-auto xl:h-[350px]">
            <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-main)]/50">
              Intake
            </span>
            <div>
              <div className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tighter mb-2">
                40
              </div>
              <span className="text-lg md:text-xl font-light text-[var(--text-main)]/70">Students per batch</span>
            </div>
          </div>

          {/* Stat 4: Age Limit */}
          <div className="stat-box flex flex-col justify-between p-8 lg:p-12 border-r border-b border-[var(--primary-base)]/10 aspect-square xl:aspect-auto xl:h-[350px]">
            <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-main)]/50">
              Age Limit
            </span>
            <div>
              <div className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tighter mb-2">
                None
              </div>
              <span className="text-lg md:text-xl font-light text-[var(--text-main)]/70">No age bar</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}