import React, { useEffect } from 'react';

export default function AdmissionForm({ isOpen, onClose }) {
  // Prevent scrolling on the main body when the drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Dark Backdrop Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-500 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      ></div>

      {/* The Slide-Out Drawer */}
      <div 
        className={`fixed top-0 right-0 w-full max-w-md h-full bg-[var(--text-light)] z-[70] shadow-2xl flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200">
          <h2 className="head-txt text-2xl text-[var(--text-main)] uppercase tracking-tight">
            Admission Query
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-[var(--text-main)] transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar">
          <form className="space-y-8 flex flex-col h-full" onSubmit={(e) => e.preventDefault()}>
            
            {/* Input Group: Name */}
            <div className="relative group">
              <input type="text" id="name" required className="w-full bg-transparent border-b border-gray-300 py-2 text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-base)] transition-colors peer" placeholder=" " />
              <label htmlFor="name" className="absolute left-0 top-2 text-gray-500 text-sm transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[var(--text-main)] peer-valid:-top-4 peer-valid:text-xs">
                Full Name
              </label>
            </div>

            {/* Input Group: Mobile & Email */}
            <div className="grid grid-cols-2 gap-6">
              <div className="relative group">
                <input type="tel" id="mobile" required className="w-full bg-transparent border-b border-gray-300 py-2 text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-base)] transition-colors peer" placeholder=" " />
                <label htmlFor="mobile" className="absolute left-0 top-2 text-gray-500 text-sm transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[var(--text-main)] peer-valid:-top-4 peer-valid:text-xs">
                  Mobile No.
                </label>
              </div>
              <div className="relative group">
                <input type="email" id="email" required className="w-full bg-transparent border-b border-gray-300 py-2 text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-base)] transition-colors peer" placeholder=" " />
                <label htmlFor="email" className="absolute left-0 top-2 text-gray-500 text-sm transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[var(--text-main)] peer-valid:-top-4 peer-valid:text-xs">
                  Email ID
                </label>
              </div>
            </div>

            {/* Dropdowns */}
            <div className="grid grid-cols-2 gap-6">
              <div className="relative">
                <select className="w-full bg-transparent border-b border-gray-300 py-2 text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-base)] appearance-none cursor-pointer">
                  <option value="" disabled selected>Course Enquired</option>
                  <option value="bsc">B.Sc. Hospitality</option>
                  <option value="diploma">Diploma in Food Production</option>
                  <option value="craft">Craftsmanship Course</option>
                </select>
                <div className="absolute right-0 top-3 pointer-events-none text-gray-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                </div>
              </div>
              
              <div className="relative">
                <select className="w-full bg-transparent border-b border-gray-300 py-2 text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-base)] appearance-none cursor-pointer">
                  <option value="" disabled selected>Select District</option>
                  <option value="paschim-bardhaman">Paschim Bardhaman</option>
                  <option value="kolkata">Kolkata</option>
                  <option value="other">Other</option>
                </select>
                <div className="absolute right-0 top-3 pointer-events-none text-gray-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                </div>
              </div>
            </div>

            {/* Textarea: Address */}
            <div className="relative group">
              <textarea id="address" rows="3" required className="w-full bg-transparent border-b border-gray-300 py-2 text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-base)] transition-colors peer resize-none" placeholder=" "></textarea>
              <label htmlFor="address" className="absolute left-0 top-2 text-gray-500 text-sm transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[var(--text-main)] peer-valid:-top-4 peer-valid:text-xs">
                Complete Address
              </label>
            </div>

            {/* Submit Button */}
            <div className="mt-auto pt-8">
              <button type="submit" className="w-full bg-[var(--primary-base)] text-[var(--text-light)] py-4 font-sans font-bold text-sm uppercase tracking-widest hover:bg-[var(--primary-light)] transition-colors duration-300">
                Submit Application
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}