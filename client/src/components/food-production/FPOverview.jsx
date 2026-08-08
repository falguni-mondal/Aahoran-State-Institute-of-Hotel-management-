import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function FPOverview() {
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
          
          {/* Left: The Massive Statistic representing the 5 senses mentioned in the text */}
          <div className="w-full lg:w-5/12 flex flex-col relative shrink-0">
            <span className="stat-text text-[10px] md:text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)] mb-2 md:mb-6 block">
              The Five Senses
            </span>
            <div className="stat-num head-txt text-[120px] md:text-[180px] lg:text-[200px] xl:text-[250px] 2xl:text-[300px] leading-[0.8] tracking-tighter text-[var(--primary-base)] relative z-10">
              05<span className="text-[40px] md:text-[60px] lg:text-[80px] xl:text-[100px] absolute top-2 md:top-6 lg:top-8 xl:top-10 ml-2 text-[var(--accent)] font-serif">*</span>
            </div>
          </div>

          {/* Right: The Narrative */}
          <div className="w-full lg:w-7/12 flex flex-col justify-end lg:pt-16 xl:pt-24">
            <h3 className="stat-text text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light tracking-tight mb-8 md:mb-12 leading-[1.2]">
              It is said that we eat with our eyes, nose, mouth (tongue) and stomach, and a chef has to not only make the food edible, but he has to take care of the eye-appeal and gastronomic values of each item.
            </h3>
            <p className="stat-text text-base md:text-lg lg:text-xl xl:text-2xl font-light text-[var(--primary-base)]/70 leading-[1.7] md:leading-[1.8] max-w-2xl">
              This department deals with the preparation, production and presentation of foods from different cuisines from all over the world. Knowledge of many ingredients used to prepare items from different cuisines, their nutritional values, effects of different cooking methods of each ingredient – all are discussed in details in the classes.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}