import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* =========================================
   DATA
========================================= */
const statsData = [
  { value: 100, suffix: "%", prefix: "", decimals: 0, label: "Placement Assistance", note: "Assured for all graduates" },
  { value: 12.5, suffix: "L", prefix: "₹", decimals: 1, label: "Highest Package", note: "Per annum, CTC" },
  { value: 4.8, suffix: "L", prefix: "₹", decimals: 1, label: "Average Package", note: "Per annum, CTC" },
];

const pipelineData = [
  {
    time: "Semester II",
    stage: "Foundation",
    desc: "Rigorous grounding in core operational fundamentals across all four major hospitality verticals.",
  },
  {
    time: "Semester V – VI",
    stage: "Industrial Attachment",
    desc: "A 16-week deployment at a 5-star property. This is where pre-placement observation officially begins.",
  },
  {
    time: "Final Semester",
    stage: "Campus Drives",
    desc: "Official interviews commence. Often, properties return specifically to hire their previous industrial trainees.",
  },
  {
    time: "Year 1 Onward",
    stage: "Career Growth",
    desc: "Structured internal tracks designed to move graduates into duty and shift management within 36 months.",
  },
];

const spotlightData = {
  name: "Sagnik Bose",
  role: "Sous Chef",
  property: "Taj Hotels",
  batch: "Batch of 2021",
  quote: "SIHM gave me the exact discipline and exposure needed to walk straight into a flagship 5-star kitchen — and lead a section of it within three years.",
};

/* =========================================
   STAT COUNTER (Responsive Grid Item)
========================================= */
const StatCounter = ({ stat, index, isLast }) => {
  const numRef = useRef(null);
  const wrapRef = useRef(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add({
      isMobile: "(max-width: 767px)",
      isDesktop: "(min-width: 768px)"
    }, (context) => {
      let { isDesktop } = context.conditions;
      const triggerStart = isDesktop ? "top 90%" : "top 95%";
      const proxy = { val: 0 };
      const decimals = stat.decimals || 0;

      // The Count-Up Animation
      gsap.to(proxy, {
        val: stat.value,
        duration: 2,
        ease: "expo.out",
        scrollTrigger: {
          trigger: wrapRef.current,
          start: triggerStart,
          toggleActions: "play none none reverse",
        },
        onUpdate: () => {
          if (numRef.current) {
            numRef.current.textContent = `${stat.prefix || ""}${proxy.val.toFixed(decimals)}${stat.suffix || ""}`;
          }
        },
      });

      // The Fade-Up
      gsap.fromTo(wrapRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: index * 0.1, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrapRef.current,
            start: triggerStart,
            toggleActions: "play none none reverse",
          }
        }
      );
    });

    return () => mm.revert();
  }, { scope: wrapRef });

  return (
    <div
      ref={wrapRef}
      className={`flex flex-col items-start py-8 md:py-10 lg:py-12 px-0 md:px-8 lg:px-12 2xl:px-16 border-b md:border-b-0 ${isLast ? '' : 'md:border-r'} border-[var(--text-light)]/15`}
    >
      <span className="font-sans font-semibold text-[10px] xl:text-[11px] 2xl:text-xs uppercase tracking-[0.2em] text-[var(--accent)] mb-3 md:mb-4 block">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="head-txt text-[3.5rem] sm:text-6xl md:text-[4rem] lg:text-7xl xl:text-[5.5rem] 2xl:text-[6.5rem] leading-none tracking-tight text-[var(--text-light)] mb-3">
        <span ref={numRef}>{stat.prefix || ""}0{stat.suffix || ""}</span>
      </div>
      <span className="font-sans font-medium text-sm md:text-base 2xl:text-lg text-[var(--text-light)]/80 mb-1">
        {stat.label}
      </span>
      <span className="font-sans text-[10px] xl:text-[11px] 2xl:text-xs uppercase tracking-[0.15em] text-[var(--text-light)]/40">
        {stat.note}
      </span>
    </div>
  );
};

