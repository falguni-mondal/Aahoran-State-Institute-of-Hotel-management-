import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* =========================================
   OVERVIEW DATA
========================================= */
const overviewData = [
  {
    id: "food-production",
    index: "01",
    title: "Food Production",
    subtitle: "Culinary Excellence",
    narrative: "It is said that we eat with our eyes, ears, nose, mouth and skin. A chef must not only make the food edible, but take care of the eye-appeal and gastronomic values. This department deals with the preparation, production, and presentation of global cuisines.",
    img: "/fp-hero.webp",
    link: "/food-production"
  },
  {
    id: "food-and-beverage",
    index: "02",
    title: "Food & Beverage",
    subtitle: "Department of Excellence",
    narrative: "An overwhelming 98% opted for the manual pour over automatic peg-measures. Guests are seeking the experience of being truly served. We train students in the technique and art of serving, menu-planning, matching wines, and the intricate techniques of F&B Control.",
    img: "/fb-hero.webp",
    link: "/food-and-beverage"
  },
  {
    id: "front-office",
    index: "03",
    title: "Front Office",
    subtitle: "The Face of Hospitality",
    narrative: "This is the face of a hotel. Prim and proper, and yet warm and friendly, the staff makes a guest feel at home immediately upon arrival. This department deals with reservations, advance bookings, and gives the organization its largest share of revenue.",
    img: "/fo-hero.webp",
    link: "/front-office"
  },
  {
    id: "house-keeping",
    index: "04",
    title: "House Keeping",
    subtitle: "The Art of Perfection",
    narrative: "Moving from one’s home, a traveller first looks for peace and security. The Housekeeping department is the nerve-centre of any hotel. The cleanliness, aesthetics, and maintenance of all public areas and rooms rely entirely on the constant care and vigil of this department.",
    img: "/hk-hero.webp",
    link: "/house-keeping"
  }
];

