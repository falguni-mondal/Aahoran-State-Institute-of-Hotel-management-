import React, { useRef, useState } from 'react';
import gsap from 'gsap';

export default function NBDownloadButton({ url }) {
  const buttonRef = useRef(null);
  const flairRef = useRef(null);
  const textRef = useRef(null);
  const iconRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Extract the exact filename from the URL path
  const extractedFileName = url
    ? decodeURIComponent(url.split('/').pop())
    : 'notice-document.pdf';

  // Handle precise coordinate tracking on mouse enter
  const handleMouseEnter = (e) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();

    const clientX = e.clientX ?? rect.left + rect.width / 2;
    const clientY = e.clientY ?? rect.top + rect.height / 2;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    gsap.set(flairRef.current, {
      left: x,
      top: y,
      scale: 0,
      xPercent: -50,
      yPercent: -50,
    });

    gsap.to(flairRef.current, {
      scale: 3,
      duration: 0.5,
      ease: 'power3.out',
      overwrite: true,
    });

    gsap.to([textRef.current, iconRef.current], {
      color: 'var(--background)',
      duration: 0.2,
      overwrite: true,
    });
  };

  // Handle precise coordinate tracking on mouse leave
  const handleMouseLeave = (e) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();

    const clientX = e.clientX ?? rect.left + rect.width / 2;
    const clientY = e.clientY ?? rect.top + rect.height / 2;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    gsap.to(flairRef.current, {
      left: x,
      top: y,
      scale: 0,
      duration: 0.5,
      ease: 'power3.out',
      overwrite: true,
    });

    gsap.to([textRef.current, iconRef.current], {
      color: 'var(--accent)',
      duration: 0.3,
      overwrite: true,
    });
  };

  // Programmatic Blob download to bypass browser PDF viewer interception
  const handleDownload = async (e) => {
    e.preventDefault();

    if (!url || isDownloading) return;

    try {
      setIsDownloading(true);

      const response = await fetch(url);
      const contentType = response.headers.get('content-type') || '';

      // Detect if Vite fell back to index.html because the file isn't in /public
      if (!response.ok || contentType.includes('text/html')) {
        console.error(
          `[Download Error] File not found at "${url}". Ensure the file exists inside "public${url}".`
        );
        alert(
          `File not found. Please ensure the PDF is placed inside your project's "public${url}" directory.`
        );
        return;
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const tempLink = document.createElement('a');
      tempLink.href = blobUrl;
      tempLink.setAttribute('download', extractedFileName);
      document.body.appendChild(tempLink);
      tempLink.click();

      // Clean up temporary DOM node and memory reference
      document.body.removeChild(tempLink);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Failed to download notice PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <a
      ref={buttonRef}
      href={url || '#'}
      download={extractedFileName}
      onClick={handleDownload}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden flex items-center justify-center gap-2 border border-[var(--accent)]/20 px-5 py-3 sm:px-5 sm:py-3 md:px-6 md:py-3.5 lg:px-6 lg:py-3.5 xl:px-7 xl:py-4 2xl:px-8 2xl:py-4 rounded-full outline-none transition-colors duration-300 w-full md:w-auto shrink-0 cursor-pointer no-underline"
    >
      {/* DIRECTIONAL FLAIR FILL */}
      <span
        ref={flairRef}
        className="pointer-events-none absolute w-[200px] h-[200px] bg-[var(--accent)] rounded-full z-0"
        style={{ transform: 'scale(0)' }}
      ></span>

      {/* Button Icon */}
      <svg
        ref={iconRef}
        className="w-3.5 h-3.5 md:w-4 md:h-4 2xl:w-4.5 2xl:h-4.5 text-[var(--accent)] relative z-10"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>

      {/* Button Text */}
      <span
        ref={textRef}
        className="font-sans text-[10px] md:text-[11px] 2xl:text-xs font-bold uppercase tracking-[0.15em] text-[var(--accent)] relative z-10"
      >
        {isDownloading ? 'Saving...' : 'Download'}
      </span>
    </a>
  );
}