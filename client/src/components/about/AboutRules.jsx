import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Extracted and adapted the GSAP CTA button for the light theme
function RulesCTA({ text, href }) {
  const btnRef = useRef(null);
  const { contextSafe } = useGSAP({ scope: btnRef });

  const handleMouseEnter = contextSafe(() => {
    gsap.to(".cta-text-main", { y: "-110%", duration: 0.6, ease: "expo.inOut" });
    gsap.to(".cta-text-hover", { y: "0%", duration: 0.6, ease: "expo.inOut" });
  });

  const handleMouseLeave = contextSafe(() => {
    gsap.to(".cta-text-main", { y: "0%", duration: 0.6, ease: "expo.inOut" });
    gsap.to(".cta-text-hover", { y: "110%", duration: 0.6, ease: "expo.inOut" });
  });

  return (
    <Link 
      to={href}
      ref={btnRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="bg-[var(--primary-base)] text-[var(--text-light)] font-semibold text-xs md:text-sm uppercase tracking-[0.15em] shadow-lg cursor-pointer flex items-stretch h-12 md:h-14 w-fit"
    >
      {/* Text Zone */}
      <div className="flex items-center justify-center px-8 md:px-10 relative overflow-hidden">
        <div className="relative overflow-hidden h-[1em] leading-none flex items-center justify-center">
          <span className="cta-text-main block">{text}</span>
          <span className="cta-text-hover absolute block translate-y-[110%]">{text}</span>
        </div>
      </div>
      
      {/* Icon Zone - Completely static single SVG */}
      <div className="border-l border-[var(--text-light)]/20 px-4 md:px-5 flex items-center justify-center">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="block w-4 h-4 md:w-5 md:h-5">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>
    </Link>
  );
}

export default function AboutRules() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    // 1. Initialize SplitType for the heading
    const heading = document.querySelector('.rules-heading');
    let splitHeading;
    
    if (heading) {
      splitHeading = new SplitType(heading, { types: 'lines', lineClass: 'split-line' });
      
      // Wrap each line in a hidden overflow div for the pure mask reveal
      splitHeading.lines.forEach((line) => {
        const wrapper = document.createElement('div');
        wrapper.style.overflow = 'hidden';
        wrapper.style.display = 'block';
        
        wrapper.style.paddingTop = '0.1em';
        wrapper.style.paddingBottom = '0.125em';
        wrapper.style.marginTop = '-0.1em';
        wrapper.style.marginBottom = '-0.1em';
        
        line.parentNode.insertBefore(wrapper, line);
        wrapper.appendChild(line);
      });
    }

    let mm = gsap.matchMedia();

    mm.add({
      isDesktop: "(min-width: 1024px)",
      isMobile: "(max-width: 1023px)"
    }, (context) => {
      let { isDesktop } = context.conditions;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: isDesktop ? "top 80%" : "top 90%",
          toggleActions: "play none none reverse"
        }
      });

      // Label Reveal
      tl.fromTo('.rules-label',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );

      // Heading Line-by-Line Reveal
      if (splitHeading) {
        tl.fromTo(splitHeading.lines,
          { yPercent: 100 },
          { yPercent: 0, duration: 1, stagger: 0.1, ease: 'expo.out' },
          "-=0.6"
        );
      }

      // Paragraph Reveal
      tl.fromTo('.rules-desc',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        "-=0.6"
      );

      // CTA Button Mask Reveal
      tl.fromTo('.rules-cta',
        { y: 20, opacity: 0, clipPath: "inset(0% 100% 0% 0%)" },
        { y: 0, opacity: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: 'expo.out' },
        "-=0.6"
      );
    });

    return () => {
      mm.revert();
      if (splitHeading) splitHeading.revert();
    };
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative w-full bg-[var(--background)] text-[var(--primary-base)] py-20 md:py-24 lg:py-32 xl:py-40 border-t border-[var(--primary-base)]/10">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24 mx-auto max-w-[1800px]">
        
        {/* Main Flex Layout: Stacks on mobile/tablet, side-by-side on desktop */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 lg:gap-20">
          
          {/* Left Side: Header */}
          <div className="flex flex-col lg:w-7/12 xl:w-6/12">
            <span className="rules-label text-[10px] md:text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)] mb-4 md:mb-6 block">
              Administration
            </span>
            <h2 className="rules-heading head-txt text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tighter">
              Rules & <br className="hidden md:block"/> Regulations.
            </h2>
          </div>

          {/* Right Side: Description & CTA */}
          <div className="flex flex-col lg:w-5/12 xl:w-4/12 pb-2">
            <p className="rules-desc text-base md:text-lg font-light text-[var(--primary-base)]/80 leading-[1.7] mb-8 md:mb-10">
              Discipline and professionalism are the cornerstones of the hospitality industry. Familiarize yourself with the core guidelines that shape the culture and standards at SIHM Durgapur.
            </p>
            
            {/* Component-based GSAP CTA Button */}
            <div className="rules-cta w-fit will-change-transform">
              <RulesCTA text="Read Guidelines" href="/about/rules" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}