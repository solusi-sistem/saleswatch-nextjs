'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  getStoryVisionMissionData, 
  listenToStoryVisionMissionChanges, 
  getRequestDemoData, 
  listenToRequestDemoChanges,
  getFaqData,
  listenToFaqChanges
} from '@/lib/sanity.home';
import type { StoryVisionMissionSection, RequestDemoSection, FaqSection } from '@/types/home';

interface HomeContextType {
  storyVisionMission: {
    data: StoryVisionMissionSection | null;
    loading: boolean;
    error: string | null;
  };
  requestDemo: {
    data: RequestDemoSection | null;
    loading: boolean;
    error: string | null;
  };
  faq: {
    data: FaqSection | null;
    loading: boolean;
    error: string | null;
  };
  refetch: () => Promise<void>;
}

const HomeContext = createContext<HomeContextType | undefined>(undefined);

export function HomeProvider({ children }: { children: ReactNode }) {
  const [storyVisionMission, setStoryVisionMission] = useState<StoryVisionMissionSection | null>(null);
  const [storyLoading, setStoryLoading] = useState(true);
  const [storyError, setStoryError] = useState<string | null>(null);

  const [requestDemo, setRequestDemo] = useState<RequestDemoSection | null>(null);
  const [demoLoading, setDemoLoading] = useState(true);
  const [demoError, setDemoError] = useState<string | null>(null);

  const [faq, setFaq] = useState<FaqSection | null>(null);
  const [faqLoading, setFaqLoading] = useState(true);
  const [faqError, setFaqError] = useState<string | null>(null);

  const fetchAllData = async () => {
    // Fetch Story Vision Mission
    try {
      setStoryLoading(true);
      setStoryError(null);
      const storyData = await getStoryVisionMissionData();
      setStoryVisionMission(storyData);
    } catch (err) {
      setStoryError(err instanceof Error ? err.message : 'Failed to load Story Vision Mission');
    } finally {
      setStoryLoading(false);
    }

    // Fetch Request Demo
    try {
      setDemoLoading(true);
      setDemoError(null);
      const demoData = await getRequestDemoData();
      setRequestDemo(demoData);
    } catch (err) {
      setDemoError(err instanceof Error ? err.message : 'Failed to load Request Demo');
    } finally {
      setDemoLoading(false);
    }

    // Fetch FAQ
    try {
      setFaqLoading(true);
      setFaqError(null);
      const faqData = await getFaqData();
      setFaq(faqData);
    } catch (err) {
      setFaqError(err instanceof Error ? err.message : 'Failed to load FAQ');
    } finally {
      setFaqLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();

    const unsubscribeStory = listenToStoryVisionMissionChanges((newData) => {
      setStoryVisionMission(newData);
    });

    const unsubscribeDemo = listenToRequestDemoChanges((newData) => {
      setRequestDemo(newData);
    });

    const unsubscribeFaq = listenToFaqChanges((newData) => {
      setFaq(newData);
    });

    return () => {
      unsubscribeStory();
      unsubscribeDemo();
      unsubscribeFaq();
    };
  }, []);

  return (
    <HomeContext.Provider
      value={{
        storyVisionMission: {
          data: storyVisionMission,
          loading: storyLoading,
          error: storyError,
        },
        requestDemo: {
          data: requestDemo,
          loading: demoLoading,
          error: demoError,
        },
        faq: {
          data: faq,
          loading: faqLoading,
          error: faqError,
        },
        refetch: fetchAllData,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
}

export function useHome() {
  const context = useContext(HomeContext);
  if (context === undefined) {
    throw new Error('useHome must be used within a HomeProvider');
  }
  return context;
}

export function useStoryVisionMission() {
  const { storyVisionMission } = useHome();
  return storyVisionMission;
}

export function useRequestDemo() {
  const { requestDemo } = useHome();
  return requestDemo;
}

export function useFaq() {
  const { faq } = useHome();
  return faq;
}