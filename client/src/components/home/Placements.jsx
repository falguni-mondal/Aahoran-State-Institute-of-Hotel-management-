import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* =========================================
   DATA
   NOTE: yearlyRate is placeholder data — swap in
   real AY-wise placement percentages when available.
========================================= */
const yearlyRate = [
  { year: "2021", value: 82 },
  { year: "2022", value: 87 },
  { year: "2023", value: 90 },
  { year: "2024", value: 93 },
  { year: "2025", value: 96 },
];

// Mirrors the 01–04 department ordering already established in Academics.jsx
const departmentOutcomes = [
  {
    id: "01",
    dept: "Food & Beverage",
    role: "Guest Relations Associate — Taj Hotels",
    package: "₹4.8L – 6.2L PA",
    note: "Placed within the first campus drive, most take up restaurant and banquet operations roles in flagship 5-star properties.",
  },
  {
    id: "02",
    dept: "Food Production",
    role: "Commis Chef — ITC Hotels",
    package: "₹4.2L – 5.5L PA",
    note: "Kitchen brigades across luxury chains recruit directly from our culinary batches every year.",
  },
  {
    id: "03",
    dept: "Front Office",
    role: "Guest Experience Executive — Marriott International",
    package: "₹4.5L – 6.0L PA",
    note: "Front office graduates are typically fast-tracked into guest relations and duty management within 2–3 years.",
  },
  {
    id: "04",
    dept: "Housekeeping",
    role: "Executive Housekeeper (Trainee) — Oberoi Group",
    package: "₹4.0L – 5.2L PA",
    note: "Consistently placed with the country's most decorated housekeeping departments.",
  },
];

/* =========================================
   HERO NUMBER (sticky, count-up on entry)
========================================= */
const HeroStat = () => {
  const numRef = useRef(null);
  const wrapRef = useRef(null);
  const latest = yearlyRate[yearlyRate.length - 1].value;

  useGSAP(() => {
    const proxy = { val: 0 };
    gsap.to(proxy, {
      val: latest,
      duration: 2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: wrapRef.current,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      onUpdate: () => {
        if (numRef.current) numRef.current.textContent = `${Math.round(proxy.val)}%`;
      },
    });
  }, { scope: wrapRef });

  return (
    <div ref={wrapRef} className="flex flex-col items-start">
      <span className="font-sans font-semibold text-xs 2xl:text-sm uppercase tracking-[0.2em] text-[var(--accent)] mb-6 block">
        Career Outcomes
      </span>
      <h2 className="head-txt text-6xl md:text-7xl lg:text-[6rem] xl:text-[7rem] 2xl:text-[8rem] leading-none tracking-tight text-[var(--text-light)] mb-4">
        <span ref={numRef}>0%</span>
      </h2>
      <p className="font-sans text-base md:text-lg text-[var(--text-light)]/70 max-w-xs leading-relaxed">
        of the graduating batch placed before convocation, Academic Year 2025–26.
      </p>
    </div>
  );
};

/* =========================================
   GROWTH LINE CHART (scroll-scrubbed draw-on)
========================================= */
const GrowthChart = () => {
  const chartRef = useRef(null);
  const pathRef = useRef(null);
  const dotsRef = useRef([]);

  // Layout math for a simple 5-point line, 0-100 scale mapped to a 600x220 viewbox
  const W = 600;
  const H = 220;
  const PAD = 24;
  const min = 75;
  const max = 100;

  const points = yearlyRate.map((d, i) => {
    const x = PAD + (i / (yearlyRate.length - 1)) * (W - PAD * 2);
    const y = H - PAD - ((d.value - min) / (max - min)) * (H - PAD * 2);
    return { ...d, x, y };
  });

  const pathD = points
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(" ");

  useGSAP(() => {
    const path = pathRef.current;
    const length = path.getTotalLength();

    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    gsap.set(dotsRef.current, { scale: 0, transformOrigin: "center" });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: chartRef.current,
        start: "top 80%",
        end: "bottom 60%",
        scrub: 1,
      },
    });

    tl.to(path, { strokeDashoffset: 0, ease: "none" }, 0);
    tl.to(dotsRef.current, { scale: 1, stagger: 0.2, ease: "power2.out" }, 0);
  }, { scope: chartRef });

  return (
    <div ref={chartRef} className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto overflow-visible">
        {/* baseline */}
        <line
          x1={PAD}
          y1={H - PAD}
          x2={W - PAD}
          y2={H - PAD}
          stroke="var(--text-light)"
          strokeOpacity="0.15"
          strokeWidth="1"
        />
        <path
          ref={pathRef}
          d={pathD}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((p, i) => (
          <circle
            key={p.year}
            ref={(el) => (dotsRef.current[i] = el)}
            cx={p.x}
            cy={p.y}
            r="5"
            fill="var(--primary-base)"
            stroke="var(--accent)"
            strokeWidth="2"
          />
        ))}
      </svg>
      {/* year labels */}
      <div className="w-full flex justify-between mt-3 px-[24px]">
        {yearlyRate.map((d) => (
          <span
            key={d.year}
            className="font-sans text-[10px] md:text-xs uppercase tracking-[0.15em] text-[var(--text-light)]/40"
          >
            {d.year}
          </span>
        ))}
      </div>
    </div>
  );
};

