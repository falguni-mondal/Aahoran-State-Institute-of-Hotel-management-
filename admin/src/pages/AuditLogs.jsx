import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { RefreshCw, Download } from 'lucide-react';
import apiClient from '../api/axios.js';
import {
  logOut,
  selectCurrentUser,
  selectCurrentRole,
} from '../store/features/authSlice.js';
import { useLenis } from '../providers/SmoothScrollProvider.jsx';

// Shared Layout Components
import Sidebar from '../components/layout/Sidebar.jsx';
import Topbar from '../components/layout/Topbar.jsx';

// Dedicated Audit Components
import AuditFilterBar from '../components/audit/AuditFilterBar.jsx';
import AuditLogTable from '../components/audit/AuditLogTable.jsx';
import AuditDetailModal from '../components/audit/AuditDetailModal.jsx';

const INITIAL_AUDIT_LOGS = [
  {
    id: 'AUD-994201',
    timestamp: '2026-10-07T06:28:14.912Z',
    action: 'SESSION_ROTATED',
    actor: 'superadmin@sihm.gov.in',
    target: '/api/v1/auth/refresh',
    status: 'SUCCESS',
    ipAddress: '192.168.1.104',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    metadata: {
      sessionFamilyId: 'fam_88f9a2',
      rotationCycle: 4,
      issuedExpiry: '15m',
    },
  },
  {
    id: 'AUD-994200',
    timestamp: '2026-10-07T06:14:02.108Z',
    action: '2FA_VERIFIED',
    actor: 'superadmin@sihm.gov.in',
    target: '/api/v1/auth/verify-2fa',
    status: 'SUCCESS',
    ipAddress: '192.168.1.104',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    hash: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0',
    metadata: {
      strategy: 'TOTP_RFC6238',
      windowSkew: '0s',
      elevationGranted: 'SuperAdmin',
    },
  },
  {
    id: 'AUD-994199',
    timestamp: '2026-10-07T05:58:44.200Z',
    action: 'ADMIN_PROVISIONED',
    actor: 'superadmin@sihm.gov.in',
    target: '/api/v1/auth/create-admin',
    status: 'SUCCESS',
    ipAddress: '10.0.4.12',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    hash: '7d793037a0760186574b0282f2f435e70d63b558f786ee4b67d5e4cfbf6e65b4',
    metadata: {
      assignedRole: 'Admin',
      newAdminIdentifier: 'finance_lead@sihm.gov.in',
      mfaRequirementEnforced: true,
    },
  },
  {
    id: 'AUD-994198',
    timestamp: '2026-10-07T04:45:10.820Z',
    action: 'LOGIN_ATTEMPT',
    actor: 'unknown_probe@sihm.gov.in',
    target: '/api/v1/auth/login',
    status: 'FLAGGED',
    ipAddress: '185.220.101.5',
    userAgent: 'Python-urllib/3.10',
    hash: '4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945',
    metadata: {
      threatAssessment: 'SUSPICIOUS_UA_ANOMALY',
      geoOrigin: 'Tor Exit Node Proxy',
      blockedByRateLimiter: true,
    },
  },
  {
    id: 'AUD-994197',
    timestamp: '2026-10-07T03:12:00.044Z',
    action: 'CONFIG_MUTATED',
    actor: 'superadmin@sihm.gov.in',
    target: '/api/v1/system/security-headers',
    status: 'SUCCESS',
    ipAddress: '192.168.1.104',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    metadata: {
      cspDirective: "default-src 'self'",
      hstsMaxAge: '31536000',
    },
  },
  {
    id: 'AUD-994196',
    timestamp: '2026-10-06T22:30:15.512Z',
    action: 'SESSION_REVOKED',
    actor: 'academic_head@sihm.gov.in',
    target: '/api/v1/auth/logout',
    status: 'SUCCESS',
    ipAddress: '172.16.20.15',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
    hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    metadata: {
      reason: 'USER_INITIATED_LOGOUT',
      sessionCookiePurged: true,
    },
  },
  {
    id: 'AUD-994195',
    timestamp: '2026-10-06T18:05:40.320Z',
    action: 'PASS_CHALLENGE_FAILED',
    actor: 'external_probe@gov.in',
    target: '/api/v1/auth/verify-2fa',
    status: 'FAILURE',
    ipAddress: '198.51.100.42',
    userAgent: 'Go-http-client/1.1',
    hash: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
    metadata: {
      attemptCount: 3,
      totpWindowDeviation: '+90s',
      accountLocked: false,
    },
  },
];

