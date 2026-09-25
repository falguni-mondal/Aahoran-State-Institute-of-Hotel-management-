import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const recruitingPartners = [
  { name: 'Conrad Hotels', category: 'Luxury Hospitality', logo: 'conrad_png.webp' },
  { name: 'Holiday Inn', category: 'Global Hospitality', logo: 'holiday-inn_png.webp' },
  { name: 'Hyatt Hotels', category: 'Premium Hospitality', logo: 'hyatt_png.webp' },
  { name: 'JW Marriott', category: 'Luxury Resorts', logo: 'jwm_png.webp' },
  { name: 'Novotel', category: 'Global Resort', logo: 'novotel_png.webp' },
  { name: 'Hilton Hotels', category: 'International Chain', logo: 'hilton_png.webp' },
  { name: 'The Oberoi', category: 'Luxury Hospitality', logo: 'oberoi_png.webp' },
  { name: 'Pride Hotels', category: 'Premium Hospitality', logo: 'pride_png.webp' },
  { name: 'Sheraton', category: 'Global Hospitality', logo: 'sheraton_png.webp' },
  { name: 'Taj Hotels', category: 'Luxury Palaces', logo: 'taj_png.webp' },
  { name: 'The LaLiT', category: 'Luxury Hospitality', logo: 'the-lalit_png.webp' },
  { name: 'Peerless Hotels', category: 'Premium Hospitality', logo: 'peerless_png.webp' },
  { name: 'Radisson Blu', category: 'International Chain', logo: 'radisson_png.webp' },
  { name: 'Ramada', category: 'Global Hospitality', logo: 'ramada_png.webp' },
  { name: 'Trident Hotels', category: 'Premium Hospitality', logo: 'trident_png.webp' },
  { name: 'Westin Hotels', category: 'Luxury Resorts', logo: 'westin_png.webp' },
  { name: 'The Park', category: 'Boutique Hotels', logo: 'the-park_png.webp' }
];

export default function PlacementMarquee() {
  const containerRef = useRef(null);
  const marqueeTrackRef = useRef(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(min-width: 320px)", () => {
      // Infinite Seamless Marquee Animation
      const marqueeTrack = marqueeTrackRef.current;
      
      gsap.to(marqueeTrack, {
        xPercent: -50,
        repeat: -1,
        duration: 90, 
        ease: 'none',
        force3D: true, 
      });
    });

    return () => mm.revert();
  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef} 
      className="relative w-full py-10 md:py-12 lg:py-16 xl:py-20 bg-[var(--background)] text-[var(--text-main)] overflow-hidden border-t border-b border-[var(--text-main)]/10"
    >
      
      {/* Top Label */}
      <div className="w-full max-w-[1800px] mx-auto px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24 mb-10 md:mb-12 lg:mb-14">
        <span className="text-[9px] md:text-[10px] lg:text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)] block text-center md:text-left">
          Recognized Industry Partners & Recruiters
        </span>
      </div>

      {/* Edge Fading Gradient Wrappers for Smooth Visual Flow */}
      <div className="absolute top-0 left-0 w-24 md:w-32 lg:w-64 h-full bg-gradient-to-r from-[var(--background)] to-transparent z-10 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-24 md:w-32 lg:w-64 h-full bg-gradient-to-l from-[var(--background)] to-transparent z-10 pointer-events-none"></div>

      {/* Infinite Marquee Track */}
      <div className="flex w-full overflow-hidden select-none">
        <div 
          ref={marqueeTrackRef} 
          className="flex items-center shrink-0 gap-16 md:gap-24 lg:gap-32 w-max pr-16 md:pr-24 lg:pr-32 will-change-transform"
        >
          {/* Double map to create a seamless infinite loop */}
          {[...recruitingPartners, ...recruitingPartners].map((partner, index) => (
            <div 
              key={index} 
              className="flex items-center gap-10 md:gap-16 lg:gap-20 shrink-0 group cursor-default"
            >
              <div className="flex flex-col items-center justify-center">
                
                {/* Logo Image - Enlarged slightly for better visibility */}
                <div className="h-8 md:h-10 lg:h-12 xl:w-28 mb-3 md:mb-4 flex items-center justify-center">
                  <img 
                    src={`/images/partner-logos/${partner.logo}`} 
                    alt={`${partner.name} Logo`} 
                    className="h-full w-auto object-contain"
                  />
                </div>

                {/* Typography Block - Scaled down text size */}
                <span className="text-lg md:text-xl lg:text-2xl font-light tracking-tight text-[var(--text-main)]/60 group-hover:text-[var(--text-main)] transition-colors duration-500 whitespace-nowrap">
                  {partner.name}
                </span>
                <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] font-bold text-[var(--accent)]/50 group-hover:text-[var(--accent)] transition-colors duration-500 mt-1.5">
                  {partner.category}
                </span>

              </div>

              {/* Decorative Separator Dot */}
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[var(--text-main)]/10 group-hover:bg-[var(--accent)] transition-colors duration-500"></div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}