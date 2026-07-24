import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function PrincipalMessage() {
  const sectionRef = useRef(null);
  const imageWrapperRef = useRef(null);
  const imageRef = useRef(null);
  
  // Split the refs so they trigger independently when scrolled into view
  const topContentRef = useRef(null);
  const paragraphsRef = useRef(null);

  // In the future, this will be passed as a prop from your backend (e.g., ImageKit URL)
  const principalImageUrl = "/principal.webp";

  // Helper function to create the word-by-word overflow mask for the curtain reveal
  const renderWords = (text, customClass = "") => {
    return text.split(" ").map((word, wIdx) => (
      <span key={wIdx} className="inline-flex overflow-hidden mr-[0.25em] align-top py-0.5">
        <span className={`principal-word translate-y-[100%] block will-change-transform ${customClass}`}>
          {word}
        </span>
      </span>
    ));
  };

  useGSAP(() => {
    let mm = gsap.matchMedia();

    // 1. UNIVERSAL IMAGE ANIMATIONS
    gsap.fromTo(
      imageWrapperRef.current,
      { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" },
      { 
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", 
        duration: 1.5, 
        ease: "expo.inOut",
        scrollTrigger: {
          trigger: imageWrapperRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        }
      }
    );

    gsap.fromTo(
      imageRef.current,
      { scale: 1.15 },
      { 
        scale: 1, 
        duration: 2, 
        ease: "expo.out",
        scrollTrigger: {
          trigger: imageWrapperRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        }
      }
    );

    // 2. DESKTOP / LARGE SCREENS ANIMATIONS
    mm.add("(min-width: 1024px)", () => {
      // Top Text Block
      gsap.fromTo(
        topContentRef.current.children,
        { y: 40, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1, 
          stagger: 0.15, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: topContentRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          }
        }
      );

      // Paragraph Curtain Reveal (Independent Trigger)
      gsap.to(
        paragraphsRef.current.querySelectorAll('.principal-word'),
        { 
          y: "0%", 
          duration: 0.6, 
          stagger: 0.008, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: paragraphsRef.current,
            start: "top 85%", // Triggers precisely when the paragraph block enters
            toggleActions: "play none none reverse",
          }
        }
      );
    });

    // 3. MOBILE / TABLET ANIMATIONS
    mm.add("(max-width: 1023px)", () => {
      // Top Text Block (Fires a bit later on mobile to ensure it's fully in view)
      gsap.fromTo(
        topContentRef.current.children,
        { y: 40, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1, 
          stagger: 0.15, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: topContentRef.current,
            start: "top 85%", 
            toggleActions: "play none none reverse",
          }
        }
      );

      // Paragraph Curtain Reveal (Tighter trigger for mobile stacking)
      gsap.to(
        paragraphsRef.current.querySelectorAll('.principal-word'),
        { 
          y: "0%", 
          duration: 0.5, // Slightly faster on mobile
          stagger: 0.01, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: paragraphsRef.current,
            start: "top 90%", // Triggers right as the paragraph enters the bottom of the screen
            toggleActions: "play none none reverse",
          }
        }
      );
    });

    return () => mm.revert();
  }, { scope: sectionRef });

  return (
    <section 
      ref={sectionRef} 
      className="w-full relative z-10 bg-[var(--primary-base)] py-24 md:py-32 xl:py-40 2xl:py-48"
    >
      {/* 
        =========================================
        SAFE BACKGROUND DECORATION LAYER 
        ========================================= 
      */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/[0.02] to-transparent"></div>
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[var(--accent)]/5 rounded-full blur-3xl"></div>
      </div>

      {/* Grid Layout Container */}
      <div className="relative z-10 max-w-7xl xl:max-w-screen-xl 2xl:max-w-[100rem] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 xl:gap-28 2xl:gap-32 px-5 md:px-12 lg:px-16 xl:px-24 2xl:px-32">
        
        {/* 
          =========================================
          LEFT COLUMN: THE STICKY PORTRAIT
          ========================================= 
        */}
        <div className="col-span-1 lg:col-span-5 relative min-w-0">
          
          <div className="lg:sticky lg:top-[14vh] xl:top-[17vh] flex flex-col w-full h-fit">
            
            {/* The Accent Frame */}
            <div className="absolute top-5 left-5 md:top-8 md:left-8 w-full h-[55vh] lg:h-[65vh] xl:h-[75vh] border border-[var(--accent)]/30 z-0 hidden md:block"></div>
            
            {/* The Image Mask Wrapper */}
            <div 
              ref={imageWrapperRef}
              className="relative z-10 w-full h-[55vh] lg:h-[65vh] xl:h-[75vh] overflow-hidden bg-[var(--background)]/5 shadow-2xl"
            >
              <img 
                ref={imageRef}
                src={principalImageUrl} 
                alt="Principal of SIHM" 
                className="w-full h-full object-cover object-top origin-center transform-gpu grayscale-[20%] contrast-125"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary-base)]/80 via-transparent to-transparent"></div>
            </div>

            {/* Name Plate Overlay */}
            <div className="absolute bottom-6 -right-2 md:bottom-10 md:-right-8 lg:-right-10 z-20 bg-[var(--background)] px-6 py-4 md:px-8 md:py-6 shadow-xl">
              <h4 className="head-txt text-xl md:text-2xl lg:text-3xl text-[var(--primary-base)] mb-1">
                Name of Principal
              </h4>
              <p className="font-sans font-semibold text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]">
                Principal, SIHM Durgapur
              </p>
            </div>
            
          </div>
        </div>

        {/* 
          =========================================
          RIGHT COLUMN: THE SCROLLING MESSAGE
          ========================================= 
        */}
        <div className="col-span-1 lg:col-span-7 flex flex-col items-start min-w-0 pt-8 md:pt-16 lg:pt-0 pb-12 lg:pb-32">
          
          <div className="absolute -top-6 lg:-top-16 -left-2 lg:-left-8 text-[8rem] lg:text-[12rem] text-[var(--text-light)] opacity-5 font-serif leading-none select-none pointer-events-none">
            "
          </div>

          {/* TOP TEXT BLOCK: Kicker, Hero Quote, Swami Quote */}
          <div ref={topContentRef} className="relative z-10 flex flex-col items-start w-full">
            
            {/* 1. Kicker */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-8 h-[1px] bg-[var(--accent)]"></div>
              <span className="font-sans font-bold text-[10px] xl:text-[11px] uppercase tracking-[0.2em] text-[var(--accent)]">
                Message from the Desk
              </span>
            </div>

            {/* 2. Hero Quote */}
            <h3 className="head-txt text-3xl md:text-4xl lg:text-[2.75rem] xl:text-5xl leading-[1.2] text-[var(--text-light)] mb-10">
              Hospitality is not merely a profession — it is a way of life rooted in <span className="italic font-light text-[var(--accent)]">values, service, and human connection.</span>
            </h3>

            {/* 3. Swami Vivekananda Quote */}
            <div className="relative w-full py-10 my-6 border-y border-[var(--text-light)]/10">
              <h4 className="head-txt text-xl md:text-2xl lg:text-3xl text-[var(--accent)] leading-tight italic mb-6">
                "Education is the manifestation of the perfection already in man."
              </h4>
              <div className="flex items-center gap-4">
                <div className="w-8 h-[1px] bg-[var(--text-light)]/30"></div>
                <p className="font-sans font-semibold text-[10px] xl:text-[11px] uppercase tracking-[0.2em] text-[var(--text-light)]/70">
                  Swami Vivekananda
                </p>
              </div>
            </div>

          </div>

          {/* BOTTOM TEXT BLOCK: Body Paragraphs with Curtain Reveal */}
          <div ref={paragraphsRef} className="relative z-10 flex flex-col gap-6 font-sans text-sm md:text-base xl:text-lg text-[var(--text-light)]/60 leading-relaxed max-w-2xl 2xl:max-w-3xl mt-4">
            <p>
              {renderWords("At")}
              {renderWords("State Institute of Hotel Management, Durgapur,", "text-[var(--text-light)] font-medium")}
              {renderWords("we believe education must ignite inner potential, nurture character, and empower students to create impact. Our vision of Hotel Management education goes far beyond traditional roles.")}
            </p>
            <p>
              {renderWords("The future belongs to those who can innovate, lead with empathy, embrace technology, and build enterprises that generate employment and meaningful experiences. Whether your aspiration is to manage world-class hotels, launch your own food venture, become a hospitality technologist, or contribute to tourism and service innovation, SIHM Durgapur provides the right foundation.")}
            </p>
            <p className="pt-4">
              {renderWords("Your journey to serve the world with skill, dignity, and vision begins here. Welcome to a future full of possibilities.", "text-[var(--text-light)]/90 italic font-medium")}
            </p>
          </div>

        </div>
        
      </div>
    </section>
  );
}