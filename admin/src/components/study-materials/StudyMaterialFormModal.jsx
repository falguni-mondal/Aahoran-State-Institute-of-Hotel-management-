import React, { useState, useEffect, forwardRef } from 'react';
import {
  X,
  BookOpen,
  UploadCloud,
  ShieldAlert,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import apiClient from '../../api/axios.js';
import { uploadToImageKit } from '../../utils/imagekitUpload.js';

const DIPLOMA_SUBJECT_PRESETS = [
  { id: 'dfp', title: 'Diploma in Food Production' },
  { id: 'dfbs', title: 'Diploma in F&B Service' },
  { id: 'dfo', title: 'Diploma in Front Office' },
  { id: 'dhk', title: 'Diploma in Housekeeping' },
];

const StudyMaterialFormModal = forwardRef(
  ({ isOpen, editingMaterial, onClose, onMaterialSaved }, ref) => {
    const [title, setTitle] = useState('');
    const [programType, setProgramType] = useState('bsc');
    const [semesterId, setSemesterId] = useState('sem-1');
    const [subjectTitle, setSubjectTitle] = useState('Food Production');
    const [topicTitle, setTopicTitle] = useState('');
    const [isNew, setIsNew] = useState(false);
    const [isActive, setIsActive] = useState(true);
    const [url, setUrl] = useState('');
    const [fileId, setFileId] = useState(null);
    const [fileName, setFileName] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const [isUploadingFile, setIsUploadingFile] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
      if (!isOpen) return;

      if (editingMaterial) {
        setTitle(editingMaterial.title || '');
        setProgramType(editingMaterial.programType || 'bsc');
        setSemesterId(
          editingMaterial.semesterId && editingMaterial.semesterId !== 'none'
            ? editingMaterial.semesterId
            : 'sem-1'
        );
        setSubjectTitle(editingMaterial.subjectTitle || '');
        setTopicTitle(editingMaterial.topicTitle || '');
        setIsNew(Boolean(editingMaterial.isNew));
        setIsActive(Boolean(editingMaterial.isActive));
        setUrl(editingMaterial.url || '');
        setFileId(editingMaterial.fileId || null);
        setFileName(editingMaterial.fileName || '');
      } else {
        setTitle('');
        setProgramType('bsc');
        setSemesterId('sem-1');
        setSubjectTitle('Food Production');
        setTopicTitle('');
        setIsNew(false);
        setIsActive(true);
        setUrl('');
        setFileId(null);
        setFileName('');
      }

      setSelectedFile(null);
      setErrorMessage(null);
      setSuccessMessage(null);
    }, [isOpen, editingMaterial]);

    if (!isOpen) return null;

    const handleProgramSwitch = (type) => {
      setProgramType(type);
      if (type === 'diploma') {
        setSubjectTitle(DIPLOMA_SUBJECT_PRESETS[0].title);
        setTopicTitle('Basic Culinary Skills');
      } else {
        setSubjectTitle('Food Production');
        setTopicTitle('');
      }
    };

    const handleFileSelect = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > 25 * 1024 * 1024) {
        setErrorMessage('File size cannot exceed 25 MB.');
        return;
      }
      setErrorMessage(null);
      setSelectedFile(file);
      setFileName(file.name);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setErrorMessage(null);
      setSuccessMessage(null);

      if (!title.trim() || !subjectTitle.trim()) {
        setErrorMessage('Document title and subject name are required.');
        return;
      }
      if (!selectedFile && !url.trim()) {
        setErrorMessage('Please upload a document or provide a direct URL.');
        return;
      }

      setIsSubmitting(true);

      try {
        let finalUrl = url.trim();
        let finalFileId = fileId;
        let finalFileName = fileName;

        if (selectedFile) {
          setIsUploadingFile(true);
          const uploaded = await uploadToImageKit(selectedFile, '/study-materials');
          finalUrl = uploaded.url;
          finalFileId = uploaded.fileId;
          finalFileName = selectedFile.name;
          setIsUploadingFile(false);
        }

        const payload = {
          title: title.trim(),
          programType,
          semesterId: programType === 'bsc' ? semesterId : 'none',
          subjectTitle: subjectTitle.trim(),
          topicTitle: programType === 'diploma' ? topicTitle.trim() : '',
          isNew,
          isActive,
          url: finalUrl,
          fileId: finalFileId,
          fileName: finalFileName || finalUrl.split('/').pop(),
        };

        if (editingMaterial) {
          const targetId = editingMaterial._id || editingMaterial.id;
          const response = await apiClient.put(`/study-materials/${targetId}`, payload);
          if (response.data?.material) {
            onMaterialSaved?.(response.data.material, true);
          }
          setSuccessMessage('Study material updated.');
        } else {
          const response = await apiClient.post('/study-materials', payload);
          if (response.data?.material) {
            onMaterialSaved?.(response.data.material, false);
          }
          setSuccessMessage('Study material published to repository.');
        }

        setTimeout(() => {
          setSuccessMessage(null);
          onClose();
        }, 900);
      } catch (err) {
        setIsUploadingFile(false);
        setErrorMessage(
          err.response?.data?.message || err.message || 'Failed to save study material.'
        );
      } finally {
        setIsSubmitting(false);
      }
    };

    const isBusy = isSubmitting || isUploadingFile;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div
          onClick={() => !isBusy && onClose()}
          className="fixed inset-0 bg-[#303030]/50 backdrop-blur-sm"
        />

        <div
          ref={ref}
          data-lenis-prevent="true"
          className="relative z-10 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-[#E6E2D8] bg-[#FFFFFF] p-6 shadow-2xl sm:p-8 lg:max-w-2xl"
        >
          <div className="flex items-start justify-between border-b border-[#E6E2D8] pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#E6E2D8] bg-[#F7F5F0] text-[#E85D04]">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-normal text-[#303030] sm:text-2xl">
                  {editingMaterial ? 'Update Study Material' : 'Upload Study Material'}
                </h3>
                <span className="font-sans text-[11px] font-semibold uppercase tracking-widest text-[#707884]">
                  Academic Handouts & Course Notes
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isBusy}
              className="rounded-xl p-1.5 text-[#707884] hover:bg-[#F7F5F0]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {errorMessage && (
            <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50/80 p-3.5 text-xs text-rose-800">
              <ShieldAlert className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3.5 text-xs text-emerald-800">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Program Selector */}
            <div>
              <label className="block font-sans text-[11px] font-semibold uppercase tracking-wider text-[#707884]">
                Academic Program *
              </label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                {[
                  { id: 'bsc', label: 'B.Sc. Degree Programmes' },
                  { id: 'diploma', label: 'Diploma Courses' },
                ].map((prog) => (
                  <button
                    key={prog.id}
                    type="button"
                    disabled={isBusy}
                    onClick={() => handleProgramSwitch(prog.id)}
                    className={`rounded-xl border py-2.5 font-sans text-xs font-medium transition-all ${
                      programType === prog.id
                        ? 'border-[#E85D04] bg-[#E85D04]/10 text-[#E85D04]'
                        : 'border-[#E6E2D8] bg-[#FFFFFF] text-[#707884]'
                    }`}
                  >
                    {prog.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Conditional B.Sc Semester OR Diploma Course + Topic */}
            {programType === 'bsc' ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-sans text-[11px] font-semibold uppercase tracking-wider text-[#707884]">
                    Semester *
                  </label>
                  <select
                    value={semesterId}
                    onChange={(e) => setSemesterId(e.target.value)}
                    disabled={isBusy}
                    className="mt-2 w-full rounded-xl border border-[#E6E2D8] bg-[#F7F5F0]/50 px-3.5 py-3 font-sans text-xs text-[#303030] outline-none focus:border-[#E85D04]"
                  >
                    <option value="sem-1">Semester I</option>
                    <option value="sem-2">Semester II</option>
                    <option value="sem-3">Semester III</option>
                    <option value="sem-4">Semester IV</option>
                    <option value="sem-5">Semester V</option>
                    <option value="sem-6">Semester VI</option>
                  </select>
                </div>

                <div>
                  <label className="block font-sans text-[11px] font-semibold uppercase tracking-wider text-[#707884]">
                    Subject Name *
                  </label>
                  <input
                    type="text"
                    value={subjectTitle}
                    onChange={(e) => setSubjectTitle(e.target.value)}
                    placeholder="e.g., Food Production / Front Office"
                    required
                    disabled={isBusy}
                    className="mt-2 w-full rounded-xl border border-[#E6E2D8] bg-[#F7F5F0]/50 px-3.5 py-3 font-sans text-xs text-[#303030] outline-none focus:border-[#E85D04]"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-sans text-[11px] font-semibold uppercase tracking-wider text-[#707884]">
                    Diploma Course *
                  </label>
                  <input
                    type="text"
                    list="diploma-courses-list"
                    value={subjectTitle}
                    onChange={(e) => setSubjectTitle(e.target.value)}
                    placeholder="e.g., Diploma in Food Production"
                    required
                    disabled={isBusy}
                    className="mt-2 w-full rounded-xl border border-[#E6E2D8] bg-[#F7F5F0]/50 px-3.5 py-3 font-sans text-xs text-[#303030] outline-none focus:border-[#E85D04]"
                  />
                  <datalist id="diploma-courses-list">
                    {DIPLOMA_SUBJECT_PRESETS.map((d) => (
                      <option key={d.id} value={d.title} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block font-sans text-[11px] font-semibold uppercase tracking-wider text-[#707884]">
                    Accordion Topic Heading *
                  </label>
                  <input
                    type="text"
                    value={topicTitle}
                    onChange={(e) => setTopicTitle(e.target.value)}
                    placeholder="e.g., Basic Culinary Skills / Bakery Basics"
                    required
                    disabled={isBusy}
                    className="mt-2 w-full rounded-xl border border-[#E6E2D8] bg-[#F7F5F0]/50 px-3.5 py-3 font-sans text-xs text-[#303030] outline-none focus:border-[#E85D04]"
                  />
                </div>
              </div>
            )}

            {/* Document Title */}
            <div>
              <label className="block font-sans text-[11px] font-semibold uppercase tracking-wider text-[#707884]">
                Handout / Module Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Introduction to Cookery / Module 1: Knife Skills & Cuts.pdf"
                required
                disabled={isBusy}
                className="mt-2 w-full rounded-xl border border-[#E6E2D8] bg-[#F7F5F0]/50 p-3 font-sans text-xs text-[#303030] outline-none focus:border-[#E85D04] sm:text-sm"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block font-sans text-[11px] font-semibold uppercase tracking-wider text-[#707884]">
                Document File (PDF / PPT / DOC via ImageKit) *
              </label>
              <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#E6E2D8] bg-[#F7F5F0]/40 p-5 text-center transition-all hover:border-[#E85D04]">
                <UploadCloud className="h-7 w-7 text-[#E85D04]" />
                <span className="mt-2 font-sans text-xs font-medium text-[#303030]">
                  {selectedFile
                    ? `Selected: ${selectedFile.name}`
                    : fileName
                    ? `Attached: ${fileName} (Click to replace)`
                    : 'Click to upload study material file'}
                </span>
                <input
                  type="file"
                  accept=".pdf,.ppt,.pptx,.doc,.docx"
                  onChange={handleFileSelect}
                  disabled={isBusy}
                  className="hidden"
                />
              </label>

              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Or enter direct file URL (https://ik.imagekit.io/...)"
                disabled={isBusy || Boolean(selectedFile)}
                className="mt-2.5 w-full rounded-xl border border-[#E6E2D8] bg-[#F7F5F0]/50 px-3.5 py-2.5 font-mono text-xs text-[#303030] outline-none focus:border-[#E85D04] disabled:opacity-50"
              />
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                disabled={isBusy}
                onClick={() => setIsNew(!isNew)}
                className={`flex items-center justify-between rounded-xl border p-3.5 text-left transition-all ${
                  isNew
                    ? 'border-[#E85D04] bg-[#E85D04]/10 text-[#303030]'
                    : 'border-[#E6E2D8] bg-[#F7F5F0]/40 text-[#707884]'
                }`}
              >
                <div>
                  <div className="font-sans text-xs font-semibold">"New" Badge</div>
                  <div className="font-sans text-[11px] opacity-80">Highlight resource as new</div>
                </div>
                <div className={`h-4 w-4 rounded-full border ${isNew ? 'border-[#E85D04] bg-[#E85D04]' : 'border-[#707884]'}`} />
              </button>

              <button
                type="button"
                disabled={isBusy}
                onClick={() => setIsActive(!isActive)}
                className={`flex items-center justify-between rounded-xl border p-3.5 text-left transition-all ${
                  isActive
                    ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950'
                    : 'border-[#E6E2D8] bg-[#F7F5F0]/40 text-[#707884]'
                }`}
              >
                <div>
                  <div className="font-sans text-xs font-semibold">
                    {isActive ? 'Publish Immediately' : 'Save as Draft'}
                  </div>
                  <div className="font-sans text-[11px] opacity-80">
                    {isActive ? 'Visible to students' : 'Hidden from portal'}
                  </div>
                </div>
                <div className={`h-4 w-4 rounded-full border ${isActive ? 'border-emerald-600 bg-emerald-600' : 'border-[#707884]'}`} />
              </button>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#E6E2D8] pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isBusy}
                className="rounded-xl border border-[#E6E2D8] bg-[#FFFFFF] px-5 py-2.5 font-sans text-xs text-[#707884]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isBusy}
                className="flex items-center gap-2 rounded-xl bg-[#303030] px-6 py-2.5 font-sans text-xs font-semibold uppercase tracking-wider text-[#F7F5F0] hover:bg-[#E85D04] disabled:opacity-50"
              >
                {isBusy ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{isUploadingFile ? 'Uploading...' : 'Saving...'}</span>
                  </>
                ) : (
                  <span>{editingMaterial ? 'Save Changes →' : 'Publish Material →'}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
);

StudyMaterialFormModal.displayName = 'StudyMaterialFormModal';

export default StudyMaterialFormModal;