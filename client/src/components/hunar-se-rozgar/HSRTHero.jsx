import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';

export default function HSRTHero() {
  const sectionRef = useRef(null);
  
  // Dynamically fetches the current year for the metadata
  const currentYear = new Date().getFullYear();

  useGSAP(() => {
    const tl = gsap.timeline();
    
    // 1. Image Wrapper Clip Reveal & Inner Parallax Scale
    tl.fromTo('.hero-img-wrapper',
      { clipPath: 'inset(100% 0% 0% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut' }
    ).fromTo('.hero-img-inner',
      { scale: 1.2 },
      { scale: 1, duration: 2, ease: 'power3.out' },
      "-=1.5"
    );

    // 2. Line-by-Line Typography Reveal
    const heading = document.querySelector('.hsrt-heading');
    let splitHeading;
    if (heading) {
      splitHeading = new SplitType(heading, { types: 'lines', lineClass: 'split-line' });
      
      splitHeading.lines.forEach((line) => {
        const wrapper = document.createElement('div');
        wrapper.style.overflow = 'hidden';
        wrapper.style.display = 'block';
        line.parentNode.insertBefore(wrapper, line);
        wrapper.appendChild(line);
      });

      tl.fromTo(splitHeading.lines,
        { yPercent: 100 },
        { yPercent: 0, duration: 1.2, stagger: 0.1, ease: 'expo.out' },
        "-=1.2"
      );
    }

    // 3. Metadata Fade-in
    tl.fromTo('.hero-meta',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power2.out' },
      "-=0.8"
    );

    return () => { if (splitHeading) splitHeading.revert(); };
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative w-full h-[100svh] min-h-[700px] bg-[var(--background)] flex items-center pt-24 pb-12 overflow-hidden selection:bg-[var(--accent)] selection:text-[var(--primary-base)]">
      <div className="w-full max-w-[1800px] mx-auto px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24 flex flex-col-reverse lg:flex-row items-center justify-between h-full gap-10">
        
        {/* LEFT: Massive Typography & Metadata */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center relative z-10 h-full">
          <div className="hero-meta flex items-center gap-4 mb-8 lg:mb-12">
            <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
              Skill Certification
            </span>
            <div className="w-12 h-[1px] bg-[var(--primary-base)]/20"></div>
            <span className="text-[10px] md:text-xs font-medium uppercase tracking-[0.2em] text-[var(--primary-base)]/60">
              Academic Year {currentYear}
            </span>
          </div>
          
          <h1 className="hsrt-heading head-txt text-[11vw] md:text-7xl lg:text-8xl xl:text-[8rem] 2xl:text-[10rem] leading-[0.85] tracking-tighter text-[var(--primary-base)] uppercase">
            Hunar Se <br /> Rozgar Tak.
          </h1>
          
          <div className="hero-meta mt-12 max-w-sm">
            <p className="text-sm md:text-base font-light text-[var(--primary-base)]/70 leading-[1.8]">
              A transformative initiative empowering individuals with essential, job-oriented skills for the hospitality industry.
            </p>
          </div>
        </div>

        {/* RIGHT: Constrained Editorial Gallery Image */}
        <div className="w-full lg:w-5/12 h-[50vh] lg:h-[75vh] flex justify-end items-center">
          <div className="hero-img-wrapper w-full max-w-[450px] lg:max-w-none lg:w-full h-full aspect-[4/5] relative overflow-hidden bg-[var(--primary-base)]/5">
            <img 
              src="/hsrt-hero.webp" 
              alt="Hunar Se Rozgar Tak Student" 
              className="hero-img-inner absolute inset-0 w-full h-full object-cover will-change-transform"
            />
          </div>
        </div>

      </div>
    </section>
  );
}