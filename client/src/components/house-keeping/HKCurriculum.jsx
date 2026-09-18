import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* =========================================
   HOUSEKEEPING FACILITIES DATA (Tabs)
========================================= */
const hkFacilities = [
  {
    id: "hk-lab-1",
    label: "HK Lab 1",
    title: "House Keeping Lab 1",
    desc: "The primary Housekeeping Laboratory is equipped with a comprehensive range of modern cleaning equipment, varied surface materials, and an extensive collection of professional cleaning agents. Students practice floor scrubbing, carpet shampooing, polishing different metals, and mastering the complex chemistry of industrial cleaning materials."
  },
  {
    id: "hk-lab-2",
    label: "HK Lab 2",
    title: "House Keeping Lab 2",
    desc: "Dedicated to the intricacies of linen management and aesthetics, HK Lab 2 functions as both a commercial laundry simulation and a design studio. Students receive hands-on training operating heavy-duty washing extractors, calendaring machines, and flatwork ironers. Additionally, the space is used for practicing advanced flower arrangement techniques and interior decoration mockups."
  },
  {
    id: "model-guest-room",
    label: "Model Guest room",
    title: "Model Guest Room",
    // When subSections exist, we render them side-by-side
    subSections: [
      {
        title: "Suits",
        desc: "The intricately decorated Master Suite mirrors the opulence and spatial dynamics of a five-star luxury hotel suite. It features premium furnishings, heavy drapery, and high-end bathroom fixtures, allowing students to master the meticulous detailing and extended servicing times required for VIP turn-down and deep cleaning."
      },
      {
        title: "Twin",
        desc: "The luxurious Twin Room serves as the standard operational blueprint for daily room servicing. Students learn time-motion efficiency, precise bed-making techniques with crisp hospital corners, bathroom sanitization, and the standardized placement of guest amenities to achieve perfect room uniformity."
      }
    ]
  }
];

export default function HKCurriculum() {
  const containerRef = useRef(null);
  const tabContentRef = useRef(null);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const activeTab = hkFacilities[activeTabIndex];

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
                src="/hk-aesthetics.webp" 
                alt="Housekeeping Aesthetics and Floral Design" 
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
              The students are given hands-on training in cleaning different areas with a vast range of surfaces on floors, walls and furniture and fixtures. The complex management of guest’s laundry, uniform of all members of staff and the multitude of linen and guest-room supplies are integral part of the syllabus. The students are trained in the science and aesthetics of horticultural development and flower arrangements to create a scenically attractive environment all around. Interior Decoration, with both ancient and modern concepts, is another area where student’s skills are developed by classroom training and a series of field visits.
            </p>
          </div>
        </div>

        {/* =======================================
            SECTION 2: FACILITIES
        ======================================= */}
        <div className="flex flex-col-reverse lg:flex-row items-start justify-between gap-12 lg:gap-20 xl:gap-24">
          
          {/* Left: Content Layout */}
          <div className="w-full lg:w-7/12 flex flex-col pt-8 lg:pt-0 relative z-10">
            
            {/* Fixed Position Watermark */}
            <span className="absolute -top-10 md:-top-20 right-0 lg:-right-10 font-sans text-[120px] md:text-[180px] lg:text-[220px] font-bold leading-none text-[var(--text-main)]/5 select-none pointer-events-none tracking-tighter -z-10">
              02
            </span>
            
            <span className="text-reveal text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)] mb-4 md:mb-6 block">
              Infrastructure
            </span>
            
            <h2 className="split-heading head-txt text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[0.9] tracking-tighter mb-12 md:mb-16">
              Facilities
            </h2>
            
            <div className="text-reveal flex flex-col relative">
              
              {/* 2-Column Text Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative mb-12">
                <p className="text-base md:text-lg font-light leading-[1.8] md:leading-[1.9] text-[var(--text-main)]/80 text-justify">
                  The Institute boasts of an intricately decorated Master Suite, one luxurious Twin Room, and an state of the art Conference Room.
                </p>
                
                <div className="hidden md:block absolute top-0 left-1/2 w-[1px] h-full bg-[var(--primary-base)]/10 -translate-x-1/2"></div>
                
                <p className="text-base md:text-lg font-light leading-[1.8] md:leading-[1.9] text-[var(--text-main)]/80 text-justify">
                  A laundry with all modern equipment matches the best standards in the industry. These facilities are utilized to the hilt to impart knowledge and skill to become an effective housekeeper of any modern hotel.
                </p>
              </div>

              {/* INTERACTIVE TAB NAV */}
              <div className="tabs-container flex flex-col gap-3 mb-8 border-b border-[var(--primary-base)]/10 pb-6 mt-4">
                <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[var(--text-main)]/40">
                  Explore Facilities
                </span>
                
                <div className="flex flex-wrap items-center gap-4 md:gap-8 overflow-x-auto no-scrollbar pb-2">
                  {hkFacilities.map((tab, idx) => {
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
                <h3 className="font-sans text-xl md:text-2xl font-semibold text-[var(--text-main)] mb-4">
                  {activeTab.title}
                </h3>
                
                {/* 
                    If the tab has subSections (like Model Guest Room), 
                    render a 2-column grid. Otherwise, render the standard description.
                */}
                {activeTab.subSections ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative">
                    <div className="flex flex-col">
                      <span className="font-sans text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)] mb-2">
                        {activeTab.subSections[0].title}
                      </span>
                      <p className="text-base md:text-lg font-light leading-[1.8] md:leading-[1.9] text-[var(--text-main)]/80 text-justify">
                        {activeTab.subSections[0].desc}
                      </p>
                    </div>
                    
                    <div className="hidden md:block absolute top-0 left-1/2 w-[1px] h-full bg-[var(--primary-base)]/10 -translate-x-1/2"></div>
                    
                    <div className="flex flex-col">
                      <span className="font-sans text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)] mb-2">
                        {activeTab.subSections[1].title}
                      </span>
                      <p className="text-base md:text-lg font-light leading-[1.8] md:leading-[1.9] text-[var(--text-main)]/80 text-justify">
                        {activeTab.subSections[1].desc}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-base md:text-lg font-light leading-[1.8] md:leading-[1.9] text-[var(--text-main)]/80 text-justify">
                    {activeTab.desc}
                  </p>
                )}
              </div>
              
            </div>
          </div>

          {/* Right: Floating Portrait Image */}
          <div className="w-full lg:w-4/12 relative mt-10 lg:mt-32">
            <div className="w-full aspect-[3/4] md:aspect-[4/5] overflow-hidden bg-[var(--primary-base)]/5">
              <img 
                src="/hk-suite.webp" 
                alt="Intricately Decorated Master Suite" 
                className="img-parallax w-full h-[120%] object-cover -translate-y-[10%] will-change-transform"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}