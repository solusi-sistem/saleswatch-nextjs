'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getLayoutData } from '@/lib/sanity.realtime';
import type { LayoutData } from '@/types';

interface LayoutContextType {
  layoutData: LayoutData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [layoutData, setLayoutData] = useState<LayoutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLayoutData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getLayoutData();
      setLayoutData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load layout data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLayoutData();
  }, []);

  return (
    <LayoutContext.Provider value={{ 
      layoutData, 
      loading, 
      error,
      refetch: fetchLayoutData 
    }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}