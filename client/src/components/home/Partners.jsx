import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Base images reused to generate a 40-item dataset
const baseImages = [
  "/campus-facility.webp",
  "/events-facility.webp",
  "/infrastructure-facility.webp",
  "/sports-facility.webp",
  "/seminar-facility.webp",
];

// Scaled up to 40 items so the 8-col and 10-col grids have enough elements to form proper rows
const partnersData = Array.from({ length: 24 }).map((_, i) => ({
  id: i + 1,
  img: baseImages[i % baseImages.length],
}));

export default function Partners() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const gridContainerRef = useRef(null);
  
  // Arrays to hold refs for both the masking container and the image itself
  const maskRefs = useRef([]);
  const imageRefs = useRef([]);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    // Define break points for highly targeted scroll triggers
    mm.add({
      isMobile: "(max-width: 767px)",
      isTablet: "(min-width: 768px) and (max-width: 1023px)",
      isDesktop: "(min-width: 1024px)"
    }, (context) => {
      let { isDesktop } = context.conditions;

      // Header Entrance Animation
      gsap.fromTo(
        headerRef.current.querySelectorAll('.partner-word'),
        { y: "120%", rotateZ: 2 },
        {
          y: "0%",
          rotateZ: 0,
          duration: 1.2,
          stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: isDesktop ? "top 80%" : "top 90%",
            toggleActions: "play none none reverse",
          }
        }
      );

      // The Classic, Premium Grid Reveal Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: gridContainerRef.current,
          start: isDesktop ? "top 90%" : "top 100%",
          toggleActions: "play none none reverse",
        }
      });

      // Slowly fade in the architectural grid lines
      tl.to(gridContainerRef.current, {
        opacity: 1,
        duration: 1.5,
        ease: "power2.inOut",
      });

      // The Cinematic Curtain Reveal
      tl.fromTo(maskRefs.current,
        { 
          clipPath: "inset(100% 0% 0% 0%)"
        },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.6,
          ease: "expo.inOut",
          stagger: {
            amount: 1, 
            from: "start", 
          }
        },
        "-=1.5" 
      );

      // Step C: The Subliminal Image Scale
      tl.fromTo(imageRefs.current,
        { 
          scale: 1.3 
        },
        {
          scale: 1,
          duration: 1.6,
          ease: "expo.inOut",
          stagger: {
            amount: 1,
            from: "start",
          }
        },
        "-=2.6" 
      );
    });

    return () => mm.revert();
  }, { scope: sectionRef });

  return (
    <section 
      ref={sectionRef} 
      className="w-full relative bg-[var(--background)] py-24 md:py-32 xl:py-40 2xl:py-48 overflow-hidden"
    >
      
      {/* SECTION HEADER */}
      <div className="w-full flex flex-col items-center justify-center mb-16 md:mb-24 px-5">
        <div ref={headerRef} className="flex flex-col items-center text-center text-[var(--primary-base)]">
          <span className="font-sans font-bold text-xs xl:text-sm 2xl:text-base uppercase tracking-[0.2em] mb-2 md:mb-3 block opacity-70">
            Our Network
          </span>
          <h2 className="head-txt text-5xl md:text-6xl lg:text-[4.5rem] xl:text-[5.5rem] 2xl:text-[6.5rem] leading-[1.05] tracking-tight">
            <span className="inline-flex overflow-hidden align-top pb-2">
              <span className="partner-word block origin-bottom-left will-change-transform">Our</span>
            </span>{" "}
            <span className="inline-flex overflow-hidden align-top pb-2">
              <span className="partner-word block origin-bottom-left will-change-transform">Placement</span>
            </span>{" "}
            <span className="inline-flex overflow-hidden align-top pb-2">
              <span className="partner-word block origin-bottom-left will-change-transform italic font-light text-[var(--accent)]">Partners</span>
            </span>
          </h2>
        </div>
      </div>

      {/* MAIN CONTENT AREA (The CSS Grid) */}
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 mx-auto max-w-[1800px]">
        {/* 
            Grid Container
            Responsive Columns adjusted per specifications: 2 -> 4 -> 6 -> 8 -> 10
        */}
        <div 
          ref={gridContainerRef}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 border-t border-l border-[var(--primary-base)]/15 opacity-0"
        >
          {partnersData.map((partner, index) => (
            
            // Grid Cell (Maintains the blueprint borders and aspect ratio independent of inner image size)
            <div 
              key={partner.id} 
              className="border-r border-b border-[var(--primary-base)]/15 flex items-center justify-center aspect-[4/3] p-4"
            >
              {/* 
                  The Mask Wrapper
                  Dimensions scaled down to prevent overflowing the much smaller cells 
                  on the 8-col and 10-col breakpoints.
              */}
              <div 
                ref={(el) => (maskRefs.current[index] = el)}
                className="relative overflow-hidden will-change-transform w-20 h-14 sm:w-24 sm:h-16 md:w-28 md:h-20 lg:w-24 lg:h-16 xl:w-28 xl:h-20 2xl:w-28 2xl:h-20"
              >
                <img
                  ref={(el) => (imageRefs.current[index] = el)}
                  src={partner.img}
                  alt={`Partner ${partner.id}`}
                  className="w-full h-full object-cover grayscale-[15%] will-change-transform" 
                />
              </div>
            </div>

          ))}
        </div>
      </div>

    </section>
  );
}