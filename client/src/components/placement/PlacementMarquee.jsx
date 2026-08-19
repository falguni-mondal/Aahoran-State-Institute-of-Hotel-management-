import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const recruitingPartners = [
  { name: 'Courtyard by Marriott', category: 'Luxury Hospitality' },
  { name: 'Novotel Hotels', category: 'Global Resort' },
  { name: 'Ramada by Wyndham', category: 'International Chain' },
  { name: 'The Pride Hotel', category: 'Premium Hospitality' },
  { name: 'Calvin Klein', category: 'Luxury Retail' },
  { name: 'Tommy Hilfiger', category: 'Global Lifestyle' },
  { name: 'Domino\'s India', category: 'F&B Management' },
  { name: 'Pizza Hut', category: 'Global Dining' },
  { name: 'Arvind Lifestyle', category: 'Retail Management' },
];

export default function PlacementMarquee() {
  const containerRef = useRef(null);
  const marqueeTrackRef = useRef(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(min-width: 320px)", () => {
      // Infinite Seamless Marquee Animation
      const marqueeTrack = marqueeTrackRef.current;
      
      gsap.to(marqueeTrack, {
        xPercent: -50,
        repeat: -1,
        duration: 25,
        ease: 'none',
      });
    });

    return () => mm.revert();
  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef} 
      className="relative w-full py-12 md:py-16 lg:py-20 xl:py-24 2xl:py-28 bg-[var(--background)] text-[var(--text-main)] overflow-hidden border-t border-b border-[var(--text-main)]/10"
    >
      
      {/* Top Label */}
      <div className="w-full max-w-[1800px] mx-auto px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24 mb-8 md:mb-12">
        <span className="text-[9px] md:text-[10px] lg:text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)] block text-center md:text-left">
          Recognized Industry Partners & Recruiters
        </span>
      </div>

      {/* Edge Fading Gradient Wrappers for Smooth Visual Flow */}
      <div className="absolute top-0 left-0 w-16 md:w-32 lg:w-48 h-full bg-gradient-to-r from-[var(--background)] to-transparent z-10 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-16 md:w-32 lg:w-48 h-full bg-gradient-to-l from-[var(--background)] to-transparent z-10 pointer-events-none"></div>

      {/* Infinite Marquee Track */}
      <div className="flex w-full overflow-hidden select-none">
        <div 
          ref={marqueeTrackRef} 
          className="flex items-center shrink-0 gap-8 md:gap-12 lg:gap-16 xl:gap-20 2xl:gap-24 w-max pr-8 md:pr-12 lg:pr-16 xl:pr-20 2xl:pr-24"
        >
          {/* Double map to create a seamless infinite loop */}
          {[...recruitingPartners, ...recruitingPartners].map((partner, index) => (
            <div 
              key={index} 
              className="flex items-center gap-6 md:gap-8 lg:gap-10 shrink-0 group cursor-default"
            >
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-light tracking-tight text-[var(--text-main)]/80 group-hover:text-[var(--accent)] transition-colors duration-500 uppercase whitespace-nowrap">
                  {partner.name}
                </span>
                <span className="text-[8px] md:text-[9px] lg:text-[10px] uppercase tracking-[0.2em] font-medium text-[var(--text-main)]/40 mt-1">
                  {partner.category}
                </span>
              </div>

              {/* Decorative Separator Dot */}
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[var(--accent)]/40 group-hover:bg-[var(--accent)] transition-colors duration-500"></div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}