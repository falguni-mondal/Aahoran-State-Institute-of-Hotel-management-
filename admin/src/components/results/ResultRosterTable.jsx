import React from 'react';
import {
  Award,
  Sparkles,
  Eye,
  EyeOff,
  ExternalLink,
  Edit3,
  Trash2,
  Link2,
} from 'lucide-react';

const SEM_MAP = {
  '1': 'Sem I',
  '2': 'Sem II',
  '3': 'Sem III',
  '4': 'Sem IV',
  '5': 'Sem V',
  '6': 'Sem VI',
  none: '—',
};

const ResultRosterTable = ({
  filteredResults = [],
  isLoading = false,
  onEditResult,
  onDeleteResult,
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
              <th scope="col" className="py-4 pl-6 pr-4">Record ID</th>
              <th scope="col" className="py-4 px-4">Program & Sem</th>
              <th scope="col" className="py-4 px-4">Session</th>
              <th scope="col" className="py-4 px-4">Result Headline</th>
              <th scope="col" className="py-4 px-4">Exam Type</th>
              <th scope="col" className="py-4 px-4">New Badge</th>
              <th scope="col" className="py-4 px-4">Visibility</th>
              <th scope="col" className="py-4 px-4">PDF Sheet</th>
              <th scope="col" className="py-4 pr-6 text-right">Directive</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#E6E2D8]/60 text-[#303030]">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={`result-skeleton-${index}`} className="animate-pulse bg-[#FFFFFF]">
                  <td className="py-4 pl-6 pr-4"><div className="h-4 w-20 rounded bg-[#E6E2D8]/70" /></td>
                  <td className="py-4 px-4"><div className="h-5 w-24 rounded bg-[#E6E2D8]/60" /></td>
                  <td className="py-4 px-4"><div className="h-4 w-20 rounded bg-[#E6E2D8]/60" /></td>
                  <td className="py-4 px-4"><div className="h-4 w-64 rounded bg-[#E6E2D8]/70" /></td>
                  <td className="py-4 px-4"><div className="h-5 w-20 rounded bg-[#E6E2D8]/60" /></td>
                  <td className="py-4 px-4"><div className="h-6 w-24 rounded-full bg-[#E6E2D8]/70" /></td>
                  <td className="py-4 px-4"><div className="h-6 w-24 rounded-full bg-[#E6E2D8]/60" /></td>
                  <td className="py-4 px-4"><div className="h-6 w-24 rounded-lg bg-[#E6E2D8]/60" /></td>
                  <td className="py-4 pr-6 text-right"><div className="ml-auto h-7 w-28 rounded-xl bg-[#E6E2D8]/60" /></td>
                </tr>
              ))
            ) : filteredResults.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-16 text-center text-[#707884]">
                  <Award className="mx-auto h-8 w-8 text-[#D5CEBF] 2xl:h-10 2xl:w-10" />
                  <span className="mt-3 block font-serif text-base font-normal text-[#303030] sm:text-lg 2xl:text-xl">
                    No Matching Result Records Found
                  </span>
                  <span className="mt-1 block font-sans text-xs text-[#707884] sm:text-sm 2xl:text-base">
                    Adjust program filters or publish a new examination result sheet above.
                  </span>
                </td>
              </tr>
            ) : (
              filteredResults.map((result, index) => {
                const targetId = result._id || result.id;
                const isDeleting = deletingId === targetId;
                const isTogglingNew = togglingId === `${targetId}-isNew`;
                const isTogglingActive = togglingId === `${targetId}-isActive`;

                return (
                  <tr
                    key={targetId || index}
                    className="group transition-colors hover:bg-[#F7F5F0]/60"
                  >
                    <td className="py-4 pl-6 pr-4 font-mono font-medium text-[#707884] whitespace-nowrap 2xl:text-sm">
                      {result.recordCode || `RES-${targetId.toString().slice(-4).toUpperCase()}`}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="rounded-lg border border-[#E6E2D8] bg-[#F7F5F0] px-2.5 py-0.5 text-[11px] font-semibold uppercase text-[#303030]">
                          {result.programType === 'bsc' ? 'B.Sc. HHA' : 'Diploma'}
                        </span>
                        {result.programType === 'bsc' && (
                          <span className="font-mono text-xs text-[#707884]">
                            {SEM_MAP[result.semesterId] || '—'}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono text-xs text-[#303030] whitespace-nowrap 2xl:text-sm">
                      {result.sessionLabel || result.sessionId}
                    </td>

                    <td className="py-4 px-4 font-medium text-[#303030] max-w-[240px] sm:max-w-[300px] xl:max-w-[400px]">
                      <p className="line-clamp-2 leading-snug" title={result.title}>
                        {result.title}
                      </p>
                      {result.verificationLabel && (
                        <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-normal text-[#E85D04]">
                          <Link2 className="h-3 w-3" />
                          <span className="truncate max-w-[220px]">{result.verificationLabel}</span>
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                          result.examType === 'Regular'
                            ? 'border border-[#E6E2D8] bg-[#F7F5F0] text-[#303030]'
                            : 'border border-[#E85D04]/30 bg-[#E85D04]/10 text-[#E85D04]'
                        }`}
                      >
                        {result.examType || result.type}
                      </span>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <button
                        type="button"
                        disabled={isTogglingNew}
                        onClick={() => onQuickToggle?.(result, 'isNew')}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium transition-all sm:text-[11px] disabled:opacity-50 ${
                          result.isNew
                            ? 'border border-[#E85D04]/30 bg-[#E85D04]/10 text-[#E85D04]'
                            : 'border border-[#E6E2D8] bg-[#F7F5F0] text-[#707884] hover:text-[#303030]'
                        }`}
                      >
                        <Sparkles className="h-3 w-3" />
                        <span>{result.isNew ? 'New Result' : 'Standard'}</span>
                      </button>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <button
                        type="button"
                        disabled={isTogglingActive}
                        onClick={() => onQuickToggle?.(result, 'isActive')}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium transition-all sm:text-[11px] disabled:opacity-50 ${
                          result.isActive
                            ? 'border border-emerald-200 bg-emerald-50 text-emerald-800'
                            : 'border border-amber-200 bg-amber-50 text-amber-800'
                        }`}
                      >
                        {result.isActive ? (
                          <Eye className="h-3 w-3 text-emerald-600" />
                        ) : (
                          <EyeOff className="h-3 w-3 text-amber-600" />
                        )}
                        <span>{result.isActive ? 'Published' : 'Draft'}</span>
                      </button>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#E6E2D8] bg-[#FFFFFF] px-2.5 py-1 text-[11px] font-medium text-[#707884] transition-all hover:border-[#D5CEBF] hover:bg-[#F7F5F0] hover:text-[#E85D04] sm:text-xs"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>Inspect PDF</span>
                      </a>
                    </td>

                    <td className="py-4 pr-6 text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onEditResult?.(result)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-[#E6E2D8] bg-[#FFFFFF] px-3 py-1.5 text-xs text-[#303030] transition-all hover:border-[#E85D04] hover:bg-[#F7F5F0] hover:text-[#E85D04]"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteResult?.(result)}
                          disabled={isDeleting}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-[#E6E2D8] bg-[#FFFFFF] px-3 py-1.5 text-xs text-[#707884] transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-40"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>{isDeleting ? 'Purging...' : 'Purge'}</span>
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

export default ResultRosterTable;