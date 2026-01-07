'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getStoryVisionMissionData, listenToStoryVisionMissionChanges } from '@/lib/sanity.home';
import type { StoryVisionMissionSection } from '@/types/home';

interface StoryVisionMissionContextType {
  data: StoryVisionMissionSection | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const StoryVisionMissionContext = createContext<StoryVisionMissionContextType | undefined>(undefined);

export function StoryVisionMissionProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StoryVisionMissionSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getStoryVisionMissionData();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load Story Vision Mission data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Subscribe to real-time changes
    const unsubscribe = listenToStoryVisionMissionChanges((newData) => {
      setData(newData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <StoryVisionMissionContext.Provider value={{ data, loading, error, refetch: fetchData }}>
      {children}
    </StoryVisionMissionContext.Provider>
  );
}

export function useStoryVisionMission() {
  const context = useContext(StoryVisionMissionContext);
  if (context === undefined) {
    throw new Error('useStoryVisionMission must be used within a StoryVisionMissionProvider');
  }
  return context;
}