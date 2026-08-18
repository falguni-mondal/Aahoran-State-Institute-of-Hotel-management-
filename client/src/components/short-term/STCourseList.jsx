import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const coursesData = [
  {
    id: "fb-service",
    title: "Food & Beverage Service",
    image: "/st-fb-service.webp",
    description: [
      "It has been observed, from the study of manpower requirement in the hospitality industry that there is a substantial demand for skilled manpower in the Food Service industry which may be provided by the hotel management institutes.",
      "The diploma in Food and Beverage Service is an 18-month course attracting the 12th standard student who are going to be exposed in hands-on training and will acquire skill therein to become confident and professional to serve the hospitality industry.",
      "There is an ample career growth for these skilled manpower, and they can earn a handful emoluments during their service and even they can be turned out as a successful entrepreneur."
    ]
  },
  {
    id: "bakery",
    title: "Bakery & Confectionery",
    image: "/st-bakery.webp",
    description: [
      "In every cities, townships and tourist destinations, there are plenty of bakery and confectionery outlets serving the millions of customer. To fulfill the demand of these outlets a good number of skilled manpower is required to support the bakery and confectionery industry.",
      "The Diploma in Bakery and Confectionary is an 18-month course attracting the 12th standard student who will actually learn the art of baking and cake making during their training in the institute.",
      "There is an ample career growth for these skilled manpower, and they can earn a handful emoluments during their service and even they can be turned out as a successful entrepreneur."
    ]
  },
  {
    id: "house-keeping",
    title: "House Keeping",
    image: "/st-housekeeping.webp",
    description: [
      "It has been observed, from the study of manpower requirement in the hospitality industry that there is a substantial demand for skilled manpower in the Food Service industry which may be provided by the hotel management institutes.",
      "The diploma in Housekeeping is an 18-month course attracting the 12th standard student who are going to be exposed to hands-on training and will acquire skill therein to become confident and professional to cater the hospitality industry.",
      "There is an ample career growth for these skilled manpower, and they can earn a handful emoluments during their service and even they can be turned out as a successful entrepreneur."
    ]
  },
  {
    id: "front-office",
    title: "Front Office",
    image: "/st-front-office.webp",
    description: [
      "Front Office is the face of the Hospitality Industry which is having an ample job opportunity in the Hotel Industry, Airlines, Retails, Travel & Tour operators. The 12th standard students during their period of 18 months training will learn grooming, soft skills, handling software, able to become professional in their fields and therein competent for hospitality profession."
    ]
  },
  {
    id: "food-production",
    title: "Food Production",
    image: "/st-food-production.webp",
    description: [
      "In every cities, townships and tourist destinations, there are plenty of restaurants, fast food outlets, canteens, QSR's serving millions of customer with their food specialities.To fulfill the demand of these outlets a good number of skilled manpower is required to support the food industry.",
      "The Diploma in Food Production is an 18-month course attracting the 12th standard student who will actually learn the culinary art during their training in the institute.",
      "There is an ample career growth for these skilled manpower, and they can earn a handful emoluments during their service and even they can be turned out as a successful entrepreneur."
    ]
  }
];

