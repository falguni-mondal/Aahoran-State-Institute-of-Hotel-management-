import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { RefreshCw, Download, ShieldAlert } from 'lucide-react';
import apiClient from '../api/axios.js';
import { useLenis } from '../providers/SmoothScrollProvider.jsx';

// Dedicated Audit Components
import AuditFilterBar from '../components/audit/AuditFilterBar.jsx';
import AuditLogTable from '../components/audit/AuditLogTable.jsx';
import AuditDetailModal from '../components/audit/AuditDetailModal.jsx';

// Standard action directives registered in the audit schema
const BASE_ACTIONS = [
  'ALL',
  'LOGIN_SUCCESS',
  'LOGIN_FAILED',
  'LOGOUT',
  '2FA_SETUP_INITIATED',
  '2FA_SETUP_COMPLETED',
  '2FA_VERIFIED',
  '2FA_FAILED',
  'REFRESH_TOKEN_ROTATED',
  'REFRESH_TOKEN_REUSE_DETECTED',
  'SESSION_REVOKED',
  'ADMIN_PROVISIONED',
  'ACCOUNT_LOCKED',
];

const AuditLogs = () => {
  const lenis = useLenis();

  const [logs, setLogs] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedAction, setSelectedAction] = useState('ALL');
  const [selectedLog, setSelectedLog] = useState(null);
  const [copiedHash, setCopiedHash] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Animation References
  const containerRef = useRef(null);
  const tableRowsRef = useRef([]);
  const modalRef = useRef(null);

  // Fetch verified ledger logs from MongoDB with server-side query filters
  const fetchAuditLogs = useCallback(
    async (manualSync = false) => {
      if (manualSync) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setErrorMessage(null);

      try {
        const params = {
          limit: 100,
          page: 1,
        };

        if (selectedStatus !== 'ALL') {
          params.status = selectedStatus;
        }

        if (selectedAction !== 'ALL') {
          params.action = selectedAction;
        }

        if (searchQuery.trim()) {
          params.search = searchQuery.trim();
        }

        const response = await apiClient.get('/audit-logs', { params });

        if (response.data && Array.isArray(response.data.logs)) {
          setLogs(response.data.logs);
          setTotalCount(response.data.total ?? response.data.logs.length);
        }
      } catch (err) {
        setErrorMessage(
          err.response?.data?.message ||
            'Failed to synchronize cryptographic audit ledger from server.'
        );
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [searchQuery, selectedStatus, selectedAction]
  );

  // Debounced search & filter synchronization (300ms throttle)
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchAuditLogs(false);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [fetchAuditLogs]);

  // Aggregate unique action choices dynamically
  const uniqueActions = useMemo(() => {
    const liveActions = logs.map((item) => item.action);
    return Array.from(new Set([...BASE_ACTIONS, ...liveActions]));
  }, [logs]);

  // Staggered Table Rows Animation
  useGSAP(
    () => {
      const rows = tableRowsRef.current.filter(Boolean);
      if (rows.length === 0) return;

      gsap.fromTo(
        rows,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          stagger: 0.03,
          ease: 'power2.out',
        }
      );
    },
    { scope: containerRef, dependencies: [logs] }
  );

  // Lenis Scroll-Lock and Modal Transition
  useEffect(() => {
    if (selectedLog) {
      if (lenis) lenis.stop();
      if (modalRef.current) {
        gsap.fromTo(
          modalRef.current,
          { opacity: 0, scale: 0.96, y: 15 },
          { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'power3.out' }
        );
      }
    } else {
      if (lenis) lenis.start();
    }
  }, [selectedLog, lenis]);

  const handleCopyHash = async (hashString, logId) => {
    try {
      await navigator.clipboard.writeText(hashString);
      setCopiedHash(logId);
      setTimeout(() => setCopiedHash(null), 2000);
    } catch {
      setCopiedHash(logId);
      setTimeout(() => setCopiedHash(null), 2000);
    }
  };

  const handleExportJSON = () => {
    if (logs.length === 0) return;

    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `SIHM_AUDIT_LEDGER_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div ref={containerRef} className="space-y-6 2xl:space-y-8">
      {/* Action Strip: Header Sync & Export */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-serif text-2xl font-normal tracking-tight text-[#303030] sm:text-2xl md:text-3xl 2xl:text-4xl">
            Ledger <span className="italic text-[#E85D04]">Explorer</span>
          </h2>
          <p className="mt-1 font-sans text-xs text-[#707884] sm:text-xs md:text-sm 2xl:text-base">
            Inspect tamper-evident records, forensic origins, and cryptographic payload digests
            {totalCount > 0 && (
              <span className="ml-1.5 font-medium text-[#303030]">
                ({totalCount.toLocaleString()} total committed)
              </span>
            )}
          </p>
        </div>

        <div className="flex w-full items-center justify-end gap-2.5 sm:w-auto sm:gap-3">
          <button
            onClick={() => fetchAuditLogs(true)}
            disabled={isRefreshing || isLoading}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#E6E2D8] bg-[#FFFFFF] px-3.5 py-2 font-sans text-xs text-[#707884] transition-all hover:border-[#D5CEBF] hover:bg-[#F7F5F0] hover:text-[#303030] disabled:opacity-50 sm:flex-initial sm:text-xs md:text-sm 2xl:px-4 2xl:py-2.5 2xl:text-base"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${
                isRefreshing ? 'animate-spin text-[#E85D04]' : ''
              }`}
            />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Stream'}</span>
          </button>

          <button
            onClick={handleExportJSON}
            disabled={logs.length === 0}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#303030] px-4 py-2 font-sans text-xs font-medium uppercase tracking-wider text-[#F7F5F0] transition-all hover:bg-[#E85D04] disabled:opacity-50 sm:flex-initial sm:text-xs md:text-sm 2xl:px-5 2xl:py-2.5 2xl:text-base"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Network Error Banner */}
      {errorMessage && (
        <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50/80 p-3.5 text-xs text-rose-800 sm:text-sm">
          <ShieldAlert className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Filter Bar */}
      <AuditFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedAction={selectedAction}
        setSelectedAction={setSelectedAction}
        uniqueActions={uniqueActions}
      />

      {/* Immutable Table */}
      <AuditLogTable
        logs={logs}
        filteredLogs={logs}
        isLoading={isLoading}
        onSelectLog={setSelectedLog}
        onCopyHash={handleCopyHash}
        copiedHash={copiedHash}
        tableRowsRef={tableRowsRef}
      />

      {/* Detail Inspector Modal */}
      <AuditDetailModal
        ref={modalRef}
        selectedLog={selectedLog}
        onClose={() => setSelectedLog(null)}
        onCopyHash={handleCopyHash}
        copiedHash={copiedHash}
      />
    </div>
  );
};

export default AuditLogs;