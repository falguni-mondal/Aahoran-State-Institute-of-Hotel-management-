import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';

export default function RulesHero() {
  const heroRef = useRef(null);

  useGSAP(() => {
    // 1. Initialize SplitType for character-by-character reveal
    const heading = document.querySelector('.rules-hero-heading');
    let splitHeading;
    
    if (heading) {
      splitHeading = new SplitType(heading, { types: 'words, chars', charClass: 'hero-char' });
      
      // Wrap characters in hidden overflow divs for clean rising effect
      splitHeading.chars.forEach((char) => {
        const wrapper = document.createElement('div');
        wrapper.style.overflow = 'hidden';
        wrapper.style.display = 'inline-block';
        
        // Anti-Clipping Fix
        wrapper.style.paddingTop = '0.1em';
        wrapper.style.paddingBottom = '0.1em';
        wrapper.style.marginTop = '-0.1em';
        wrapper.style.marginBottom = '-0.1em';
        
        char.parentNode.insertBefore(wrapper, char);
        wrapper.appendChild(char);
      });

      // 2. Animate characters up
      gsap.fromTo(splitHeading.chars, 
        { yPercent: 100 },
        { 
          yPercent: 0, 
          duration: 1.2, 
          stagger: 0.02, 
          ease: "expo.out",
          delay: 0.2
        }
      );
    }

    // 3. Fade in subtitle and line indicator
    gsap.fromTo('.rules-hero-fade',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.2, delay: 0.8 }
    );

    // 4. Draw scroll line
    gsap.fromTo('.scroll-line-container', 
      { scaleY: 0 },
      { scaleY: 1, duration: 1.2, ease: "expo.out", delay: 1.2, transformOrigin: "top" }
    );

    return () => {
      if (splitHeading) splitHeading.revert();
    };
  }, { scope: heroRef });

  return (
    <section 
      ref={heroRef} 
      className="relative w-full h-[100svh] min-h-[600px] bg-[var(--background)] text-[var(--primary-base)] flex flex-col justify-center items-center overflow-hidden px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24 pt-20"
    >
      
      <div className="flex flex-col items-center text-center z-10 w-full max-w-7xl">
        
        <span className="rules-hero-fade text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)] mb-6 md:mb-8 block">
          Official Guidelines
        </span>
        
        <h1 className="rules-hero-heading head-txt text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[10rem] leading-[0.85] tracking-tighter uppercase w-full">
          Institute <br /> Regulations
        </h1>
        
      </div>

      {/* =========================================
         DELICATE SCROLL INDICATOR
      ========================================= */}
      <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
        <span className="rules-hero-fade text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-medium opacity-50">
          Scroll to explore
        </span>
        
        <div className="scroll-line-container w-[1px] h-12 md:h-16 bg-[var(--primary-base)]/20 relative overflow-hidden">
          {/* Infinite scrolling inner line */}
          <div className="absolute top-0 left-0 w-full h-1/2 bg-[var(--primary-base)] animate-[scrollDown_2s_ease-in-out_infinite]"></div>
        </div>
      </div>
      
      {/* Inline styles for the specific scroll animation */}
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