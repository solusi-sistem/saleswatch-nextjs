'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getTermsConditionsData, listenToTermsConditionsChanges } from '@/lib/sanity.termsConditions';
import type { TermsConditionsSection } from '@/types/termsConditions';

interface TermsConditionsContextType {
  data: TermsConditionsSection | null;
  loading: boolean;
  error: string | null;
}

const TermsConditionsContext = createContext<TermsConditionsContextType | undefined>(undefined);

export function TermsConditionsProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<TermsConditionsSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const result = await getTermsConditionsData();
        setData(result);
      } catch (err) {
        setError('Failed to load terms and conditions');
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    // Listen for real-time updates
    const unsubscribe = listenToTermsConditionsChanges((updatedData) => {
      setData(updatedData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <TermsConditionsContext.Provider value={{ data, loading, error }}>
      {children}
    </TermsConditionsContext.Provider>
  );
}

export function useTermsConditions() {
  const context = useContext(TermsConditionsContext);
  if (context === undefined) {
    throw new Error('useTermsConditions must be used within TermsConditionsProvider');
  }
  return context;
}