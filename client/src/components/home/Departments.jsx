import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const academicsData = [
  {
    id: "01",
    title: "Food & Beverage",
    kicker: "Service & Management",
    desc: "Master the art of fine dining, restaurant management, and mixology. Learn to anticipate guest needs and deliver flawless service in high-end hospitality environments.",
    img: "/fnb-bg.webp",
    link: "/food-and-beverage",
  },
  {
    id: "02",
    title: "Food Production",
    kicker: "Culinary Arts & Kitchen Operations",
    desc: "An intensive immersion into global culinary arts. From fundamental knife skills to advanced gastronomy, train to lead in the world's most demanding kitchens.",
    img: "/fp-bg.webp",
    link: "/food-production",
  },
  {
    id: "03",
    title: "Front Office",
    kicker: "Guest Relations & Revenue",
    desc: "Become the face of luxury hospitality. Master guest experience management, reservation systems, and the critical operational flow of the hotel lobby.",
    img: "/fo-bg.webp",
    link: "/front-office",
  },
  {
    id: "04",
    title: "Housekeeping",
    kicker: "Accommodation Operations",
    desc: "The backbone of any 5-star property. Acquire the meticulous skills required for room detailing, inventory management, and maintaining immaculate physical environments.",
    img: "/hk-bg.webp",
    link: "/house-keeping",
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

  useGSAP(() => {
    let mm = gsap.matchMedia();

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

  useGSAP(() => {
    tl.current = gsap.timeline({ paused: true });

    tl.current.to(
      cardRef.current.querySelectorAll('.curtain-word'), 
      { y: "0%", duration: 0.5, stagger: 0.015, ease: "power3.out" }
    );

    tl.current.fromTo(
      cardRef.current.querySelector('.dept-btn'),
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, ease: "expo.out" },
      "-=0.2"
    );
  }, { scope: cardRef });

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
      className={`relative h-[55vh] md:h-[60vh] lg:h-[70vh] xl:h-[75vh] 2xl:h-[80vh] overflow-hidden transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] border-b lg:border-b-0 lg:border-r border-[var(--text-main)]/15 cursor-pointer flex flex-col justify-end
        ${isActive ? 'lg:flex-[2.8] xl:flex-[3]' : 'lg:flex-1'}
      `}
    >
      {/* 
          =========================================
          THE LAYERED BACKGROUND CANVAS
          Stacked perfectly to provide the image, the old white overlay, 
          and the new orange vignette on top.
          =========================================
      */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-[var(--background)]">
        
        {/* Layer 1: Base Image Canvas */}
        <img
          src={dept.img}
          alt={dept.title}
          className={`w-full h-full object-cover transition-all duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] transform-gpu origin-center
            ${isActive 
              ? 'grayscale-0 opacity-100 scale-100' 
              : 'grayscale opacity-70 scale-110'
            }
          `}
        />
        
        {/* Layer 2: The OLD Effect (White/Light low opacity overlay) */}
        <div className={`absolute inset-0 bg-[var(--background)] transition-opacity duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]
          ${isActive ? 'opacity-0' : 'opacity-60'}
        `}></div>

        {/* Layer 3: The Active State Text Protector (Only shows when hovered) */}
        <div className={`absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/80 to-transparent transition-opacity duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]
          ${isActive ? 'opacity-100' : 'opacity-0'}
        `}></div>

        {/* Layer 4: The NEW Orange Vignette (Absolute positioned on top, fades out on hover) */}
        <div className={`absolute inset-0 bg-gradient-to-t from-[#ff6200] via-[#ff6200]/20 to-transparent transition-opacity duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none mix-blend-multiply
          ${isActive ? 'opacity-0' : 'opacity-80'}
        `}></div>

      </div>

      {/* Content Container */}
      <div className="relative z-10 p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-16 w-full flex flex-col justify-end h-full overflow-hidden">

        {/* HEADER BLOCK */}
        <div 
          className={`flex flex-col gap-1 md:gap-2 mb-2 lg:mb-4 transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]
            ${isActive 
              ? 'w-[280px] md:w-[350px] lg:w-[380px] xl:w-[460px] 2xl:w-[540px] shrink-0' 
              : 'w-full'
            }
          `}
        >
          {/* Index */}
          <span className={`font-sans font-semibold text-[10px] md:text-[11px] xl:text-[12px] 2xl:text-[13px] tracking-widest transition-colors duration-[900ms] ${isActive ? 'text-[var(--accent)]' : 'text-white/70'}`}>
            {dept.id}
          </span>

          {/* Heading */}
          <h3 
            className={`head-txt tracking-tight transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]
              ${isActive 
                ? 'text-[var(--text-main)] text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-[5.5rem] leading-[1.05]' 
                : 'text-white text-2xl md:text-3xl lg:text-[1.75rem] xl:text-3xl 2xl:text-4xl leading-[1.1] whitespace-normal break-words'
              }
            `}
          >
            {dept.title}
          </h3>
        </div>

        {/* HIDDEN / EXPANDABLE CONTENT */}
        <div 
          ref={contentRef} 
          className={`grid transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] shrink-0
            w-[280px] md:w-[350px] lg:w-[380px] xl:w-[480px] 2xl:w-[560px]
            ${isActive ? 'grid-rows-[1fr] mt-4 lg:mt-6 2xl:mt-8 opacity-100' : 'grid-rows-[0fr] mt-0 opacity-0'}
          `}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col items-start pb-2">

              <span className="font-sans font-bold text-[9px] md:text-[10px] xl:text-[11px] 2xl:text-xs uppercase tracking-[0.2em] text-[var(--accent)] mb-3 2xl:mb-4 block">
                {dept.kicker}
              </span>

              <div className="mb-8 2xl:mb-10">
                {dept.desc.split(" ").map((word, wIdx) => (
                  <span key={wIdx} className="inline-flex overflow-hidden mr-[0.25em] align-top py-0.5">
                    <span className="curtain-word translate-y-[100%] font-sans text-sm md:text-base xl:text-lg 2xl:text-xl text-[var(--text-main)]/80 leading-relaxed will-change-transform block">
                      {word}
                    </span>
                  </span>
                ))}
              </div>

              {/* Action Button (Fixed the background class typo here) */}
              <Link to={dept.link} className="dept-btn relative overflow-hidden flex items-center gap-3 border bg-[var(--background)] border-[var(--text-main)]/20 hover:border-[var(--accent)] px-6 py-2.5 2xl:px-8 2xl:py-3.5 rounded-sm cursor-pointer outline-none group/btn transition-colors duration-500">
                <div className="absolute inset-0 w-full h-full bg-[var(--accent)] translate-y-[101%] group-hover/btn:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"></div>
                <span className="relative z-10 text-[var(--accent)] group-hover/btn:text-white transition-colors duration-500 font-sans text-[10px] xl:text-[11px] 2xl:text-xs font-bold uppercase tracking-[0.15em]">
                  View Course
                </span>
                <svg 
                  className="relative z-10 w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-[var(--accent)] group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>

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
export default function Departments() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="w-full bg-[var(--background)] relative z-10 py-24 md:py-32 xl:py-40 2xl:py-48 border-t border-[var(--text-main)]/10">

      {/* Section Header */}
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24 mb-16 lg:mb-20 2xl:mb-24">
        <div className="flex flex-col items-start">
          <span className="font-sans font-bold text-xs xl:text-sm 2xl:text-base uppercase tracking-[0.2em] text-[var(--accent)] mb-4 2xl:mb-6 block">
            Academic Verticals
          </span>
          <h2 className="head-txt text-5xl md:text-6xl lg:text-[4.5rem] xl:text-[5.5rem] 2xl:text-[6.5rem] text-[var(--text-main)] leading-none tracking-tight">
            Our <span className="italic font-light text-[var(--accent)]">Departments</span>
          </h2>
        </div>
      </div>

      {/* The Monolith Grid Container */}
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="flex flex-col lg:flex-row w-full border-t border-l lg:border-r-0 border-r border-[var(--text-main)]/15 shadow-2xl">
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