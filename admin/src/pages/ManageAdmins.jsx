import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { UserPlus, RefreshCw, ShieldAlert } from 'lucide-react';
import apiClient from '../api/axios.js';
import { selectCurrentUser } from '../store/features/authSlice.js';
import { useLenis } from '../providers/SmoothScrollProvider.jsx';

// Dedicated Admin Components
import AdminStatsGrid from '../components/admins/AdminStatsGrid.jsx';
import AdminFilterBar from '../components/admins/AdminFilterBar.jsx';
import AdminRosterTable from '../components/admins/AdminRosterTable.jsx';
import ProvisionAdminModal from '../components/admins/ProvisionAdminModal.jsx';

const ManageAdmins = () => {
  const lenis = useLenis();
  const currentUser = useSelector(selectCurrentUser);

  const [admins, setAdmins] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [revokingId, setRevokingId] = useState(null);

  // Animation References
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const statsGridRef = useRef(null);
  const tableSectionRef = useRef(null);
  const modalRef = useRef(null);

  // Fetch real administrative roster from MongoDB
  const fetchAdmins = useCallback(async (manualSync = false) => {
    if (manualSync) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setErrorMessage(null);

    try {
      const response = await apiClient.get('/admins');
      if (response.data && Array.isArray(response.data.admins)) {
        setAdmins(response.data.admins);
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message ||
          'Failed to synchronize administrative personnel roster from server.'
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins(false);
  }, [fetchAdmins]);

  // Filtered Administrative Roster Memoization
  const filteredAdmins = useMemo(() => {
    return admins.filter((admin) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        admin.email.toLowerCase().includes(query) ||
        admin.id?.toLowerCase().includes(query) ||
        admin._id?.toLowerCase().includes(query);

      const matchesRole = roleFilter === 'ALL' || admin.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [admins, searchQuery, roleFilter]);

  // Unified Page Entrance: Everything enters in ONE coordinated sequence on mount
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // 1. Header action strip
      tl.fromTo(
        headerRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.38 }
      )
        // 2. Stat cards cascade
        .fromTo(
          statsGridRef.current?.children || [],
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.38, stagger: 0.04 },
          '-=0.2'
        )
        // 3. Filter Bar & Table enter together as a unified lower section
        .fromTo(
          tableSectionRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.38 },
          '-=0.15'
        );
    },
    { scope: containerRef }
  );

  // Lenis Scroll-Lock and Modal Transition
  useEffect(() => {
    if (isProvisionModalOpen) {
      if (lenis) lenis.stop();
      if (modalRef.current) {
        gsap.fromTo(
          modalRef.current,
          { opacity: 0, scale: 0.95, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'power3.out' }
        );
      }
    } else {
      if (lenis) lenis.start();
    }
  }, [isProvisionModalOpen, lenis]);

  const handleAdminProvisioned = (newAdmin) => {
    setAdmins((prev) => [newAdmin, ...prev]);
  };

  const handleRevokeAdmin = async (targetId) => {
    if (!targetId || revokingId) return;

    const confirmed = window.confirm(
      'Are you sure you want to revoke this administrator? All active sessions and privileges will be immediately purged.'
    );
    if (!confirmed) return;

    setRevokingId(targetId);
    setErrorMessage(null);

    try {
      await apiClient.delete(`/admins/${targetId}`);
      setAdmins((prev) =>
        prev.filter((item) => item._id !== targetId && item.id !== targetId)
      );
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to revoke administrator credentials.'
      );
    } finally {
      setRevokingId(null);
    }
  };

  return (
    <div ref={containerRef} className="space-y-6 2xl:space-y-8">
      {/* Header & Actions */}
      <div
        ref={headerRef}
        className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
      >
        <div>
          <h2 className="font-serif text-2xl font-normal tracking-tight text-[#303030] sm:text-2xl md:text-3xl 2xl:text-4xl">
            Personnel <span className="italic text-[#E85D04]">Registry</span>
          </h2>
          <p className="mt-1 font-sans text-xs text-[#707884] sm:text-xs md:text-sm 2xl:text-base">
            Manage administrative clearances, evaluate multi-factor compliance, and onboard staff.
          </p>
        </div>

        <div className="flex w-full items-center justify-end gap-2.5 sm:w-auto sm:gap-3">
          <button
            onClick={() => fetchAdmins(true)}
            disabled={isRefreshing || isLoading}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#E6E2D8] bg-[#FFFFFF] px-3.5 py-2 font-sans text-xs text-[#707884] transition-all hover:border-[#D5CEBF] hover:bg-[#F7F5F0] hover:text-[#303030] disabled:opacity-50 sm:flex-initial sm:text-xs md:text-sm 2xl:px-4 2xl:py-2.5 2xl:text-base"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${
                isRefreshing ? 'animate-spin text-[#E85D04]' : ''
              }`}
            />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Roster'}</span>
          </button>

          <button
            onClick={() => setIsProvisionModalOpen(true)}
            className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#303030] px-4 py-2 font-sans text-xs font-medium uppercase tracking-wider text-[#F7F5F0] transition-all hover:bg-[#E85D04] sm:flex-initial sm:text-xs md:text-sm 2xl:px-5 2xl:py-2.5 2xl:text-base"
          >
            <UserPlus className="h-4 w-4 transition-transform group-hover:scale-110 2xl:h-5 2xl:w-5" />
            <span>Add New Admin</span>
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

      {/* Metrics Grid */}
      <AdminStatsGrid
        ref={statsGridRef}
        admins={admins}
        isLoading={isLoading}
      />

      {/* Unified Lower Section: Filter Bar & Roster Table */}
      <div ref={tableSectionRef} className="space-y-4 sm:space-y-5">
        <AdminFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
        />

        <AdminRosterTable
          filteredAdmins={filteredAdmins}
          currentUserEmail={currentUser?.email}
          isLoading={isLoading}
          onRevokeAdmin={handleRevokeAdmin}
          revokingId={revokingId}
        />
      </div>

      {/* Admin Onboarding Modal */}
      <ProvisionAdminModal
        ref={modalRef}
        isOpen={isProvisionModalOpen}
        onClose={() => setIsProvisionModalOpen(false)}
        onAdminProvisioned={handleAdminProvisioned}
      />
    </div>
  );
};

export default ManageAdmins;