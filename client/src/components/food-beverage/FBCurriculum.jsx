import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* =========================================
   RESTAURANT FACILITIES DATA (Tabs)
========================================= */
const fbFacilities = [
  {
    id: "btr",
    label: "BTR",
    title: "Basic Training Restaurant",
    desc: "The Basic Training Restaurant serves as the foundational ground where students learn the core principles of food and beverage service. Here, they master the art of table laying, napkin folding, carrying salvers, clearing techniques, and basic service sequences. This simulated environment builds confidence and instills the essential etiquette required for professional hospitality service."
  },
  {
    id: "atr",
    label: "ATR",
    title: "Advance Training Restaurant",
    desc: "The Advance Training Restaurant is a sophisticated space designed to simulate fine dining and specialty restaurant operations. Senior students practice complex service techniques such as gueridon (flambé) service, silver service, wine decanting, and elaborate banquet setups. This environment bridges the gap between foundational skills and high-end luxury hospitality demands."
  }
];

export default function FBCurriculum() {
  const containerRef = useRef(null);
  const tabContentRef = useRef(null);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const activeTab = fbFacilities[activeTabIndex];

  const { contextSafe } = useGSAP({ scope: containerRef });

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      // 1. Image Parallax Effects
      gsap.utils.toArray('.img-parallax').forEach((img) => {
        gsap.to(img, {
          yPercent: 15,
          ease: "none",
          scrollTrigger: {
            trigger: img.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      });

      // 2. Text Block Fade Reveals
      gsap.utils.toArray('.text-reveal').forEach((textBlock) => {
        gsap.fromTo(textBlock, 
          { y: 40, opacity: 0 },
          { 
            y: 0, opacity: 1, duration: 1.2, ease: "power3.out",
            scrollTrigger: {
              trigger: textBlock,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // 3. Head-txt SplitType Animation
      const headings = document.querySelectorAll('.split-heading');
      headings.forEach((heading) => {
        const text = new SplitType(heading, { types: 'lines, words, chars', charClass: 'split-char' });
        
        // Wrap chars to hide overflow for the mask effect
        text.chars.forEach((char) => {
          const wrapper = document.createElement('div');
          wrapper.style.overflow = 'hidden';
          wrapper.style.display = 'inline-block';
          wrapper.style.padding = '0.1em 0';
          wrapper.style.margin = '-0.1em 0';
          char.parentNode.insertBefore(wrapper, char);
          wrapper.appendChild(char);
        });

        gsap.fromTo(text.chars, 
          { yPercent: 100 },
          { 
            yPercent: 0, 
            duration: 1, 
            stagger: 0.02, 
            ease: "expo.out",
            scrollTrigger: {
              trigger: heading,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });
    });

    return () => mm.revert();
  }, { scope: containerRef });

  // Tab Switching Animation
  const handleTabChange = contextSafe((index) => {
    if (index === activeTabIndex) return;
    
    // Animate out current content
    gsap.to(tabContentRef.current, {
      opacity: 0,
      y: -10,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        setActiveTabIndex(index);
        
        // Animate in new content
        gsap.fromTo(tabContentRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
        );
      }
    });
  });

  return (
    <section ref={containerRef} className="w-full bg-[var(--background)] text-[var(--text-main)] py-20 md:py-32 lg:py-40 xl:py-48 overflow-hidden relative border-t border-[var(--primary-base)]/10">
      
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24 mx-auto max-w-[1800px]">
        
        {/* =======================================
            SECTION 1: ABOUT THE COURSE
        ======================================= */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 xl:gap-24 mb-32 md:mb-40 lg:mb-56">
          
          {/* Left: Huge Editorial Image */}
          <div className="w-full lg:w-6/12 relative">
            <div className="w-full aspect-[4/3] md:aspect-[16/10] overflow-hidden bg-[var(--primary-base)]/5">
              <img 
                src="/fb-service.webp" 
                alt="Food and Beverage Service" 
                className="img-parallax w-full h-[120%] object-cover -translate-y-[10%] will-change-transform"
              />
            </div>
          </div>

          {/* Right: Spacious Text Block */}
          <div className="w-full lg:w-5/12 flex flex-col pt-8 lg:pt-0 relative z-10">
            
            {/* Fixed Position Watermark */}
            <span className="absolute -top-10 md:-top-20 right-0 lg:-right-10 font-sans text-[120px] md:text-[180px] lg:text-[220px] font-bold leading-none text-[var(--text-main)]/5 select-none pointer-events-none tracking-tighter -z-10">
              01
            </span>
            
            <span className="text-reveal text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)] mb-4 md:mb-6 block">
              Foundations
            </span>
            
            <h2 className="split-heading head-txt text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[0.9] tracking-tighter mb-8 md:mb-12">
              About The <br/> Course
            </h2>
            
            <p className="text-reveal text-base md:text-lg lg:text-xl font-light leading-[1.8] md:leading-[1.9] text-[var(--text-main)]/80 text-justify">
              The Food & Beverage Service department trains the students in the technique and art of serving and selling food and beverage. Waiting skills, Supervisory skills and Managerial skills are taught in 1st, 2nd and 3rd year respectively. Menu and the maxims of menu-planning, matching different foods with the right wines, usage of various tools and equipment’s, layout of the restaurant, on-table arrangements for foods from various cuisines, buffets and banquet service – students acquire mastery in these skills with the inputs in both theory and practical classes.
            </p>
          </div>
        </div>

        {/* =======================================
            SECTION 2: COURSE DETAILS
        ======================================= */}
        <div className="flex flex-col-reverse lg:flex-row items-start justify-between gap-12 lg:gap-20 xl:gap-24">
          
          {/* Left: Content Layout */}
          <div className="w-full lg:w-7/12 flex flex-col pt-8 lg:pt-0 relative z-10">
            
            {/* Fixed Position Watermark */}
            <span className="absolute -top-10 md:-top-20 right-0 lg:-right-10 font-sans text-[120px] md:text-[180px] lg:text-[220px] font-bold leading-none text-[var(--text-main)]/5 select-none pointer-events-none tracking-tighter -z-10">
              02
            </span>
            
            <span className="text-reveal text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)] mb-4 md:mb-6 block">
              In-Depth
            </span>
            
            <h2 className="split-heading head-txt text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[0.9] tracking-tighter mb-12 md:mb-16">
              Course Details
            </h2>
            
            <div className="text-reveal flex flex-col relative">
              
              {/* 2-Column Text Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative mb-12">
                <p className="text-base md:text-lg font-light leading-[1.8] md:leading-[1.9] text-[var(--text-main)]/80 text-justify">
                  Origin and manufacturing of various types of alcoholic beverage (beers, wines, spirits, liqueurs, cocktails, etc.) form a large part of the syllabus. The students are also imparted with the skills of serving the drinks and making the cocktails. This department also deals with the intricate techniques of Food & Beverage Control and Management so that the students develop the capacity to successfully operate and manage a food outlet and also earn a profit for the organization.
                </p>
                
                <div className="hidden md:block absolute top-0 left-1/2 w-[1px] h-full bg-[var(--primary-base)]/10 -translate-x-1/2"></div>
                
                <p className="text-base md:text-lg font-light leading-[1.8] md:leading-[1.9] text-[var(--text-main)]/80 text-justify">
                  Cost control, budgetary implications, inventory management, purchase systems, etc. are integral components of the syllabi. The department manages a bar-cum-restaurant of more than 2000 sq. ft. which is well-equipped with a large inventory of various tools and equipment.
                </p>
              </div>

              {/* INTERACTIVE TAB NAV */}
              <div className="tabs-container flex flex-col gap-3 mb-8 border-b border-[var(--primary-base)]/10 pb-6 mt-4">
                <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[var(--text-main)]/40">
                  Explore Facilities
                </span>
                
                <div className="flex flex-wrap items-center gap-4 md:gap-8 overflow-x-auto no-scrollbar pb-2">
                  {fbFacilities.map((tab, idx) => {
                    const isActive = activeTabIndex === idx;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(idx)}
                        className="group relative outline-none flex items-center py-2 cursor-pointer shrink-0"
                      >
                        <span className={`text-lg md:text-xl lg:text-2xl font-light tracking-tight transition-colors duration-500 ${
                          isActive ? 'text-[var(--text-main)]' : 'text-[var(--text-main)]/40 hover:text-[var(--text-main)]/70'
                        }`}>
                          [ {tab.label} ]
                        </span>
                        
                        {/* Animated Orange Underline */}
                        {isActive && (
                          <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--accent)]"></span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* TAB CONTENT PANEL */}
              <div ref={tabContentRef} className="flex flex-col min-h-[150px]">
                <h3 className="font-sans text-xl md:text-2xl font-semibold text-[var(--text-main)] mb-3">
                  {activeTab.title}
                </h3>
                <p className="text-base md:text-lg font-light leading-[1.8] md:leading-[1.9] text-[var(--text-main)]/80 text-justify">
                  {activeTab.desc}
                </p>
              </div>
              
            </div>
          </div>

          {/* Right: Floating Portrait Image */}
          <div className="w-full lg:w-4/12 relative mt-10 lg:mt-32">
            <div className="w-full aspect-[3/4] md:aspect-[4/5] overflow-hidden bg-[var(--primary-base)]/5">
              <img 
                src="/fb-mixology.webp" 
                alt="Mixology and Bar Management" 
                className="img-parallax w-full h-[120%] object-cover -translate-y-[10%] will-change-transform"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}