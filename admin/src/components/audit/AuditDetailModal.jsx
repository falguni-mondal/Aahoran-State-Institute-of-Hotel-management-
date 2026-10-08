import React, { forwardRef } from 'react';
import { Hash, X, Copy, Check, Code2 } from 'lucide-react';

const AuditDetailModal = forwardRef(
  ({ selectedLog, onClose, onCopyHash, copiedHash }, ref) => {
    if (!selectedLog) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#303030]/40 p-4 backdrop-blur-sm sm:p-6 md:p-8 2xl:p-12">
        <div
          ref={ref}
          className="relative w-full max-w-2xl rounded-2xl border border-[#E6E2D8] bg-[#FFFFFF] p-6 shadow-2xl sm:p-8 md:max-w-2xl lg:max-w-3xl 2xl:max-w-4xl 2xl:p-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#E6E2D8] pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E6E2D8] bg-[#F7F5F0] text-[#E85D04] 2xl:h-12 2xl:w-12">
                <Hash className="h-4 w-4 2xl:h-5 2xl:w-5" />
              </div>
              <div>
                <h3 className="font-mono text-sm font-semibold tracking-wider text-[#303030] sm:text-base 2xl:text-lg">
                  {selectedLog.id}
                </h3>
                <span className="font-sans text-[10px] uppercase text-[#707884] sm:text-[11px] 2xl:text-xs">
                  TRANSACTION SIGNATURE INSPECTION
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-[#707884] transition-colors hover:bg-[#F7F5F0] hover:text-[#303030]"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Details Grid */}
          <div className="mt-6 space-y-4 font-sans text-xs sm:text-xs md:text-sm 2xl:text-base">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-[#E6E2D8] bg-[#F7F5F0]/60 p-3.5">
                <span className="text-[10px] font-semibold uppercase text-[#707884] 2xl:text-xs">
                  Directive Action
                </span>
                <div className="mt-1 font-medium text-[#303030]">
                  {selectedLog.action}
                </div>
              </div>

              <div className="rounded-xl border border-[#E6E2D8] bg-[#F7F5F0]/60 p-3.5">
                <span className="text-[10px] font-semibold uppercase text-[#707884] 2xl:text-xs">
                  Target Route
                </span>
                <div className="mt-1 font-mono font-medium text-[#E85D04]">
                  {selectedLog.target}
                </div>
              </div>

              <div className="rounded-xl border border-[#E6E2D8] bg-[#F7F5F0]/60 p-3.5">
                <span className="text-[10px] font-semibold uppercase text-[#707884] 2xl:text-xs">
                  Origin IP & Network
                </span>
                <div className="mt-1 font-mono text-[#303030]">
                  {selectedLog.ipAddress}
                </div>
              </div>

              <div className="rounded-xl border border-[#E6E2D8] bg-[#F7F5F0]/60 p-3.5">
                <span className="text-[10px] font-semibold uppercase text-[#707884] 2xl:text-xs">
                  UTC Timestamp
                </span>
                <div className="mt-1 text-[#303030]">{selectedLog.timestamp}</div>
              </div>
            </div>

            {/* SHA-256 Digest */}
            <div className="rounded-xl border border-[#E6E2D8] bg-[#F7F5F0]/60 p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase text-[#707884] 2xl:text-xs">
                  Immutable Hash Digest (SHA-256)
                </span>
                <button
                  type="button"
                  onClick={() => onCopyHash(selectedLog.hash, 'modal')}
                  className="flex items-center gap-1 font-sans text-[11px] font-semibold text-[#E85D04] hover:underline 2xl:text-xs"
                >
                  {copiedHash === 'modal' ? (
                    <>
                      <Check className="h-3 w-3" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy Full Hash</span>
                    </>
                  )}
                </button>
              </div>
              <div className="mt-2 break-all font-mono text-[11px] text-[#303030] select-all sm:text-xs 2xl:text-sm">
                {selectedLog.hash}
              </div>
            </div>

            {/* Parsed Metadata JSON */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase text-[#707884] 2xl:text-xs">
                <Code2 className="h-3 w-3 text-[#E85D04]" />
                <span>Payload Metadata & Context Vector</span>
              </div>
              <div className="max-h-48 overflow-y-auto rounded-xl border border-[#E6E2D8] bg-[#F7F5F0] p-4 font-mono text-xs text-[#303030] 2xl:max-h-60 2xl:text-sm">
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(selectedLog.metadata, null, 2)}
                </pre>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end border-t border-[#E6E2D8] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-[#303030] px-5 py-2.5 font-sans text-xs font-medium uppercase tracking-wider text-[#F7F5F0] transition-colors hover:bg-[#E85D04] sm:text-xs 2xl:py-3 2xl:text-sm"
            >
              Close Inspector
            </button>
          </div>
        </div>
      </div>
    );
  }
);

AuditDetailModal.displayName = 'AuditDetailModal';

export default AuditDetailModal;