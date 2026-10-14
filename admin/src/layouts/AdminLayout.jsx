import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import apiClient from '../api/axios.js';
import {
  logOut,
  selectCurrentUser,
  selectCurrentRole,
} from '../store/features/authSlice.js';
import Sidebar from '../components/layout/Sidebar.jsx';
import Topbar from '../components/layout/Topbar.jsx';

// Route header metadata mapping
const ROUTE_HEADER_MAP = {
  '/dashboard': {
    title: 'Institutional Telemetry',
    subtitle: 'PORTAL ROOT / REAL-TIME OBSERVABILITY',
  },
  '/audit-logs': {
    title: 'Security Audit Logs',
    subtitle: 'CRYPTOGRAPHIC SYSTEM AUDIT / ZERO-TRUST LOG',
  },
  '/mentors': {
    title: 'Mentors Directory',
    subtitle: 'ACADEMIC LEADERSHIP / PUBLIC REGISTRY',
  },
  '/notices': {
    title: 'Notice Board',
    subtitle: 'OFFICIAL CIRCULARS / PUBLIC DOCUMENT DISPATCH',
  },
  '/admins': {
    title: 'Clearance Staff & RBAC',
    subtitle: 'RESTRICTED PARTITION / SUPERADMIN LEVEL ACCESS ONLY',
  },
};

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUser = useSelector(selectCurrentUser);
  const userRole = useSelector(selectCurrentRole) || 'Admin';
  const isSuperAdmin = userRole === 'SuperAdmin';

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const headerMeta = ROUTE_HEADER_MAP[location.pathname] || {
    title: 'SIHM Administration',
    subtitle: 'STATE INSTITUTE OF HOTEL MANAGEMENT',
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Clear client state even if transient network fails
    } finally {
      dispatch(logOut());
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-[#F7F5F0] font-sans text-[#303030]">
      {/* Background Architectural Watermarks */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(#E6E2D8_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(232,93,4,0.03),transparent_50%)]" />

      <Sidebar
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        currentUser={currentUser}
        userRole={userRole}
        isSuperAdmin={isSuperAdmin}
        onLogout={handleLogout}
        isLoggingOut={isLoggingOut}
      />

      {/* 
          1. data-lenis-prevent="true" bypasses the smooth scroll interception
          2. overflow-x-hidden ensures no horizontal wobble
      */}
      <main
        data-lenis-prevent="true"
        className="relative z-10 flex h-full flex-1 flex-col overflow-y-auto overflow-x-hidden"
      >
        <Topbar
          onOpenMobileNav={() => setIsMobileNavOpen(true)}
          title={headerMeta.title}
          subtitle={headerMeta.subtitle}
        />

        <div className="flex-1 p-4 sm:p-6 md:p-8 lg:p-8 xl:p-10 2xl:p-14">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;