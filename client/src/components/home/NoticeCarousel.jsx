import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// Register the GSAP React hook
gsap.registerPlugin(useGSAP);

export default function NoticeCarousel() {
  const containerRef = useRef(null);

  // Data array for easy CMS integration later
  const notices = [
    { id: 1, date: "15 Jun", text: "B.Sc. Hospitality & Hotel Administration Round 2 Counseling Results", tag: "NEW" },
    { id: 2, date: "12 Jun", text: "Download Admit Card for NCHM JEE 2026", tag: null },
    { id: 3, date: "10 Jun", text: "Hostel Accommodation List for 1st Year Students Released", tag: null },
    { id: 4, date: "05 Jun", text: "Notice regarding submission of Anti-Ragging Affidavits", tag: "URGENT" },
  ];

  useGSAP(() => {
    // The Infinite Notice Ticker Animation
    gsap.to('.ticker-content', {
      xPercent: -50, 
      ease: 'none',
      duration: 25, // Adjusted duration for smooth reading pace
      repeat: -1, 
    });
  }, { scope: containerRef });

  return (
    <div 
      ref={containerRef} 
      className="absolute bottom-0 left-0 w-full bg-[var(--primary-light)] border-t border-[var(--text-light)]/10 py-3 z-20 flex overflow-hidden group"
    >
      <div 
        className="ticker-content flex whitespace-nowrap group-hover:[animation-play-state:paused]"
        onMouseEnter={() => gsap.globalTimeline.pause()}
        onMouseLeave={() => gsap.globalTimeline.play()}
      >
        {/* We duplicate the mapped array once to create the seamless infinite loop illusion */}
        {[...Array(2)].map((_, arrayIndex) => (
          <div key={arrayIndex} className="flex items-center">
            {notices.map((notice) => (
              <div key={notice.id} className="flex items-center px-8 border-r border-[var(--text-light)]/20 last:border-r-0">
                {notice.tag && (
                  <span className="bg-[var(--text-light)] text-[var(--primary-base)] text-[10px] font-bold px-2 py-0.5 rounded-sm mr-3">
                    {notice.tag}
                  </span>
                )}
                <span className="micro-text text-[var(--text-light)]/70 mr-3">{notice.date}</span>
                <span className="font-sans text-sm text-[var(--text-light)] font-medium tracking-wide cursor-pointer hover:opacity-70 transition-opacity duration-300">
                  {notice.text}
                </span>
                {/* Small bullet separator */}
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-light)]/30 ml-8"></div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}