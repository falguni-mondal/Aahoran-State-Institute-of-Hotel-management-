import React, { useState, useEffect } from 'react';
import { Menu, Clock } from 'lucide-react';

const Topbar = ({ onOpenMobileNav, title = 'Institutional Telemetry', subtitle = 'PORTAL ROOT / REAL-TIME OBSERVABILITY' }) => {
  const [systemTime, setSystemTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setSystemTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZoneName: 'short',
        })
      );
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#E6E2D8] bg-[#F7F5F0]/90 px-4 py-3.5 backdrop-blur-md sm:px-6 md:px-8 lg:px-8 xl:px-10 2xl:px-12 2xl:py-5">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileNav}
          className="rounded-lg border border-[#E6E2D8] bg-[#FFFFFF] p-2 text-[#707884] hover:bg-[#F7F5F0] hover:text-[#303030] lg:hidden"
          aria-label="Open navigation sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h1 className="font-serif text-lg font-medium tracking-tight text-[#303030] sm:text-xl md:text-xl lg:text-2xl 2xl:text-3xl">
            {title}
          </h1>
          <span className="font-sans text-[10px] uppercase tracking-wider text-[#707884] sm:text-[11px] 2xl:text-xs">
            {subtitle}
          </span>
        </div>
      </div>

      {/* Status Badges */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        <div className="hidden items-center gap-2 rounded-full border border-[#E6E2D8] bg-[#FFFFFF] px-3.5 py-1 font-sans text-[11px] text-[#707884] md:flex lg:flex xl:flex 2xl:text-xs">
          <Clock className="h-3.5 w-3.5 text-[#E85D04]" />
          <span>{systemTime || 'SYNCING CLOCK...'}</span>
        </div>

        <div className="flex items-center gap-1.5 rounded-full border border-[#E6E2D8] bg-[#FFFFFF] px-3 py-1 font-sans text-[10px] font-medium text-[#303030] sm:text-xs 2xl:text-xs">
          <span className="h-2 w-2 rounded-full bg-[#E85D04]" />
          <span>ZERO-TRUST ENFORCED</span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;