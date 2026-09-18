import React, { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import { useLenis } from 'lenis/react'; // <-- Imported useLenis
import LabHorizontalScroll from '../computer-lab/LabHorizontalScroll';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function FOCurriculum() {
  const containerRef = useRef(null);
  const location = useLocation(); // <-- Added useLocation
  const lenis = useLenis();       // <-- Added useLenis

  // ==========================================
  // CROSS-PAGE HASH ROUTING FIX (For Computer Lab)
  // ==========================================
  useEffect(() => {
    // If the URL has a hash (like #computer-lab) AND lenis is ready
    if (location.hash && lenis) {
      // Small delay ensures the DOM is fully painted before calculating scroll position
      const timeoutId = setTimeout(() => {
        lenis.scrollTo(location.hash, {
          offset: -80, // Adjust this offset if your navbar covers the heading
          duration: 1.5,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      }, 100); 

      return () => clearTimeout(timeoutId);
    }
  }, [location.hash, lenis]);
  // ==========================================

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

  return (
    <div ref={containerRef} className="w-full bg-[var(--background)] text-[var(--text-main)] overflow-hidden">
      
      {/* =======================================
          TOP VERTICAL SCROLLING CONTENT
      ======================================= */}
      <section className="w-full text-justify pt-20 md:pt-32 lg:pt-40 xl:pt-48 pb-24 md:pb-32 lg:pb-40 relative border-t border-[var(--primary-base)]/10">
        <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24 mx-auto max-w-[1800px]">
          
          {/* =======================================
              SECTION 1: ABOUT THE COURSE
          ======================================= */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 xl:gap-24 mb-32 md:mb-40 lg:mb-56">
            
            {/* Left: Huge Editorial Image */}
            <div className="w-full lg:w-6/12 relative">
              <div className="w-full aspect-[4/3] md:aspect-[16/10] overflow-hidden bg-[var(--primary-base)]/5">
                <img 
                  src="/fo-management.webp" 
                  alt="Property Management Training" 
                  className="img-parallax w-full h-[120%] object-cover -translate-y-[10%] will-change-transform"
                />
              </div>
            </div>

            {/* Right: Spacious Text Block */}
            <div className="w-full lg:w-5/12 flex flex-col pt-8 lg:pt-0 relative z-10">
              
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
                Students receive hands-on training in all aspects of Accommodation Management, supported by a state-of-the-art <span className='font-bold'>Property Management System (PMS)</span> aligned with global hotel industry practices. Spacious, simulation-enabled lecture halls provide an immersive environment for effective, industry-oriented learning.
              </p>
            </div>
          </div>

          {/* =======================================
              SECTION 2: FACILITIES
          ======================================= */}
          <div className="flex flex-col-reverse lg:flex-row items-start justify-between gap-12 lg:gap-20 xl:gap-24">
            
            {/* Left: 2-Column Text Layout */}
            <div className="w-full lg:w-7/12 flex flex-col pt-8 lg:pt-0 relative z-10">
              
              <span className="absolute -top-10 md:-top-20 right-0 lg:-right-10 font-sans text-[120px] md:text-[180px] lg:text-[220px] font-bold leading-none text-[var(--text-main)]/5 select-none pointer-events-none tracking-tighter -z-10">
                02
              </span>
              
              <span className="text-reveal text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)] mb-4 md:mb-6 block">
                Infrastructure
              </span>
              
              <h2 className="split-heading head-txt text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[0.9] tracking-tighter mb-12 md:mb-16">
                Facilities
              </h2>
              
              <div className="text-reveal grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 relative">
                
                {/* Column 1: Lobby/Reception */}
                <div className="flex flex-col">
                  <h3 className="font-sans text-xl md:text-2xl font-semibold text-[var(--text-main)] mb-4">
                    Lobby/Reception
                  </h3>
                  <p className="text-base md:text-lg font-light leading-[1.8] md:leading-[1.9] text-[var(--text-main)]/80 text-justify">
                    A fully functional front desk simulation allows students to master the art of guest relations, check-in/check-out procedures, and handling diverse guest scenarios in a realistic hotel lobby environment.
                  </p>
                </div>
                
                {/* Vertical Divider (Hidden on Mobile) */}
                <div className="hidden md:block absolute top-0 left-1/2 w-[1px] h-full bg-[var(--primary-base)]/10 -translate-x-1/2"></div>
                
                {/* Column 2: PMS Lab */}
                <div className="flex flex-col">
                  <h3 className="font-sans text-xl md:text-2xl font-semibold text-[var(--text-main)] mb-4">
                    PMS (Property Management System) Lab
                  </h3>
                  <p className="text-base md:text-lg font-light leading-[1.8] md:leading-[1.9] text-[var(--text-main)]/80 text-justify">
                    The department is proud of its massive computer lab with individual work stations which facilitates individual attention while the students acquire the mastery in operating the PMS.
                  </p>
                </div>

              </div>
            </div>

            {/* Right: Floating Portrait Image */}
            <div className="w-full lg:w-4/12 relative mt-10 lg:mt-32">
              <div className="w-full aspect-[3/4] md:aspect-[4/5] overflow-hidden bg-[var(--primary-base)]/5">
                <img 
                  src="/fo-lab.webp" 
                  alt="Front Office Computer Lab" 
                  className="img-parallax w-full h-[120%] object-cover -translate-y-[10%] will-change-transform"
                />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =======================================
          SECTION 3: COMPUTER LAB (HORIZONTAL SCROLL)
      ======================================= */}
      {/* 
          IMPORTANT: The ID here matches the hash we added to the 
          FacilityCard link in Facilities.jsx 
      */}
      <div id="computer-lab" className="relative w-full">
        {/* Massive Editorial Heading anchored over the horizontal section */}
        <div className="absolute top-16 md:top-24 lg:top-32 left-0 w-full px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24 max-w-[1800px] mx-auto z-20 pointer-events-none">
          <span className="text-reveal text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)] mb-4 block">
            Digital Infrastructure
          </span>
          <h2 className="split-heading head-txt text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[0.9] tracking-tighter">
            Computer Lab
          </h2>
        </div>

        {/* The imported scrolling track */}
        <LabHorizontalScroll />
      </div>

    </div>
  );
}