import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const generalRules = [
  "The student is expected to attend 100% classes. However, below 75% attendance, the student is not eligible to appear for term end examination.",
  "The students must not absent themselves from any Institute activity without the prior permission of the Principal.",
  "The Institute may take disciplinary action against a student whose conduct is not satisfactory and the fees paid will be forfeited.",
  "Smoking & Drinking is strictly prohibited in all areas of the Institute.",
  "No student should communicate any information or write about matters dealing with Institute administration in the press.",
  "Absence without leave is considered a breach of discipline.",
  "The Institute authorities cannot accept any liability in respect of any accident caused to a student while engaged in practical work or due to any other causes.",
  "Any change of address should be immediately notified of Institute's records.",
  "Matters not covered by the existing rules will rest at the absolute discretion of the institute.",
  "Every Student must always carry his/her identity card which will be supplied by the Institute office on payment."
];

export default function RulesGeneral() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(min-width: 320px)", () => {
      const items = gsap.utils.toArray('.rule-item');

      items.forEach((item) => {
        ScrollTrigger.create({
          trigger: item,
          start: "top 75%", // Triggers when the item is 75% down the screen
          end: "bottom 25%", // Stays active until it goes 25% near the top
          toggleClass: { targets: item, className: "is-active" }
        });
      });
    });

    return () => mm.revert();
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative w-full bg-[var(--primary-base)] text-[var(--text-light)] py-24 md:py-32 lg:py-48 border-t border-[var(--text-light)]/10">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24 mx-auto max-w-[1800px] flex flex-col lg:flex-row gap-16 lg:gap-24 xl:gap-32">
        
        {/* =========================================
           LEFT COLUMN: Sticky Header
        ========================================= */}
        <div className="lg:w-4/12 xl:w-1/3 flex flex-col lg:sticky lg:top-40 lg:h-fit relative z-10">
          <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)] mb-4 md:mb-6 block">
            01 / Core Guidelines
          </span>
          <h2 className="head-txt text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tighter">
            General <br className="hidden md:block"/> Regulations.
          </h2>
        </div>

        {/* =========================================
           RIGHT COLUMN: Scrolling Rules List
        ========================================= */}
        <div className="lg:w-8/12 xl:w-2/3 flex flex-col">
          <div className="flex flex-col border-t border-[var(--text-light)]/15">
            
            {generalRules.map((rule, index) => {
              // Format number with leading zero (e.g., 01, 02)
              const num = (index + 1).toString().padStart(2, '0');
              
              return (
                <div 
                  key={index} 
                  className="rule-item group relative flex flex-col md:flex-row border-b border-[var(--text-light)]/15 py-12 md:py-16 lg:py-20 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] opacity-30 [&.is-active]:opacity-100"
                >
                  
                  {/* The Massive Faded Number */}
                  <div className="md:w-1/4 flex items-start mb-6 md:mb-0">
                    <span className="font-sans font-bold text-6xl md:text-7xl lg:text-8xl tracking-tighter text-[var(--text-light)]/10 group-[.is-active]:text-[var(--accent)]/20 transition-colors duration-700">
                      {num}
                    </span>
                  </div>

                  {/* The Rule Text */}
                  <div className="md:w-3/4 flex items-center md:pl-8 lg:pl-12">
                    <p className="text-lg md:text-xl lg:text-2xl font-light leading-[1.6] md:leading-[1.7] text-[var(--text-light)] group-[.is-active]:translate-x-2 md:group-[.is-active]:translate-x-4 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]">
                      {rule}
                    </p>
                  </div>
                  
                </div>
              );
            })}

          </div>
        </div>

      </div>
    </section>
  );
}