import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* =========================================
   DATA — THE PIPELINE
   The four real stages a student moves through.
   The timeframe itself is the marker, not 01/02/03.
========================================= */
const pipelineData = [
  {
    time: "Semester II",
    stage: "Foundation Training",
    desc: "Grounding in food and beverage, kitchen, front office and housekeeping fundamentals across all four verticals.",
  },
  {
    time: "Semester V – VI",
    stage: "Industrial Training",
    desc: "A sixteen-week attachment at a live four- or five-star property — where most pre-placement offers actually begin.",
  },
  {
    time: "Final Semester",
    stage: "Campus Placements",
    desc: "Often the very same property returns to hire the trainee it already knows, formally, through campus interviews.",
  },
  {
    time: "Year 1 Onward",
    stage: "Career Growth",
    desc: "Structured internal tracks move graduates from trainee to shift and duty management within three to four years.",
  },
];

/* =========================================
   DATA — THIS YEAR'S POSTINGS
   Placeholder roster. Replace with the current
   graduating batch's real postings each season.
========================================= */
const postingsData = [
  { name: "Ankita Roy", role: "Guest Relations Associate", property: "Taj Bengal", city: "Kolkata" },
  { name: "Souvik Das", role: "Commis Chef I", property: "ITC Sonar", city: "Kolkata" },
  { name: "Priyanka Sengupta", role: "Front Office Trainee", property: "JW Marriott", city: "Pune" },
  { name: "Rahul Mahato", role: "F&B Associate", property: "The Oberoi Grand", city: "Kolkata" },
  { name: "Debolina Chatterjee", role: "Housekeeping Executive (Trainee)", property: "Hyatt Regency", city: "Delhi" },
  { name: "Arka Banerjee", role: "Kitchen Trainee", property: "Leela Palace", city: "Bengaluru" },
];

/* =========================================
   DATA — GROWTH SPOTLIGHT
   Placeholder alumnus. Swap for a real, named graduate.
========================================= */
const spotlightData = {
  name: "Sagnik Bose",
  property: "Taj Bengal, Kolkata",
  from: { title: "Trainee", year: "2021" },
  to: { title: "Duty Manager", year: "2024" },
  quote: "My industrial training posting became my first job. I never had to apply anywhere else.",
};

