import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const rulesData = [
  "The academic session will start from 09am to 05pm in the evening.",
  "Students are instructed to follow the timetable on the student's notice board.",
  "Students are instructed to wear formal dresses to attend the class.",
  "Students should maintain a proper grooming as per instruction of the faculty.",
  "Students are instructed to bring their notebooks, toolkits regularly in the classroom.",
  "No students are allowed to attend the practical class without uniform.",
  "The student should come either with Sneaker or covered shoe.",
  "80% attendance is compulsory to complete the Hunar Se Rozgar Tak course otherwise the student would be debarred from getting a stipend.",
  "The student has to appear in the practical examination which would be evaluated by the external examiner.",
  "Students are not allowed to operate any mobile in the campus of SIHM.",
  "Students are prohibited to chew pan, Pan Parag, any other narcotics and hard drinks within the campus.",
  "Any damage caused by the students has to be recovered from them only.",
  "Ragging is strictly prohibited in the campus.",
  "The Institute is not responsible for any theft or misappropriation of any asset.",
  "Matters not covered by the existing rules will rest at the absolute discretion of the institute."
];

export default function HSRTRules() {
  const containerRef = useRef(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    // DESKTOP ANIMATIONS: Pinned Title & Staggered Rule Reveal
    mm.add("(min-width: 1024px)", () => {
      // Pin the left heading container
      ScrollTrigger.create({
        trigger: ".rules-container",
        start: "top 120px", // Offset for your navbar
        end: "bottom bottom",
        pin: ".rules-pin-container",
      });

      // Fade up each rule as it enters the screen
      gsap.utils.toArray('.rule-item').forEach((rule) => {
        gsap.fromTo(rule, 
          { opacity: 0, y: 30 },
          { 
            opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
            scrollTrigger: {
              trigger: rule,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });
    });

    // MOBILE ANIMATIONS: Simple Scroll Reveals
    mm.add("(max-width: 1023px)", () => {
       gsap.utils.toArray('.rule-item-mobile').forEach((elem) => {
          gsap.fromTo(elem,
            { opacity: 0, y: 30 },
            {
              opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
              scrollTrigger: {
                trigger: elem,
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
    <section ref={containerRef} className="w-full bg-[var(--background)] text-[var(--text-main)] py-20 md:py-32 lg:py-48 relative border-t border-[var(--primary-base)]/10">
      <div className="rules-container w-full max-w-[1800px] mx-auto px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24 flex flex-col lg:flex-row relative">
        
        {/* ==========================================
            LEFT: PINNED HEADING (Desktop) / TOP HEADING (Mobile)
        ========================================== */}
        <div className="w-full lg:w-5/12 lg:h-[calc(100vh-120px)] rules-pin-container relative z-10 flex flex-col justify-start pt-4 mb-16 lg:mb-0 pr-0 lg:pr-12">
          
          <div className="flex items-center gap-4 mb-6 opacity-80">
            <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
              Code of Conduct
            </span>
            <div className="w-12 h-[1px] bg-[var(--primary-base)]/20"></div>
          </div>
          
          <h2 className="head-txt text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light tracking-tighter leading-[1.05] text-[var(--text-main)] mb-8">
            Rules & Regulations <br className="hidden lg:block"/> for Students
          </h2>

          <p className="text-base md:text-lg font-light leading-[1.8] text-[var(--text-main)]/70 max-w-md">
            The following guidelines apply to all students enrolled in the Skill Testing Certification Program to ensure a professional and disciplined academic environment.
          </p>

        </div>

        {/* ==========================================
            RIGHT: SCROLLING RULES LIST
        ========================================== */}
        <div className="w-full lg:w-7/12 flex flex-col z-20">
          
          {/* Top border for the first item */}
          <div className="w-full h-[1px] bg-[var(--primary-base)]/10"></div>

          {rulesData.map((rule, index) => {
            // Format number to have a leading zero (01, 02, etc.)
            const ruleNumber = (index + 1).toString().padStart(2, '0');
            
            return (
              <div 
                key={index} 
                className="rule-item rule-item-mobile flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10 py-8 md:py-12 border-b border-[var(--primary-base)]/10 group hover:bg-[var(--primary-base)]/5 transition-colors duration-500 px-4 md:px-8 -mx-4 md:-mx-8"
              >
                
                {/* Elegant Number */}
                <div className="w-12 md:w-16 shrink-0 font-serif text-3xl md:text-4xl lg:text-5xl font-light text-[var(--accent)]/60 group-hover:text-[var(--accent)] transition-colors duration-500">
                  {ruleNumber}
                </div>
                
                {/* Rule Text */}
                <p className="text-lg md:text-xl lg:text-2xl font-light leading-[1.6] text-[var(--text-main)]/90 tracking-tight">
                  {rule}
                </p>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}