import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Dummy JSON Data (Structured for future API integration)
const syllabusData = [
  {
    category: "B.Sc Degree Programmes",
    items: [
      { id: 1, title: "Syllabus for B.Sc 1st Year (New) under JNU", link: "#" },
      { id: 2, title: "Syllabus for B.Sc 1st Semester (Old) under IGNOU", link: "#" },
      { id: 3, title: "Syllabus for B.Sc 2nd Semester (Old) under IGNOU", link: "#" },
      { id: 4, title: "Syllabus for B.Sc 3rd & 4th Semester (Old) under IGNOU", link: "#" },
      { id: 5, title: "Syllabus for B.Sc 5th Semester (Old) under IGNOU", link: "#" },
      { id: 6, title: "Syllabus for B.Sc 6th Semester (Old) under IGNOU", link: "#" },
    ]
  },
  {
    category: "Diploma Programmes",
    items: [
      { id: 7, title: "Syllabus for Diploma in Food Production", link: "#" },
      { id: 8, title: "Syllabus for Diploma in Food & Beverage Service", link: "#" },
      { id: 9, title: "Syllabus for Diploma in House Keeping", link: "#" },
    ]
  }
];

export default function SyllabusList() {
  const containerRef = useRef(null);

  useGSAP(() => {
    // Animate each category block as it scrolls into view
    gsap.utils.toArray('.category-block').forEach((block) => {
      
      const header = block.querySelector('.category-header');
      const rows = block.querySelectorAll('.syllabus-row');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: block,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      });

      // 1. Fade up the category header
      tl.fromTo(header,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );

      // 2. Stagger in the document rows beneath it
      tl.fromTo(rows,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" },
        "-=0.4" // Overlap animation slightly for a smoother flow
      );
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full bg-[var(--background)] text-[var(--text-main)] py-20 md:py-32 overflow-hidden border-t border-[var(--primary-base)]/10">
      <div className="w-full max-w-[1800px] mx-auto px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        
        {syllabusData.map((category, catIndex) => (
          <div key={catIndex} className="category-block flex flex-col mb-24 last:mb-0">
            
            {/* Category Header */}
            <div className="category-header flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-16 gap-6">
              <div>
                <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)] mb-4 block">
                  Archive Category 0{catIndex + 1}
                </span>
                <h2 className="head-txt text-4xl md:text-5xl lg:text-6xl tracking-tighter text-[var(--text-main)] leading-none">
                  {category.category}.
                </h2>
              </div>
              <div className="hidden md:block w-32 h-[1px] bg-[var(--primary-base)]/20 mb-2"></div>
            </div>

            {/* Interactive Document Rows */}
            <div className="flex flex-col border-t border-[var(--primary-base)]/10">
              {category.items.map((item) => (
                <a 
                  key={item.id} 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="syllabus-row group flex flex-col md:flex-row justify-between items-start md:items-center py-6 md:py-8 border-b border-[var(--primary-base)]/10 hover:bg-[var(--primary-base)]/5 transition-colors duration-500 px-4 md:px-8 -mx-4 md:-mx-8 cursor-pointer"
                >
                  
                  {/* Document Title */}
                  <h3 className="text-lg md:text-xl lg:text-2xl font-light tracking-tight text-[var(--text-main)]/90 group-hover:text-[var(--text-main)] transition-colors duration-300 pr-8 md:pr-12 mb-4 md:mb-0">
                    {item.title}
                  </h3>
                  
                  {/* View Action Indicator */}
                  <div className="flex items-center gap-4 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-xs md:text-sm font-semibold uppercase tracking-[0.2em] text-[var(--text-main)]">
                      View Document
                    </span>
                    
                    {/* Animated SVG Arrow */}
                    <div className="w-10 h-10 rounded-full border border-[var(--primary-base)]/20 flex items-center justify-center group-hover:bg-[var(--accent)] group-hover:border-transparent transition-all duration-300">
                      <svg 
                        className="w-4 h-4 text-[var(--text-main)] group-hover:text-[var(--background)] transform group-hover:-rotate-45 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]" 
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                  
                </a>
              ))}
            </div>

          </div>
        ))}
        
      </div>
    </section>
  );
}