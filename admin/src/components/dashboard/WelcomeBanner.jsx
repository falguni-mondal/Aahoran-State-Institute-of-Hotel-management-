import React, { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const WelcomeBanner = forwardRef(({ userEmail }, ref) => {
  const username = userEmail?.split('@')[0] || 'Administrator';

  return (
    <div
      ref={ref}
      className="flex flex-col justify-between gap-6 rounded-2xl border border-[#E6E2D8] bg-[#FFFFFF] p-6 shadow-[0_10px_30px_rgba(48,48,48,0.03)] sm:p-8 md:p-8 lg:flex-row lg:items-center xl:p-9 2xl:p-10"
    >
      <div className="space-y-1.5">
        <span className="font-sans text-[11px] font-semibold uppercase tracking-widest text-[#E85D04] sm:text-xs 2xl:text-sm">
          ACTIVE IDENTITY VERIFIED
        </span>
        <h2 className="font-serif text-2xl font-normal tracking-tight text-[#303030] sm:text-3xl md:text-3xl lg:text-3xl 2xl:text-4xl">
          Welcome back, <span className="italic text-[#E85D04]">{username}</span>
        </h2>
        <p className="font-sans text-xs text-[#707884] sm:text-sm md:text-sm lg:text-sm 2xl:text-base">
          Session authenticated via hardware-timed TOTP. All transactions and state changes are cryptographically committed to immutable audit storage.
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <Link
          to="/audit-logs"
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#303030] px-5 py-3 font-sans text-xs font-medium uppercase tracking-wider text-[#F7F5F0] transition-all hover:bg-[#E85D04] sm:w-auto md:w-auto 2xl:py-3.5 2xl:text-sm"
        >
          <span>Inspect Audit Log</span>
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
});

WelcomeBanner.displayName = 'WelcomeBanner';

export default WelcomeBanner;