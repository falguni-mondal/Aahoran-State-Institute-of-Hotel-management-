import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* =========================================
   FACULTY DATA (Using requested placeholder)
========================================= */
const facultyData = [
  { name: "Dr. Santanu Dasgupta", role: "Principal", image: "/nchmct-bg.webp" },
  { name: "Mr. Ananda Shankar Ojha", role: "Sr. Lecturer", image: "/nchmct-bg.webp" },
  { name: "Ms. Banani Mondal", role: "Sr. Lecturer", image: "/nchmct-bg.webp" },
  { name: "Mr. Somnath Bandyopadhyay", role: "Lecturer", image: "/nchmct-bg.webp" },
  { name: "Dr. Aditi Sharma", role: "HOD, Food Production", image: "/nchmct-bg.webp" },
  { name: "Mr. Rohan Chatterjee", role: "Lecturer, F&B Service", image: "/nchmct-bg.webp" },
  { name: "Ms. Kavita Sen", role: "Instructor, Front Office", image: "/nchmct-bg.webp" },
  { name: "Mr. Vikram Singh", role: "Instructor, Housekeeping", image: "/nchmct-bg.webp" },
];

export default function AboutFaculty() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    // 1. Initialize SplitType
    const paragraphs = gsap.utils.toArray('.split-paragraph');
    let splitInstances = [];

    paragraphs.forEach((para) => {
      const split = new SplitType(para, { types: 'lines', lineClass: 'split-line' });
      splitInstances.push(split);

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

      // Header entrance
      gsap.fromTo('.faculty-header-item',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.faculty-header-item',
            start: isDesktop ? "top 80%" : "top 90%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Paragraph Line-by-Line Reveal
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

      // Cinematic Curtain Reveal for Faculty Grid
      const facultyGridTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.faculty-grid',
          start: isDesktop ? "top 90%" : "top 95%",
        }
      });

      facultyGridTl.fromTo('.faculty-img-mask',
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.6,
          ease: "expo.inOut",
          stagger: 0.1
        }
      );

      facultyGridTl.fromTo('.faculty-img',
        { scale: 1.3 },
        {
          scale: 1,
          duration: 1.6,
          ease: "expo.inOut",
          stagger: 0.1,
          clearProps: "transform" // Critical for Tailwind hover effects to resume working
        },
        "-=1.6" 
      );

      facultyGridTl.fromTo('.faculty-info',
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out"
        },
        "-=1.2" 
      );

    }); // End matchMedia

    // Cleanup function
    return () => {
      mm.revert();
      splitInstances.forEach(instance => instance.revert());
    };
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative w-full bg-[var(--background)] text-[var(--primary-base)] pt-12 pb-32 md:pt-16 md:pb-40 lg:pt-20 lg:pb-48">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24 mx-auto max-w-[1800px]">
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-16 md:mb-24">
          <div className="flex flex-col lg:max-w-2xl xl:max-w-3xl">
            <div className="faculty-header-item">
              <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)] mb-4 lg:mb-6 block">
                Our Faculties
              </span>
              <h2 className="head-txt text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tighter mb-8 lg:mb-10">
                Academic <br className="hidden md:block"/> Leadership.
              </h2>
            </div>
            
            <div className="flex flex-col gap-6">
              <p className="split-paragraph text-base md:text-lg lg:text-xl font-light text-[var(--primary-base)]/80 leading-[1.7]">
                The faculties are exposed in direct teaching skills, they are well versed to design the training program and will be able to transfer the knowledge to the students.
              </p>
              <p className="split-paragraph text-base md:text-lg lg:text-xl font-light text-[var(--primary-base)]/80 leading-[1.7]">
                The faculties are also keeping updated information about the industry, its changes and modify the teaching accordingly. They are also involved in Research & Development producing journals and periodicals and be able to provide necessary guidance to the students.
              </p>
            </div>
          </div>
        </div>

        {/* Elegant Cinematic Faculty Grid */}
        <div className="faculty-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-8 lg:gap-x-12 pt-16 md:pt-20 border-t border-[var(--primary-base)]/15">
          {facultyData.map((faculty, index) => (
            <div key={index} className="faculty-card group flex flex-col">
              
              {/* Premium Image Mask Reveal Container */}
              <div className="faculty-img-mask relative w-full aspect-[3/4] mb-6 overflow-hidden rounded-sm bg-[var(--primary-base)]/5 will-change-transform">
                <img 
                  src={faculty.image} 
                  alt={faculty.name} 
                  className="faculty-img w-full h-full object-cover grayscale opacity-90 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-100 will-change-transform"
                />
                <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.05)] pointer-events-none transition-opacity duration-500 group-hover:opacity-0"></div>
              </div>

              {/* Text Content */}
              <div className="faculty-info flex flex-col will-change-transform">
                <h3 className="font-semibold text-lg md:text-xl xl:text-2xl text-[var(--primary-base)] mb-1 tracking-tight">
                  {faculty.name}
                </h3>
                <div className="w-4 h-[1px] bg-[var(--accent)] mt-1 mb-2"></div>
                <span className="text-sm md:text-base font-light text-[var(--primary-base)]/60">
                  {faculty.role}
                </span>
              </div>
              
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}