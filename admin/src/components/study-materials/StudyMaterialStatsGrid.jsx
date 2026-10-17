import React, { forwardRef } from 'react';
import { BookOpen, GraduationCap, Layers, Sparkles } from 'lucide-react';

const StudyMaterialStatsGrid = forwardRef(({ materials = [], isLoading = false }, ref) => {
  const totalCount = materials.length;
  const bscCount = materials.filter((m) => m.programType === 'bsc').length;
  const diplomaCount = materials.filter((m) => m.programType === 'diploma').length;
  const uniqueSubjects = new Set(materials.map((m) => m.subjectId)).size;

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 2xl:gap-6"
    >
      <div className="rounded-2xl border border-[#E6E2D8] bg-[#FFFFFF] p-6 shadow-[0_10px_30px_rgba(48,48,48,0.03)] 2xl:p-8">
        <div className="flex items-center justify-between text-[#707884]">
          <span className="font-sans text-[11px] font-semibold uppercase tracking-wider">
            Total Study Notes
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E6E2D8] bg-[#F7F5F0] text-[#E85D04]">
            <BookOpen className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-4 font-serif text-3xl text-[#303030] md:text-4xl 2xl:text-5xl">
          {isLoading ? '—' : totalCount}
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-[#E6E2D8] pt-3 font-sans text-[11px] text-[#707884]">
          <span>Uploaded lecture handouts</span>
          <span className="font-medium text-[#303030]">Repository</span>
        </div>
      </div>

      <div className="rounded-2xl border border-[#E6E2D8] bg-[#FFFFFF] p-6 shadow-[0_10px_30px_rgba(48,48,48,0.03)] 2xl:p-8">
        <div className="flex items-center justify-between text-[#707884]">
          <span className="font-sans text-[11px] font-semibold uppercase tracking-wider">
            B.Sc. Degree Notes
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E6E2D8] bg-[#F7F5F0] text-emerald-600">
            <GraduationCap className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-4 font-serif text-3xl text-emerald-700 md:text-4xl 2xl:text-5xl">
          {isLoading ? '—' : bscCount}
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-[#E6E2D8] pt-3 font-sans text-[11px] text-[#707884]">
          <span>Semester-wise modules</span>
          <span className="font-medium text-emerald-700">B.Sc. HHA</span>
        </div>
      </div>

      <div className="rounded-2xl border border-[#E6E2D8] bg-[#FFFFFF] p-6 shadow-[0_10px_30px_rgba(48,48,48,0.03)] 2xl:p-8">
        <div className="flex items-center justify-between text-[#707884]">
          <span className="font-sans text-[11px] font-semibold uppercase tracking-wider">
            Diploma Modules
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E6E2D8] bg-[#F7F5F0] text-[#303030]">
            <Layers className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-4 font-serif text-3xl text-[#303030] md:text-4xl 2xl:text-5xl">
          {isLoading ? '—' : diplomaCount}
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-[#E6E2D8] pt-3 font-sans text-[11px] text-[#707884]">
          <span>Topic-grouped practical files</span>
          <span className="font-medium text-[#303030]">Diploma</span>
        </div>
      </div>

      <div className="rounded-2xl border border-[#E6E2D8] bg-[#FFFFFF] p-6 shadow-[0_10px_30px_rgba(48,48,48,0.03)] 2xl:p-8">
        <div className="flex items-center justify-between text-[#707884]">
          <span className="font-sans text-[11px] font-semibold uppercase tracking-wider">
            Active Subjects
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E6E2D8] bg-[#F7F5F0] text-[#E85D04]">
            <Sparkles className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-4 font-serif text-3xl text-[#303030] md:text-4xl 2xl:text-5xl">
          {isLoading ? '—' : uniqueSubjects}
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-[#E6E2D8] pt-3 font-sans text-[11px] text-[#707884]">
          <span>Distinct course subjects</span>
          <span className="font-medium text-[#E85D04]">Indexed</span>
        </div>
      </div>
    </div>
  );
});

StudyMaterialStatsGrid.displayName = 'StudyMaterialStatsGrid';

export default StudyMaterialStatsGrid;