/* =========================================
   ZONE 1: THE PIPELINE
   A rail draws itself as you scroll, lighting up
   each stage in order — the mechanism, not a stat.
========================================= */
const Pipeline = () => {
  const containerRef = useRef(null);
  const railFillRef = useRef(null);
  const dotRefs = useRef([]);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    // First stage is always "already reached" — the rest wait to be filled in
    gsap.set(dotRefs.current[0], { scale: 1, opacity: 1 });
    gsap.set(dotRefs.current.slice(1), { scale: 0.6, opacity: 0.3 });

    // Content reveal, same on every breakpoint
    gsap.fromTo(
      ".pipeline-fade",
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );

    gsap.to(".pipeline-word", {
      y: "0%",
      duration: 0.6,
      stagger: 0.01,
      ease: "power3.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 78%",
        toggleActions: "play none none reverse",
      },
    });

    // The rail itself — orientation-aware, scroll-scrubbed
    mm.add(
      { isDesktop: "(min-width: 1024px)", isMobile: "(max-width: 1023px)" },
      (context) => {
        const { isDesktop } = context.conditions;

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

        tl.to(
          railFillRef.current,
          isDesktop
            ? { scaleX: 1, ease: "none", duration: segments }
            : { scaleY: 1, ease: "none", duration: segments },
          0
        );

        for (let i = 1; i < pipelineData.length; i++) {
          tl.to(
            dotRefs.current[i],
            { scale: 1, opacity: 1, ease: "power2.out", duration: 0.3 },
            i - 0.15
          );
        }
      }
    );

    return () => mm.revert();
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full">
      {/* track */}
      <div className="absolute w-[2px] top-[6px] bottom-[6px] left-[6px] lg:left-[12.5%] lg:right-[12.5%] lg:w-auto lg:top-[7px] lg:bottom-auto lg:h-[2px] rounded-full bg-[var(--text-light)]/15" />
      {/* fill */}
      <div
        ref={railFillRef}
        className="absolute w-[2px] top-[6px] bottom-[6px] left-[6px] lg:left-[12.5%] lg:right-[12.5%] lg:w-auto lg:top-[7px] lg:bottom-auto lg:h-[2px] rounded-full bg-[var(--accent)] will-change-transform"
      />

      <div className="relative flex flex-col gap-10 lg:flex-row lg:gap-0">
        {pipelineData.map((node, i) => (
          <div
            key={node.stage}
            className="relative lg:flex lg:flex-col lg:flex-1 pl-8 lg:pl-0 lg:pr-8 xl:pr-10"
          >
            <span
              ref={(el) => (dotRefs.current[i] = el)}
              className="absolute left-0 top-1 lg:static lg:mx-auto lg:mb-6 lg:block w-3.5 h-3.5 rounded-full bg-[var(--primary-base)] border-2 border-[var(--accent)] will-change-transform shrink-0"
            />
            <div className="pipeline-fade">
              <span className="font-sans font-semibold text-[10px] xl:text-[11px] uppercase tracking-[0.2em] text-[var(--accent)] mb-2 block">
                {node.time}
              </span>
              <h3 className="head-txt text-2xl md:text-3xl xl:text-[2rem] leading-tight text-[var(--text-light)] mb-3">
                {node.stage}
              </h3>
              <p className="font-sans text-sm md:text-[15px] text-[var(--text-light)]/60 leading-relaxed max-w-xs">
                {node.desc.split(" ").map((word, wIdx) => (
                  <span key={wIdx} className="inline-flex overflow-hidden mr-[0.2em] align-top py-0.5">
                    <span className="pipeline-word translate-y-[100%] block will-change-transform">
                      {word}
                    </span>
                  </span>
                ))}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================
   ZONE 2: THIS YEAR'S POSTINGS
   A roster, not a logo wall — Partners.jsx already
   owns "who hires us"; this is "who they are."
========================================= */
const PostingsRoster = () => {
  const listRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      listRef.current.querySelectorAll(".roster-row"),
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.06,
        ease: "power3.out",
        scrollTrigger: {
          trigger: listRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, { scope: listRef });

  return (
    <div ref={listRef} className="w-full">
      <div className="hidden md:grid grid-cols-12 gap-4 pb-4 mb-2 border-b border-[var(--text-light)]/15">
        <span className="col-span-3 font-sans font-semibold text-[10px] uppercase tracking-[0.2em] text-[var(--text-light)]/40">Graduate</span>
        <span className="col-span-4 font-sans font-semibold text-[10px] uppercase tracking-[0.2em] text-[var(--text-light)]/40">Designation</span>
        <span className="col-span-3 font-sans font-semibold text-[10px] uppercase tracking-[0.2em] text-[var(--text-light)]/40">Property</span>
        <span className="col-span-2 font-sans font-semibold text-[10px] uppercase tracking-[0.2em] text-[var(--text-light)]/40">City</span>
      </div>
      {postingsData.map((p) => (
        <div
          key={p.name}
          className="roster-row grid grid-cols-1 md:grid-cols-12 gap-1 md:gap-4 py-4 border-b border-[var(--text-light)]/10"
        >
          <span className="md:col-span-3 font-sans font-semibold text-base text-[var(--text-light)]">{p.name}</span>
          <span className="md:col-span-4 font-sans text-sm text-[var(--text-light)]/70">{p.role}</span>
          <span className="md:col-span-3 font-sans text-sm text-[var(--text-light)]/70">{p.property}</span>
          <span className="md:col-span-2 font-sans text-sm text-[var(--text-light)]/50 uppercase tracking-wide">{p.city}</span>
        </div>
      ))}
    </div>
  );
};

/* =========================================
   ZONE 3: GROWTH SPOTLIGHT + REPORT CTA
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
      className="bg-[var(--accent)] text-[var(--primary-base)] font-semibold text-xs uppercase tracking-[0.15em] shadow-lg cursor-pointer flex items-stretch h-13 shrink-0 no-underline"
    >
      <div className="flex items-center justify-center px-8 md:px-10 relative overflow-hidden">
        <div className="relative overflow-hidden h-[1em] leading-none flex items-center justify-center">
          <span className="placement-cta-text-main block">{text}</span>
          <span className="placement-cta-text-hover absolute block translate-y-[110%]">{text}</span>
        </div>
      </div>
      <div className="border-l border-[var(--primary-base)]/20 px-4 flex items-center justify-center">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="block">
          <path d="M12 4v11m0 0l4-4m-4 4l-4-4M4 20h16" />
        </svg>
      </div>
    </a>
  );
}

const GrowthSpotlight = () => {
  const wrapRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      wrapRef.current,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, { scope: wrapRef });

  return (
    <div
      ref={wrapRef}
      className="w-full flex flex-col lg:flex-row lg:items-end justify-between gap-10 lg:gap-16"
    >
      <div className="flex flex-col items-start max-w-xl">
        <div className="flex items-center gap-3 mb-6">
          <span className="font-sans font-semibold text-sm text-[var(--text-light)]/40">
            {spotlightData.from.title}, {spotlightData.from.year}
          </span>
          <svg className="w-4 h-4 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
          <span className="font-sans font-semibold text-sm text-[var(--accent)]">
            {spotlightData.to.title}, {spotlightData.to.year}
          </span>
        </div>
        <p className="head-txt text-2xl md:text-3xl xl:text-[2.25rem] leading-snug italic text-[var(--text-light)]/90 mb-6">
          "{spotlightData.quote}"
        </p>
        <div className="flex items-center gap-4">
          <div className="w-8 h-[1px] bg-[var(--accent)]"></div>
          <p className="font-sans font-semibold text-[10px] xl:text-[11px] uppercase tracking-[0.2em] text-[var(--text-light)]/60">
            {spotlightData.name} — {spotlightData.property}
          </p>
        </div>
      </div>

      <PlacementCTA text="View Full Placement Report" href="/placement-report.pdf" />
    </div>
  );
};

/* =========================================
   MAIN SECTION COMPONENT
========================================= */
export default function Placements3() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);

  const currentYear = new Date().getFullYear();
  const nextYearShort = (currentYear + 1).toString().slice(-2);

  useGSAP(() => {
    const tl = gsap.timeline({
      defaults: { ease: "expo.out" },
      scrollTrigger: {
        trigger: headerRef.current,
        start: "top 82%",
        toggleActions: "play none none reverse",
      },
    });

    tl.fromTo(
      ".placement-title-line",
      { y: "120%", rotateZ: 2 },
      { y: "0%", rotateZ: 0, duration: 1.2, stagger: 0.1 }
    );

    tl.fromTo(
      ".placement-lede",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
      "<0.3"
    );
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[var(--primary-base)] text-[var(--text-light)] relative z-10 py-24 md:py-32 xl:py-40 2xl:py-48 overflow-hidden mt-56"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[var(--accent)]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24 mx-auto max-w-[1800px]">

        {/* Section Header */}
        <div ref={headerRef} className="max-w-3xl mb-20 md:mb-28 xl:mb-32">
          <span className="font-sans font-bold text-xs xl:text-sm uppercase tracking-[0.2em] text-[var(--accent)] mb-5 block">
            The Placement Cell
          </span>
          <h2 className="head-txt text-5xl md:text-6xl lg:text-[4.5rem] xl:text-[5.5rem] 2xl:text-[6.5rem] leading-[1.05] tracking-tight mb-6">
            <div className="overflow-hidden pb-2">
              <span className="placement-title-line block origin-bottom-left">From Campus</span>
            </div>
            <div className="overflow-hidden pb-2">
              <span className="placement-title-line block origin-bottom-left italic font-light text-[var(--accent)]">to Career.</span>
            </div>
          </h2>
          <p className="placement-lede font-sans text-lg md:text-xl text-[var(--text-light)]/70 max-w-2xl leading-relaxed">
            Placement here doesn't start at graduation — it starts on the training floor.
          </p>
        </div>

        {/* Zone 1: The Pipeline */}
        <div className="mb-24 md:mb-28 xl:mb-32 pt-10 border-t border-[var(--text-light)]/10">
          <span className="font-sans font-semibold text-[10px] xl:text-[11px] uppercase tracking-[0.2em] text-[var(--text-light)]/40 mb-10 md:mb-14 block">
            How Placement Actually Happens
          </span>
          <Pipeline />
        </div>

        {/* Zone 2: This Year's Postings */}
        <div className="mb-24 md:mb-28 xl:mb-32 pt-10 border-t border-[var(--text-light)]/10">
          <span className="font-sans font-semibold text-[10px] xl:text-[11px] uppercase tracking-[0.2em] text-[var(--text-light)]/40 mb-10 block">
            {`Postings — AY ${currentYear}–${nextYearShort}`}
          </span>
          <PostingsRoster />
        </div>

        {/* Zone 3: Growth Spotlight + Report CTA */}
        <div className="pt-10 border-t border-[var(--text-light)]/10">
          <span className="font-sans font-semibold text-[10px] xl:text-[11px] uppercase tracking-[0.2em] text-[var(--text-light)]/40 mb-10 block">
            Where They Are Now
          </span>
          <GrowthSpotlight />
        </div>

      </div>
    </section>
  );
}