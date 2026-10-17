import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Plus, RefreshCw, ShieldAlert } from 'lucide-react';
import apiClient from '../api/axios.js';
import { useLenis } from '../providers/SmoothScrollProvider.jsx';

import StudyMaterialStatsGrid from '../components/study-materials/StudyMaterialStatsGrid.jsx';
import StudyMaterialFilterBar from '../components/study-materials/StudyMaterialFilterBar.jsx';
import StudyMaterialRosterTable from '../components/study-materials/StudyMaterialRosterTable.jsx';
import StudyMaterialFormModal from '../components/study-materials/StudyMaterialFormModal.jsx';

const ManageStudyMaterials = () => {
  const lenis = useLenis();

  const [materials, setMaterials] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [programFilter, setProgramFilter] = useState('all');
  const [semesterFilter, setSemesterFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);

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

  const fetchMaterials = useCallback(async (manualSync = false) => {
    if (manualSync) setIsRefreshing(true);
    else setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await apiClient.get('/study-materials/admin');
      if (response.data && Array.isArray(response.data.materials)) {
        setMaterials(response.data.materials);
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to synchronize study materials.'
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMaterials(false);
  }, [fetchMaterials]);

  const filteredMaterials = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return materials.filter((mat) => {
      const matchesProg =
        programFilter === 'all' || mat.programType === programFilter;
      const matchesSem =
        programFilter === 'diploma' ||
        semesterFilter === 'all' ||
        mat.semesterId === semesterFilter;

      const title = mat.title?.toLowerCase() || '';
      const subject = mat.subjectTitle?.toLowerCase() || '';
      const topic = mat.topicTitle?.toLowerCase() || '';
      const code = mat.recordCode?.toLowerCase() || '';

      const matchesSearch =
        !q ||
        title.includes(q) ||
        subject.includes(q) ||
        topic.includes(q) ||
        code.includes(q);

      return matchesProg && matchesSem && matchesSearch;
    });
  }, [materials, searchQuery, programFilter, semesterFilter]);

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

  const handleMaterialSaved = (savedItem, isEdit) => {
    const savedId = savedItem._id || savedItem.id;
    if (isEdit) {
      setMaterials((prev) =>
        prev.map((item) => ((item._id || item.id) === savedId ? savedItem : item))
      );
    } else {
      setMaterials((prev) => [savedItem, ...prev]);
    }
  };

  const handleQuickToggle = async (mat, field) => {
    const targetId = mat._id || mat.id;
    if (!targetId || togglingId) return;

    setTogglingId(`${targetId}-${field}`);
    try {
      const response = await apiClient.put(`/study-materials/${targetId}`, {
        [field]: !mat[field],
      });
      if (response.data?.material) {
        setMaterials((prev) =>
          prev.map((item) =>
            (item._id || item.id) === targetId ? response.data.material : item
          )
        );
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to update material status.');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteMaterial = async (mat) => {
    const targetId = mat._id || mat.id;
    if (!targetId || deletingId) return;
    if (!window.confirm(`Permanently purge "${mat.title}"?`)) return;

    setDeletingId(targetId);
    try {
      await apiClient.delete(`/study-materials/${targetId}`);
      setMaterials((prev) => prev.filter((item) => (item._id || item.id) !== targetId));
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to delete study material.');
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
            Study Materials <span className="italic text-[#E85D04]">Repository</span>
          </h2>
          <p className="mt-1 font-sans text-xs text-[#707884] md:text-sm 2xl:text-base">
            Curate lecture notes, subject handouts, and practical modules for B.Sc. and Diploma students.
          </p>
        </div>

        <div className="flex w-full items-center justify-end gap-2.5 sm:w-auto sm:gap-3">
          <button
            type="button"
            onClick={() => fetchMaterials(true)}
            disabled={isRefreshing || isLoading}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#E6E2D8] bg-[#FFFFFF] px-3.5 py-2 font-sans text-xs text-[#707884] hover:bg-[#F7F5F0] sm:flex-initial md:text-sm"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-[#E85D04]' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Repository'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingMaterial(null);
              setIsModalOpen(true);
            }}
            className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#303030] px-4 py-2 font-sans text-xs font-medium uppercase tracking-wider text-[#F7F5F0] hover:bg-[#E85D04] sm:flex-initial md:text-sm"
          >
            <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
            <span>Upload Material</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50/80 p-3.5 text-xs text-rose-800 sm:text-sm">
          <ShieldAlert className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <StudyMaterialStatsGrid ref={statsGridRef} materials={materials} isLoading={isLoading} />

      <div ref={tableSectionRef} className="space-y-4 sm:space-y-5">
        <StudyMaterialFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          programFilter={programFilter}
          setProgramFilter={setProgramFilter}
          semesterFilter={semesterFilter}
          setSemesterFilter={setSemesterFilter}
        />

        <StudyMaterialRosterTable
          filteredMaterials={filteredMaterials}
          isLoading={isLoading}
          onEditMaterial={(item) => {
            setEditingMaterial(item);
            setIsModalOpen(true);
          }}
          onDeleteMaterial={handleDeleteMaterial}
          onQuickToggle={handleQuickToggle}
          togglingId={togglingId}
          deletingId={deletingId}
        />
      </div>

      <StudyMaterialFormModal
        ref={modalRef}
        isOpen={isModalOpen}
        editingMaterial={editingMaterial}
        onClose={() => {
          setIsModalOpen(false);
          setEditingMaterial(null);
        }}
        onMaterialSaved={handleMaterialSaved}
      />
    </div>
  );
};

export default ManageStudyMaterials;