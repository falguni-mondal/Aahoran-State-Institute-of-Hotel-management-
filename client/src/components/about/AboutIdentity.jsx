import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function AboutIdentity() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    // Initialize SplitType ONCE outside of matchMedia to prevent layout shifts
    const paragraphs = gsap.utils.toArray('.split-paragraph');
    let splitInstances = [];

    paragraphs.forEach((para) => {
      const split = new SplitType(para, { types: 'lines', lineClass: 'split-line' });
      splitInstances.push(split);

      // Wrap each line in a hidden overflow div to create a pure mask reveal effect
      split.lines.forEach((line) => {
        const wrapper = document.createElement('div');
        wrapper.style.overflow = 'hidden';
        wrapper.style.display = 'block'; 
        line.parentNode.insertBefore(wrapper, line);
        wrapper.appendChild(line);
      });
    });

    let mm = gsap.matchMedia();

    mm.add({
      isDesktop: "(min-width: 1024px)",
      isMobile: "(max-width: 1023px)"
    }, (context) => {
      let { isDesktop } = context.conditions;

      // Header Animation
      gsap.fromTo('.identity-header',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.identity-header',
            start: isDesktop ? "top 80%" : "top 90%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Mask Reveal for Image
      gsap.fromTo('.identity-image-mask',
        { scaleY: 1 }, 
        {
          scaleY: 0, 
          duration: 1.5,
          ease: 'expo.inOut',
          transformOrigin: 'top',
          scrollTrigger: {
            trigger: '.identity-image-container',
            start: isDesktop ? "top 75%" : "top 85%",
          }
        }
      );

      // Subliminal Image Scale
      gsap.fromTo('.identity-image',
        { scale: 1.1 },
        {
          scale: 1,
          duration: 1.5,
          ease: 'expo.inOut',
          scrollTrigger: {
            trigger: '.identity-image-container',
            start: isDesktop ? "top 75%" : "top 85%",
          }
        }
      );

      // Pure Line-by-Line "Curtain" Reveal
      splitInstances.forEach((split, index) => {
        gsap.fromTo(split.lines,
          { yPercent: 100 }, 
          {
            yPercent: 0,
            duration: 1.2,
            stagger: 0.15, 
            ease: 'expo.out', 
            scrollTrigger: {
              trigger: paragraphs[index],
              start: isDesktop ? "top 85%" : "top 95%", 
              toggleActions: "play none none reverse"
            }
          }
        );
      });

    }); // End matchMedia

    // Cleanup function for unmounting
    return () => {
      mm.revert();
      splitInstances.forEach(instance => instance.revert());
    };
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="identity-section relative w-full px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-20 md:py-28 lg:py-32 mt-12 md:mt-20 mx-auto max-w-[1800px] border-t border-[var(--text-light)]/10 bg-[var(--primary-base)]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 xl:gap-24 2xl:gap-32 items-center">
        
        {/* Left: Text Content */}
        <div className="lg:col-span-6 flex flex-col order-2 lg:order-1">
          <div className="identity-header overflow-hidden mb-6 lg:mb-10">
            <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)] mb-4 lg:mb-6 block">
              Our Identity
            </span>
            <h2 className="head-txt text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-[var(--text-light)] leading-[0.95] tracking-tighter">
              Forging the future of Hospitality.
            </h2>
          </div>
          
          <div className="flex flex-col gap-6 lg:gap-8">
            <p className="split-paragraph text-base md:text-lg lg:text-xl 2xl:text-2xl font-light text-[var(--text-light)]/75 leading-[1.7]">
              SIHM Durgapur is one of the new endeavours established in the state of West Bengal as a Hotel Management Institute, which operates under the affiliation of the <span className="text-[var(--text-light)] font-medium">National Council for Hotel Management Catering Technology (NCHMCT), Ministry of Tourism, Govt. of India.</span>
            </p>
            
            <p className="split-paragraph text-base md:text-lg lg:text-xl 2xl:text-2xl font-light text-[var(--text-light)]/75 leading-[1.7]">
              The name <span className="text-[var(--accent)] font-medium">"AAHORAN"</span> was gifted by the Hon'ble Chief Minister, Govt. of West Bengal with the vision of imparting soft skills, hard skills, and a positive attitude, enabling our pupils to serve guests at the highest echelons of the Hospitality Industry.
            </p>
            
            <p className="split-paragraph text-base md:text-lg lg:text-xl 2xl:text-2xl font-light text-[var(--text-light)]/75 leading-[1.7]">
              With the advent of urbanization and industrialization, catering establishments are increasing in large numbers. The development of adequate services for feeding the large and increasing number of workers poses a special challenge of considerable importance that SIHM is built to address.
            </p>
          </div>
        </div>

        {/* Right: Mask Revealed Image */}
        <div className="identity-image-container lg:col-span-6 relative h-[350px] md:h-[500px] lg:h-[650px] xl:h-[750px] w-full overflow-hidden order-1 lg:order-2 rounded-sm">
          <div className="identity-image-mask absolute inset-0 w-full h-full bg-[var(--background)] z-10"></div>
          <img 
            src="/about_kitchen.webp" 
            alt="Culinary students in training kitchen" 
            className="identity-image absolute inset-0 w-full h-full object-cover object-center"
          />
        </div>

      </div>
    </section>
  );
}