import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger
gsap.registerPlugin(useGSAP, ScrollTrigger);

/* =========================================
   CUSTOM COMPONENT: Diagonal Wave Scrub Text
========================================= */
const ScrubText = ({ text, className }) => {
  const containerRef = useRef(null);

  useGSAP(() => {
    const chars = containerRef.current.querySelectorAll('.scrub-char');
    if (!chars.length) return;

    // 1. Dynamically group characters into lines based on their vertical position
    const lines = [];
    let currentLine = [];
    let lastTop = chars[0].offsetTop;

    chars.forEach((char) => {
      if (char.offsetTop !== lastTop) {
        lines.push(currentLine);
        currentLine = [];
        lastTop = char.offsetTop;
      }
      currentLine.push(char);
    });
    lines.push(currentLine); 

    // 2. Create the scrub timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 85%", 
        end: "bottom 55%",
        scrub: 1, 
      }
    });

    // 3. Animate each line with a stagger delay between lines for the diagonal wave
    lines.forEach((lineChars, lineIndex) => {
      tl.to(
        lineChars,
        {
          opacity: 1,
          stagger: 0.05, 
          ease: "none",
        },
        lineIndex * 0.1 
      );
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className={className}>
      {text.split(" ").map((word, wIdx) => (
        <span key={wIdx} className="inline-block mr-[0.25em] mb-1">
          {word.split("").map((char, cIdx) => (
            <span key={cIdx} className="scrub-char opacity-30 transition-none inline-block">
              {char}
            </span>
          ))}
        </span>
      ))}
    </div>
  );
};

