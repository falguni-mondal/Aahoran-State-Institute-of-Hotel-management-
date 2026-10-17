import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Plus, RefreshCw, ShieldAlert } from 'lucide-react';
import apiClient from '../api/axios.js';
import { useLenis } from '../providers/SmoothScrollProvider.jsx';

import SyllabusStatsGrid from '../components/syllabus/SyllabusStatsGrid.jsx';
import SyllabusFilterBar from '../components/syllabus/SyllabusFilterBar.jsx';
import SyllabusRosterTable from '../components/syllabus/SyllabusRosterTable.jsx';
import SyllabusFormModal from '../components/syllabus/SyllabusFormModal.jsx';

const ManageSyllabus = () => {
  const lenis = useLenis();

  const [syllabi, setSyllabi] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSyllabus, setEditingSyllabus] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const statsGridRef = useRef(null);
  const tableSectionRef = useRef(null);
  const modalRef = useRef(null);

  const fetchSyllabi = useCallback(async (manualSync = false) => {
    if (manualSync) setIsRefreshing(true);
    else setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await apiClient.get('/syllabus/admin');
      if (response.data && Array.isArray(response.data.syllabi)) {
        setSyllabi(response.data.syllabi);
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to synchronize syllabus archive.'
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchSyllabi(false);
  }, [fetchSyllabi]);

  const filteredSyllabi = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return syllabi.filter((syl) => {
      const matchesFilter =
        activeFilter === 'all' ||
        (activeFilter === 'diploma' && syl.categoryGroup === 'diploma') ||
        (activeFilter === 'jnu' && syl.tabId === 'jnu') ||
        (activeFilter === 'ignou' && syl.tabId === 'ignou');

      const title = syl.title?.toLowerCase() || '';
      const code = syl.recordCode?.toLowerCase() || '';
      const tab = syl.tabLabel?.toLowerCase() || '';

      const matchesSearch = !q || title.includes(q) || code.includes(q) || tab.includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [syllabi, searchQuery, activeFilter]);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(headerRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.38 })
        .fromTo(
          statsGridRef.current?.children || [],
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.38, stagger: 0.04 },
          '-=0.2'
        )
        .fromTo(tableSectionRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.38 }, '-=0.15');
    },
    { scope: containerRef }
  );

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
    } else if (lenis) {
      lenis.start();
    }
  }, [isModalOpen, lenis]);

  const handleSyllabusSaved = (savedItem, isEdit) => {
    const savedId = savedItem._id || savedItem.id;
    if (isEdit) {
      setSyllabi((prev) =>
        prev.map((item) => ((item._id || item.id) === savedId ? savedItem : item))
      );
    } else {
      setSyllabi((prev) => [savedItem, ...prev]);
    }
  };

  const handleQuickToggle = async (syl, field) => {
    const targetId = syl._id || syl.id;
    if (!targetId || togglingId) return;

    setTogglingId(`${targetId}-${field}`);
    try {
      const response = await apiClient.put(`/syllabus/${targetId}`, {
        [field]: !syl[field],
      });
      if (response.data?.syllabus) {
        setSyllabi((prev) =>
          prev.map((item) =>
            (item._id || item.id) === targetId ? response.data.syllabus : item
          )
        );
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to update syllabus status.');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteSyllabus = async (syl) => {
    const targetId = syl._id || syl.id;
    if (!targetId || deletingId) return;
    if (!window.confirm(`Permanently purge "${syl.title}"?`)) return;

    setDeletingId(targetId);
    try {
      await apiClient.delete(`/syllabus/${targetId}`);
      setSyllabi((prev) => prev.filter((item) => (item._id || item.id) !== targetId));
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to delete syllabus.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div ref={containerRef} className="space-y-6 2xl:space-y-8">
      <div
        ref={headerRef}
        className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
      >
        <div>
          <h2 className="font-serif text-2xl font-normal tracking-tight text-[#303030] md:text-3xl 2xl:text-4xl">
            Curriculum <span className="italic text-[#E85D04]">Syllabus</span>
          </h2>
          <p className="mt-1 font-sans text-xs text-[#707884] md:text-sm 2xl:text-base">
            Manage official JNU, IGNOU, and Diploma curriculum syllabus documents.
          </p>
        </div>

        <div className="flex w-full items-center justify-end gap-2.5 sm:w-auto sm:gap-3">
          <button
            type="button"
            onClick={() => fetchSyllabi(true)}
            disabled={isRefreshing || isLoading}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#E6E2D8] bg-[#FFFFFF] px-3.5 py-2 font-sans text-xs text-[#707884] hover:bg-[#F7F5F0] sm:flex-initial md:text-sm"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-[#E85D04]' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Syllabus'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingSyllabus(null);
              setIsModalOpen(true);
            }}
            className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#303030] px-4 py-2 font-sans text-xs font-medium uppercase tracking-wider text-[#F7F5F0] hover:bg-[#E85D04] sm:flex-initial md:text-sm"
          >
            <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
            <span>Publish Syllabus</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50/80 p-3.5 text-xs text-rose-800 sm:text-sm">
          <ShieldAlert className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <SyllabusStatsGrid ref={statsGridRef} syllabi={syllabi} isLoading={isLoading} />

      <div ref={tableSectionRef} className="space-y-4 sm:space-y-5">
        <SyllabusFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />

        <SyllabusRosterTable
          filteredSyllabi={filteredSyllabi}
          isLoading={isLoading}
          onEditSyllabus={(item) => {
            setEditingSyllabus(item);
            setIsModalOpen(true);
          }}
          onDeleteSyllabus={handleDeleteSyllabus}
          onQuickToggle={handleQuickToggle}
          togglingId={togglingId}
          deletingId={deletingId}
        />
      </div>

      <SyllabusFormModal
        ref={modalRef}
        isOpen={isModalOpen}
        editingSyllabus={editingSyllabus}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSyllabus(null);
        }}
        onSyllabusSaved={handleSyllabusSaved}
      />
    </div>
  );
};

export default ManageSyllabus;