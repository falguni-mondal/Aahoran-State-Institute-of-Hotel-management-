import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function FBOverview() {
  const containerRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
        toggleActions: "play none none reverse"
      }
    });

    tl.fromTo('.stat-num', 
      { y: 50, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "expo.out" }
    ).fromTo('.stat-text',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power3.out" },
      "-=0.8"
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full bg-[var(--background)] text-[var(--primary-base)] py-20 md:py-28 lg:py-36 xl:py-48 2xl:py-56 overflow-hidden">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24 mx-auto max-w-[1800px]">
        
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 lg:gap-20 xl:gap-32">
          
          {/* Left: The Massive Statistic */}
          <div className="w-full lg:w-5/12 flex flex-col relative shrink-0">
            <span className="stat-text text-[10px] md:text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)] mb-2 md:mb-6 block">
              The Overview
            </span>
            <div className="stat-num head-txt text-[120px] md:text-[180px] lg:text-[200px] xl:text-[250px] 2xl:text-[300px] leading-[0.8] tracking-tighter text-[var(--primary-base)] relative z-10">
              98<span className="text-[60px] md:text-[100px] lg:text-[120px] xl:text-[150px] absolute top-2 md:top-6 lg:top-8 xl:top-10">%</span>
            </div>
          </div>

          {/* Right: The Narrative */}
          <div className="w-full lg:w-7/12 flex flex-col justify-end lg:pt-16 xl:pt-24">
            <h3 className="stat-text text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light tracking-tight mb-8 md:mb-12 leading-[1.2]">
              In a recent survey, guests were asked if they prefer automatic peg-measures or the craft of a manual pour.
            </h3>
            <p className="stat-text text-base md:text-lg lg:text-xl xl:text-2xl font-light text-[var(--primary-base)]/70 leading-[1.7] md:leading-[1.8] max-w-2xl">
              An overwhelming 98% opted for the manual pour. This reveals a fundamental truth of our industry: guests are not just looking for the right quantity of food and drink—they are seeking the experience of being truly <span className="italic font-medium text-[var(--primary-base)]">served</span>. That art of service is what we master here.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}