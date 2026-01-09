'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getTermsConditionsData, listenToTermsConditionsChanges } from '@/lib/sanity.termsConditions';
import type { TermsConditionsSection } from '@/types/termsConditions';

interface TermsConditionsContextType {
  data: TermsConditionsSection | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const TermsConditionsContext = createContext<TermsConditionsContextType | undefined>(undefined);

export function TermsConditionsProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<TermsConditionsSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getTermsConditionsData();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load Terms and Conditions data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const unsubscribe = listenToTermsConditionsChanges((newData) => {
      setData(newData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <TermsConditionsContext.Provider value={{ data, loading, error, refetch: fetchData }}>
      {children}
    </TermsConditionsContext.Provider>
  );
}

export function useTermsConditions() {
  const context = useContext(TermsConditionsContext);
  if (context === undefined) {
    throw new Error('useTermsConditions must be used within a TermsConditionsProvider');
  }
  return context;
}