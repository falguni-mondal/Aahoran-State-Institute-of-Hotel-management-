import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { UserPlus } from 'lucide-react';
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

// Dedicated Admin Components
import AdminStatsGrid from '../components/admins/AdminStatsGrid.jsx';
import AdminFilterBar from '../components/admins/AdminFilterBar.jsx';
import AdminRosterTable from '../components/admins/AdminRosterTable.jsx';
import ProvisionAdminModal from '../components/admins/ProvisionAdminModal.jsx';

const INITIAL_ADMIN_ROSTER = [
  {
    id: 'ADM-001',
    email: 'superadmin@sihm.gov.in',
    role: 'SuperAdmin',
    is2faEnabled: true,
    status: 'ACTIVE',
    createdAt: '2026-01-15T08:00:00.000Z',
    lastLogin: 'Just now',
    originIp: '192.168.1.104',
  },
  {
    id: 'ADM-002',
    email: 'finance_lead@sihm.gov.in',
    role: 'Admin',
    is2faEnabled: true,
    status: 'ACTIVE',
    createdAt: '2026-03-20T10:15:00.000Z',
    lastLogin: '45 mins ago',
    originIp: '10.0.4.12',
  },
  {
    id: 'ADM-003',
    email: 'academic_head@sihm.gov.in',
    role: 'Admin',
    is2faEnabled: true,
    status: 'ACTIVE',
    createdAt: '2026-05-12T14:30:00.000Z',
    lastLogin: '2 hours ago',
    originIp: '172.16.20.18',
  },
  {
    id: 'ADM-004',
    email: 'registrar_staff@sihm.gov.in',
    role: 'Admin',
    is2faEnabled: false,
    status: 'PENDING_2FA',
    createdAt: '2026-09-02T11:45:00.000Z',
    lastLogin: 'Never',
    originIp: 'Unassigned',
  },
];

const ManageAdmins = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const lenis = useLenis();

  const currentUser = useSelector(selectCurrentUser);
  const userRole = useSelector(selectCurrentRole) || 'SuperAdmin';
  const isSuperAdmin = userRole === 'SuperAdmin';

  const [admins, setAdmins] = useState(INITIAL_ADMIN_ROSTER);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Animation References
  const containerRef = useRef(null);
  const statsGridRef = useRef(null);
  const tableRowsRef = useRef([]);
  const modalRef = useRef(null);

  // Filtered Administrative Roster Memoization
  const filteredAdmins = useMemo(() => {
    return admins.filter((admin) => {
      const matchesSearch =
        admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'ALL' || admin.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [admins, searchQuery, roleFilter]);

  // Entrance Stagger Animation
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        statsGridRef.current?.children || [],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 }
      );

      const rows = tableRowsRef.current.filter(Boolean);
      if (rows.length > 0) {
        gsap.fromTo(
          rows,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            stagger: 0.05,
            ease: 'power2.out',
          }
        );
      }
    },
    { scope: containerRef, dependencies: [filteredAdmins] }
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

  const handleAdminProvisioned = (newEntry) => {
    const formattedEntry = {
      ...newEntry,
      id: `ADM-${String(admins.length + 1).padStart(3, '0')}`,
    };
    setAdmins((prev) => [formattedEntry, ...prev]);
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
          title="Clearance Staff & RBAC"
          subtitle="RESTRICTED PARTITION / SUPERADMIN LEVEL ACCESS ONLY"
        />

        {/* Dynamic Content Canvas */}
        <div className="flex-1 space-y-6 p-4 sm:p-6 md:p-8 lg:p-8 xl:p-10 2xl:space-y-8 2xl:p-14">
          {/* Action Strip: Header Title & Provision Trigger */}
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-serif text-2xl font-normal tracking-tight text-[#303030] sm:text-2xl md:text-3xl 2xl:text-4xl">
                Personnel <span className="italic text-[#E85D04]">Registry</span>
              </h2>
              <p className="mt-1 font-sans text-xs text-[#707884] sm:text-xs md:text-sm 2xl:text-base">
                Manage administrative clearances, evaluate multi-factor compliance, and provision staff.
              </p>
            </div>

            <button
              onClick={() => setIsProvisionModalOpen(true)}
              className="group flex items-center gap-2 rounded-xl bg-[#303030] px-4 py-2 font-sans text-xs font-medium uppercase tracking-wider text-[#F7F5F0] transition-all hover:bg-[#E85D04] sm:text-xs md:text-sm 2xl:px-5 2xl:py-2.5 2xl:text-base"
            >
              <UserPlus className="h-4 w-4 transition-transform group-hover:scale-110 2xl:h-5 2xl:w-5" />
              <span>Provision Admin</span>
            </button>
          </div>

          {/* Metrics Grid */}
          <AdminStatsGrid ref={statsGridRef} admins={admins} />

          {/* Filter Bar */}
          <AdminFilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
          />

          {/* Roster Table */}
          <AdminRosterTable
            filteredAdmins={filteredAdmins}
            currentUserEmail={currentUser?.email}
            tableRowsRef={tableRowsRef}
          />
        </div>
      </main>

      {/* 3. Provisioning Modal */}
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