/* =========================================
   THE PIPELINE (Scroll-scrubbed)
========================================= */
const Pipeline = () => {
  const containerRef = useRef(null);
  const railFillRef = useRef(null);
  const dotRefs = useRef([]);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    // Reset initial states
    gsap.set(dotRefs.current[0], { scale: 1, opacity: 1, backgroundColor: "var(--accent)" });
    gsap.set(dotRefs.current.slice(1), { scale: 0.6, opacity: 0.3, backgroundColor: "var(--primary-base)" });

    mm.add({
      isMobile: "(max-width: 1023px)",
      isDesktop: "(min-width: 1024px)"
    }, (context) => {
      let { isDesktop } = context.conditions;
      const triggerStart = isDesktop ? "top 85%" : "top 95%";

      // Content Fade-up
      gsap.fromTo(".pipeline-content",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: triggerStart,
            toggleActions: "play none none reverse",
          }
        }
      );

      // The Rail Scrub
      gsap.set(railFillRef.current, {
        transformOrigin: isDesktop ? "left center" : "top center",
        scaleX: isDesktop ? 0 : 1,
        scaleY: isDesktop ? 1 : 0,
      });

      const segments = pipelineData.length - 1;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: isDesktop ? "top 75%" : "top 85%",
          end: isDesktop ? "bottom 60%" : "bottom 70%",
          scrub: 1,
        },
      });

      tl.to(railFillRef.current,
        isDesktop
          ? { scaleX: 1, ease: "none", duration: segments }
          : { scaleY: 1, ease: "none", duration: segments },
        0
      );

      // Light up the dots as the line hits them
      for (let i = 1; i < pipelineData.length; i++) {
        tl.to(dotRefs.current[i],
          { scale: 1, opacity: 1, backgroundColor: "var(--accent)", ease: "power2.out", duration: 0.3 },
          i - 0.15
        );
      }
    });

    return () => mm.revert();
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full py-8 lg:py-10">
      {/* Background Track */}
      <div className="absolute w-[2px] top-[6px] bottom-[6px] left-[6px] lg:left-[12.5%] lg:right-[12.5%] lg:w-auto lg:top-[7px] lg:bottom-auto lg:h-[2px] rounded-full bg-[var(--text-light)]/15" />
      
      {/* Fill Track */}
      <div
        ref={railFillRef}
        className="absolute w-[2px] top-[6px] bottom-[6px] left-[6px] lg:left-[12.5%] lg:right-[12.5%] lg:w-auto lg:top-[7px] lg:bottom-auto lg:h-[2px] rounded-full bg-[var(--accent)] will-change-transform"
      />

      <div className="relative flex flex-col gap-10 lg:flex-row lg:gap-0">
        {pipelineData.map((node, i) => (
          <div key={node.stage} className="relative lg:flex lg:flex-col lg:flex-1 pl-8 lg:pl-0 lg:pr-8 xl:pr-12 2xl:pr-16">
            {/* The Dot */}
            <span
              ref={(el) => (dotRefs.current[i] = el)}
              className="absolute left-0 top-1 lg:static lg:mx-auto lg:mb-8 lg:block w-3.5 h-3.5 rounded-full border-2 border-[var(--accent)] will-change-transform shrink-0 z-10"
            />
            {/* The Content */}
            <div className="pipeline-content">
              <span className="font-sans font-semibold text-[10px] xl:text-[11px] 2xl:text-xs uppercase tracking-[0.2em] text-[var(--accent)] mb-2 block">
                {node.time}
              </span>
              <h3 className="head-txt text-2xl md:text-3xl lg:text-2xl xl:text-[2rem] 2xl:text-[2.5rem] leading-tight text-[var(--text-light)] mb-3">
                {node.stage}
              </h3>
              <p className="font-sans text-sm md:text-base 2xl:text-lg text-[var(--text-light)]/70 leading-relaxed max-w-sm">
                {node.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================
   CTA BUTTON (Fully Responsive & Magnetic)
========================================= */
function PlacementCTA({ text, href }) {
  const btnRef = useRef(null);
  const { contextSafe } = useGSAP({ scope: btnRef });

  const handleMouseEnter = contextSafe(() => {
    gsap.to(".placement-cta-text-main", { y: "-110%", duration: 0.6, ease: "expo.inOut" });
    gsap.to(".placement-cta-text-hover", { y: "0%", duration: 0.6, ease: "expo.inOut" });
  });

  const handleMouseLeave = contextSafe(() => {
    gsap.to(".placement-cta-text-main", { y: "0%", duration: 0.6, ease: "expo.inOut" });
    gsap.to(".placement-cta-text-hover", { y: "110%", duration: 0.6, ease: "expo.inOut" });
  });

  return (
    <a
      ref={btnRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      // w-full on mobile, auto width on sm screens and up
      className="w-full sm:w-auto bg-[var(--accent)] text-[var(--primary-base)] font-semibold text-[10px] md:text-[11px] xl:text-xs 2xl:text-sm uppercase tracking-[0.15em] cursor-pointer flex items-stretch h-12 md:h-14 2xl:h-16 shrink-0 no-underline rounded-sm overflow-hidden shadow-lg shadow-black/20"
    >
      {/* flex-1 ensures the text stays centered if the button is stretched on mobile */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 xl:px-10 relative overflow-hidden">
        {/* Slightly taller height (1.2em) prevents descenders from clipping during animation */}
        <div className="relative overflow-hidden h-[1.2em] leading-none flex items-center justify-center">
          {/* whitespace-nowrap prevents line breaks on tiny screens */}
          <span className="placement-cta-text-main block whitespace-nowrap">{text}</span>
          <span className="placement-cta-text-hover absolute block translate-y-[110%] whitespace-nowrap text-white">{text}</span>
        </div>
      </div>
      {/* shrink-0 ensures the icon area never gets squished */}
      <div className="shrink-0 border-l border-[var(--primary-base)]/20 px-4 md:px-5 2xl:px-6 flex items-center justify-center transition-colors duration-500 hover:bg-[var(--primary-base)] hover:text-white hover:border-transparent">
        {/* Dynamic SVG sizing based on breakpoints */}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="block w-4 h-4 md:w-5 md:h-5 2xl:w-6 2xl:h-6">
          <path d="M12 4v11m0 0l4-4m-4 4l-4-4M4 20h16" />
        </svg>
      </div>
    </a>
  );
}

/* =========================================
   MAIN SECTION COMPONENT
========================================= */
export default function Placements4() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const quoteRef = useRef(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add({
      isMobile: "(max-width: 767px)",
      isDesktop: "(min-width: 768px)"
    }, (context) => {
      let { isDesktop } = context.conditions;
      const triggerStart = isDesktop ? "top 90%" : "top 95%";

      // Header Entrance
      gsap.fromTo(
        headerRef.current.querySelectorAll('.placement-word'),
        { y: "120%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          duration: 0.8,
          stagger: 0.05,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: triggerStart,
            toggleActions: "play none none reverse",
          }
        }
      );

      // Spotlight Quote Entrance
      gsap.fromTo(quoteRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: quoteRef.current,
            start: triggerStart,
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
      className="w-full bg-[var(--primary-base)] text-[var(--text-light)] relative z-10 py-20 md:py-28 xl:py-36 2xl:py-48 overflow-hidden"
    >
      <div className="relative z-10 w-full px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24 mx-auto max-w-[1800px]">

        {/* ================= HEADER ================= */}
        <div ref={headerRef} className="max-w-4xl 2xl:max-w-5xl mb-16 md:mb-20 xl:mb-24">
          <span className="font-sans font-bold text-xs xl:text-sm 2xl:text-base uppercase tracking-[0.2em] text-[var(--accent)] mb-4 md:mb-5 block">
            Career Outcomes
          </span>
          <h2 className="head-txt text-5xl md:text-6xl lg:text-[4.5rem] xl:text-[5.5rem] 2xl:text-[6.5rem] leading-[1.05] tracking-tight text-[var(--text-light)] mb-6 md:mb-8">
            <div className="overflow-hidden pb-1">
              <span className="placement-word block will-change-transform">From Campus</span>
            </div>
            <div className="overflow-hidden pb-3">
              <span className="placement-word block will-change-transform italic font-light text-[var(--accent)]">to Career.</span>
            </div>
          </h2>
          <p className="placement-word font-sans text-base md:text-lg xl:text-xl 2xl:text-2xl text-[var(--text-light)]/70 max-w-2xl 2xl:max-w-3xl leading-relaxed">
            Success here is architected. We don't just rely on graduation; placement begins the moment our students step onto the training floor.
          </p>
        </div>

        {/* ================= STATS ================= */}
        <div className="w-full border-t border-[var(--text-light)]/15 mb-20 md:mb-28 xl:mb-32">
          {/* Changed from flex to explicit Grid for robust tablet/desktop rendering */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3">
            {statsData.map((stat, idx) => (
              <StatCounter 
                key={stat.label} 
                stat={stat} 
                index={idx} 
                isLast={idx === statsData.length - 1} 
              />
            ))}
          </div>
        </div>

        {/* ================= THE PIPELINE ================= */}
        <div className="w-full border-t border-[var(--text-light)]/15 pt-8 md:pt-12 mb-20 md:mb-28 xl:mb-32">
          <span className="font-sans font-bold text-[10px] xl:text-[11px] 2xl:text-xs uppercase tracking-[0.2em] text-[var(--text-light)]/40 mb-4 block">
            The Methodology
          </span>
          <Pipeline />
        </div>

        {/* ================= SPOTLIGHT & CTA ================= */}
        <div className="w-full border-t border-[var(--text-light)]/15 pt-10 md:pt-16 2xl:pt-20">
          <div
            ref={quoteRef}
            className="w-full flex flex-col lg:flex-row lg:items-end justify-between gap-10 lg:gap-16 2xl:gap-24"
          >
            {/* Left: The Quote */}
            <div className="flex flex-col items-start max-w-2xl 2xl:max-w-4xl border-l-2 border-[var(--accent)] pl-6 md:pl-8 2xl:pl-10 py-2">
              <p className="head-txt text-2xl md:text-3xl xl:text-[2.25rem] 2xl:text-[2.75rem] leading-snug italic text-[var(--text-light)]/90 mb-6 2xl:mb-8">
                "{spotlightData.quote}"
              </p>
              <div className="flex flex-col items-start">
                <p className="font-sans font-bold text-[10px] xl:text-[11px] 2xl:text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
                  {spotlightData.name} — {spotlightData.role}
                </p>
                <p className="font-sans font-medium text-[10px] xl:text-[11px] 2xl:text-xs uppercase tracking-[0.1em] text-[var(--text-light)]/50 mt-1 md:mt-1.5">
                  {spotlightData.property}, {spotlightData.batch}
                </p>
              </div>
            </div>

            {/* Right: The CTA */}
            <div className="w-full sm:w-auto mt-4 lg:mt-0 shrink-0">
              <PlacementCTA text="Download Placement Report" href="/placement-report.pdf" />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}