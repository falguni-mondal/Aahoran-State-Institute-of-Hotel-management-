import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ARUgcBanner() {
  const sectionRef = useRef(null);

  // Elegant reveal: Borders expand, then text fades up
  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      tl.fromTo(
        ".ugc-border",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          ease: "expo.out",
          transformOrigin: "left center",
        },
      ).fromTo(
        ".ugc-reveal",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out" },
        "-=0.8",
      );
    },
    { scope: sectionRef },
  );

  // GSAP Hover Animation dynamically scoped to the hovered button
  const { contextSafe } = useGSAP({ scope: sectionRef });
  
  const handleMouseEnter = contextSafe((e) => {
    // Find the text elements ONLY inside the button currently being hovered
    const btn = e.currentTarget;
    gsap.to(btn.querySelector(".cta-text-main"), {
      y: "-110%",
      duration: 0.6,
      ease: "expo.inOut",
    });
    gsap.to(btn.querySelector(".cta-text-hover"), { 
      y: "0%", 
      duration: 0.6, 
      ease: "expo.inOut" 
    });
  });

  const handleMouseLeave = contextSafe((e) => {
    const btn = e.currentTarget;
    gsap.to(btn.querySelector(".cta-text-main"), { 
      y: "0%", 
      duration: 0.6, 
      ease: "expo.inOut" 
    });
    gsap.to(btn.querySelector(".cta-text-hover"), {
      y: "110%",
      duration: 0.6,
      ease: "expo.inOut",
    });
  });

  return (
    <section className="w-full bg-[var(--background)] px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24 pt-10 pb-4">
      <div
        ref={sectionRef}
        className="w-full max-w-[1800px] mx-auto relative flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-24 py-16 md:py-20 lg:py-24"
      >
        {/* Animated Bottom Editorial Borders */}
        <div className="ugc-border absolute bottom-0 left-0 w-full h-[1px] bg-[var(--text-main)]/15"></div>

        {/* LEFT COLUMN: Kicker & Heading */}
        <div className="flex flex-col w-full lg:w-5/12 xl:w-5/12 relative z-10">
          <span className="ugc-reveal font-sans font-bold text-[10px] md:text-xs uppercase tracking-[0.3em] text-[var(--accent)] mb-6 block">
            National Mandate
          </span>
          <h3 className="ugc-reveal text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-[var(--text-main)] leading-[1.1]">
            UGC Anti-Ragging Guidelines.
          </h3>
        </div>

        {/* RIGHT COLUMN: Serif Paragraph & CTA */}
        <div className="flex flex-col w-full lg:w-7/12 xl:w-7/12 relative z-10 pt-2">
          {/* THEME UPDATE: Applied font-serif and matching line-height to perfectly complement ARContent */}
          <p className="ugc-reveal font-serif text-lg md:text-xl lg:text-2xl xl:text-3xl text-[var(--text-main)]/80 leading-[1.7] md:leading-[1.8] mb-10 md:mb-12 text-justify">
            SIHM Durgapur maintains a zero-tolerance policy towards ragging,
            strictly adhering to the comprehensive regulations laid down by the
            University Grants Commission (UGC) of India.
          </p>

          {/* External Link Buttons */}
          <div className="flex flex-wrap gap-5">
            
            {/* BUTTON 1: UGC Portal */}
            <div className="ugc-reveal w-fit">
              <a
                href="https://www.ugc.gov.in/Bureaus/bureaus_details?EwV4Rtmy2xJ7nuhP3MYqbpwm5MTBRSa5u2ipRdltuUxMTUu1gSiipessUFP0rnrG"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="bg-[var(--accent)] text-[var(--text-light)] font-semibold text-xs md:text-sm uppercase tracking-[0.15em] cursor-pointer flex items-stretch h-14 md:h-16 w-fit shadow-lg"
              >
                {/* Button Text Zone */}
                <div className="flex items-center justify-center px-8 md:px-10 relative overflow-hidden">
                  <div className="relative overflow-hidden h-[1em] leading-none flex items-center justify-center">
                    <span className="cta-text-main block">
                      Visit UGC Portal
                    </span>
                    <span className="cta-text-hover absolute block translate-y-[110%]">
                      Visit UGC Portal
                    </span>
                  </div>
                </div>

                {/* External Link Icon Zone */}
                <div className="border-l border-[var(--text-light)]/20 px-5 md:px-6 flex items-center justify-center">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="block w-4 h-4 md:w-5 md:h-5"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </div>
              </a>
            </div>

            {/* BUTTON 2: Anti Ragging Portal */}
            <div className="ugc-reveal w-fit">
              <a
                href="https://www.antiragging.in/"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="bg-[var(--accent)] text-[var(--text-light)] font-semibold text-xs md:text-sm uppercase tracking-[0.15em] cursor-pointer flex items-stretch h-14 md:h-16 w-fit shadow-lg"
              >
                {/* Button Text Zone */}
                <div className="flex items-center justify-center px-8 md:px-10 relative overflow-hidden">
                  <div className="relative overflow-hidden h-[1em] leading-none flex items-center justify-center">
                    <span className="cta-text-main block">
                      Visit Anti Ragging Portal
                    </span>
                    <span className="cta-text-hover absolute block translate-y-[110%]">
                      Visit Anti Ragging Portal
                    </span>
                  </div>
                </div>

                {/* External Link Icon Zone */}
                <div className="border-l border-[var(--text-light)]/20 px-5 md:px-6 flex items-center justify-center">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="block w-4 h-4 md:w-5 md:h-5"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </div>
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}