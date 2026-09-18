import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* =========================================
   UPDATED DATA STRUCTURE 
========================================= */
const syllabusData = [
  {
    category: "B.Sc Degree Programmes",
    isTabbed: true,
    tabs: [
      {
        id: "jnu",
        label: "JNU (New) - Since 2023",
        items: [
          { id: 1, title: "Syllabus for B.Sc 1st Year (New) under JNU", link: "#" },
        ]
      },
      {
        id: "ignou",
        label: "IGNOU (Old) - Till 2023",
        items: [
          { id: 2, title: "Syllabus for B.Sc 1st Semester (Old) under IGNOU", link: "#" },
          { id: 3, title: "Syllabus for B.Sc 2nd Semester (Old) under IGNOU", link: "#" },
          { id: 4, title: "Syllabus for B.Sc 3rd & 4th Semester (Old) under IGNOU", link: "#" },
          { id: 5, title: "Syllabus for B.Sc 5th Semester (Old) under IGNOU", link: "#" },
          { id: 6, title: "Syllabus for B.Sc 6th Semester (Old) under IGNOU", link: "#" },
        ]
      }
    ]
  },
  {
    category: "Diploma Programmes",
    isTabbed: false,
    items: [
      { id: 7, title: "Syllabus for Diploma in Food Production", link: "#" },
      { id: 8, title: "Syllabus for Diploma in Food & Beverage Service", link: "#" },
    ]
  }
];

/* =========================================
   SUB-COMPONENT: CategoryBlock
========================================= */
const CategoryBlock = ({ category, catIndex }) => {
  const blockRef = useRef(null);
  const rowsContainerRef = useRef(null);
  
  // Tab State
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const isInitialRender = useRef(true);

  const itemsToRender = category.isTabbed ? category.tabs[activeTabIndex].items : category.items;

  const { contextSafe } = useGSAP({ scope: blockRef });

  // 1. Initial Scroll Reveal Animation
  useGSAP(() => {
    const header = blockRef.current.querySelector('.category-header');
    const tabs = blockRef.current.querySelector('.tabs-container');
    const rows = rowsContainerRef.current.children;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: blockRef.current,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    });

    tl.fromTo(header,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );

    if (tabs) {
      tl.fromTo(tabs,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        "-=0.6"
      );
    }

    tl.fromTo(rows,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" },
      "-=0.4"
    );
  }, { scope: blockRef });

  // 2. Tab Switch Outgoing Animation
  const handleTabChange = contextSafe((index) => {
    if (index === activeTabIndex) return;

    const rows = rowsContainerRef.current.children;

    gsap.to(rows, {
      opacity: 0,
      y: -15,
      duration: 0.3,
      stagger: 0.05,
      ease: "power2.in",
      onComplete: () => {
        setActiveTabIndex(index);
      }
    });
  });

  // 3. Tab Switch Incoming Animation
  useGSAP(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    const rows = rowsContainerRef.current.children;
    gsap.fromTo(rows,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: "power2.out" }
    );
  }, [activeTabIndex]);

  return (
    <div ref={blockRef} className="category-block flex flex-col mb-32 last:mb-0">

      {/* Category Header */}
      <div className="category-header flex flex-col md:flex-row md:items-end justify-between mb-8 lg:mb-12 gap-6">
        <div>
          <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)] mb-4 block">
            Archive Category 0{catIndex + 1}
          </span>
          <h2 className="head-txt text-4xl md:text-5xl lg:text-6xl tracking-tighter text-[var(--text-main)] leading-none">
            {category.category}
          </h2>
        </div>
        {/* Hidden on mobile, line on desktop to anchor the design */}
        <div className="hidden md:block w-32 h-[1px] bg-[var(--primary-base)]/20 mb-2"></div>
      </div>

      {/* Elegant Tab Switcher (Scaled down for hierarchy) */}
      {category.isTabbed && (
        <div className="tabs-container flex flex-col gap-3 mb-10 border-b border-[var(--primary-base)]/10 pb-6">
          
          <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
            Select Curriculum
          </span>
          
          <div className="flex flex-wrap items-center gap-6 md:gap-8">
            {category.tabs.map((tab, idx) => {
              const isActive = activeTabIndex === idx;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(idx)}
                  // Added py-2 for better click area and underline positioning
                  className="group relative outline-none flex items-center py-2 cursor-pointer"
                >
                  {/* SCALED DOWN: text-lg md:text-xl lg:text-2xl */}
                  <span className={`text-lg md:text-xl lg:text-2xl font-light tracking-tight transition-colors duration-500 ${
                    isActive ? 'text-[var(--text-main)]' : 'text-[var(--text-main)]/40 hover:text-[var(--text-main)]/70'
                  }`}>
                    [ {tab.label} ]
                  </span>
                  
                  {/* Active Tab Indicator Line - Re-positioned to sit tight beneath the text */}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--accent)]"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Interactive Document Rows */}
      <div ref={rowsContainerRef} className={`flex flex-col min-h-[300px] ${!category.isTabbed && 'border-t border-[var(--primary-base)]/10'}`}>
        {itemsToRender.map((item) => (
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
  );
};

/* =========================================
   MAIN COMPONENT: SyllabusList
========================================= */
export default function SyllabusList() {
  const containerRef = useRef(null);

  return (
    <section ref={containerRef} className="w-full bg-[var(--background)] text-[var(--text-main)] py-20 md:py-32 overflow-hidden border-t border-[var(--primary-base)]/10">
      <div className="w-full max-w-[1800px] mx-auto px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24">

        {syllabusData.map((category, catIndex) => (
          <CategoryBlock 
            key={catIndex} 
            category={category} 
            catIndex={catIndex} 
          />
        ))}

      </div>
    </section>
  );
}