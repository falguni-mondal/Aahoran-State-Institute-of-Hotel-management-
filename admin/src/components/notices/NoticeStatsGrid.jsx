import React, { forwardRef } from 'react';
import { FileText, Eye, Sparkles, EyeOff } from 'lucide-react';

const NoticeStatsGrid = forwardRef(({ notices = [], isLoading = false }, ref) => {
  const totalCount = notices.length;
  const activeCount = notices.filter((n) => n.isActive).length;
  const newBadgeCount = notices.filter((n) => n.isNew).length;
  const draftCount = totalCount - activeCount;

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:gap-6"
    >
      {/* 1. Total Circulars */}
      <div className="rounded-2xl border border-[#E6E2D8] bg-[#FFFFFF] p-6 shadow-[0_10px_30px_rgba(48,48,48,0.03)] sm:p-6 md:p-6 lg:p-6 xl:p-7 2xl:p-8">
        <div className="flex items-center justify-between text-[#707884]">
          <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-[#707884] sm:text-[11px] 2xl:text-xs">
            Total Circulars
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E6E2D8] bg-[#F7F5F0] text-[#E85D04] 2xl:h-10 2xl:w-10">
            <FileText className="h-4 w-4 2xl:h-5 2xl:w-5" />
          </div>
        </div>
        {isLoading ? (
          <div className="mt-4 h-9 w-16 animate-pulse rounded-md bg-[#E6E2D8]/70 sm:h-10 sm:w-20 2xl:h-12 2xl:w-24" />
        ) : (
          <div className="mt-4 font-serif text-3xl font-normal tracking-tight text-[#303030] sm:text-3xl md:text-4xl lg:text-4xl 2xl:text-5xl">
            {totalCount}
          </div>
        )}
        <div className="mt-3 flex items-center justify-between border-t border-[#E6E2D8] pt-3 font-sans text-[11px] text-[#707884] 2xl:text-xs">
          <span>Registered PDF documents</span>
          <span className="font-medium text-[#303030]">Archive</span>
        </div>
      </div>

      {/* 2. Published Live */}
      <div className="rounded-2xl border border-[#E6E2D8] bg-[#FFFFFF] p-6 shadow-[0_10px_30px_rgba(48,48,48,0.03)] sm:p-6 md:p-6 lg:p-6 xl:p-7 2xl:p-8">
        <div className="flex items-center justify-between text-[#707884]">
          <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-[#707884] sm:text-[11px] 2xl:text-xs">
            Published Live
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E6E2D8] bg-[#F7F5F0] text-emerald-600 2xl:h-10 2xl:w-10">
            <Eye className="h-4 w-4 2xl:h-5 2xl:w-5" />
          </div>
        </div>
        {isLoading ? (
          <div className="mt-4 h-9 w-16 animate-pulse rounded-md bg-[#E6E2D8]/70 sm:h-10 sm:w-20 2xl:h-12 2xl:w-24" />
        ) : (
          <div className="mt-4 font-serif text-3xl font-normal tracking-tight text-emerald-700 sm:text-3xl md:text-4xl lg:text-4xl 2xl:text-5xl">
            {activeCount}
          </div>
        )}
        <div className="mt-3 flex items-center justify-between border-t border-[#E6E2D8] pt-3 font-sans text-[11px] text-[#707884] 2xl:text-xs">
          <span>Visible on public portal</span>
          <span className="flex items-center gap-1 font-medium text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
            Live
          </span>
        </div>
      </div>

      {/* 3. New Update Badges */}
      <div className="rounded-2xl border border-[#E6E2D8] bg-[#FFFFFF] p-6 shadow-[0_10px_30px_rgba(48,48,48,0.03)] sm:p-6 md:p-6 lg:p-6 xl:p-7 2xl:p-8">
        <div className="flex items-center justify-between text-[#707884]">
          <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-[#707884] sm:text-[11px] 2xl:text-xs">
            New Update Badges
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E6E2D8] bg-[#F7F5F0] text-[#E85D04] 2xl:h-10 2xl:w-10">
            <Sparkles className="h-4 w-4 2xl:h-5 2xl:w-5" />
          </div>
        </div>
        {isLoading ? (
          <div className="mt-4 h-9 w-16 animate-pulse rounded-md bg-[#E6E2D8]/70 sm:h-10 sm:w-20 2xl:h-12 2xl:w-24" />
        ) : (
          <div className="mt-4 font-serif text-3xl font-normal tracking-tight text-[#303030] sm:text-3xl md:text-4xl lg:text-4xl 2xl:text-5xl">
            {newBadgeCount}
          </div>
        )}
        <div className="mt-3 flex items-center justify-between border-t border-[#E6E2D8] pt-3 font-sans text-[11px] text-[#707884] 2xl:text-xs">
          <span>Pinned with accent indicator</span>
          <span className="font-medium text-[#E85D04]">Highlighted</span>
        </div>
      </div>

      {/* 4. Hidden / Drafts */}
      <div className="rounded-2xl border border-[#E6E2D8] bg-[#FFFFFF] p-6 shadow-[0_10px_30px_rgba(48,48,48,0.03)] sm:p-6 md:p-6 lg:p-6 xl:p-7 2xl:p-8">
        <div className="flex items-center justify-between text-[#707884]">
          <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-[#707884] sm:text-[11px] 2xl:text-xs">
            Hidden / Drafts
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E6E2D8] bg-[#F7F5F0] text-[#707884] 2xl:h-10 2xl:w-10">
            <EyeOff className="h-4 w-4 2xl:h-5 2xl:w-5" />
          </div>
        </div>
        {isLoading ? (
          <div className="mt-4 h-9 w-16 animate-pulse rounded-md bg-[#E6E2D8]/70 sm:h-10 sm:w-20 2xl:h-12 2xl:w-24" />
        ) : (
          <div className="mt-4 font-serif text-3xl font-normal tracking-tight text-[#707884] sm:text-3xl md:text-4xl lg:text-4xl 2xl:text-5xl">
            {draftCount}
          </div>
        )}
        <div className="mt-3 flex items-center justify-between border-t border-[#E6E2D8] pt-3 font-sans text-[11px] text-[#707884] 2xl:text-xs">
          <span>Withheld from public view</span>
          <span className="font-medium text-[#707884]">Staged</span>
        </div>
      </div>
    </div>
  );
});

NoticeStatsGrid.displayName = 'NoticeStatsGrid';

export default NoticeStatsGrid;