import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function AboutVision() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add({
      isDesktop: "(min-width: 1024px)",
      isMobile: "(max-width: 1023px)"
    }, (context) => {
      let { isDesktop } = context.conditions;

      // Vision Statement Text Reveal
      gsap.fromTo('.vision-text',
        { y: isDesktop ? 40 : 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: isDesktop ? "top 80%" : "top 90%", 
            toggleActions: "play none none reverse"
          }
        }
      );
      
      // Accent Line Grow Reveal
      gsap.fromTo('.hero-accent-line', 
        { scaleY: 0 }, 
        { 
          scaleY: 1, 
          duration: 1, 
          transformOrigin: 'top',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: isDesktop ? "top 80%" : "top 90%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    return () => mm.revert();
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="vision-section relative w-full px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-16 md:py-24 lg:py-32 mx-auto max-w-[1200px] 2xl:max-w-[1400px] flex flex-col items-center text-center z-10">
      <div className="hero-accent-line w-[2px] h-12 md:h-20 lg:h-24 bg-[var(--accent)] mb-8 md:mb-12"></div>
      <p className="vision-text head-txt text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-[1.2] tracking-tight text-[var(--text-main)]/90 italic">
        "With a vision of enhancing hospitality education in West Bengal, Hon'ble Chief Minister dreamt of establishing a hospitality management institute which will cater to Hospitality aspirants of Eastern India and other parts which will justify Bengal as <span className="text-[var(--accent)]">'The Sweetest Part of India'</span>."
      </p>
    </section>
  );
}