export default function STCourseList() {
  const containerRef = useRef(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    // DESKTOP ANIMATIONS: Pinned Parallax Crossfade
    mm.add("(min-width: 1024px)", () => {
      ScrollTrigger.create({
        trigger: ".lookbook-container",
        start: "top top",
        end: "bottom bottom",
        pin: ".image-pin-container",
      });

      const blocks = gsap.utils.toArray('.course-block');
      const images = gsap.utils.toArray('.course-img');

      // Set initial state: first image visible, rest hidden
      gsap.set(images, { opacity: 0 });
      gsap.set(images[0], { opacity: 1 });

      blocks.forEach((block, index) => {
        // Crossfade images based on which text block is in the center of the screen
        ScrollTrigger.create({
          trigger: block,
          start: "top 50%",
          end: "bottom 50%",
          onToggle: (self) => {
            if (self.isActive) {
              gsap.to(images, { opacity: 0, duration: 0.8, ease: "power2.inOut" });
              gsap.to(images[index], { opacity: 1, duration: 0.8, ease: "power2.inOut" });
            }
          }
        });

        // Fade up the text blocks as they enter the screen
        gsap.fromTo(block, 
          { opacity: 0, y: 50 },
          { 
            opacity: 1, y: 0, duration: 1, ease: "power3.out",
            scrollTrigger: {
              trigger: block,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });
    });

    // MOBILE ANIMATIONS: Simple Scroll Reveals
    mm.add("(max-width: 1023px)", () => {
       gsap.utils.toArray('.mobile-course').forEach((card) => {
          gsap.fromTo(card,
            { opacity: 0, y: 40 },
            {
              opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none reverse"
              }
            }
          );
       });
    });

    return () => mm.revert();
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full bg-[var(--background)] text-[var(--primary-base)] relative border-t border-[var(--primary-base)]/10 pb-32">
      <div className="lookbook-container w-full max-w-[1800px] mx-auto flex flex-col lg:flex-row relative">
        
        {/* ==========================================
            DESKTOP: LEFT PINNED IMAGE GALLERY 
            (Hidden on mobile)
        ========================================== */}
        <div className="hidden lg:flex w-5/12 h-[100svh] image-pin-container relative z-10 flex-col justify-center mt-14 p-12 xl:p-16 2xl:p-24">
          <div className="w-full aspect-[4/5] relative overflow-hidden bg-[var(--primary-base)]/5 shadow-2xl">
            {coursesData.map((course) => (
              <img 
                key={`${course.id}-img`}
                src={course.image}
                alt={course.title}
                className="course-img absolute inset-0 w-full h-full object-cover"
              />
            ))}
          </div>
        </div>

        {/* ==========================================
            DESKTOP: RIGHT SCROLLING TEXT BLOCKS 
            (Hidden on mobile)
        ========================================== */}
        <div className="hidden lg:flex w-7/12 flex-col z-20 py-[50vh] px-12 xl:px-16 2xl:px-24">
          {coursesData.map((course, index) => (
            <div key={`${course.id}-desc`} className="course-block flex flex-col justify-center min-h-[70vh] mb-32 last:mb-0">
              
              <div className="flex items-center gap-6 mb-8 opacity-80">
                <span className="text-xl md:text-2xl font-light text-[var(--accent)] tracking-widest font-serif">
                  0{index + 1}
                </span>
                <div className="w-16 h-[1px] bg-[var(--primary-base)]/20"></div>
              </div>

              <h3 className="head-txt text-5xl xl:text-6xl 2xl:text-7xl font-light tracking-tighter mb-10 leading-[0.95] text-[var(--primary-base)]">
                Diploma in <br/> {course.title}
              </h3>
              
              <div className="flex flex-col gap-6">
                {course.description.map((para, pIndex) => (
                  <p key={pIndex} className="text-lg xl:text-xl font-light leading-[1.8] text-[var(--primary-base)]/80 max-w-2xl text-justify">
                    {para}
                  </p>
                ))}
              </div>

            </div>
          ))}
        </div>

        {/* ==========================================
            MOBILE: STACKED ALTERNATING LAYOUT 
            (Hidden on desktop)
        ========================================== */}
        <div className="lg:hidden w-full flex flex-col px-5 md:px-8 py-20 md:py-32 gap-24 md:gap-32">
          {coursesData.map((course, index) => (
            <div key={`${course.id}-mobile`} className="mobile-course flex flex-col gap-8">
              
              <div className="w-full aspect-[4/5] overflow-hidden bg-[var(--primary-base)]/5 shadow-lg">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-4 mb-6 opacity-80">
                  <span className="text-lg font-light text-[var(--accent)] tracking-widest font-serif">
                    0{index + 1}
                  </span>
                  <div className="w-12 h-[1px] bg-[var(--primary-base)]/20"></div>
                </div>

                <h3 className="head-txt text-4xl md:text-5xl font-light tracking-tighter mb-6 leading-[0.95] text-[var(--primary-base)]">
                  Diploma in <br/> {course.title}.
                </h3>
                
                <div className="flex flex-col gap-5">
                  {course.description.map((para, pIndex) => (
                    <p key={pIndex} className="text-base md:text-lg font-light leading-[1.8] text-[var(--primary-base)]/80 text-justify">
                      {para}
                    </p>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}