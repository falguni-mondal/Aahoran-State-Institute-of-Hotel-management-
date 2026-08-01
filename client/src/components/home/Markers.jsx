import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/* =========================================
   DATA FOR THE TICKERS
========================================= */
const sectorsRow1 = [
  "Luxury Resorts", "Michelin Star Kitchens", "Global Aviation", 
  "Corporate Hospitality", "Premium Cruise Lines", "Diplomatic Services"
];

const sectorsRow2 = [
  "Event & Banquet Operations", "Revenue Strategy", "Facility Management", 
  "Guest Experience", "Boutique Hotels", "Culinary Arts"
];

/* =========================================
   INTERNAL INFINITE TICKER LOGIC
========================================= */
const Ticker = ({ items, reverse = false, speed = 40 }) => {
  const trackRef = useRef(null);

  useGSAP(() => {
    const track = trackRef.current;
    
    // Using scrollWidth / 2 because the array is duplicated in the DOM to create a seamless loop.
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

    // Optional: Pause on hover for readability
    const handleEnter = () => gsap.to(tween, { timeScale: 0, duration: 0.4 });
    const handleLeave = () => gsap.to(tween, { timeScale: 1, duration: 0.4 });

    const parent = track.parentElement;
    parent.addEventListener("mouseenter", handleEnter);
    parent.addEventListener("mouseleave", handleLeave);

    return () => {
      parent.removeEventListener("mouseenter", handleEnter);
      parent.removeEventListener("mouseleave", handleLeave);
    };
  }, { scope: trackRef, dependencies: [items, reverse, speed] });

  return (
    <div className="w-full overflow-hidden py-3 md:py-4">
      <div ref={trackRef} className="flex items-center w-max whitespace-nowrap will-change-transform">
        {[...items, ...items].map((name, idx) => (
          <div key={idx} className="flex items-center">
            <span className="head-txt italic font-light text-2xl md:text-3xl xl:text-4xl text-[var(--text-light)]/80 px-6 md:px-10 tracking-wide">
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
   MAIN EXPORTED COMPONENT (Ready for Home.jsx)
========================================= */
export default function Markers() {
  return (
    <section className="w-full bg-[var(--primary-base)] py-10 md:py-16 border-y border-[var(--text-light)]/10">
      <div className="w-full bg-[var(--text-light)]/5 py-4">
        <Ticker items={sectorsRow1} speed={35} />
        <div className="w-full h-px bg-[var(--text-light)]/5 my-2"></div>
        <Ticker items={sectorsRow2} reverse={true} speed={42} />
      </div>
    </section>
  );
}