import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';

export default function HKHero() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    // Cinematic slow pull-focus on background
    gsap.fromTo('.hk-hero-bg', 
      { scale: 1.15 }, 
      { scale: 1, duration: 2.5, ease: 'expo.out' }
    );

    // Staggered text reveal
    const heading = document.querySelector('.hk-heading');
    let splitHeading;

    if (heading) {
      splitHeading = new SplitType(heading, { types: 'words, chars', charClass: 'split-char' });
      
      splitHeading.chars.forEach((char) => {
        const wrapper = document.createElement('div');
        wrapper.style.overflow = 'hidden';
        wrapper.style.display = 'inline-block';
        wrapper.style.padding = '0.1em 0';
        wrapper.style.margin = '-0.1em 0';
        char.parentNode.insertBefore(wrapper, char);
        wrapper.appendChild(char);
      });

      gsap.fromTo(splitHeading.chars,
        { yPercent: 100 },
        { yPercent: 0, duration: 1.2, stagger: 0.02, ease: 'expo.out', delay: 0.2 }
      );
    }

    gsap.fromTo('.hk-hero-sub',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.8 }
    );

    return () => { if (splitHeading) splitHeading.revert(); };
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative w-full h-[100svh] min-h-[600px] bg-[var(--primary-base)] flex items-center justify-center overflow-hidden">
      
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <img 
          src="/hk-hero.webp" 
          alt="The Art of Housekeeping" 
          className="hk-hero-bg absolute inset-0 w-full h-full object-cover will-change-transform"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary-base)] via-[var(--primary-base)]/60 to-transparent mix-blend-multiply opacity-90"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24 w-full">
        <span className="hk-hero-sub text-[10px] md:text-xs lg:text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent)] mb-4 md:mb-6 lg:mb-8 block">
          The Art of Perfection
        </span>
        <h1 className="hk-heading head-txt text-5xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[10rem] leading-[0.9] tracking-tighter text-[var(--text-light)] uppercase max-w-[90vw]">
          House <br /> Keeping
        </h1>
      </div>

      <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10 opacity-60">
        <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-[var(--text-light)] font-medium">Discover</span>
        <div className="w-[1px] h-10 md:h-16 bg-[var(--text-light)]/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-[var(--text-light)] animate-[scrollDown_2s_ease-in-out_infinite]"></div>
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