import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';

export default function LabHero() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    // 1. Image slow scale effect
    gsap.fromTo('.lab-hero-bg', 
      { scale: 1.15 }, 
      { scale: 1, duration: 2.5, ease: 'expo.out' }
    );

    // 2. SplitType Typography Reveal
    const heading = document.querySelector('.lab-heading');
    let splitHeading;

    if (heading) {
      splitHeading = new SplitType(heading, { types: 'chars', charClass: 'split-char' });
      
      splitHeading.chars.forEach((char) => {
        const wrapper = document.createElement('div');
        wrapper.style.overflow = 'hidden';
        wrapper.style.display = 'inline-block';
        
        wrapper.style.paddingTop = '0.1em';
        wrapper.style.paddingBottom = '0.1em';
        wrapper.style.marginTop = '-0.1em';
        wrapper.style.marginBottom = '-0.1em';
        
        char.parentNode.insertBefore(wrapper, char);
        wrapper.appendChild(char);
      });

      gsap.fromTo(splitHeading.chars,
        { yPercent: 100 },
        { yPercent: 0, duration: 1.2, stagger: 0.04, ease: 'expo.out', delay: 0.2 }
      );
    }

    // 3. Subtitle fade in
    gsap.fromTo('.lab-hero-sub',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.8 }
    );

    return () => {
      if (splitHeading) splitHeading.revert();
    };
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative w-full h-[100svh] min-h-[600px] bg-[var(--primary-base)] flex items-center justify-center overflow-hidden">
      
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <img 
          src="/computer-lab.webp" 
          alt="Advanced Digital Lab" 
          className="lab-hero-bg absolute inset-0 w-full h-full object-cover will-change-transform"
        />
        <div className="absolute inset-0 bg-[var(--primary-base)]/80 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_var(--primary-base)_100%)] opacity-80"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-5">
        <span className="lab-hero-sub text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)] mb-6 block">
          Digital Infrastructure
        </span>
        <h1 className="lab-heading head-txt text-6xl md:text-8xl lg:text-9xl xl:text-[10rem] leading-[0.85] tracking-tighter text-[var(--text-light)] uppercase">
          The Digital <br /> Lab.
        </h1>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10 opacity-50">
        <span className="text-[9px] uppercase tracking-[0.2em] text-[var(--text-light)] font-medium">Scroll</span>
        <div className="w-[1px] h-12 bg-[var(--text-light)]/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-[var(--text-light)] animate-[scrollDown_2s_ease-in-out_infinite]"></div>
        </div>
      </div>

      {/* FIXED: Added missing keyframes for the scroll line */}
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