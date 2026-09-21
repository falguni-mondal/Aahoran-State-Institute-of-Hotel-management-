import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* =========================================
   MAP DATA & POINTERS
========================================= */
const worldGeoUrl =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const indiaGeoUrl =
  "https://raw.githubusercontent.com/datameet/maps/master/Country/india-composite.geojson";

// Deep Inland Global Pointers (Avoiding coastlines)
// These raw coordinates remain unchanged and unaffected by the projection change.
const globalPointers = [
  // North America
  { name: "Denver", coordinates: [-104.99, 39.73] },
  { name: "Dallas", coordinates: [-96.79, 32.77] },
  { name: "Calgary", coordinates: [-114.07, 51.04] },
  { name: "Winnipeg", coordinates: [-97.13, 49.89] },
  { name: "Mexico City", coordinates: [-99.13, 19.43] },
  { name: "Phoenix", coordinates: [-112.07, 33.44] },
  // South America
  { name: "Brasília", coordinates: [-47.88, -15.79] },
  { name: "Manaus", coordinates: [-60.02, -3.11] },
  { name: "Córdoba", coordinates: [-64.18, -31.42] },
  { name: "Bogotá", coordinates: [-74.07, 4.71] },
  { name: "Santa Cruz", coordinates: [-63.18, -17.78] },
  // Europe
  { name: "Moscow", coordinates: [37.61, 55.75] },
  { name: "Munich", coordinates: [11.58, 48.13] },
  { name: "Warsaw", coordinates: [21.01, 52.22] },
  { name: "Madrid", coordinates: [-3.7, 40.41] },
  { name: "Kyiv", coordinates: [30.52, 50.45] },
  { name: "Yekaterinburg", coordinates: [60.58, 56.83] },
  // Africa
  { name: "Johannesburg", coordinates: [28.04, -26.2] },
  { name: "Addis Ababa", coordinates: [38.75, 9.02] },
  { name: "Kano", coordinates: [8.59, 12.0] },
  { name: "Kinshasa", coordinates: [15.29, -4.32] },
  { name: "Khartoum", coordinates: [32.55, 15.5] },
  { name: "Bamako", coordinates: [-8.0, 12.63] },
  // Asia & Oceania
  { name: "Riyadh", coordinates: [46.71, 24.71] },
  { name: "Tehran", coordinates: [51.38, 35.68] },
  { name: "Tashkent", coordinates: [69.24, 41.29] },
  { name: "Novosibirsk", coordinates: [82.92, 55.0] },
  { name: "Chengdu", coordinates: [104.06, 30.57] },
  { name: "Ulaanbaatar", coordinates: [106.91, 47.91] },
  { name: "Krasnoyarsk", coordinates: [92.85, 56.01] },
  { name: "Alice Springs", coordinates: [133.88, -23.69] },
  { name: "Kalgoorlie", coordinates: [121.46, -30.74] },
  // Asian / Southeast Asian / Island Pointers
  { name: "Japan", coordinates: [138.18, 36.65] },
  { name: "Indonesia", coordinates: [107.61, -6.91] },
  { name: "Singapore", coordinates: [103.81, 1.35] },
  { name: "Malaysia", coordinates: [101.68, 3.13] },
  { name: "Thailand", coordinates: [98.98, 18.79] },
  { name: "Cambodia", coordinates: [103.86, 13.36] },
  { name: "Philippines", coordinates: [120.59, 16.4] },
  { name: "Sri Lanka", coordinates: [80.63, 7.29] },
  { name: "Maldives", coordinates: [73.5, 4.17] },
  // India
  { name: "Delhi", coordinates: [77.2, 28.61] },
  { name: "Mumbai", coordinates: [72.87, 19.07] },
];

/* =========================================
   PARTNERS DATA
========================================= */
const baseImages = [
  "/campus-facility.webp",
  "/events-facility.webp",
  "/infrastructure-facility.webp",
  "/sports-facility.webp",
  "/seminar-facility.webp",
];

// Generates 24 items to fit perfectly into 3 or 4 columns
const partnersData = Array.from({ length: 24 }).map((_, i) => ({
  id: i + 1,
  img: baseImages[i % baseImages.length],
}));

