import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

// Custom Select Component built to match the premium form UI
const CustomSelect = ({ options, placeholder, id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const dropdownRef = useRef(null);

  // Handle clicking outside to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative group col-span-1 md:col-span-2" ref={dropdownRef}>
      {/* Hidden input to ensure form submission captures the value */}
      <input type="hidden" id={id} value={selected} required />
      
      {/* The Trigger/Input Area */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-transparent border-b py-2 transition-colors text-sm cursor-pointer flex justify-between items-center ${
          isOpen ? 'border-[var(--primary-base)]' : 'border-[var(--text-muted)]/30 hover:border-[var(--primary-base)]/50'
        }`}
      >
        <span className={selected ? "text-[var(--text-main)]" : "text-[var(--text-muted)] font-medium"}>
          {selected || placeholder}
        </span>
        <svg 
          className={`w-3 h-3 text-[var(--text-muted)] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </div>

      {/* The Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute left-0 top-full mt-1 w-full bg-[#f8f9fa] border border-[var(--text-muted)]/10 shadow-2xl z-50 max-h-52 overflow-y-auto rounded-sm"
          onWheel={(e) => e.stopPropagation()} // Prevents scrolling the modal when scrolling the dropdown
        >
          {options.map((option, index) => (
            <div 
              key={index}
              onClick={() => {
                setSelected(option);
                setIsOpen(false);
              }}
              className={`px-4 py-3 text-sm cursor-pointer transition-colors ${
                selected === option 
                  ? 'bg-[var(--primary-base)] text-[var(--text-light)]' 
                  : 'text-[var(--text-main)] hover:bg-[var(--primary-base)]/10'
              }`}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function AdmissionModal({ isOpen, onClose }) {
  const modalWrapperRef = useRef(null);
  const modalBgRef = useRef(null);
  const modalContentRef = useRef(null);

  // Complete list of West Bengal Districts
  const wbDistricts = [
    "Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur", 
    "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", 
    "Kalimpong", "Kolkata", "Malda", "Murshidabad", "Nadia", 
    "North 24 Parganas", "Paschim Bardhaman", "Paschim Medinipur", 
    "Purba Bardhaman", "Purba Medinipur", "Purulia", "South 24 Parganas", 
    "Uttar Dinajpur"
  ];

  // Course Options from Screenshot
  const courseOptions = [
    "B.Sc. in Hospitality and Hotel Administration",
    "Diploma in Food Production / Food & Beverage Service"
  ];

  useGSAP(() => {
    if (isOpen) {
      gsap.to(modalWrapperRef.current, { autoAlpha: 1, duration: 0.4, ease: "power2.out" });
      gsap.fromTo(
        modalContentRef.current,
        { y: 40, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "power3.out", delay: 0.1 }
      );
    } else {
      gsap.to(modalWrapperRef.current, { autoAlpha: 0, duration: 0.3, ease: "power2.in" });
    }
  }, [isOpen]);

  return (
    <div
      ref={modalWrapperRef}
      className="fixed inset-0 z-[100] flex items-center justify-center invisible opacity-0 p-4 md:p-0"
    >
      {/* Blurred Backdrop */}
      <div
        ref={modalBgRef}
        onClick={onClose}
        className="absolute inset-0 bg-[#111111]/65 backdrop-blur-md cursor-pointer"
      ></div>

      {/* Modal Content */}
      <div
        ref={modalContentRef}
        className="relative z-10 w-full max-w-3xl bg-[var(--text-light)] text-[var(--text-main)] rounded-sm shadow-2xl overflow-hidden flex flex-col md:flex-row"
      >
        {/* Left Side - Brand/Visual */}
        <div className="hidden md:flex md:w-1/3 bg-[var(--text-main)] p-8 flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--primary-light),_transparent_80%)] opacity-50 mix-blend-screen"></div>
          <div className="relative z-10">
            <h3 className="head-txt text-3xl text-[var(--text-light)] leading-tight mb-4">Start Your Journey</h3>
            <p className="font-sans text-xs text-[var(--text-light)]/70 leading-relaxed">
              Join the next generation of global hospitality leaders. Fill out the form and our counselors will reach out to you.
            </p>
          </div>
          <div className="relative z-10 flex items-center space-x-2">
             <span className="w-2 h-2 rounded-full bg-[var(--accent)]"></span>
             <span className="micro-text text-[var(--text-light)]">SIHM Durgapur</span>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-2/3 px-8 p-12 relative max-h-[90vh] overflow-y-hidden custom-scrollbar">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <h2 className="font-sans text-xl font-bold text-[var(--text-main)] tracking-tight mb-8 uppercase">
            Admission Query Form
          </h2>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8" onSubmit={(e) => e.preventDefault()}>
            
            {/* Name Input */}
            <div className="relative group col-span-1 md:col-span-2">
              <input type="text" id="name" className="w-full bg-transparent border-b border-[var(--text-muted)]/30 py-2 focus:outline-none focus:border-[var(--primary-base)] transition-colors peer text-sm text-[var(--text-main)] placeholder-transparent" placeholder="Name" required />
              <label htmlFor="name" className="absolute left-0 top-2 text-sm text-[var(--text-muted)] transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-2 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[var(--text-main)] font-medium">Full Name</label>
            </div>

            {/* Mobile No Input */}
            <div className="relative group">
              <input type="tel" id="mobile" className="w-full bg-transparent border-b border-[var(--text-muted)]/30 py-2 focus:outline-none focus:border-[var(--primary-base)] transition-colors peer text-sm text-[var(--text-main)] placeholder-transparent" placeholder="Mobile" required />
              <label htmlFor="mobile" className="absolute left-0 top-2 text-sm text-[var(--text-muted)] transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-2 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[var(--text-main)] font-medium">Mobile No.</label>
            </div>

            {/* Email Input */}
            <div className="relative group">
              <input type="email" id="email" className="w-full bg-transparent border-b border-[var(--text-muted)]/30 py-2 focus:outline-none focus:border-[var(--primary-base)] transition-colors peer text-sm text-[var(--text-main)] placeholder-transparent" placeholder="Email" required />
              <label htmlFor="email" className="absolute left-0 top-2 text-sm text-[var(--text-muted)] transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-2 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[var(--text-main)] font-medium">Email ID</label>
            </div>

            {/* Address Input */}
            <div className="relative group col-span-1 md:col-span-2">
              <input type="text" id="address" className="w-full bg-transparent border-b border-[var(--text-muted)]/30 py-2 focus:outline-none focus:border-[var(--primary-base)] transition-colors peer text-sm text-[var(--text-main)] placeholder-transparent" placeholder="Address" required />
              <label htmlFor="address" className="absolute left-0 top-2 text-sm text-[var(--text-muted)] transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-2 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[var(--text-main)] font-medium">Complete Address</label>
            </div>

            {/* Custom District Dropdown */}
            <CustomSelect 
              id="district" 
              options={wbDistricts} 
              placeholder="--Select District--" 
            />

            {/* Custom Course Dropdown */}
            <CustomSelect 
              id="course" 
              options={courseOptions} 
              placeholder="--Course Enquired--" 
            />

            {/* Submit Button */}
            <div className="col-span-1 md:col-span-2 mt-4 flex justify-end">
              <button type="submit" className="bg-[var(--accent)] text-[var(--text-light)] px-8 py-3 font-sans font-bold text-sm uppercase tracking-widest hover:bg-[var(--primary-light)] transition-colors duration-300 shadow-lg cursor-pointer">
                Submit Query
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}