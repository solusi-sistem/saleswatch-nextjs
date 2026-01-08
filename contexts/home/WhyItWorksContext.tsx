'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getWhyItWorksData, listenToWhyItWorksChanges } from '@/lib/sanity.home';
import type { WhyItWorksSection } from '@/types/home';

interface WhyItWorksContextType {
  data: WhyItWorksSection | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const WhyItWorksContext = createContext<WhyItWorksContextType | undefined>(undefined);

export function WhyItWorksProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<WhyItWorksSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getWhyItWorksData();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load Why It Works data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const unsubscribe = listenToWhyItWorksChanges((newData) => {
      setData(newData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <WhyItWorksContext.Provider value={{ data, loading, error, refetch: fetchData }}>
      {children}
    </WhyItWorksContext.Provider>
  );
}

export function useWhyItWorks() {
  const context = useContext(WhyItWorksContext);
  if (context === undefined) {
    throw new Error('useWhyItWorks must be used within a WhyItWorksProvider');
  }
  return context;
}