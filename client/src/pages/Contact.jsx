import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* =========================================
   MOCK DATA: DISTANCES & UNIQUE SVG TYPES
========================================= */
const distanceData = [
  { id: 'airport', title: 'Kazi Nazrul Islam Airport', distance: '24.6 km', type: 'flight' },
  { id: 'railway', title: 'Durgapur Railway Station', distance: '11.7 km', type: 'rail' },
  { id: 'benachity', title: 'Benachity Prantika', distance: '8.6 km', type: 'node' },
  { id: 'bus', title: 'Durgapur City Center Bus Stand', distance: '7.8 km', type: 'urban' },
  { id: 'muchipara', title: 'Muchipara Bus Stand', distance: '6.9 km', type: 'curve' },
];

/* 
  =========================================
  DECORATIVE SVG ICONS WITH FLAWLESS MASK
  ========================================= 
*/
const DistanceIcon = ({ type }) => {
  let maskPath = '';
  // A thick stroke ensures the mask generously covers the artwork dots
  let maskStrokeWidth = "30"; 

  if (type === 'flight') maskPath = "M 20 80 Q 50 20 80 20";
  // The rail requires a wider diagonal sweep to cover all three parallel lines
  if (type === 'rail') { maskPath = "M 20 90 L 90 20"; maskStrokeWidth = "50"; }
  if (type === 'node') maskPath = "M 20 50 Q 35 25 50 50 T 80 50";
  if (type === 'urban') maskPath = "M 20 70 L 50 70 L 50 35 L 80 35";
  if (type === 'curve') maskPath = "M 20 30 Q 50 80 80 70";

  return (
    <div className="w-16 h-16 md:w-20 md:h-20 mb-6 relative">
      <svg viewBox="0 0 100 100" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full opacity-90">
        
        {/* THE INVISIBLE ANIMATION MASK */}
        <defs>
          <mask id={`mask-${type}`}>
            <path 
              className="dist-mask-anim" 
              d={maskPath} 
              stroke="white" 
              strokeWidth={maskStrokeWidth} 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </mask>
        </defs>

        {/* THE ARTWORK (Protected by the mask) */}
        <g mask={`url(#mask-${type})`}>
          {type === 'flight' && (
            <>
              <path d="M 20 80 Q 50 20 80 20" strokeDasharray="4 6" />
              <circle cx="20" cy="80" r="3.5" fill="var(--accent)" className="dist-fade" />
              <circle cx="80" cy="20" r="3" fill="var(--background)" stroke="var(--accent)" strokeWidth="2" className="dist-fade" />
            </>
          )}
          
          {type === 'rail' && (
            <>
              <path d="M 30 75 L 75 30" />
              <path d="M 40 85 L 85 40" />
              {/* Dashed middle line */}
              <path d="M 35 80 L 80 35" strokeWidth="1.5" strokeDasharray="3 5" opacity="0.6" />
            </>
          )}
          
          {type === 'node' && (
            <>
              <path d="M 20 50 Q 35 25 50 50 T 80 50" />
              <circle cx="20" cy="50" r="3.5" fill="var(--accent)" className="dist-fade" />
              <circle cx="80" cy="50" r="3.5" fill="var(--accent)" className="dist-fade" />
            </>
          )}
          
          {type === 'urban' && (
            <>
              <path d="M 20 70 L 50 70 L 50 35 L 80 35" />
              <circle cx="20" cy="70" r="3.5" fill="var(--accent)" className="dist-fade" />
              <rect x="77" y="32" width="6" height="6" fill="var(--background)" stroke="var(--accent)" strokeWidth="2" className="dist-fade" />
            </>
          )}
          
          {type === 'curve' && (
            <>
              <path d="M 20 30 Q 50 80 80 70" strokeDasharray="3 5" />
              <circle cx="20" cy="30" r="3.5" fill="var(--background)" stroke="var(--accent)" strokeWidth="2" className="dist-fade" />
              <circle cx="80" cy="70" r="3.5" fill="var(--accent)" className="dist-fade" />
            </>
          )}
        </g>
      </svg>
    </div>
  );
};

