import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const academicsData = [
  {
    id: "01",
    title: "Food & Beverage",
    kicker: "Service & Management",
    desc: "Master the art of fine dining, restaurant management, and mixology. Learn to anticipate guest needs and deliver flawless service in high-end hospitality environments.",
    img: "/fnb-bg.webp",
  },
  {
    id: "02",
    title: "Food Production",
    kicker: "Culinary Arts & Kitchen Operations",
    desc: "An intensive immersion into global culinary arts. From fundamental knife skills to advanced gastronomy, train to lead in the world's most demanding kitchens.",
    img: "/fp-bg.webp",
  },
  {
    id: "03",
    title: "Front Office",
    kicker: "Guest Relations & Revenue",
    desc: "Become the face of luxury hospitality. Master guest experience management, reservation systems, and the critical operational flow of the hotel lobby.",
    img: "/fo-bg.webp",
  },
  {
    id: "04",
    title: "Housekeeping",
    kicker: "Accommodation Operations",
    desc: "The backbone of any 5-star property. Acquire the meticulous skills required for room detailing, inventory management, and maintaining immaculate physical environments.",
    img: "/hk-bg.webp",
  },
];

/* =========================================
   INDIVIDUAL EXPANDING CARD COMPONENT
========================================= */
const DepartmentCard = ({ dept, index, activeIndex, setActiveIndex }) => {
  const isActive = activeIndex === index;
  const cardRef = useRef(null);
  const contentRef = useRef(null);
  const tl = useRef(null);

  // ScrollTrigger for Mobile (Stacks vertically)
  useGSAP(() => {
    let mm = gsap.matchMedia();
    
    // On mobile, trigger the active state when the card scrolls into the center
    mm.add("(max-width: 1023px)", () => {
      ScrollTrigger.create({
        trigger: cardRef.current,
        start: "top 55%",
        end: "bottom 45%",
        onEnter: () => setActiveIndex(index),
        onEnterBack: () => setActiveIndex(index),
      });
    });

    return () => mm.revert();
  }, { scope: cardRef });

  // GSAP Curtain Reveal Timeline
  useGSAP(() => {
    tl.current = gsap.timeline({ paused: true });
    
    // Stagger the words up.
    tl.current.to(
      cardRef.current.querySelectorAll('.curtain-word'), 
      { y: "0%", duration: 0.5, stagger: 0.015, ease: "power3.out" }
    );
    
    // Fade in button
    tl.current.fromTo(
      cardRef.current.querySelector('.dept-btn'),
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, ease: "expo.out" },
      "-=0.2"
    );
  }, { scope: cardRef });

  // Play/Reverse animation based on isActive state
  useEffect(() => {
    if (isActive) {
      tl.current?.play();
    } else {
      tl.current?.reverse();
    }
  }, [isActive]);

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => { if (window.innerWidth >= 1024) setActiveIndex(index); }}
      className={`relative h-[55vh] md:h-[60vh] lg:h-[70vh] xl:h-[75vh] 2xl:h-[80vh] overflow-hidden transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] border-b lg:border-b-0 lg:border-r border-[var(--primary-base)]/15 cursor-pointer flex flex-col justify-end
        ${isActive ? 'lg:flex-[2.8] xl:flex-[3]' : 'lg:flex-1'}
      `}
    >
      {/* Background Image Canvas */}
      <div className="absolute inset-0 z-0 bg-[var(--background)] overflow-hidden">
        <img
          src={dept.img}
          alt={dept.title}
          className={`w-full h-full object-cover transition-all duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] transform-gpu origin-center
            ${isActive 
              ? 'grayscale-0 opacity-100 scale-100 mix-blend-normal' 
              : 'grayscale opacity-30 scale-110 mix-blend-multiply'
            }
          `}
        />
        {/* Gradient Overlay */}
        <div className={`absolute inset-0 transition-opacity duration-700
          ${isActive 
            ? 'bg-gradient-to-t from-[var(--background)] via-[var(--background)]/80 to-transparent opacity-100' 
            : 'bg-gradient-to-t from-[var(--background)] to-transparent opacity-90'
          }
        `}></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-16 w-full flex flex-col justify-end h-full overflow-hidden">
        
        {/* 
            HEADER BLOCK (Always Visible) 
            The index remains a fixed size.
            The container width transitions so the text wraps when inactive, 
            but holds a firm width when active to match the paragraph below.
        */}
        <div 
          className={`flex flex-col gap-1 md:gap-2 mb-2 lg:mb-4 transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]
            ${isActive 
              ? 'w-[280px] md:w-[350px] lg:w-[380px] xl:w-[460px] 2xl:w-[540px] shrink-0' 
              : 'w-full'
            }
          `}
        >
          {/* Index - Fixed Size */}
          <span className="font-sans font-medium text-[10px] md:text-[11px] xl:text-[12px] 2xl:text-[13px] tracking-widest text-[var(--primary-base)]/60">
            {dept.id}
          </span>
          
          {/* Heading - Fluid Typography Scale & Wrapping */}
          <h3 
            className={`head-txt tracking-tight text-[var(--primary-base)] transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]
              ${isActive 
                ? 'text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-[5.5rem] leading-[1.05]' 
                : 'text-2xl md:text-3xl lg:text-[1.75rem] xl:text-3xl 2xl:text-4xl leading-[1.1] whitespace-normal break-words'
              }
            `}
          >
            {dept.title}
          </h3>
        </div>

        {/* 
            HIDDEN / EXPANDABLE CONTENT 
            Retains fixed width so the paragraph text does not awkwardly reflow during the slide animation.
        */}
        <div 
          ref={contentRef} 
          className={`grid transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] shrink-0
            w-[280px] md:w-[350px] lg:w-[380px] xl:w-[480px] 2xl:w-[560px]
            ${isActive ? 'grid-rows-[1fr] mt-4 lg:mt-6 2xl:mt-8 opacity-100' : 'grid-rows-[0fr] mt-0 opacity-0'}
          `}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col items-start pb-2">
              
              <span className="font-sans font-bold text-[9px] md:text-[10px] xl:text-[11px] 2xl:text-xs uppercase tracking-[0.2em] text-[var(--primary-base)] mb-3 2xl:mb-4 block">
                {dept.kicker}
              </span>
              
              {/* Word-by-word stagger wrapper */}
              <div className="mb-8 2xl:mb-10">
                {dept.desc.split(" ").map((word, wIdx) => (
                  <span key={wIdx} className="inline-flex overflow-hidden mr-[0.25em] align-top py-0.5">
                    <span className="curtain-word translate-y-[100%] font-sans text-sm md:text-base xl:text-lg 2xl:text-xl text-[var(--primary-base)]/80 leading-relaxed will-change-transform block">
                      {word}
                    </span>
                  </span>
                ))}
              </div>

              {/* Ghost Button */}
              <button className="dept-btn relative overflow-hidden flex items-center gap-3 border border-[var(--primary-base)]/30 hover:border-[var(--accent)] px-6 py-2.5 2xl:px-8 2xl:py-3.5 rounded-sm cursor-pointer outline-none group/btn transition-colors duration-500">
                <div className="absolute inset-0 w-full h-full bg-[var(--accent)] translate-y-[101%] group-hover/btn:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"></div>
                <span className="relative z-10 text-[var(--primary-base)] group-hover/btn:text-white transition-colors duration-500 font-sans text-[10px] xl:text-[11px] 2xl:text-xs font-bold uppercase tracking-[0.15em]">
                  View Course
                </span>
                <svg 
                  className="relative z-10 w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-[var(--primary-base)] group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================
   MAIN SECTION COMPONENT
========================================= */
export default function Academics() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="w-full bg-[var(--background)] relative z-10 py-24 md:py-32 xl:py-40 2xl:py-48">
      
      {/* Section Header */}
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24 mb-16 lg:mb-20 2xl:mb-24">
        <div className="flex flex-col items-start">
          <span className="font-sans font-bold text-xs xl:text-sm 2xl:text-base uppercase tracking-[0.2em] text-[var(--primary-base)]/60 mb-4 2xl:mb-6 block">
            Academic Verticals
          </span>
          <h2 className="head-txt text-5xl md:text-6xl lg:text-[4.5rem] xl:text-[5.5rem] 2xl:text-[6.5rem] text-[var(--primary-base)] leading-none tracking-tight">
            Our <span className="italic font-light">Departments.</span>
          </h2>
        </div>
      </div>

      {/* The Monolith Grid Container */}
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="flex flex-col lg:flex-row w-full border-t border-l lg:border-r-0 border-r border-[var(--primary-base)]/15">
          {academicsData.map((dept, idx) => (
            <DepartmentCard
              key={dept.id}
              dept={dept}
              index={idx}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
            />
          ))}
        </div>
      </div>
      
    </section>
  );
}