export default function Partners() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const gridContainerRef = useRef(null);

  // Refs for grid animations
  const maskRefs = useRef([]);
  const imageRefs = useRef([]);

  useGSAP(
    () => {
      let mm = gsap.matchMedia();

      mm.add(
        {
          isMobile: "(max-width: 767px)",
          isDesktop: "(min-width: 768px)",
        },
        (context) => {
          let { isDesktop } = context.conditions;

          // 1. Header Entrance Animation
          gsap.fromTo(
            headerRef.current.querySelectorAll(".partner-word"),
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
              },
            },
          );

          // 2. The Classic, Premium Grid Reveal Timeline
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: gridContainerRef.current,
              start: isDesktop ? "top 85%" : "top 95%",
              toggleActions: "play none none reverse",
            },
          });

          // Slowly fade in the architectural grid lines
          tl.to(gridContainerRef.current, {
            opacity: 1,
            duration: 1.5,
            ease: "power2.inOut",
          });

          // Cinematic Curtain Reveal for Logos
          tl.fromTo(
            maskRefs.current,
            { clipPath: "inset(100% 0% 0% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.6,
              ease: "expo.inOut",
              stagger: { amount: 1, from: "start" },
            },
            "-=1.5",
          );

          // Subliminal Image Scale
          tl.fromTo(
            imageRefs.current,
            { scale: 1.3 },
            {
              scale: 1,
              duration: 1.6,
              ease: "expo.inOut",
              stagger: { amount: 1, from: "start" },
            },
            "-=2.6",
          );
        },
      );

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="w-full relative bg-[var(--background)] py-24 md:py-32 xl:py-40 overflow-hidden"
    >
      {/* SECTION HEADER */}
      <div className="w-full flex flex-col items-center justify-center mb-16 md:mb-24 px-5">
        <div
          ref={headerRef}
          className="flex flex-col items-center text-center text-[var(--text-main)]"
        >
          <span className="font-sans font-bold text-xs xl:text-sm 2xl:text-base uppercase tracking-[0.2em] mb-2 md:mb-3 block opacity-70">
            Our Network
          </span>
          <h2 className="head-txt text-5xl md:text-6xl lg:text-[4.5rem] xl:text-[5.5rem] 2xl:text-[6.5rem] leading-[1.05] tracking-tight">
            <span className="inline-flex overflow-hidden align-top pb-2">
              <span className="partner-word block origin-bottom-left will-change-transform">
                Our
              </span>
            </span>{" "}
            <span className="inline-flex overflow-hidden align-top pb-2">
              <span className="partner-word block origin-bottom-left will-change-transform">
                Placement
              </span>
            </span>{" "}
            <span className="inline-flex overflow-hidden align-top pb-2">
              <span className="partner-word block origin-bottom-left will-change-transform italic font-light text-[var(--accent)]">
                Partners
              </span>
            </span>
          </h2>
        </div>
      </div>

      {/* 
        ==========================================
        SPLIT SCREEN: MAP (60%) & GRID (40%)
        ========================================== 
      */}
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 mx-auto max-w-[1800px] flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 lg:gap-8">
        {/* ================= LEFT: THE MAP (60%) ================= */}
        <div className="w-full lg:w-[60%] flex flex-col items-center relative opacity-90 pt-8">
          <div className="w-full text-center lg:text-left mb-10 px-4 xl:px-0">
            <h3 className="head-txt text-xl md:text-2xl lg:text-3xl tracking-tight text-[var(--text-main)]">
              The{" "}
              <span className="italic font-light text-[var(--accent)]">
                Global
              </span>{" "}
              Presence of Our Alumni's.
            </h3>
          </div>

          <ComposableMap
            // CHANGE 1: Switched to geoMercator for straight edges
            projection="geoMercator"
            // CHANGE 2: Adjusted scale (from 155 to 115) to fit container with new projection
            projectionConfig={{ scale: 115 }}
            className="w-full h-auto pointer-events-none"
          >
            {/* Layer 1: World Map */}
            <Geographies geography={worldGeoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  if (geo.id === "356" || geo.properties.name === "India")
                    return null;
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="transparent"
                      stroke="#36454F"
                      strokeWidth={0.5}
                      style={{ default: { outline: "none" } }}
                    />
                  );
                })
              }
            </Geographies>

            {/* Layer 2: Official India Mask */}
            <Geographies geography={indiaGeoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="var(--background)"
                    stroke="#36454F"
                    strokeWidth={0.5}
                    style={{ default: { outline: "none" } }}
                  />
                ))
              }
            </Geographies>

            {/* Layer 3: Global Pins */}
            {globalPointers.map((pointer, index) => (
              <Marker key={index} coordinates={pointer.coordinates}>
                {/* PERMANENT STATIC GLOW */}
                <circle
                  cx="0"
                  cy="0"
                  r="7"
                  fill="var(--accent)"
                  opacity="0.15"
                />
                <circle
                  cx="0"
                  cy="0"
                  r="4"
                  fill="var(--accent)"
                  opacity="0.3"
                />

                {/* CUSTOM LOCATION PIN ICON */}
                <g transform="scale(0.65)">
                  <path
                    d="M 0 0 C -3.5 -5 -6 -8.5 -6 -12 A 6 6 0 1 1 6 -12 C 6 -8.5 3.5 -5 0 0 Z"
                    fill="var(--accent)"
                  />
                  <circle cx="0" cy="-12" r="2.5" fill="var(--background)" />
                </g>
              </Marker>
            ))}

            {/* Layer 4: SIHM Durgapur */}
            <Marker coordinates={[87.33992374149645, 23.54757943246294]}>
              <circle r={3} fill="var(--accent)" />
              <circle
                r={8}
                fill="none"
                stroke="var(--accent)"
                strokeWidth={1}
                opacity={0.5}
              />
              <text
                textAnchor="middle"
                y={-12}
                className="font-sans font-semibold tracking-widest text-[8px] uppercase fill-[var(--text-main)]"
              >
                SIHM Durgapur
              </text>
            </Marker>
          </ComposableMap>
        </div>

        {/* ================= RIGHT: THE STATIC GRID (40%) ================= */}
        <div className="w-full lg:w-[40%] flex justify-end">
          <div
            ref={gridContainerRef}
            className="w-full grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 border-t border-l border-[var(--text-main)]/15 opacity-0"
          >
            {partnersData.map((partner, index) => (
              <div
                key={partner.id}
                className="border-r border-b border-[var(--text-main)]/15 flex items-center justify-center aspect-[4/3] p-4 lg:p-6"
              >
                {/* The Masking Container for GSAP Reveal */}
                <div
                  ref={(el) => (maskRefs.current[index] = el)}
                  className="relative overflow-hidden will-change-transform w-full h-full flex items-center justify-center"
                >
                  <img
                    ref={(el) => (imageRefs.current[index] = el)}
                    src={partner.img}
                    alt={`Partner ${partner.id}`}
                    className="w-full h-full object-contain grayscale-[30%] hover:grayscale-0 transition-all duration-300 will-change-transform"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
