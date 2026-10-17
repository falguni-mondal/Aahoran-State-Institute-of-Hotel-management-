import React, { useState, useEffect, forwardRef } from 'react';
import {
  X,
  Award,
  UploadCloud,
  ShieldAlert,
  CheckCircle2,
  Loader2,
  Link2,
} from 'lucide-react';
import apiClient from '../../api/axios.js';
import { uploadToImageKit } from '../../utils/imagekitUpload.js';

const PRESET_SESSIONS = [
  { id: '25-26', label: '2025 - 26' },
  { id: '24-25', label: '2024 - 25' },
  { id: '23-24', label: '2023 - 24' },
  { id: '22-23', label: '2022 - 23' },
  { id: '21-22', label: '2021 - 22' },
  { id: '20-21', label: '2020 - 21' },
];

const ResultFormModal = forwardRef(
  ({ isOpen, editingResult, onClose, onResultSaved }, ref) => {
    const [title, setTitle] = useState('');
    const [programType, setProgramType] = useState('bsc');
    const [sessionId, setSessionId] = useState('24-25');
    const [sessionLabel, setSessionLabel] = useState('2024 - 25');
    const [semesterId, setSemesterId] = useState('1');
    const [examType, setExamType] = useState('Regular');
    const [isNew, setIsNew] = useState(true);
    const [isActive, setIsActive] = useState(true);
    const [url, setUrl] = useState('');
    const [fileId, setFileId] = useState(null);
    const [fileName, setFileName] = useState('');
    const [verificationLabel, setVerificationLabel] = useState('');
    const [verificationUrl, setVerificationUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const [isUploadingFile, setIsUploadingFile] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
      if (!isOpen) return;

      if (editingResult) {
        setTitle(editingResult.title || '');
        setProgramType(editingResult.programType || 'bsc');
        setSessionId(editingResult.sessionId || '23-24');
        setSessionLabel(editingResult.sessionLabel || '2023 - 24');
        setSemesterId(
          editingResult.semesterId && editingResult.semesterId !== 'none'
            ? editingResult.semesterId
            : '1'
        );
        setExamType(editingResult.examType || editingResult.type || 'Regular');
        setIsNew(Boolean(editingResult.isNew));
        setIsActive(Boolean(editingResult.isActive));
        setUrl(editingResult.url || '');
        setFileId(editingResult.fileId || null);
        setFileName(editingResult.fileName || '');
        setVerificationLabel(editingResult.verificationLabel || '');
        setVerificationUrl(editingResult.verificationUrl || '');
      } else {
        setTitle('');
        setProgramType('bsc');
        setSessionId('24-25');
        setSessionLabel('2024 - 25');
        setSemesterId('1');
        setExamType('Regular');
        setIsNew(true);
        setIsActive(true);
        setUrl('');
        setFileId(null);
        setFileName('');
        setVerificationLabel('');
        setVerificationUrl('');
      }

      setSelectedFile(null);
      setErrorMessage(null);
      setSuccessMessage(null);
    }, [isOpen, editingResult]);

    if (!isOpen) return null;

    const handleSessionSelect = (e) => {
      const selectedId = e.target.value;
      setSessionId(selectedId);
      const found = PRESET_SESSIONS.find((s) => s.id === selectedId);
      if (found) setSessionLabel(found.label);
    };

    const handleFileSelect = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.type !== 'application/pdf') {
        setErrorMessage('Only official PDF result sheets (.pdf) are permitted.');
        return;
      }
      if (file.size > 20 * 1024 * 1024) {
        setErrorMessage('Document file size cannot exceed 20 MB.');
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

      if (!title.trim()) {
        setErrorMessage('Result headline title is required.');
        return;
      }
      if (!selectedFile && !url.trim()) {
        setErrorMessage('Please upload a result PDF or specify a direct document URL.');
        return;
      }

      setIsSubmitting(true);

      try {
        let finalUrl = url.trim();
        let finalFileId = fileId;
        let finalFileName = fileName;

        if (selectedFile) {
          setIsUploadingFile(true);
          const uploadedAsset = await uploadToImageKit(selectedFile, '/results');
          finalUrl = uploadedAsset.url;
          finalFileId = uploadedAsset.fileId;
          finalFileName = selectedFile.name;
          setIsUploadingFile(false);
        }

        const payload = {
          title: title.trim(),
          programType,
          sessionId: sessionId.trim(),
          sessionLabel: sessionLabel.trim(),
          semesterId: programType === 'bsc' ? semesterId : 'none',
          examType,
          isNew,
          isActive,
          url: finalUrl,
          fileId: finalFileId,
          fileName: finalFileName || finalUrl.split('/').pop(),
          verificationLabel: verificationLabel.trim(),
          verificationUrl: verificationUrl.trim(),
        };

        if (editingResult) {
          const targetId = editingResult._id || editingResult.id;
          const response = await apiClient.put(`/results/${targetId}`, payload);
          if (response.data?.result) {
            onResultSaved?.(response.data.result, true);
          }
          setSuccessMessage('Result declaration updated.');
        } else {
          const response = await apiClient.post('/results', payload);
          if (response.data?.result) {
            onResultSaved?.(response.data.result, false);
          }
          setSuccessMessage('Academic result published to archive.');
        }

        setTimeout(() => {
          setSuccessMessage(null);
          onClose();
        }, 900);
      } catch (err) {
        setIsUploadingFile(false);
        setErrorMessage(
          err.response?.data?.message || err.message || 'Failed to save result record.'
        );
      } finally {
        setIsSubmitting(false);
      }
    };

    const isBusy = isSubmitting || isUploadingFile;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div
          onClick={() => !isBusy && onClose()}
          className="fixed inset-0 bg-[#303030]/50 backdrop-blur-sm"
        />

        <div
          ref={ref}
          data-lenis-prevent="true"
          className="relative z-10 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-[#E6E2D8] bg-[#FFFFFF] p-6 shadow-2xl sm:p-8 lg:max-w-2xl 2xl:max-w-3xl 2xl:p-10"
        >
          <div className="flex items-start justify-between border-b border-[#E6E2D8] pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#E6E2D8] bg-[#F7F5F0] text-[#E85D04]">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-normal text-[#303030] sm:text-2xl">
                  {editingResult ? 'Update Examination Result' : 'Publish Examination Result'}
                </h3>
                <span className="font-sans text-[11px] font-semibold uppercase tracking-widest text-[#707884]">
                  Official Academic Result Dispatch
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isBusy}
              className="rounded-xl p-1.5 text-[#707884] hover:bg-[#F7F5F0] hover:text-[#303030]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {errorMessage && (
            <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50/80 p-3.5 text-xs text-rose-800 sm:text-sm">
              <ShieldAlert className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3.5 text-xs text-emerald-800 sm:text-sm">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Program Tier & Exam Type */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-sans text-[11px] font-semibold uppercase tracking-wider text-[#707884]">
                  Academic Program *
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {[
                    { id: 'bsc', label: 'B.Sc. HHA' },
                    { id: 'diploma', label: 'Diploma' },
                  ].map((prog) => (
                    <button
                      key={prog.id}
                      type="button"
                      disabled={isBusy}
                      onClick={() => setProgramType(prog.id)}
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

              <div>
                <label className="block font-sans text-[11px] font-semibold uppercase tracking-wider text-[#707884]">
                  Examination Category *
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {['Regular', 'Reappear'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      disabled={isBusy}
                      onClick={() => setExamType(type)}
                      className={`rounded-xl border py-2.5 font-sans text-xs font-medium transition-all ${
                        examType === type
                          ? 'border-[#E85D04] bg-[#E85D04]/10 text-[#E85D04]'
                          : 'border-[#E6E2D8] bg-[#FFFFFF] text-[#707884]'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Session & Semester */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-sans text-[11px] font-semibold uppercase tracking-wider text-[#707884]">
                  Academic Session *
                </label>
                <select
                  value={sessionId}
                  onChange={handleSessionSelect}
                  disabled={isBusy}
                  className="mt-2 w-full rounded-xl border border-[#E6E2D8] bg-[#F7F5F0]/50 px-3.5 py-3 font-sans text-xs text-[#303030] outline-none focus:border-[#E85D04] focus:bg-[#FFFFFF] sm:text-sm"
                >
                  {PRESET_SESSIONS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label} ({s.id})
                    </option>
                  ))}
                </select>
              </div>

              {programType === 'bsc' && (
                <div>
                  <label className="block font-sans text-[11px] font-semibold uppercase tracking-wider text-[#707884]">
                    Semester *
                  </label>
                  <select
                    value={semesterId}
                    onChange={(e) => setSemesterId(e.target.value)}
                    disabled={isBusy}
                    className="mt-2 w-full rounded-xl border border-[#E6E2D8] bg-[#F7F5F0]/50 px-3.5 py-3 font-sans text-xs text-[#303030] outline-none focus:border-[#E85D04] focus:bg-[#FFFFFF] sm:text-sm"
                  >
                    <option value="1">Semester I</option>
                    <option value="2">Semester II</option>
                    <option value="3">Semester III</option>
                    <option value="4">Semester IV</option>
                    <option value="5">Semester V</option>
                    <option value="6">Semester VI</option>
                  </select>
                </div>
              )}
            </div>

            {/* Result Headline */}
            <div>
              <label className="block font-sans text-[11px] font-semibold uppercase tracking-wider text-[#707884]">
                Result Headline Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Result of SEM 2 of B.Sc. HHA session 2024-25"
                required
                disabled={isBusy}
                className="mt-2 w-full rounded-xl border border-[#E6E2D8] bg-[#F7F5F0]/50 p-3 font-sans text-xs text-[#303030] outline-none focus:border-[#E85D04] focus:bg-[#FFFFFF] sm:text-sm"
              />
            </div>

            {/* Optional Verification Link */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-sans text-[11px] font-semibold uppercase tracking-wider text-[#707884]">
                  Verification Form Label (Optional)
                </label>
                <div className="relative mt-2">
                  <Link2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#707884]" />
                  <input
                    type="text"
                    value={verificationLabel}
                    onChange={(e) => setVerificationLabel(e.target.value)}
                    placeholder="e.g., Marks Verification Form Sem II"
                    disabled={isBusy}
                    className="w-full rounded-xl border border-[#E6E2D8] bg-[#F7F5F0]/50 py-2.5 pl-10 pr-3 font-sans text-xs text-[#303030] outline-none focus:border-[#E85D04] focus:bg-[#FFFFFF]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-sans text-[11px] font-semibold uppercase tracking-wider text-[#707884]">
                  Verification Form URL (Optional)
                </label>
                <input
                  type="text"
                  value={verificationUrl}
                  onChange={(e) => setVerificationUrl(e.target.value)}
                  placeholder="https://... or /files/..."
                  disabled={isBusy}
                  className="mt-2 w-full rounded-xl border border-[#E6E2D8] bg-[#F7F5F0]/50 px-3.5 py-2.5 font-mono text-xs text-[#303030] outline-none focus:border-[#E85D04] focus:bg-[#FFFFFF]"
                />
              </div>
            </div>

            {/* PDF Upload */}
            <div>
              <label className="block font-sans text-[11px] font-semibold uppercase tracking-wider text-[#707884]">
                Official Result PDF Sheet (ImageKit Cloud) *
              </label>
              <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#E6E2D8] bg-[#F7F5F0]/40 p-5 text-center transition-all hover:border-[#E85D04] hover:bg-[#F7F5F0]">
                <UploadCloud className="h-7 w-7 text-[#E85D04]" />
                <span className="mt-2 font-sans text-xs font-medium text-[#303030] sm:text-sm">
                  {selectedFile
                    ? `Selected: ${selectedFile.name}`
                    : fileName
                    ? `Attached: ${fileName} (Click to replace)`
                    : 'Click to upload Result PDF Sheet'}
                </span>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileSelect}
                  disabled={isBusy}
                  className="hidden"
                />
              </label>

              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Or enter direct PDF URL (https://ik.imagekit.io/...)"
                disabled={isBusy || Boolean(selectedFile)}
                className="mt-2.5 w-full rounded-xl border border-[#E6E2D8] bg-[#F7F5F0]/50 px-3.5 py-2.5 font-mono text-xs text-[#303030] outline-none focus:border-[#E85D04] focus:bg-[#FFFFFF] disabled:opacity-50"
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
                  <div className="font-sans text-xs font-semibold">"New Result" Badge</div>
                  <div className="font-sans text-[11px] opacity-80">Highlight with accent pill</div>
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
                    {isActive ? 'Visible on Results page' : 'Hidden from students'}
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
                className="rounded-xl border border-[#E6E2D8] bg-[#FFFFFF] px-5 py-2.5 font-sans text-xs text-[#707884] hover:bg-[#F7F5F0]"
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
                    <span>{isUploadingFile ? 'Uploading PDF...' : 'Saving...'}</span>
                  </>
                ) : (
                  <span>{editingResult ? 'Save Changes →' : 'Publish Result →'}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
);

ResultFormModal.displayName = 'ResultFormModal';

export default ResultFormModal;