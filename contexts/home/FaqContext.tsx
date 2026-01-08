'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getFaqData, listenToFaqChanges } from '@/lib/sanity.home';
import type { FaqSection } from '@/types/home';

interface FaqContextType {
  data: FaqSection | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const FaqContext = createContext<FaqContextType | undefined>(undefined);

export function FaqProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<FaqSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getFaqData();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load FAQ data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const unsubscribe = listenToFaqChanges((newData) => {
      setData(newData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <FaqContext.Provider value={{ data, loading, error, refetch: fetchData }}>
      {children}
    </FaqContext.Provider>
  );
}

export function useFaq() {
  const context = useContext(FaqContext);
  if (context === undefined) {
    throw new Error('useFaq must be used within an FaqProvider');
  }
  return context;
}