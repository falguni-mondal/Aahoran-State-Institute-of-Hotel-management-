import React, { forwardRef } from 'react';
import { ScrollText, GraduationCap, History, BookMarked } from 'lucide-react';

const SyllabusStatsGrid = forwardRef(({ syllabi = [], isLoading = false }, ref) => {
  const totalCount = syllabi.length;
  const jnuCount = syllabi.filter((s) => s.tabId === 'jnu').length;
  const ignouCount = syllabi.filter((s) => s.tabId === 'ignou').length;
  const diplomaCount = syllabi.filter((s) => s.categoryGroup === 'diploma').length;

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 2xl:gap-6"
    >
      <div className="rounded-2xl border border-[#E6E2D8] bg-[#FFFFFF] p-6 shadow-[0_10px_30px_rgba(48,48,48,0.03)] 2xl:p-8">
        <div className="flex items-center justify-between text-[#707884]">
          <span className="font-sans text-[11px] font-semibold uppercase tracking-wider">
            Total Curricula
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E6E2D8] bg-[#F7F5F0] text-[#E85D04]">
            <ScrollText className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-4 font-serif text-3xl text-[#303030] md:text-4xl 2xl:text-5xl">
          {isLoading ? '—' : totalCount}
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-[#E6E2D8] pt-3 font-sans text-[11px] text-[#707884]">
          <span>Official syllabus PDFs</span>
          <span className="font-medium text-[#303030]">Archive</span>
        </div>
      </div>

      <div className="rounded-2xl border border-[#E6E2D8] bg-[#FFFFFF] p-6 shadow-[0_10px_30px_rgba(48,48,48,0.03)] 2xl:p-8">
        <div className="flex items-center justify-between text-[#707884]">
          <span className="font-sans text-[11px] font-semibold uppercase tracking-wider">
            JNU (New Curriculum)
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E6E2D8] bg-[#F7F5F0] text-emerald-600">
            <GraduationCap className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-4 font-serif text-3xl text-emerald-700 md:text-4xl 2xl:text-5xl">
          {isLoading ? '—' : jnuCount}
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-[#E6E2D8] pt-3 font-sans text-[11px] text-[#707884]">
          <span>Effective Since 2023</span>
          <span className="font-medium text-emerald-700">JNU</span>
        </div>
      </div>

      <div className="rounded-2xl border border-[#E6E2D8] bg-[#FFFFFF] p-6 shadow-[0_10px_30px_rgba(48,48,48,0.03)] 2xl:p-8">
        <div className="flex items-center justify-between text-[#707884]">
          <span className="font-sans text-[11px] font-semibold uppercase tracking-wider">
            IGNOU (Legacy)
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E6E2D8] bg-[#F7F5F0] text-[#707884]">
            <History className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-4 font-serif text-3xl text-[#303030] md:text-4xl 2xl:text-5xl">
          {isLoading ? '—' : ignouCount}
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-[#E6E2D8] pt-3 font-sans text-[11px] text-[#707884]">
          <span>Batches Till 2023</span>
          <span className="font-medium text-[#707884]">IGNOU</span>
        </div>
      </div>

      <div className="rounded-2xl border border-[#E6E2D8] bg-[#FFFFFF] p-6 shadow-[0_10px_30px_rgba(48,48,48,0.03)] 2xl:p-8">
        <div className="flex items-center justify-between text-[#707884]">
          <span className="font-sans text-[11px] font-semibold uppercase tracking-wider">
            Diploma Syllabi
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E6E2D8] bg-[#F7F5F0] text-[#E85D04]">
            <BookMarked className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-4 font-serif text-3xl text-[#303030] md:text-4xl 2xl:text-5xl">
          {isLoading ? '—' : diplomaCount}
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-[#E6E2D8] pt-3 font-sans text-[11px] text-[#707884]">
          <span>Trade diploma programs</span>
          <span className="font-medium text-[#E85D04]">Diploma</span>
        </div>
      </div>
    </div>
  );
});

SyllabusStatsGrid.displayName = 'SyllabusStatsGrid';

export default SyllabusStatsGrid;