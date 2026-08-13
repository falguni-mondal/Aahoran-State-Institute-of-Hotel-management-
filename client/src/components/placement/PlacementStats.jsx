import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const statsData = [
  { 
    id: 1, 
    value: 95, 
    suffix: '%', 
    label: 'Placement Rate', 
    description: 'Consistent career launch record across leading global hospitality sectors.' 
  },
  { 
    id: 2, 
    value: 50, 
    suffix: '+', 
    label: 'Recruiting Partners', 
    description: 'Direct recruitment drives by luxury hotel chains, F&B leaders, and retail giants.' 
  },
  { 
    id: 3, 
    value: 12, 
    suffix: ' LPA', 
    label: 'Highest Package', 
    description: 'Top tier compensation offered for executive and management trainee positions.' 
  },
  { 
    id: 4, 
    value: 1000, 
    suffix: '+', 
    label: 'Alumni Worldwide', 
    description: 'An expansive professional network driving industry excellence across continents.' 
  }
];

export default function PlacementStats() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(min-width: 320px)", () => {
      // Animate each metric block independently as it enters view
      statsData.forEach((stat) => {
        const numElement = sectionRef.current.querySelector(`.stat-number-${stat.id}`);
        const obj = { val: 0 };

        gsap.to(obj, {
          val: stat.value,
          duration: 2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: `.stat-card-${stat.id}`,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          onUpdate: () => {
            if (numElement) {
              numElement.innerText = Math.floor(obj.val) + stat.suffix;
            }
          }
        });

        // Fade & slide up card content
        gsap.fromTo(`.stat-card-${stat.id}`,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: `.stat-card-${stat.id}`,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });
    });

    return () => mm.revert();
  }, { scope: sectionRef });

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full py-20 md:py-32 lg:py-40 bg-[var(--background)] text-[var(--text-main)] overflow-hidden"
    >
      <div className="w-full max-w-[1800px] mx-auto px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        
        {/* Section Header */}
        <div className="flex flex-col gap-4 mb-16 md:mb-24">
          <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
            Impact in Numbers
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light tracking-tighter leading-none">
            Institutional <br className="hidden md:block"/> Performance.
          </h2>
        </div>

        {/* Stats Grid: 1 Col Mobile, 2 Col MD, 4 Col XL/2XL */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12 md:gap-16 xl:gap-12 border-t border-[var(--text-main)]/10 pt-12 md:pt-16">
          {statsData.map((stat) => (
            <div 
              key={stat.id} 
              className={`stat-card-${stat.id} flex flex-col justify-between h-full border-b xl:border-b-0 xl:border-r border-[var(--text-main)]/10 pb-12 xl:pb-0 xl:pr-8 last:border-none`}
            >
              <div>
                <span className={`stat-number-${stat.id} block text-5xl md:text-6xl lg:text-7xl xl:text-7xl 2xl:text-8xl font-light tracking-tighter text-[var(--accent)] mb-4 md:mb-6 font-mono`}>
                  0{stat.suffix}
                </span>
                <h3 className="text-xl md:text-2xl lg:text-3xl font-light tracking-tight text-[var(--text-main)] mb-3">
                  {stat.label}
                </h3>
              </div>
              <p className="text-xs md:text-sm font-light text-[var(--text-main)]/60 leading-relaxed max-w-xs mt-2">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}