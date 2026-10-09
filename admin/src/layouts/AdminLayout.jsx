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

  // Derive dynamic header titles based on the active path
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
    <div className="relative flex min-h-screen w-full flex-col bg-[#F7F5F0] font-sans text-[#303030] lg:flex-row">
      {/* Background Architectural Watermarks */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(#E6E2D8_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(232,93,4,0.03),transparent_50%)]" />

      {/* 1. Persistent Shared Sidebar */}
      <Sidebar
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        currentUser={currentUser}
        userRole={userRole}
        isSuperAdmin={isSuperAdmin}
        onLogout={handleLogout}
        isLoggingOut={isLoggingOut}
      />

      {/* 2. Main Workspace & Dynamic Content Outlet */}
      <main className="relative z-10 flex min-h-screen flex-1 flex-col overflow-y-auto">
        {/* Persistent Topbar */}
        <Topbar
          onOpenMobileNav={() => setIsMobileNavOpen(true)}
          title={headerMeta.title}
          subtitle={headerMeta.subtitle}
        />

        {/* Dynamic Child Page Canvas */}
        <div className="flex-1 p-4 sm:p-6 md:p-8 lg:p-8 xl:p-10 2xl:p-14">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;