import React from 'react';
import {
  BookOpen,
  Sparkles,
  Eye,
  EyeOff,
  ExternalLink,
  Edit3,
  Trash2,
} from 'lucide-react';

const StudyMaterialRosterTable = ({
  filteredMaterials = [],
  isLoading = false,
  onEditMaterial,
  onDeleteMaterial,
  onQuickToggle,
  togglingId = null,
  deletingId = null,
}) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E6E2D8] bg-[#FFFFFF] shadow-[0_10px_30px_rgba(48,48,48,0.03)]">
      <div className="overflow-x-auto overflow-y-hidden">
        <table className="w-full min-w-[960px] text-left font-sans text-xs sm:text-xs md:text-sm 2xl:text-base">
          <thead>
            <tr className="border-b border-[#E6E2D8] bg-[#F7F5F0]/70 text-[11px] font-semibold uppercase tracking-wider text-[#707884] 2xl:text-xs">
              <th className="py-4 pl-6 pr-4">Record ID</th>
              <th className="py-4 px-4">Program & Sem</th>
              <th className="py-4 px-4">Subject / Course</th>
              <th className="py-4 px-4">Document Title & Module</th>
              <th className="py-4 px-4">New Badge</th>
              <th className="py-4 px-4">Visibility</th>
              <th className="py-4 px-4">Document</th>
              <th className="py-4 pr-6 text-right">Directive</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#E6E2D8]/60 text-[#303030]">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={`mat-skel-${idx}`} className="animate-pulse">
                  <td className="py-4 pl-6 pr-4"><div className="h-4 w-20 rounded bg-[#E6E2D8]/70" /></td>
                  <td className="py-4 px-4"><div className="h-5 w-28 rounded bg-[#E6E2D8]/60" /></td>
                  <td className="py-4 px-4"><div className="h-4 w-36 rounded bg-[#E6E2D8]/60" /></td>
                  <td className="py-4 px-4"><div className="h-4 w-60 rounded bg-[#E6E2D8]/70" /></td>
                  <td className="py-4 px-4"><div className="h-6 w-20 rounded-full bg-[#E6E2D8]/60" /></td>
                  <td className="py-4 px-4"><div className="h-6 w-20 rounded-full bg-[#E6E2D8]/60" /></td>
                  <td className="py-4 px-4"><div className="h-6 w-20 rounded-lg bg-[#E6E2D8]/60" /></td>
                  <td className="py-4 pr-6 text-right"><div className="ml-auto h-7 w-24 rounded-xl bg-[#E6E2D8]/60" /></td>
                </tr>
              ))
            ) : filteredMaterials.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center text-[#707884]">
                  <BookOpen className="mx-auto h-8 w-8 text-[#D5CEBF]" />
                  <span className="mt-3 block font-serif text-base text-[#303030] sm:text-lg">
                    No Study Materials Found
                  </span>
                  <span className="mt-1 block font-sans text-xs text-[#707884]">
                    Adjust filters or upload a new lecture handout above.
                  </span>
                </td>
              </tr>
            ) : (
              filteredMaterials.map((mat, index) => {
                const targetId = mat._id || mat.id;
                const isDeleting = deletingId === targetId;
                const isTogglingNew = togglingId === `${targetId}-isNew`;
                const isTogglingActive = togglingId === `${targetId}-isActive`;

                return (
                  <tr key={targetId || index} className="group transition-colors hover:bg-[#F7F5F0]/60">
                    <td className="py-4 pl-6 pr-4 font-mono font-medium text-[#707884] whitespace-nowrap">
                      {mat.recordCode || `MAT-${targetId.toString().slice(-4).toUpperCase()}`}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="rounded-lg border border-[#E6E2D8] bg-[#F7F5F0] px-2.5 py-0.5 text-[11px] font-semibold uppercase text-[#303030]">
                          {mat.programType === 'bsc' ? 'B.Sc.' : 'Diploma'}
                        </span>
                        {mat.programType === 'bsc' && (
                          <span className="font-mono text-xs text-[#707884]">
                            {mat.semesterLabel}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4 font-medium text-[#303030] whitespace-nowrap">
                      {mat.subjectTitle}
                    </td>

                    <td className="py-4 px-4 max-w-[280px] xl:max-w-[380px]">
                      <p className="font-medium text-[#303030] line-clamp-1" title={mat.title}>
                        {mat.title}
                      </p>
                      {mat.programType === 'diploma' && mat.topicTitle && (
                        <span className="mt-0.5 block text-[11px] text-[#E85D04]">
                          Topic: {mat.topicTitle}
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <button
                        type="button"
                        disabled={isTogglingNew}
                        onClick={() => onQuickToggle?.(mat, 'isNew')}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium transition-all ${
                          mat.isNew
                            ? 'border border-[#E85D04]/30 bg-[#E85D04]/10 text-[#E85D04]'
                            : 'border border-[#E6E2D8] bg-[#F7F5F0] text-[#707884]'
                        }`}
                      >
                        <Sparkles className="h-3 w-3" />
                        <span>{mat.isNew ? 'New' : 'Standard'}</span>
                      </button>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <button
                        type="button"
                        disabled={isTogglingActive}
                        onClick={() => onQuickToggle?.(mat, 'isActive')}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium transition-all ${
                          mat.isActive
                            ? 'border border-emerald-200 bg-emerald-50 text-emerald-800'
                            : 'border border-amber-200 bg-amber-50 text-amber-800'
                        }`}
                      >
                        {mat.isActive ? (
                          <Eye className="h-3 w-3 text-emerald-600" />
                        ) : (
                          <EyeOff className="h-3 w-3 text-amber-600" />
                        )}
                        <span>{mat.isActive ? 'Published' : 'Draft'}</span>
                      </button>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <a
                        href={mat.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#E6E2D8] bg-[#FFFFFF] px-2.5 py-1 text-xs font-medium text-[#707884] hover:border-[#E85D04] hover:text-[#E85D04]"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>Inspect</span>
                      </a>
                    </td>

                    <td className="py-4 pr-6 text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onEditMaterial?.(mat)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-[#E6E2D8] bg-[#FFFFFF] px-3 py-1.5 text-xs text-[#303030] hover:border-[#E85D04] hover:text-[#E85D04]"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteMaterial?.(mat)}
                          disabled={isDeleting}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-[#E6E2D8] bg-[#FFFFFF] px-3 py-1.5 text-xs text-[#707884] hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-40"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>{isDeleting ? '...' : 'Purge'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudyMaterialRosterTable;