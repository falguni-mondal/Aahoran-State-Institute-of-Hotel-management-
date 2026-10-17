import React, { forwardRef } from 'react';
import { Award, GraduationCap, BookOpen, Sparkles } from 'lucide-react';

const ResultStatsGrid = forwardRef(({ results = [], isLoading = false }, ref) => {
  const totalCount = results.length;
  const bscCount = results.filter((r) => r.programType === 'bsc').length;
  const diplomaCount = results.filter((r) => r.programType === 'diploma').length;
  const newBadgeCount = results.filter((r) => r.isNew).length;

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:gap-6"
    >
      {/* 1. Total Results */}
      <div className="rounded-2xl border border-[#E6E2D8] bg-[#FFFFFF] p-6 shadow-[0_10px_30px_rgba(48,48,48,0.03)] xl:p-7 2xl:p-8">
        <div className="flex items-center justify-between text-[#707884]">
          <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-[#707884] 2xl:text-xs">
            Total Declarations
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E6E2D8] bg-[#F7F5F0] text-[#E85D04] 2xl:h-10 2xl:w-10">
            <Award className="h-4 w-4 2xl:h-5 2xl:w-5" />
          </div>
        </div>
        {isLoading ? (
          <div className="mt-4 h-9 w-16 animate-pulse rounded-md bg-[#E6E2D8]/70 sm:h-10 sm:w-20 2xl:h-12 2xl:w-24" />
        ) : (
          <div className="mt-4 font-serif text-3xl font-normal tracking-tight text-[#303030] md:text-4xl 2xl:text-5xl">
            {totalCount}
          </div>
        )}
        <div className="mt-3 flex items-center justify-between border-t border-[#E6E2D8] pt-3 font-sans text-[11px] text-[#707884] 2xl:text-xs">
          <span>Examination result sheets</span>
          <span className="font-medium text-[#303030]">Archive</span>
        </div>
      </div>

      {/* 2. B.Sc Results */}
      <div className="rounded-2xl border border-[#E6E2D8] bg-[#FFFFFF] p-6 shadow-[0_10px_30px_rgba(48,48,48,0.03)] xl:p-7 2xl:p-8">
        <div className="flex items-center justify-between text-[#707884]">
          <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-[#707884] 2xl:text-xs">
            B.Sc. HHA Results
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E6E2D8] bg-[#F7F5F0] text-emerald-600 2xl:h-10 2xl:w-10">
            <GraduationCap className="h-4 w-4 2xl:h-5 2xl:w-5" />
          </div>
        </div>
        {isLoading ? (
          <div className="mt-4 h-9 w-16 animate-pulse rounded-md bg-[#E6E2D8]/70 sm:h-10 sm:w-20 2xl:h-12 2xl:w-24" />
        ) : (
          <div className="mt-4 font-serif text-3xl font-normal tracking-tight text-emerald-700 md:text-4xl 2xl:text-5xl">
            {bscCount}
          </div>
        )}
        <div className="mt-3 flex items-center justify-between border-t border-[#E6E2D8] pt-3 font-sans text-[11px] text-[#707884] 2xl:text-xs">
          <span>Semesters I through VI</span>
          <span className="font-medium text-emerald-700">Degree</span>
        </div>
      </div>

      {/* 3. Diploma Results */}
      <div className="rounded-2xl border border-[#E6E2D8] bg-[#FFFFFF] p-6 shadow-[0_10px_30px_rgba(48,48,48,0.03)] xl:p-7 2xl:p-8">
        <div className="flex items-center justify-between text-[#707884]">
          <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-[#707884] 2xl:text-xs">
            Diploma Courses
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E6E2D8] bg-[#F7F5F0] text-[#303030] 2xl:h-10 2xl:w-10">
            <BookOpen className="h-4 w-4 2xl:h-5 2xl:w-5" />
          </div>
        </div>
        {isLoading ? (
          <div className="mt-4 h-9 w-16 animate-pulse rounded-md bg-[#E6E2D8]/70 sm:h-10 sm:w-20 2xl:h-12 2xl:w-24" />
        ) : (
          <div className="mt-4 font-serif text-3xl font-normal tracking-tight text-[#303030] md:text-4xl 2xl:text-5xl">
            {diplomaCount}
          </div>
        )}
        <div className="mt-3 flex items-center justify-between border-t border-[#E6E2D8] pt-3 font-sans text-[11px] text-[#707884] 2xl:text-xs">
          <span>DFP, DFBS & Front Office</span>
          <span className="font-medium text-[#303030]">Diploma</span>
        </div>
      </div>

      {/* 4. New Result Badges */}
      <div className="rounded-2xl border border-[#E6E2D8] bg-[#FFFFFF] p-6 shadow-[0_10px_30px_rgba(48,48,48,0.03)] xl:p-7 2xl:p-8">
        <div className="flex items-center justify-between text-[#707884]">
          <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-[#707884] 2xl:text-xs">
            New Result Badges
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E6E2D8] bg-[#F7F5F0] text-[#E85D04] 2xl:h-10 2xl:w-10">
            <Sparkles className="h-4 w-4 2xl:h-5 2xl:w-5" />
          </div>
        </div>
        {isLoading ? (
          <div className="mt-4 h-9 w-16 animate-pulse rounded-md bg-[#E6E2D8]/70 sm:h-10 sm:w-20 2xl:h-12 2xl:w-24" />
        ) : (
          <div className="mt-4 font-serif text-3xl font-normal tracking-tight text-[#303030] md:text-4xl 2xl:text-5xl">
            {newBadgeCount}
          </div>
        )}
        <div className="mt-3 flex items-center justify-between border-t border-[#E6E2D8] pt-3 font-sans text-[11px] text-[#707884] 2xl:text-xs">
          <span>Pinned as recent release</span>
          <span className="font-medium text-[#E85D04]">Highlighted</span>
        </div>
      </div>
    </div>
  );
});

ResultStatsGrid.displayName = 'ResultStatsGrid';

export default ResultStatsGrid;