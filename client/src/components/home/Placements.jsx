import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* =========================================
   DATA
========================================= */
const statsData = [
  { value: 96, suffix: "%", label: "Placement Rate", note: "Batch of 2025" },
  { value: 9.5, suffix: "L", prefix: "₹", decimals: 1, label: "Highest Package", note: "Per annum, CTC" },
  { value: 4.2, suffix: "L", prefix: "₹", decimals: 1, label: "Average Package", note: "Per annum, CTC" },
  { value: 180, suffix: "+", label: "Hiring Partners", note: "Across India & Abroad" },
];

// Recruiter names only — no logo assets required, styled as a departure-board style ticker
const recruitersRow1 = [
  "Taj Hotels", "The Oberoi Group", "ITC Hotels", "Marriott International",
  "Hyatt Hotels", "Radisson Group", "Leela Palaces", "Lemon Tree Hotels",
];
const recruitersRow2 = [
  "Novotel", "Hilton Worldwide", "Accor Group", "IHCL SeleQtions",
  "Park Hyatt", "JW Marriott", "Sheraton Grand", "The Claridges",
];

/* =========================================
   STAT COUNTER SUB-COMPONENT
========================================= */
const StatCounter = ({ stat, index }) => {
  const numRef = useRef(null);
  const wrapRef = useRef(null);

  useGSAP(() => {
    const proxy = { val: 0 };
    const decimals = stat.decimals || 0;

    gsap.to(proxy, {
      val: stat.value,
      duration: 2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: wrapRef.current,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      onUpdate: () => {
        if (numRef.current) {
          numRef.current.textContent = `${stat.prefix || ""}${proxy.val.toFixed(decimals)}${stat.suffix || ""}`;
        }
      },
    });
  }, { scope: wrapRef });

  return (
    <div
      ref={wrapRef}
      className="placement-stat flex-1 flex flex-col items-start px-8 py-10 md:py-0 md:px-10 xl:px-12 border-b md:border-b-0 md:border-l first:border-l-0 border-[var(--text-light)]/15"
    >
      <span className="font-sans font-semibold text-[10px] xl:text-[11px] uppercase tracking-[0.2em] text-[var(--accent)] mb-4 block">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="head-txt text-5xl md:text-6xl xl:text-7xl 2xl:text-[5rem] leading-none tracking-tight text-[var(--text-light)] mb-3">
        <span ref={numRef}>{stat.prefix || ""}0{stat.suffix || ""}</span>
      </div>
      <span className="font-sans text-sm md:text-base text-[var(--text-light)]/70 mb-1">
        {stat.label}
      </span>
      <span className="font-sans text-[11px] uppercase tracking-[0.15em] text-[var(--text-light)]/40">
        {stat.note}
      </span>
    </div>
  );
};

