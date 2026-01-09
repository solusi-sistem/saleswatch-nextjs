'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getPrivacyPolicyData, listenToPrivacyPolicyChanges } from '@/lib/sanity.privacyPolicy';
import type { PrivacyPolicySection } from '@/types/privacyPolicy';

interface PrivacyPolicyContextType {
  data: PrivacyPolicySection | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const PrivacyPolicyContext = createContext<PrivacyPolicyContextType | undefined>(undefined);

export function PrivacyPolicyProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PrivacyPolicySection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getPrivacyPolicyData();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load Privacy Policy data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Subscribe to real-time changes
    const unsubscribe = listenToPrivacyPolicyChanges((newData) => {
      setData(newData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <PrivacyPolicyContext.Provider value={{ data, loading, error, refetch: fetchData }}>
      {children}
    </PrivacyPolicyContext.Provider>
  );
}

export function usePrivacyPolicy() {
  const context = useContext(PrivacyPolicyContext);
  if (context === undefined) {
    throw new Error('usePrivacyPolicy must be used within a PrivacyPolicyProvider');
  }
  return context;
}