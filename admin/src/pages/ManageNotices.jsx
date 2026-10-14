import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Plus, RefreshCw, ShieldAlert } from 'lucide-react';
import apiClient from '../api/axios.js';
import { useLenis } from '../providers/SmoothScrollProvider.jsx';

// Dedicated Notice Board CMS Components
import NoticeStatsGrid from '../components/notices/NoticeStatsGrid.jsx';
import NoticeFilterBar from '../components/notices/NoticeFilterBar.jsx';
import NoticeRosterTable, {
  CATEGORY_BADGE_MAP,
} from '../components/notices/NoticeRosterTable.jsx';
import NoticeFormModal from '../components/notices/NoticeFormModal.jsx';

const ManageNotices = () => {
  const lenis = useLenis();

  const [notices, setNotices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Animation References
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const statsGridRef = useRef(null);
  const tableSectionRef = useRef(null);
  const modalRef = useRef(null);

  // Fetch all notices (including drafts) from MongoDB
  const fetchNotices = useCallback(async (manualSync = false) => {
    if (manualSync) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setErrorMessage(null);

    try {
      const response = await apiClient.get('/notices/admin');
      if (response.data && Array.isArray(response.data.notices)) {
        setNotices(response.data.notices);
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message ||
          'Failed to synchronize notice registry from server.'
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNotices(false);
  }, [fetchNotices]);

  // Filtered Notice Roster Memoization
  const filteredNotices = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return notices.filter((notice) => {
      const matchesCategory =
        selectedCategory === 'all' || notice.categoryId === selectedCategory;

      const title = notice.title?.toLowerCase() || '';
      const recordCode =
        notice.recordCode?.toLowerCase() ||
        `ntc-${(notice._id || notice.id || '').toString().slice(-4).toLowerCase()}`;
      const rawId = (notice._id || notice.id || '').toString().toLowerCase();
      const categoryLabel = (
        CATEGORY_BADGE_MAP[notice.categoryId] ||
        notice.categoryId ||
        ''
      ).toLowerCase();
      const fileName = notice.fileName?.toLowerCase() || '';
      const date = notice.date?.toLowerCase() || '';

      const matchesSearch =
        !query ||
        title.includes(query) ||
        recordCode.includes(query) ||
        rawId.includes(query) ||
        categoryLabel.includes(query) ||
        fileName.includes(query) ||
        date.includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [notices, searchQuery, selectedCategory]);

  // Unified Page Entrance Sequence
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        headerRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.38 }
      )
        .fromTo(
          statsGridRef.current?.children || [],
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.38, stagger: 0.04 },
          '-=0.2'
        )
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
    if (isModalOpen) {
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
  }, [isModalOpen, lenis]);

  const handleOpenCreate = () => {
    setEditingNotice(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (notice) => {
    setEditingNotice(notice);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingNotice(null);
  };

  const handleNoticeSaved = (savedNotice, isEdit) => {
    const savedId = savedNotice._id || savedNotice.id;

    if (isEdit) {
      setNotices((prev) =>
        prev.map((item) =>
          (item._id || item.id) === savedId ? savedNotice : item
        )
      );
    } else {
      setNotices((prev) => [savedNotice, ...prev]);
    }
  };

  const handleQuickToggle = async (notice, field) => {
    const targetId = notice._id || notice.id;
    if (!targetId || togglingId) return;

    setTogglingId(`${targetId}-${field}`);
    setErrorMessage(null);

    try {
      const updatedValue = !notice[field];
      const response = await apiClient.put(`/notices/${targetId}`, {
        [field]: updatedValue,
      });

      if (response.data?.notice) {
        setNotices((prev) =>
          prev.map((item) =>
            (item._id || item.id) === targetId ? response.data.notice : item
          )
        );
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to update notice status.'
      );
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteNotice = async (notice) => {
    const targetId = notice._id || notice.id;
    if (!targetId || deletingId) return;

    const confirmed = window.confirm(
      `Are you sure you want to permanently purge "${notice.title}"? The associated PDF document will also be deleted from cloud storage.`
    );
    if (!confirmed) return;

    setDeletingId(targetId);
    setErrorMessage(null);

    try {
      await apiClient.delete(`/notices/${targetId}`);
      setNotices((prev) =>
        prev.filter((item) => (item._id || item.id) !== targetId)
      );
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to delete notice record.'
      );
    } finally {
      setDeletingId(null);
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
            Notice Board <span className="italic text-[#E85D04]">Registry</span>
          </h2>
          <p className="mt-1 font-sans text-xs text-[#707884] sm:text-xs md:text-sm 2xl:text-base">
            Publish official institutional directives, examination schedules, tenders, and recruitment circulars.
          </p>
        </div>

        <div className="flex w-full items-center justify-end gap-2.5 sm:w-auto sm:gap-3">
          <button
            type="button"
            onClick={() => fetchNotices(true)}
            disabled={isRefreshing || isLoading}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#E6E2D8] bg-[#FFFFFF] px-3.5 py-2 font-sans text-xs text-[#707884] transition-all hover:border-[#D5CEBF] hover:bg-[#F7F5F0] hover:text-[#303030] disabled:opacity-50 sm:flex-initial sm:text-xs md:text-sm 2xl:px-4 2xl:py-2.5 2xl:text-base"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${
                isRefreshing ? 'animate-spin text-[#E85D04]' : ''
              }`}
            />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Registry'}</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#303030] px-4 py-2 font-sans text-xs font-medium uppercase tracking-wider text-[#F7F5F0] transition-all hover:bg-[#E85D04] sm:flex-initial sm:text-xs md:text-sm 2xl:px-5 2xl:py-2.5 2xl:text-base"
          >
            <Plus className="h-4 w-4 transition-transform group-hover:rotate-90 2xl:h-5 2xl:w-5" />
            <span>Publish Notice</span>
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
      <NoticeStatsGrid
        ref={statsGridRef}
        notices={notices}
        isLoading={isLoading}
      />

      {/* Unified Lower Section: Filter Bar & Notice Table */}
      <div ref={tableSectionRef} className="space-y-4 sm:space-y-5">
        <NoticeFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        <NoticeRosterTable
          filteredNotices={filteredNotices}
          isLoading={isLoading}
          onEditNotice={handleOpenEdit}
          onDeleteNotice={handleDeleteNotice}
          onQuickToggle={handleQuickToggle}
          togglingId={togglingId}
          deletingId={deletingId}
        />
      </div>

      {/* Create / Edit Notice Modal */}
      <NoticeFormModal
        ref={modalRef}
        isOpen={isModalOpen}
        editingNotice={editingNotice}
        onClose={handleCloseModal}
        onNoticeSaved={handleNoticeSaved}
      />
    </div>
  );
};

export default ManageNotices;