/* =========================================
   RECRUITER TICKER ROW
========================================= */
const TickerRow = ({ items, reverse, speed = 40 }) => {
  const trackRef = useRef(null);

  useGSAP(() => {
    const track = trackRef.current;
    const totalWidth = track.scrollWidth / 2;

    const tween = gsap.to(track, {
      x: reverse ? totalWidth : -totalWidth,
      duration: speed,
      ease: "none",
      repeat: -1,
    });

    if (reverse) {
      gsap.set(track, { x: -totalWidth });
      tween.vars.x = 0;
      tween.invalidate().restart();
    }

    const handleEnter = () => gsap.to(tween, { timeScale: 0, duration: 0.4 });
    const handleLeave = () => gsap.to(tween, { timeScale: 1, duration: 0.4 });

    track.parentElement.addEventListener("mouseenter", handleEnter);
    track.parentElement.addEventListener("mouseleave", handleLeave);

    return () => {
      track.parentElement.removeEventListener("mouseenter", handleEnter);
      track.parentElement.removeEventListener("mouseleave", handleLeave);
    };
  }, { scope: trackRef, dependencies: [items, reverse, speed] });

  return (
    <div className="w-full overflow-hidden py-3 md:py-4">
      <div ref={trackRef} className="flex items-center w-max whitespace-nowrap will-change-transform">
        {[...items, ...items].map((name, idx) => (
          <div key={idx} className="flex items-center">
            <span className="head-txt italic font-light text-2xl md:text-3xl xl:text-4xl text-[var(--primary-base)]/80 px-6 md:px-10">
              {name}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]/60"></span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================
   MAIN SECTION COMPONENT
========================================= */
export default function Placements() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const quoteRef = useRef(null);

  useGSAP(() => {
    // Header curtain reveal — consistent with Facilities / Partners headers
    gsap.fromTo(
      headerRef.current.querySelectorAll(".placement-word"),
      { y: "120%", rotateZ: 2 },
      {
        y: "0%",
        rotateZ: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Stat block fade-up
    gsap.fromTo(
      ".placement-stat",
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.12,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".placement-stat",
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Quote fade-up
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
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[var(--primary-base)] text-[var(--text-light)] relative z-10 py-24 md:py-32 xl:py-40 2xl:py-48 overflow-hidden"
    >
      {/* ambient decoration, matches PrincipalMessage's restrained backdrop */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[var(--accent)]/5 rounded-full blur-3xl"></div>
      </div>

      {/* Section Header */}
      <div className="relative z-10 w-full px-5 md:px-12 lg:px-16 xl:px-24 2xl:px-32 mb-16 md:mb-20 xl:mb-24">
        <div ref={headerRef} className="flex flex-col items-start max-w-4xl">
          <span className="font-sans font-bold text-xs xl:text-sm uppercase tracking-[0.2em] text-[var(--accent)] mb-5 block">
            Career Outcomes
          </span>
          <h2 className="head-txt text-5xl md:text-6xl lg:text-[4.5rem] xl:text-[5.5rem] 2xl:text-[6.5rem] leading-[1.05] tracking-tight">
            <div className="overflow-hidden pb-2">
              <span className="placement-word block origin-bottom-left">Where Our</span>
            </div>
            <div className="overflow-hidden pb-2">
              <span className="placement-word block origin-bottom-left italic font-light text-[var(--accent)]">
                Graduates Go.
              </span>
            </div>
          </h2>
        </div>
      </div>

      {/* Stats Ledger */}
      <div className="relative z-10 w-full px-5 md:px-12 lg:px-16 xl:px-24 2xl:px-32 mb-16 md:mb-24 xl:mb-28">
        <div className="w-full flex flex-col md:flex-row border-t border-[var(--text-light)]/15">
          {statsData.map((stat, idx) => (
            <StatCounter key={stat.label} stat={stat} index={idx} />
          ))}
        </div>
      </div>

      {/* Recruiter Departure-Board Ticker */}
      <div className="relative z-10 w-full mb-16 md:mb-24 xl:mb-28">
        <div className="w-full px-5 md:px-12 lg:px-16 xl:px-24 2xl:px-32 mb-6">
          <span className="font-sans font-semibold text-[10px] xl:text-[11px] uppercase tracking-[0.2em] text-[var(--text-light)]/40 block">
            Our Graduates Are Serving At
          </span>
        </div>
        <div className="w-full bg-[var(--text-light)] rounded-sm">
          <TickerRow items={recruitersRow1} speed={38} />
          <div className="w-full h-px bg-[var(--primary-base)]/10"></div>
          <TickerRow items={recruitersRow2} reverse speed={44} />
        </div>
      </div>

      {/* Student Success Quote */}
      <div className="relative z-10 w-full px-5 md:px-12 lg:px-16 xl:px-24 2xl:px-32">
        <div
          ref={quoteRef}
          className="max-w-4xl border-l-2 border-[var(--accent)] pl-6 md:pl-8 py-2"
        >
          <p className="head-txt text-2xl md:text-3xl lg:text-4xl xl:text-[2.5rem] leading-snug italic text-[var(--text-light)]/90 mb-6">
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
    </section>
  );
}