/* =========================================
   CUSTOM COMPONENT: About CTA Button
========================================= */
function AboutCTA({ text }) {
  const btnRef = useRef(null);
  const { contextSafe } = useGSAP({ scope: btnRef });

  const handleMouseEnter = contextSafe(() => {
    gsap.to(".about-cta-text-main", { y: "-110%", duration: 0.6, ease: "expo.inOut" });
    gsap.to(".about-cta-text-hover", { y: "0%", duration: 0.6, ease: "expo.inOut" });
  });

  const handleMouseLeave = contextSafe(() => {
    gsap.to(".about-cta-text-main", { y: "0%", duration: 0.6, ease: "expo.inOut" });
    gsap.to(".about-cta-text-hover", { y: "110%", duration: 0.6, ease: "expo.inOut" });
  });

  return (
    <button 
      ref={btnRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="bg-[var(--primary-base)] text-[var(--text-light)] font-medium text-xs uppercase tracking-[0.15em] shadow-xl cursor-pointer flex items-stretch h-13 xl:h-14 mt-4 outline-none"
    >
      <div className="flex items-center justify-center px-10 xl:px-12 relative overflow-hidden">
        <div className="relative overflow-hidden h-[1em] leading-none flex items-center justify-center">
          <span className="about-cta-text-main block">{text}</span>
          <span className="about-cta-text-hover absolute block translate-y-[110%]">{text}</span>
        </div>
      </div>
      <div className="border-l border-[var(--text-light)]/20 px-4 xl:px-6 flex items-center justify-center">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="block xl:w-5 xl:h-5">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}

/* =========================================
   MAIN SECTION: About Component
========================================= */
export default function About() {
  const sectionRef = useRef(null);
  const imageWrapperRef = useRef(null);
  const blockquoteRef = useRef(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    // 1. HORIZONTAL / DESKTOP
    mm.add("(orientation: landscape)", () => {
      gsap.fromTo(
        ".about-title-line",
        { y: "120%", rotateZ: 2 },
        { 
          y: "0%", 
          rotateZ: 0, 
          duration: 1.2, 
          stagger: 0.1, 
          ease: "expo.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          }
        }
      );
    });

    // 2. VERTICAL / MOBILE
    mm.add("(orientation: portrait)", () => {
      gsap.fromTo(
        ".about-title-line",
        { y: "120%", rotateZ: 2 },
        { 
          y: "0%", 
          rotateZ: 0, 
          duration: 1.2, 
          stagger: 0.1, 
          ease: "expo.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          }
        }
      );
    });

    // 3. UNIVERSAL ANIMATIONS
    gsap.fromTo(
      blockquoteRef.current,
      { y: 40, opacity: 0 },
      {
        y: 0, 
        opacity: 1, 
        duration: 1, 
        ease: "expo.out",
        scrollTrigger: {
          trigger: blockquoteRef.current,
          start: "top 85%",
          end: "bottom 15%", 
          toggleActions: "play reverse play reverse", 
        }
      }
    );

    gsap.fromTo(
      ".image-curtain",
      { scaleY: 1 },
      { 
        scaleY: 0, 
        duration: 1.5, 
        ease: "expo.inOut",
        scrollTrigger: {
          trigger: imageWrapperRef.current,
          start: "top 75%",
        }
      }
    );

    // Using yPercent instead of 'y' allows flawless parallax on auto-height responsive images
    gsap.fromTo(
      ".parallax-image",
      { yPercent: -8 },
      {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: imageWrapperRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      }
    );

    return () => mm.revert();
  }, { scope: sectionRef });

  return (
    <section 
      ref={sectionRef} 
      className="w-full bg-[#F7F5F0] text-[var(--primary-base)] py-24 md:py-32 xl:py-40 2xl:py-48 relative z-10"
    >
      <div className="max-w-7xl xl:max-w-screen-xl 2xl:max-w-[100rem] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 xl:gap-32 2xl:gap-40 relative">
        
        {/* Left Column Wrapper */}
        <div className="col-span-1 lg:col-span-5 relative min-w-0 pl-5 md:pl-12 lg:pl-16 xl:pl-24 2xl:pl-32">
          
          <div className="lg:sticky lg:top-[37vh] flex flex-col justify-center items-start w-full">
            <span className="font-sans font-bold text-xs xl:text-sm 2xl:text-base uppercase tracking-[0.2em] text-[var(--text-muted)] mb-6 xl:mb-8 block opacity-80">
              Established in West Bengal
            </span>
            
            <h2 className="head-txt text-5xl md:text-6xl lg:text-[5rem] xl:text-[5.5rem] 2xl:text-[6.5rem] leading-[1.05] tracking-tight mb-8">
              <div className="overflow-hidden pb-2">
                <span className="about-title-line block origin-bottom-left">A Legacy of</span>
              </div>
              <div className="overflow-hidden pb-4">
                <span className="about-title-line block origin-bottom-left italic font-light text-[var(--accent)]">Hospitality.</span>
              </div>
            </h2>
          </div>
        </div>

        {/* Right Column: The Scrolling Narrative */}
        <div className="col-span-1 lg:col-span-7 flex flex-col items-start min-w-0 pr-5 md:pr-12 lg:pr-16 xl:pr-24 2xl:pr-32">
          
          <ScrubText 
            text="The State Institute of Hotel Management (SIHM), Durgapur is an initiation of the State of West Bengal to attract young, enthusiastic boys and girls to acquire soft, hard and managerial skills to become competent in the Hospitality industry of the country."
            className="font-sans text-base md:text-lg xl:text-xl 2xl:text-2xl leading-relaxed text-[var(--primary-base)] mb-8 xl:mb-12"
          />

          <blockquote 
            ref={blockquoteRef}
            className="border-l-2 border-[var(--accent)] pl-6 md:pl-8 py-2 my-10 xl:my-16 2xl:my-20"
          >
            <p className="head-txt text-2xl md:text-3xl lg:text-4xl xl:text-[2.5rem] 2xl:text-5xl leading-snug italic text-[var(--primary-base)]/90">
              "It is the first institute that has been gifted the name AAHORAN by our Hon'ble Chief Minister which means Collection."
            </p>
          </blockquote>

          <ScrubText 
            text="SIHM Durgapur promises the best education with a modern and professional approach along with State of the Art facilities. With the advent of urbanization and industrialisation, the Hospitality Industry is rapidly growing to cater the mass involved in Accommodation, Food and Beverage, Retails, Cruise, Airline and other service sectors."
            className="font-sans text-base md:text-lg xl:text-xl 2xl:text-2xl leading-relaxed text-[var(--primary-base)] mb-12 xl:mb-16"
          />

          {/* Cinematic Image Container - Full Width, Auto Height */}
          <div 
            ref={imageWrapperRef}
            className="w-full relative overflow-hidden rounded-sm mb-12 xl:mb-16 shadow-2xl"
          >
            <div className="image-curtain absolute inset-0 bg-[#F7F5F0] z-10 origin-bottom"></div>
            
            {/* 
              h-auto and w-full let the image define the container's height natively.
              scale-[1.15] makes it slightly larger than the container so GSAP can move it.
            */}
            <img 
              className="parallax-image w-full h-auto scale-[1.15] grayscale-[20%]"
              src="/graduationBW.webp" 
              alt="SIHM Graduation Ceremony" 
            />
          </div>

          <AboutCTA text="KNOW MORE" />

        </div>
      </div>
    </section>
  );
}