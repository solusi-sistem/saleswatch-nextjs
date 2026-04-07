'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import ScheduleDemoModal from './modals/ScheduleDemoModal';

export default function HashHandler() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkHash = () => {
      // Triggers if URL ends in #request-demo
      if (window.location.hash === '#request-demo') {
        setIsOpen(true);
      }
    };

    // Check on initial load
    checkHash();

    // Listen for hash changes
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Remove the hash from the URL so it doesn't stay there after closing
    if (window.location.hash === '#request-demo') {
      window.history.replaceState(null, "", window.location.pathname);
    }
  };

  // Determine button text based on language
  const isIndo = pathname.startsWith('/id');
  const buttonText = isIndo ? "Jadwalkan Demo" : "Schedule Demo";

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-[#061551] text-white px-8 py-3 rounded-full font-bold hover:bg-opacity-90 transition-all shadow-lg"
      >
        {buttonText}
      </button>

      <ScheduleDemoModal 
        isOpen={isOpen} 
        onClose={handleClose} 
      />
    </>
  );
}
