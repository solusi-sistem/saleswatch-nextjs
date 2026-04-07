'use client';

import { useEffect } from 'react';

export default function HashHandler({ openModal }) {
  useEffect(() => {
    // 1. Logic to check the hash
    const checkHash = () => {
      if (window.location.hash === '#request-demo') {
        openModal(true);
      }
    };

    // 2. Check immediately on page load
    const timeoutId = setTimeout(checkHash, 500);

    // 3. Listen for changes if the user clicks a link while already on the page
    window.addEventListener('hashchange', checkHash);

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('hashchange', checkHash);
    };
  }, [openModal]);

  return null;
}