export default function Contact() {
  const containerRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(min-width: 320px)", () => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

      // 1. Structural Lines & Headers
      tl.fromTo('.struct-line', 
        { scaleX: 0 }, 
        { scaleX: 1, duration: 1.5, stagger: 0.1, transformOrigin: 'left center' }
      )
      .fromTo('.reveal-title',
        { y: '110%', rotateX: -10 },
        { y: '0%', rotateX: 0, duration: 1.5, stagger: 0.05 },
        "-=1.2"
      )
      .fromTo('.reveal-label',
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 1, stagger: 0.05 },
        "-=1"
      )
      .fromTo('.reveal-link',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, stagger: 0.1 },
        "-=1"
      );

      // 2. Map Reveal
      gsap.fromTo('.map-reveal',
        { opacity: 0, scale: 0.95, filter: 'blur(10px)' },
        {
          opacity: 1, 
          scale: 1, 
          filter: 'blur(0px)',
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".map-reveal",
            start: "top 85%",
            once: true // Ensures the map stays revealed
          }
        }
      );

      // 3. Distance Cards Text Reveal
      gsap.fromTo('.distance-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1, 
          y: 0,
          duration: 1.2,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".distance-grid",
            start: "top 80%",
            once: true
          }
        }
      );

      // 4. SVG Mask Wipe Animations (Plays Once on Scroll)
      const maskPaths = document.querySelectorAll('.dist-mask-anim');
      maskPaths.forEach((path) => {
        const length = path.getTotalLength();
        // A generous buffer pulls the rounded cap completely out of frame before starting
        const buffer = 50; 
        
        gsap.fromTo(path, 
          { strokeDasharray: length + buffer, strokeDashoffset: length + buffer },
          {
            strokeDashoffset: 0,
            duration: 2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: path.closest('.distance-card'),
              start: "top 85%",
              once: true // Will only draw once, no reversing glitch
            }
          }
        );
      });

      // 5. SVG Dots/Accents (Pops in once alongside the lines)
      gsap.fromTo('.dist-fade',
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(2)",
          transformOrigin: "center",
          scrollTrigger: {
            trigger: ".distance-grid",
            start: "top 85%",
            once: true
          }
        }
      );
    });

    return () => mm.revert();
  }, { scope: containerRef });

  return (
    <main 
      ref={containerRef} 
      className="w-full min-h-screen bg-[var(--background)] text-[var(--text-main)] selection:bg-[var(--accent)] selection:text-[var(--text-main)] pt-32 pb-32 md:pt-40 flex flex-col justify-center overflow-hidden"
    >
      <div className="w-full max-w-[1800px] mx-auto px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        
        {/* ==========================================
            MASSIVE TYPOGRAPHIC HEADER
        ========================================== */}
        <div className="w-full mb-16 md:mb-24 flex flex-col">
          <div className="overflow-hidden pb-4 md:pb-8">
            <h1 className="reveal-title head-txt italic text-6xl md:text-8xl lg:text-[9rem] xl:text-[11rem] 2xl:text-[13rem] font-light tracking-tighter leading-[0.8] uppercase text-[var(--text-main)]">
              Get In Touch
            </h1>
          </div>
        </div>

        {/* ==========================================
            EDITORIAL GRID LAYOUT
        ========================================== */}
        <div className="flex flex-col w-full">
          
          {/* ROW 1: General Inquiry & Phones */}
          <div className="w-full relative py-12 md:py-16 lg:py-20 flex flex-col lg:flex-row gap-12 lg:gap-24">
            <div className="struct-line absolute top-0 left-0 w-full h-[1px] bg-[var(--primary-base)]/20"></div>
            
            <div className="w-full lg:w-[25%] shrink-0">
              <span className="reveal-label font-sans text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
                Direct Lines & General
              </span>
            </div>

            <div className="w-full lg:w-[75%] flex flex-col gap-6 md:gap-8">
              
              <div className="w-full">
                <a href="mailto:sihmdurgapur@gmail.com" className="reveal-link group relative inline-block text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight hover:text-[var(--accent)] transition-colors duration-500 outline-none break-all pb-2 md:pb-4">
                  sihmdurgapur@gmail.com
                  <div className="absolute bottom-0 left-0 h-[2px] bg-[var(--accent)] w-0 group-hover:w-full transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"></div>
                </a>
              </div>

              <div className="flex flex-col md:flex-row gap-10 md:gap-16 mt-4 md:mt-8 flex-wrap">
                <div className="flex flex-col">
                  <a 
                    href="https://wa.me/918927596669" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="reveal-link inline-block text-2xl md:text-3xl lg:text-4xl font-light tracking-tight hover:text-[var(--accent)] hover:translate-x-2 transition-all duration-500 outline-none w-fit"
                  >
                    +91 892 759 6669
                  </a>
                  <span className="reveal-link font-sans text-sm md:text-base opacity-50 mt-2 tracking-wide">
                    (Mon - Fri: 9AM - 5PM) except Public Holidays
                  </span>
                </div>
                
                <div className="flex flex-col justify-start">
                  <a 
                    href="tel:0343-2500775" 
                    className="reveal-link inline-block text-2xl md:text-3xl lg:text-4xl font-light tracking-tight hover:text-[var(--accent)] hover:translate-x-2 transition-all duration-500 outline-none w-fit"
                  >
                    0343-2500775
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ROW 2: Placement Desk */}
          <div className="w-full relative py-12 md:py-16 lg:py-20 flex flex-col lg:flex-row gap-12 lg:gap-24">
            <div className="struct-line absolute top-0 left-0 w-full h-[1px] bg-[var(--primary-base)]/20"></div>
            
            <div className="w-full lg:w-[25%] shrink-0">
              <span className="reveal-label font-sans text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
                Placement Desk
              </span>
            </div>

            <div className="w-full lg:w-[75%] flex flex-col gap-10 md:gap-16">
              <div className="flex flex-col md:flex-row gap-4 md:gap-12 items-start md:items-baseline">
                <span className="reveal-label w-32 shrink-0 font-sans text-[10px] opacity-40 uppercase tracking-[0.2em]">Placement</span>
                <a href="mailto:tpocell.sihmdgp@gmail.com" className="reveal-link group relative inline-block text-2xl md:text-4xl lg:text-5xl font-light tracking-tight hover:text-[var(--accent)] transition-colors duration-500 outline-none break-all pb-1 md:pb-2">
                  tpocell.sihmdgp@gmail.com
                  <div className="absolute bottom-0 left-0 h-[1px] bg-[var(--accent)] w-0 group-hover:w-full transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"></div>
                </a>
              </div>
            </div>
          </div>

          {/* ROW 3: Address & MAP */}
          <div className="w-full relative py-12 md:py-16 lg:py-20 flex flex-col lg:flex-row gap-12 lg:gap-24">
            <div className="struct-line absolute top-0 left-0 w-full h-[1px] bg-[var(--primary-base)]/20"></div>
            
            <div className="w-full lg:w-[25%] shrink-0">
              <span className="reveal-label font-sans text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
                Location
              </span>
            </div>

            <div className="w-full lg:w-[75%] flex flex-col lg:flex-row gap-12 lg:gap-16">
              
              <div className="flex flex-col gap-6 w-full lg:w-1/2">
                <p className="reveal-link text-xl md:text-2xl lg:text-3xl font-light tracking-tight leading-relaxed opacity-90">
                  State Institute of Hotel Management,<br />
                  Fuljhore, Durgapur - 713206<br />
                  West Bengal, India.
                </p>
                
                <a 
                  href="https://www.google.com/maps?q=23.54757943246294,87.33992374149645" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="reveal-link mt-4 w-fit border-b border-[var(--text-main)]/30 pb-1 text-sm uppercase tracking-widest font-semibold hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors duration-300"
                >
                  Get Directions
                </a>
              </div>

              <div className="map-reveal w-full lg:w-1/2 h-64 md:h-80 bg-[var(--primary-base)]/5 p-2 border border-[var(--primary-base)]/10">
                <iframe 
                  src="https://maps.google.com/maps?q=23.54757943246294,87.33992374149645&z=16&output=embed" 
                  className="w-full h-full grayscale-[0.5] hover:grayscale-0 transition-all duration-500" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="SIHM Durgapur Map Location"
                ></iframe>
              </div>

            </div>
          </div>

          {/* ==========================================
              ROW 4: CONNECTIVITY & DISTANCES (GRID)
          ========================================== */}
          <div className="w-full relative py-12 md:py-16 lg:py-20 flex flex-col lg:flex-row gap-12 lg:gap-24">
            <div className="struct-line absolute top-0 left-0 w-full h-[1px] bg-[var(--primary-base)]/20"></div>
            {/* <div className="struct-line absolute bottom-0 left-0 w-full h-[1px] bg-[var(--primary-base)]/20"></div> */}
            
            <div className="w-full lg:w-[25%] shrink-0">
              <span className="reveal-label font-sans text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
                Proximity
              </span>
            </div>

            <div className="distance-grid w-full lg:w-[75%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8 md:gap-x-12">
              
              {distanceData.map((item) => (
                <div key={item.id} className="distance-card flex flex-col items-start border-l border-[var(--primary-base)]/10 pl-6 md:pl-8 group">
                  
                  <DistanceIcon type={item.type} />

                  <h3 className="text-4xl md:text-5xl font-light tracking-tighter text-[var(--text-main)] mb-2 group-hover:text-[var(--accent)] transition-colors duration-500">
                    {item.distance}
                  </h3>
                  
                  <div className="flex flex-col">
                    <span className="font-sans text-[10px] uppercase tracking-widest opacity-50 mb-1">Distance From</span>
                    <span className="text-sm md:text-base opacity-80 font-medium">
                      {item.title}
                    </span>
                  </div>

                </div>
              ))}

            </div>
          </div>

        </div>

      </div>
    </main>
  );
}