/* =========================================
   DEPARTMENT OUTCOME ROW
========================================= */
const OutcomeRow = ({ item }) => {
  const rowRef = useRef(null);

  useGSAP(() => {
    gsap.to(
      rowRef.current.querySelectorAll(".outcome-word"),
      {
        y: "0%",
        duration: 0.6,
        stagger: 0.01,
        ease: "power3.out",
        scrollTrigger: {
          trigger: rowRef.current,
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, { scope: rowRef });

  return (
    <div
      ref={rowRef}
      className="flex flex-col md:flex-row md:items-start gap-2 md:gap-8 xl:gap-12 py-8 border-b border-[var(--text-light)]/10"
    >
      <div className="flex items-baseline gap-4 md:w-1/3 shrink-0">
        <span className="font-sans font-medium text-xs xl:text-sm text-[var(--accent)]">
          {item.id}
        </span>
        <h3 className="head-txt text-2xl md:text-3xl xl:text-4xl leading-tight text-[var(--text-light)]">
          {item.dept}
        </h3>
      </div>

      <div className="flex flex-col items-start md:w-2/3">
        <span className="font-sans font-semibold text-sm md:text-base text-[var(--text-light)] mb-1">
          {item.role}
        </span>
        <span className="font-sans text-xs md:text-sm uppercase tracking-[0.15em] text-[var(--accent)] mb-4 block">
          {item.package}
        </span>
        <p className="font-sans text-sm md:text-base text-[var(--text-light)]/60 leading-relaxed max-w-xl">
          {item.note.split(" ").map((word, wIdx) => (
            <span key={wIdx} className="inline-flex overflow-hidden mr-[0.25em] align-top py-0.5">
              <span className="outcome-word translate-y-[100%] block will-change-transform">
                {word}
              </span>
            </span>
          ))}
        </p>
      </div>
    </div>
  );
};

/* =========================================
   MAIN SECTION COMPONENT
========================================= */
export default function Placements() {
  const sectionRef = useRef(null);
  const quoteRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      quoteRef.current,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: {
          trigger: quoteRef.current,
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[var(--primary-base)] text-[var(--text-light)] relative z-10 py-24 md:py-32 xl:py-40 2xl:py-48"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[var(--accent)]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl xl:max-w-screen-xl 2xl:max-w-[100rem] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 xl:gap-28 2xl:gap-32 px-5 md:px-12 lg:px-16 xl:px-24 2xl:px-32">

        {/* LEFT: sticky hero number */}
        <div className="col-span-1 lg:col-span-5 relative min-w-0">
          <div className="lg:sticky lg:top-[30vh]">
            <HeroStat />
          </div>
        </div>

        {/* RIGHT: chart, department outcomes, quote */}
        <div className="col-span-1 lg:col-span-7 flex flex-col items-start min-w-0">

          <div className="w-full mb-16 xl:mb-20">
            <span className="font-sans font-semibold text-[10px] xl:text-[11px] uppercase tracking-[0.2em] text-[var(--text-light)]/40 mb-6 block">
              Placement Rate, Year on Year
            </span>
            <GrowthChart />
          </div>

          <div className="w-full border-t border-[var(--text-light)]/10 mb-12 xl:mb-16">
            {departmentOutcomes.map((item) => (
              <OutcomeRow key={item.id} item={item} />
            ))}
          </div>

          <div
            ref={quoteRef}
            className="w-full max-w-2xl border-l-2 border-[var(--accent)] pl-6 md:pl-8 py-2"
          >
            <p className="head-txt text-2xl md:text-3xl xl:text-[2.25rem] leading-snug italic text-[var(--text-light)]/90 mb-6">
              "SIHM Durgapur gave me the discipline and the exposure to walk straight into a 5-star kitchen — and lead one within three years."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-8 h-[1px] bg-[var(--accent)]"></div>
              <p className="font-sans font-semibold text-[10px] xl:text-[11px] uppercase tracking-[0.2em] text-[var(--text-light)]/60">
                Alumnus, Batch of 2021 — Sous Chef, Taj Hotels
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}