import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const chapters = [
  {
    id: "01",
    title: "The Threat of Ragging",
    text: "Ragging is a disturbing reality that goes far beyond playful banter, often escalating into psychological and physical abuse. It strips students of their dignity, disrupts their academic focus, and creates an environment of fear. We recognize ragging not as a rite of passage, but as a severe violation of human rights that has absolutely no place in an institution of learning."
  },
  {
    id: "02",
    title: "The Law of India",
    text: "Under the directives of the Honorable Supreme Court of India and the University Grants Commission (UGC), ragging is a strictly punishable criminal offense. The 'UGC Regulations on Curbing the Menace of Ragging in Higher Educational Institutions, 2009' mandates uncompromising compliance from all colleges. SIHM Durgapur operates strictly under these federal and state frameworks, ensuring total legal alignment and zero loopholes for offenders."
  },
  {
    id: "03",
    title: "Strict Penalties",
    text: "Any student found guilty of ragging, or abetting ragging, will face immediate and severe disciplinary action. Penalties include immediate suspension from classes, expulsion from the hostel, cancellation of admission, and the mandatory lodging of a First Information Report (FIR) with the local police. A ruined career and a permanent criminal record are the guaranteed outcomes for those who choose to violate this mandate."
  },
  {
    id: "04",
    title: "Anonymous Reporting",
    text: "We have established a robust, 24/7 anti-ragging cell and anonymous reporting mechanisms. Students and parents can reach out to the authorities without any fear of retaliation. Our faculty and anti-ragging squad conduct surprise checks across hostels, canteens, and campus grounds to ensure our promise of safety is actively enforced every single day."
  }
];

export default function ARContent() {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Smooth scroll handler for the sidebar navigation
  const handleScrollTo = (index) => {
    const targetElement = document.querySelector(`.chapter-content-${index}`);
    if (targetElement) {
      targetElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  };

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(min-width: 320px)", () => {
      
      chapters.forEach((_, index) => {
        // 1. Scroll-Spy logic to update the sticky sidebar active state
        ScrollTrigger.create({
          trigger: `.chapter-content-${index}`,
          start: "top 50%", // Triggers when the top of the paragraph hits the middle of the screen
          end: "bottom 50%",
          onEnter: () => setActiveIndex(index),
          onEnterBack: () => setActiveIndex(index),
        });

        // 2. Fade up animation for the paragraphs as they scroll into view
        gsap.fromTo(`.chapter-content-${index}`,
          { opacity: 0, y: 40 },
          {
            opacity: 1, 
            y: 0, 
            duration: 1.2, 
            ease: "power3.out",
            scrollTrigger: {
              trigger: `.chapter-content-${index}`,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });
    });

    return () => mm.revert();
  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef} 
      className="relative w-full px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-20 md:py-32 lg:py-40 bg-[var(--background)]"
    >
      <div className="w-full max-w-[1800px] mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 xl:gap-32">
        
        {/* ==========================================
            LEFT COLUMN: STICKY CHAPTER NAVIGATION
        ========================================== */}
        <div className="w-full lg:w-1/3 relative">
          <div className="lg:sticky lg:top-[30vh] flex flex-col gap-6 md:gap-8">
            <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)] mb-4">
              Editorial Brief
            </span>
            
            <ul className="flex flex-col gap-6">
              {chapters.map((chapter, index) => (
                <li 
                  key={chapter.id} 
                  onClick={() => handleScrollTo(index)}
                  className={`group flex items-start gap-4 transition-all duration-500 cursor-pointer ${
                    activeIndex === index 
                      ? 'opacity-100 translate-x-2' 
                      : 'opacity-30 hover:opacity-70'
                  }`}
                >
                  <span className="font-sans text-[10px] md:text-xs font-bold text-[var(--accent)] mt-1.5 md:mt-2 transition-colors duration-300">
                    {chapter.id}.
                  </span>
                  <h3 className={`text-2xl md:text-3xl lg:text-4xl font-light tracking-tight transition-colors duration-500 ${
                    activeIndex === index 
                      ? 'text-[var(--primary-base)]' 
                      : 'text-[var(--primary-base)]/50 group-hover:text-[var(--primary-base)]'
                  }`}>
                    {chapter.title}
                  </h3>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ==========================================
            RIGHT COLUMN: SCROLLING PARAGRAPHS
        ========================================== */}
        <div className="w-full lg:w-2/3 flex flex-col pt-0 lg:pt-[10vh] pb-[10vh]">
          {chapters.map((chapter, index) => (
            <div 
              key={chapter.id} 
              className={`chapter-content-${index} flex flex-col mb-24 md:mb-32 lg:mb-48 last:mb-0`}
            >
              {/* Mobile Title (Hidden on Desktop) */}
              <h3 className="lg:hidden text-2xl md:text-3xl font-light tracking-tight text-[var(--primary-base)] mb-6">
                <span className="text-[var(--accent)] text-sm font-bold mr-3">{chapter.id}.</span>
                {chapter.title}
              </h3>
              
              {/* Editorial Paragraph */}
              <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-serif text-[var(--primary-base)]/80 leading-[1.7] md:leading-[1.8] lg:leading-[1.9]">
                {chapter.text}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}