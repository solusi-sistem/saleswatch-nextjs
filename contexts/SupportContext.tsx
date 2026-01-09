'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getSupportData, listenToSupportChanges } from '@/lib/sanity.support';
import type { SupportSection } from '@/types/support';

interface SupportContextType {
  data: SupportSection | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const SupportContext = createContext<SupportContextType | undefined>(undefined);

export function SupportProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SupportSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getSupportData();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load Support data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Subscribe to real-time changes
    const unsubscribe = listenToSupportChanges((newData) => {
      setData(newData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <SupportContext.Provider value={{ data, loading, error, refetch: fetchData }}>
      {children}
    </SupportContext.Provider>
  );
}

export function useSupport() {
  const context = useContext(SupportContext);
  if (context === undefined) {
    throw new Error('useSupport must be used within a SupportProvider');
  }
  return context;
}