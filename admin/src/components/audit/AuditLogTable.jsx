import React, { forwardRef } from 'react';
import { Terminal, Lock, Copy, Check } from 'lucide-react';

const AuditLogTable = forwardRef(
  (
    {
      logs,
      filteredLogs,
      onSelectLog,
      onCopyHash,
      copiedHash,
      tableRowsRef,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className="overflow-hidden rounded-2xl border border-[#E6E2D8] bg-[#FFFFFF] shadow-[0_10px_30px_rgba(48,48,48,0.03)]"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left font-sans text-xs sm:text-xs md:text-sm 2xl:text-base">
            <thead>
              <tr className="border-b border-[#E6E2D8] bg-[#F7F5F0]/60 text-[11px] uppercase tracking-wider text-[#707884] sm:text-[11px] 2xl:text-xs">
                <th className="py-4 pl-6 pr-4 font-semibold">Record ID</th>
                <th className="py-4 px-4 font-semibold">Timestamp (UTC)</th>
                <th className="py-4 px-4 font-semibold">Action Directive</th>
                <th className="py-4 px-4 font-semibold">Authorized Actor</th>
                <th className="py-4 px-4 font-semibold">Origin IP</th>
                <th className="py-4 px-4 font-semibold">Status</th>
                <th className="py-4 pl-4 pr-6 text-right font-semibold">Payload Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E2D8]/60 text-[#303030]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-[#707884]">
                    <Terminal className="mx-auto h-8 w-8 text-[#D5CEBF] 2xl:h-10 2xl:w-10" />
                    <span className="mt-2 block font-sans text-xs uppercase tracking-widest text-[#707884] 2xl:text-sm">
                      No matching records located in ledger partition
                    </span>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, index) => {
                  const isFlagged = log.status === 'FLAGGED';
                  const isFailure = log.status === 'FAILURE';
                  const isSuccess = log.status === 'SUCCESS';

                  return (
                    <tr
                      key={log.id}
                      ref={(el) => {
                        if (tableRowsRef && tableRowsRef.current) {
                          tableRowsRef.current[index] = el;
                        }
                      }}
                      onClick={() => onSelectLog(log)}
                      className="group cursor-pointer transition-colors hover:bg-[#F7F5F0]/60"
                    >
                      {/* ID */}
                      <td className="py-4 pl-6 pr-4 font-mono font-semibold text-[#303030] group-hover:text-[#E85D04]">
                        {log.id}
                      </td>

                      {/* Timestamp */}
                      <td className="py-4 px-4 text-[#707884]">
                        {new Date(log.timestamp).toLocaleTimeString('en-US', {
                          hour12: false,
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </td>

                      {/* Action */}
                      <td className="py-4 px-4 font-medium text-[#303030]">
                        <span className="rounded-md border border-[#E6E2D8] bg-[#F7F5F0] px-2 py-1 text-[11px] sm:text-xs 2xl:text-sm">
                          {log.action}
                        </span>
                      </td>

                      {/* Actor */}
                      <td className="py-4 px-4 text-[#707884] truncate max-w-[180px] sm:max-w-[220px] 2xl:max-w-[280px]">
                        {log.actor}
                      </td>

                      {/* IP */}
                      <td className="py-4 px-4 font-mono text-[11px] text-[#707884] sm:text-xs 2xl:text-sm">
                        {log.ipAddress}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium sm:text-[11px] 2xl:text-xs ${
                            isSuccess
                              ? 'border border-emerald-200 bg-emerald-50 text-emerald-800'
                              : isFlagged
                              ? 'border border-amber-200 bg-amber-50 text-amber-800'
                              : 'border border-rose-200 bg-rose-50 text-rose-800'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isSuccess
                                ? 'bg-emerald-600'
                                : isFlagged
                                ? 'bg-amber-600 animate-pulse'
                                : 'bg-rose-600'
                            }`}
                          />
                          {log.status}
                        </span>
                      </td>

                      {/* SHA-256 Hash */}
                      <td className="py-4 pl-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="font-mono text-[10px] text-[#707884] sm:text-[11px] 2xl:text-xs">
                            {log.hash.slice(0, 8)}...{log.hash.slice(-6)}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onCopyHash(log.hash, log.id);
                            }}
                            className="rounded p-1 text-[#707884] transition-colors hover:bg-[#F7F5F0] hover:text-[#303030]"
                            title="Copy SHA-256 Hash"
                          >
                            {copiedHash === log.id ? (
                              <Check className="h-3.5 w-3.5 text-[#E85D04]" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
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

        {/* Footer Ledger Notice */}
        <div className="flex flex-col items-center justify-between gap-2 border-t border-[#E6E2D8] bg-[#F7F5F0]/60 px-6 py-3.5 font-sans text-[11px] text-[#707884] sm:flex-row sm:text-xs 2xl:text-sm">
          <span>
            Showing {filteredLogs.length} of {logs.length} immutable records
          </span>
          <span className="flex items-center gap-1.5 font-medium text-[#303030]">
            <Lock className="h-3 w-3 text-[#E85D04]" />
            Ledger Chain Cryptographically Validated
          </span>
        </div>
      </div>
    );
  }
);

AuditLogTable.displayName = 'AuditLogTable';

export default AuditLogTable;