const AuditLogs = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const lenis = useLenis();

  const currentUser = useSelector(selectCurrentUser);
  const userRole = useSelector(selectCurrentRole) || 'Admin';
  const isSuperAdmin = userRole === 'SuperAdmin';

  const [logs, setLogs] = useState(INITIAL_AUDIT_LOGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedAction, setSelectedAction] = useState('ALL');
  const [selectedLog, setSelectedLog] = useState(null);
  const [copiedHash, setCopiedHash] = useState(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Animation References
  const containerRef = useRef(null);
  const tableRowsRef = useRef([]);
  const modalRef = useRef(null);

  // Fetch live logs from backend with state fallback
  const fetchAuditLogs = async () => {
    setIsRefreshing(true);
    try {
      const response = await apiClient.get('/audit-logs');
      if (response.data && Array.isArray(response.data.logs)) {
        setLogs(response.data.logs);
      }
    } catch {
      // Retain zero-trust fallback records
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  // Filtered dataset memoization
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.ipAddress.includes(searchQuery) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === 'ALL' || log.status === selectedStatus;

      const matchesAction =
        selectedAction === 'ALL' || log.action === selectedAction;

      return matchesSearch && matchesStatus && matchesAction;
    });
  }, [logs, searchQuery, selectedStatus, selectedAction]);

  // Staggered Table Rows Animation
  useGSAP(
    () => {
      const rows = tableRowsRef.current.filter(Boolean);
      if (rows.length === 0) return;

      gsap.fromTo(
        rows,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          stagger: 0.04,
          ease: 'power2.out',
        }
      );
    },
    { scope: containerRef, dependencies: [filteredLogs] }
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
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(filteredLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `SIHM_AUDIT_TRAIL_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Clear client state even if network fails
    } finally {
      dispatch(logOut());
      navigate('/login', { replace: true });
    }
  };

  const uniqueActions = ['ALL', ...new Set(logs.map((item) => item.action))];

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-screen w-full flex-col bg-[#F7F5F0] font-sans text-[#303030] lg:flex-row"
    >
      {/* Background Watermark Pattern */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(#E6E2D8_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(232,93,4,0.03),transparent_50%)]" />

      {/* 1. Shared Navigation Sidebar */}
      <Sidebar
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        currentUser={currentUser}
        userRole={userRole}
        isSuperAdmin={isSuperAdmin}
        onLogout={handleLogout}
        isLoggingOut={isLoggingOut}
      />

      {/* 2. Main Workspace */}
      <main className="relative z-10 flex min-h-screen flex-1 flex-col overflow-y-auto">
        <Topbar
          onOpenMobileNav={() => setIsMobileNavOpen(true)}
          title="Security Audit Logs"
          subtitle="CRYPTOGRAPHIC SYSTEM AUDIT / ZERO-TRUST LOG"
        />

        {/* Dynamic Content Canvas */}
        <div className="flex-1 space-y-6 p-4 sm:p-6 md:p-8 lg:p-8 xl:p-10 2xl:space-y-8 2xl:p-14">
          {/* Action Strip: Header Sync & Export */}
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-serif text-2xl font-normal tracking-tight text-[#303030] sm:text-2xl md:text-3xl 2xl:text-4xl">
                Ledger <span className="italic text-[#E85D04]">Explorer</span>
              </h2>
              <p className="mt-1 font-sans text-xs text-[#707884] sm:text-xs md:text-sm 2xl:text-base">
                Inspect tamper-evident records, forensic origins, and cryptographic payload digests.
              </p>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3">
              <button
                onClick={fetchAuditLogs}
                disabled={isRefreshing}
                className="flex items-center gap-1.5 rounded-xl border border-[#E6E2D8] bg-[#FFFFFF] px-3.5 py-2 font-sans text-xs text-[#707884] transition-all hover:border-[#D5CEBF] hover:bg-[#F7F5F0] hover:text-[#303030] disabled:opacity-50 sm:text-xs md:text-sm 2xl:px-4 2xl:py-2.5 2xl:text-base"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${
                    isRefreshing ? 'animate-spin text-[#E85D04]' : ''
                  }`}
                />
                <span>Sync Stream</span>
              </button>

              <button
                onClick={handleExportJSON}
                className="flex items-center gap-1.5 rounded-xl bg-[#303030] px-4 py-2 font-sans text-xs font-medium uppercase tracking-wider text-[#F7F5F0] transition-all hover:bg-[#E85D04] sm:text-xs md:text-sm 2xl:px-5 2xl:py-2.5 2xl:text-base"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export JSON</span>
              </button>
            </div>
          </div>

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
            filteredLogs={filteredLogs}
            onSelectLog={setSelectedLog}
            onCopyHash={handleCopyHash}
            copiedHash={copiedHash}
            tableRowsRef={tableRowsRef}
          />
        </div>
      </main>

      {/* 3. Detail Inspector Modal */}
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