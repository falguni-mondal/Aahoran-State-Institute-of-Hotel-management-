import React from 'react';
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

const worldGeoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const indiaGeoUrl = "https://raw.githubusercontent.com/datameet/maps/master/Country/india-composite.geojson";

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
  { name: "Madrid", coordinates: [-3.70, 40.41] },
  { name: "Kyiv", coordinates: [30.52, 50.45] },
  { name: "Yekaterinburg", coordinates: [60.58, 56.83] },
  // Africa
  { name: "Johannesburg", coordinates: [28.04, -26.20] },
  { name: "Addis Ababa", coordinates: [38.75, 9.02] },
  { name: "Kano", coordinates: [8.59, 12.00] },
  { name: "Kinshasa", coordinates: [15.29, -4.32] },
  { name: "Khartoum", coordinates: [32.55, 15.50] },
  { name: "Bamako", coordinates: [-8.00, 12.63] },
  // Asia & Oceania
  { name: "Riyadh", coordinates: [46.71, 24.71] },
  { name: "Tehran", coordinates: [51.38, 35.68] },
  { name: "Tashkent", coordinates: [69.24, 41.29] },
  { name: "Novosibirsk", coordinates: [82.92, 55.00] },
  { name: "Chengdu", coordinates: [104.06, 30.57] },
  { name: "Ulaanbaatar", coordinates: [106.91, 47.91] },
  { name: "Krasnoyarsk", coordinates: [92.85, 56.01] },
  { name: "Alice Springs", coordinates: [133.88, -23.69] },
  { name: "Kalgoorlie", coordinates: [121.46, -30.74] },
  // Newly Added Asian / Southeast Asian / Island Pointers
  { name: "Japan (Nagano)", coordinates: [138.18, 36.65] },
  { name: "Indonesia (Bandung)", coordinates: [107.61, -6.91] },
  { name: "Singapore", coordinates: [103.81, 1.35] },
  { name: "Malaysia (Kuala Lumpur)", coordinates: [101.68, 3.13] },
  { name: "Thailand (Chiang Mai)", coordinates: [98.98, 18.79] },
  { name: "Cambodia (Siem Reap)", coordinates: [103.86, 13.36] },
  { name: "Philippines (Baguio)", coordinates: [120.59, 16.40] },
  { name: "Sri Lanka (Kandy)", coordinates: [80.63, 7.29] },
  { name: "Maldives (Male)", coordinates: [73.50, 4.17] }
];

export default function MapPointing() {
  return (
    <section className="w-full py-24 bg-[var(--background)] flex flex-col items-center justify-center overflow-hidden border-t border-[var(--primary-base)]/10">
      
      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        .animate-pulse-ring {
          animation: pulse-ring 2.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
          transform-origin: center;
        }
      `}</style>

      <div className="w-full max-w-[1400px] px-5 md:px-12 flex flex-col items-center">
        
        {/* HEADER */}
        <div className="text-center mb-12 md:mb-16">
          <span className="font-sans text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)] mb-4 block">
            Global Reach
          </span>
          <h2 className="text-4xl md:text-6xl font-light tracking-tighter text-[var(--text-main)]">
            Our Coordinates.
          </h2>
        </div>

        {/* REACT SIMPLE MAPS */}
        <div className="relative w-full max-w-5xl opacity-80">
          
          <ComposableMap 
            projectionConfig={{ scale: 155 }} 
            className="w-full h-auto pointer-events-none" 
          >
            {/* LAYER 1: WORLD MAP */}
            <Geographies geography={worldGeoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  // FILTER APPLIED HERE: Removing India (356) and Antarctica (010)
                  if (
                    geo.id === "356" || 
                    geo.properties.name === "India" ||
                    geo.id === "010" || 
                    geo.properties.name === "Antarctica"
                  ) {
                    return null;
                  }

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="transparent"
                      stroke="#36454F" 
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { outline: "none" },
                        pressed: { outline: "none" },
                      }}
                    />
                  );
                })
              }
            </Geographies>

            {/* LAYER 2: OFFICIAL INDIA BOUNDARY */}
            <Geographies geography={indiaGeoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="var(--background)" 
                    stroke="#36454F" 
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none" },
                      pressed: { outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>

            {/* LAYER 3: ADDITIONAL GLOBAL POINTERS */}
            {globalPointers.map((pointer, index) => (
              <Marker key={index} coordinates={pointer.coordinates}>
                <circle cx="0" cy="0" r="1" fill="none" stroke="var(--accent)" strokeWidth="0.8">
                  <animate attributeName="r" from="1" to="12" dur="2.5s" begin={`${(index % 5) * 0.4}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.8" to="0" dur="2.5s" begin={`${(index % 5) * 0.4}s`} repeatCount="indefinite" />
                </circle>

                <g transform="scale(0.65)">
                  <path d="M 0 0 C -3.5 -5 -6 -8.5 -6 -12 A 6 6 0 1 1 6 -12 C 6 -8.5 3.5 -5 0 0 Z" fill="var(--accent)" />
                  <circle cx="0" cy="-12" r="2.5" fill="var(--background)" />
                </g>
              </Marker>
            ))}

            {/* LAYER 4: EXACT MARKER FOR SIHM DURGAPUR */}
            <Marker coordinates={[87.33992374149645, 23.54757943246294]}>
              <circle r={3} fill="var(--accent)" />
              <circle r={8} fill="none" stroke="var(--accent)" strokeWidth={1} opacity={0.5} />
              <text textAnchor="middle" y={-12} className="font-sans font-semibold tracking-widest text-[8px] uppercase fill-[var(--text-main)]">
                SIHM Durgapur
              </text>
            </Marker>

          </ComposableMap>
        </div>

      </div>
    </section>
  );
}