export default function DepartmentOverview() {
  const containerRef = useRef(null);

  useGSAP(() => {
    let splitHeading;
    let mm = gsap.matchMedia();

    mm.add("(min-width: 320px)", () => {
      /* --- HERO ANIMATIONS --- */
      gsap.fromTo('.overview-hero-bg', 
        { scale: 1.15 }, 
        { scale: 1, duration: 2.5, ease: 'expo.out' }
      );

      const heading = document.querySelector('.overview-heading');
      if (heading) {
        splitHeading = new SplitType(heading, { types: 'words, chars', charClass: 'split-char' });
        
        splitHeading.chars.forEach((char) => {
          const wrapper = document.createElement('div');
          wrapper.style.overflow = 'hidden';
          wrapper.style.display = 'inline-block';
          wrapper.style.padding = '0.1em 0';
          wrapper.style.margin = '-0.1em 0';
          char.parentNode.insertBefore(wrapper, char);
          wrapper.appendChild(char);
        });

        gsap.fromTo(splitHeading.chars,
          { yPercent: 100 },
          { yPercent: 0, duration: 1.2, stagger: 0.02, ease: 'expo.out', delay: 0.2 }
        );
      }

      gsap.fromTo('.overview-hero-sub',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.8 }
      );

      /* --- MASTER SECTION TIMELINES --- */
      gsap.utils.toArray('.dept-section').forEach((section) => {
        const imgMask = section.querySelector('.dept-img-mask');
        const img = section.querySelector('.dept-img');
        const textElements = section.querySelectorAll('.dept-text-reveal');
        
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            toggleActions: "play none none reverse"
          }
        });

        // 1. Cinematic Curtain Reveal for Image Container
        if(imgMask) {
          tl.fromTo(imgMask, 
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut" }
          );
        }

        // 2. Subliminal Scale Down for Image
        if(img) {
          tl.fromTo(img, 
            { scale: 1.3 },
            { scale: 1, duration: 1.4, ease: "expo.inOut" },
            "<" // Play simultaneously with mask
          );
        }

        // 3. Fast Staggered Text & Button Reveal
        if(textElements.length) {
          tl.fromTo(textElements, 
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.08, ease: "power3.out" },
            "<0.4" 
          );
        }
      });
    });

    return () => {
      if (splitHeading) splitHeading.revert();
      mm.revert();
    };
  }, { scope: containerRef });

  return (
    <main ref={containerRef} className="w-full bg-[var(--background)] text-[var(--text-main)] overflow-hidden">
      
      {/* =======================================
          HERO SECTION
      ======================================= */}
      <section className="relative w-full h-[100svh] min-h-[600px] bg-[var(--primary-base)] flex items-center justify-center overflow-hidden">
        
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <img 
            src="/images/department-overview/department-hero.webp" 
            alt="The Pillars of Hospitality" 
            className="overview-hero-bg absolute inset-0 w-full h-full object-cover will-change-transform"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary-base)] via-[var(--primary-base)]/60 to-transparent mix-blend-multiply opacity-90"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24 w-full">
          <span className="overview-hero-sub text-[10px] md:text-xs lg:text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent)] mb-4 md:mb-6 lg:mb-8 block">
            The Pillars of Hospitality
          </span>
          <h1 className="overview-heading head-txt text-5xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[10rem] leading-[0.9] tracking-tighter text-[var(--text-light)] uppercase max-w-[90vw]">
            Department <br /> Overview
          </h1>
        </div>

        {/* Explore line indicator matching individual dept pages */}
        <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10 opacity-60">
          <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-[var(--text-light)] font-medium">Explore</span>
          <div className="w-[1px] h-10 md:h-16 bg-[var(--text-light)]/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-[var(--text-light)] animate-[scrollDown_2s_ease-in-out_infinite]"></div>
          </div>
        </div>

        <style>{`
          @keyframes scrollDown {
            0% { transform: translateY(-100%); }
            50% { transform: translateY(100%); }
            100% { transform: translateY(200%); }
          }
        `}</style>
      </section>

      {/* =======================================
          ALTERNATING DEPARTMENT SECTIONS
      ======================================= */}
      <div className="w-full pb-20 md:pb-32 lg:pb-40">
        {overviewData.map((dept, index) => {
          const isEven = index % 2 !== 0;

          return (
            <section 
              key={dept.id} 
              className={`dept-section w-full px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24 mx-auto max-w-[1800px] pt-24 md:pt-32 lg:pt-40 border-b border-[var(--primary-base)]/10 pb-24 md:pb-32 lg:pb-40 last:border-b-0`}
            >
              <div className={`flex flex-col ${isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center lg:items-start justify-between gap-12 lg:gap-20 xl:gap-32`}>
                
                {/* Visual Half */}
                <div className="w-full lg:w-6/12 relative group">
                  <div className="dept-img-mask w-full aspect-[4/3] md:aspect-[16/10] overflow-hidden relative z-10 will-change-transform">
                    <img 
                      src={dept.img} 
                      alt={dept.title} 
                      className="dept-img w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 will-change-transform"
                    />
                  </div>
                </div>

                {/* Content Half */}
                <div className="w-full lg:w-5/12 flex flex-col pt-8 lg:pt-12 relative z-20">
                  
                  {/* The Low-Opacity Index Watermark */}
                  <span className={`absolute -top-12 md:-top-20 ${isEven ? 'right-0 lg:-right-10' : 'right-0 lg:-right-10'} font-sans text-[120px] md:text-[180px] lg:text-[220px] font-bold leading-none text-[var(--text-main)]/5 select-none pointer-events-none tracking-tighter -z-10`}>
                    {dept.index}
                  </span>

                  <span className="dept-text-reveal text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)] mb-4 block">
                    {dept.subtitle}
                  </span>
                  
                  <h2 className="dept-text-reveal head-txt text-5xl md:text-6xl lg:text-7xl leading-[0.9] tracking-tighter mb-8 md:mb-10">
                    {dept.title}
                  </h2>
                  
                  <p className="dept-text-reveal text-base md:text-lg lg:text-xl font-light leading-[1.8] md:leading-[1.9] text-[var(--text-main)]/80 text-justify mb-10">
                    {dept.narrative}
                  </p>

                  {/* Wrapper entirely isolates GSAP from the Link's CSS hover transition */}
                  <div className="dept-text-reveal w-fit">
                    <Link 
                      to={dept.link} 
                      className="group flex items-center justify-between gap-6 border border-[var(--primary-base)]/20 px-6 py-4 uppercase tracking-[0.2em] text-[10px] font-bold text-[var(--text-main)] hover:bg-[var(--accent)] hover:border-[var(--accent)] hover:text-[var(--background)] transition-all duration-500"
                    >
                      <span>Explore Department</span>
                      <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                    </Link>
                  </div>
                </div>

              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}