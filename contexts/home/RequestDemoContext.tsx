'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getRequestDemoData, listenToRequestDemoChanges } from '@/lib/sanity.home';
import type { RequestDemoSection } from '@/types/home';

interface RequestDemoContextType {
  data: RequestDemoSection | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const RequestDemoContext = createContext<RequestDemoContextType | undefined>(undefined);

export function RequestDemoProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<RequestDemoSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getRequestDemoData();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load Request Demo data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const unsubscribe = listenToRequestDemoChanges((newData) => {
      setData(newData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <RequestDemoContext.Provider value={{ data, loading, error, refetch: fetchData }}>
      {children}
    </RequestDemoContext.Provider>
  );
}

export function useRequestDemo() {
  const context = useContext(RequestDemoContext);
  if (context === undefined) {
    throw new Error('useRequestDemo must be used within a RequestDemoProvider');
  }
  return context;
}