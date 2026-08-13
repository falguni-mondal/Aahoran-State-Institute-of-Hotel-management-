import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Extracted data from your banners for a realistic structure
const placementData = [
  {
    id: 1,
    name: 'Nikhil Raj',
    batch: 'B.Sc. HHA (2018-2021)',
    role: 'Restaurant Manager (M.T)',
    company: 'Pizza Hut',
    image: '/student_nikhil.jpg' // You can map your actual images here
  },
  {
    id: 2,
    name: 'Ashish Shaw',
    batch: 'B.Sc. HHA (2018-2021)',
    role: 'Sales Officer (M.T)',
    company: 'Reliance Ajio',
    image: '/student_ashish.jpg'
  },
  {
    id: 3,
    name: 'Anjali Pathak',
    batch: 'B.Sc. HHA (2018-2021)',
    role: 'Guest Service Associate (F&B)',
    company: 'Ramada Encore',
    image: '/student_anjali.jpg'
  },
  {
    id: 4,
    name: 'Deepto Banerjee',
    batch: 'B.Sc. HHA (2018-2021)',
    role: 'Guest Service Associate (F.O)',
    company: 'Ramada Ahmedabad',
    image: '/student_deepto.jpg'
  },
  {
    id: 5,
    name: 'Subhalaxmi Dal',
    batch: 'B.Sc. HHA (2018-2021)',
    role: 'Guest Service Associate (F.O)',
    company: 'Courtyard by Marriott',
    image: '/student_subhalaxmi.jpg'
  },
  {
    id: 6,
    name: 'Debjani Das',
    batch: 'B.Sc. HHA (2018-2021)',
    role: 'Guest Service Associate (H.K)',
    company: 'Novotel Chennai',
    image: '/student_debjani.jpg'
  },
  {
    id: 7,
    name: 'Saloni Guha',
    batch: 'B.Sc. HHA (2017-2020)',
    role: 'Guest Relationship Officer (M.T)',
    company: 'Calvin Klein',
    image: '/student_saloni.jpg'
  }
];

export default function PlacementRoster() {
  const containerRef = useRef(null);
  const cursorRef = useRef(null);
  
  // State to track which student image to display inside the floating cursor
  const [activeImage, setActiveImage] = useState(placementData[0].image);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    // 1. Initial fade-up animation for the roster rows
    gsap.fromTo('.roster-row',
      { opacity: 0, y: 30 },
      {
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        stagger: 0.05, 
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // 2. Custom Mouse Follower Logic (Only runs on Desktop/Hover-capable devices)
    mm.add("(min-width: 1024px)", () => {
      // gsap.quickTo is highly optimized for mouse movement tracking
      const xTo = gsap.quickTo(cursorRef.current, "x", { duration: 0.4, ease: "power3" });
      const yTo = gsap.quickTo(cursorRef.current, "y", { duration: 0.4, ease: "power3" });

      const handleMouseMove = (e) => {
        // Center the image container on the cursor
        xTo(e.clientX - 150); 
        yTo(e.clientY - 200);
      };

      const section = containerRef.current;
      section.addEventListener("mousemove", handleMouseMove);

      return () => {
        section.removeEventListener("mousemove", handleMouseMove);
      };
    });

    return () => mm.revert();
  }, { scope: containerRef });

  // Handlers to show/hide the floating image on hover
  const handleMouseEnter = (image) => {
    setActiveImage(image);
    gsap.to(cursorRef.current, { scale: 1, opacity: 1, duration: 0.4, ease: "expo.out" });
  };

  const handleMouseLeave = () => {
    gsap.to(cursorRef.current, { scale: 0.8, opacity: 0, duration: 0.4, ease: "expo.out" });
  };

  return (
    <section 
      ref={containerRef} 
      className="relative w-full py-20 md:py-32 lg:py-40 bg-[var(--background)] text-[var(--primary-base)] border-b border-[var(--primary-base)]/10"
    >
      <div className="w-full max-w-[1800px] mx-auto px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-20 gap-8">
          <div>
            <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)] mb-4 block">
              Alumni Outcomes
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light tracking-tighter leading-none">
              The Executive <br/> Roster.
            </h2>
          </div>
          <p className="text-sm md:text-base font-light text-[var(--primary-base)]/60 max-w-sm">
            A curated directory of our distinguished graduates and their current placements in the global hospitality and luxury sectors.
          </p>
        </div>

        {/* ==========================================
            INTERACTIVE ROSTER LIST
        ========================================== */}
        <div className="flex flex-col border-t border-[var(--primary-base)]/10">
          {/* Table Headers (Hidden on mobile) */}
          <div className="hidden lg:grid grid-cols-12 gap-8 py-6 border-b border-[var(--primary-base)]/10 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--primary-base)]/40">
            <div className="col-span-4">Candidate & Batch</div>
            <div className="col-span-5">Appointed Role</div>
            <div className="col-span-3">Hiring Organization</div>
          </div>

          {/* Table Rows */}
          {placementData.map((student) => (
            <div 
              key={student.id}
              onMouseEnter={() => handleMouseEnter(student.image)}
              onMouseLeave={handleMouseLeave}
              className="roster-row group flex flex-col lg:grid lg:grid-cols-12 gap-2 lg:gap-8 py-6 md:py-8 lg:py-10 border-b border-[var(--primary-base)]/10 hover:bg-[var(--primary-base)]/5 transition-colors duration-500 cursor-pointer -mx-5 md:-mx-8 lg:mx-0 px-5 md:px-8 lg:px-4"
            >
              
              {/* Mobile Avatar (Only shows on < lg screens) */}
              <div className="lg:hidden w-12 h-12 rounded-full overflow-hidden mb-4 bg-[var(--primary-base)]/10 shrink-0">
                <img src={student.image} alt={student.name} className="w-full h-full object-cover" />
              </div>

              {/* Column 1: Name & Batch */}
              <div className="col-span-4 flex flex-col justify-center transition-transform duration-500 lg:group-hover:translate-x-4">
                <h3 className="text-xl md:text-2xl lg:text-3xl font-light tracking-tight text-[var(--primary-base)] group-hover:text-[var(--accent)] transition-colors duration-300">
                  {student.name}
                </h3>
                <span className="text-[10px] md:text-xs font-medium uppercase tracking-widest text-[var(--primary-base)]/40 mt-1 md:mt-2">
                  {student.batch}
                </span>
              </div>

              {/* Column 2: Role */}
              <div className="col-span-5 flex items-center mt-2 lg:mt-0">
                <p className="text-base md:text-lg lg:text-xl font-serif text-[var(--primary-base)]/80">
                  {student.role}
                </p>
              </div>

              {/* Column 3: Company */}
              <div className="col-span-3 flex lg:justify-end items-center mt-1 lg:mt-0">
                <span className="text-xs md:text-sm font-semibold uppercase tracking-[0.1em] text-[var(--primary-base)]">
                  {student.company}
                </span>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* ==========================================
          GLOBAL FLOATING CURSOR IMAGE (Desktop Only)
      ========================================== */}
      <div 
        ref={cursorRef} 
        className="hidden lg:block fixed top-0 left-0 w-[300px] h-[400px] pointer-events-none z-50 overflow-hidden scale-75 opacity-0 rounded-sm shadow-2xl"
      >
        <img 
          src={activeImage} 
          alt="Student Portrait" 
          className="w-full h-full object-cover bg-[var(--primary-base)]/10"
        />
        {/* Cinematic Vignette over the floating image */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary-base)]/40 to-transparent"></div>
      </div>

    </section>
  );
}