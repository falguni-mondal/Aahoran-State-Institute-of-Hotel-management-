import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Dummy JSON Data (Structured for future API integration)
const studyMaterialsData = [
  {
    id: 'sem-ii',
    title: 'Semester II',
    materials: [
      { id: 1, title: 'Food Production Operations Notes', isNew: false, link: '#' },
      { id: 2, title: 'Food & Beverage Service Notes', isNew: false, link: '#' },
      { id: 3, title: 'Front Office Operations Notes', isNew: true, link: '#' },
      { id: 4, title: 'Accommodation Operations Notes', isNew: false, link: '#' },
    ]
  },
  {
    id: 'sem-iv',
    title: 'Semester IV',
    materials: [
      { id: 5, title: 'Front Office Notes', isNew: false, link: '#' },
      { id: 6, title: 'Food & Beverage Controls', isNew: false, link: '#' },
      { id: 7, title: 'Food & Beverage Operations', isNew: false, link: '#' },
      { id: 8, title: 'Food Safety & Quality', isNew: false, link: '#' },
      { id: 9, title: 'Food Production Operations Notes', isNew: true, link: '#' },
      { id: 10, title: 'Accommodation Operations Notes', isNew: true, link: '#' },
      { id: 11, title: 'Hotel Accountancy Notes', isNew: true, link: '#' },
    ]
  }
];

export default function StudyMaterialList() {
  const containerRef = useRef(null);
  const listRef = useRef(null);
  
  // State to track which semester is currently active (defaults to the first one)
  const [activeSemester, setActiveSemester] = useState(studyMaterialsData[0].id);

  // Get the data for the currently selected semester
  const activeData = studyMaterialsData.find(sem => sem.id === activeSemester);

  useGSAP(() => {
    // 1. Initial Scroll Reveal for the whole section
    gsap.fromTo('.tab-header',
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }, { scope: containerRef });

  useGSAP(() => {
    // 2. Dynamic Stagger Reveal every time the tab changes
    const rows = listRef.current.querySelectorAll('.material-row');
    
    gsap.fromTo(rows,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: "power2.out" }
    );
  }, { scope: listRef, dependencies: [activeSemester] });

  return (
    <section ref={containerRef} className="w-full bg-[var(--background)] text-[var(--text-main)] py-20 md:py-32 overflow-hidden border-t border-[var(--primary-base)]/10">
      <div className="w-full max-w-[1800px] mx-auto px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        
        {/* ==========================================
            ELEGANT TAB SWITCHER
        ========================================== */}
        <div className="tab-header flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-20 gap-8 border-b border-[var(--primary-base)]/10 pb-8 md:pb-12">
          
          <div className="flex flex-col gap-4">
            <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
              Select Semester
            </span>
            
            <div className="flex flex-wrap items-center gap-6 md:gap-10">
              {studyMaterialsData.map((semester) => {
                const isActive = activeSemester === semester.id;
                
                return (
                  <button
                    key={semester.id}
                    onClick={() => setActiveSemester(semester.id)}
                    className="group relative outline-none flex items-center"
                  >
                    <span className={`text-2xl md:text-3xl lg:text-4xl font-light tracking-tighter transition-colors duration-500 ${
                      isActive ? 'text-[var(--text-main)]' : 'text-[var(--text-main)]/40 hover:text-[var(--text-main)]/70'
                    }`}>
                      [ {semester.title} ]
                    </span>
                    
                    {/* Active Tab Indicator Line */}
                    {isActive && (
                      <span className="absolute -bottom-2 left-0 w-full h-[1px] bg-[var(--primary-base)]"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          
        </div>

        {/* ==========================================
            INTERACTIVE DOCUMENT LIST
        ========================================== */}
        <div ref={listRef} className="flex flex-col min-h-[500px]">
          {activeData.materials.map((item) => (
            <a 
              key={item.id} 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="material-row group flex flex-col md:flex-row justify-between items-start md:items-center py-6 md:py-8 border-b border-[var(--primary-base)]/10 hover:bg-[var(--primary-base)]/5 transition-colors duration-500 px-4 md:px-8 -mx-4 md:-mx-8 cursor-pointer"
            >
              
              {/* Left Side: Document Title & Badge */}
              <div className="flex items-center gap-4 md:gap-6 mb-4 md:mb-0 pr-8 md:pr-12">
                <h3 className="text-lg md:text-xl lg:text-2xl font-light tracking-tight text-[var(--text-main)]/90 group-hover:text-[var(--text-main)] transition-colors duration-300">
                  {item.title}
                </h3>
                
                {/* Premium Modern 'NEW' Badge */}
                {item.isNew && (
                  <span className="shrink-0 bg-[var(--accent)] text-[var(--text-light)] text-[9px] md:text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm mt-1">
                    New
                  </span>
                )}
              </div>
              
              {/* Right Side: View Action Indicator */}
              <div className="flex items-center gap-4 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-xs md:text-sm font-semibold uppercase tracking-[0.2em] text-[var(--text-main)]">
                  Download
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
    </section>
  );
}