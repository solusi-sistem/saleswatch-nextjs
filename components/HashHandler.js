'use client';

import { useEffect, useState } from 'react';
import ScheduleDemoModal from './modals/ScheduleDemoModal';

export default function HashHandler() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#request-demo') {
        setIsOpen(true);
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  return (
    <ScheduleDemoModal 
      isOpen={isOpen} 
      onClose={() => {
        setIsOpen(false);
        // Clean the URL hash so it doesn't pop up again on refresh
        if (window.location.hash === '#request-demo') {
          window.history.replaceState(null, "", window.location.pathname);
        }
      }} 
    />
  );
}
