'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getMasterData } from '@/lib/sanity';
import type { 
  TestimonialSection,
  WhyItWorksSection,
  StoryVisionMissionSection, 
  FaqSection,
  RequestDemoSection,
} from '@/types/home';

interface HomeContextType {
  testimonial: {
    data: TestimonialSection | null;
    loading: boolean;
    error: string | null;
  };
  whyItWorks: {
    data: WhyItWorksSection | null;
    loading: boolean;
    error: string | null;
  };
  storyVisionMission: {
    data: StoryVisionMissionSection | null;
    loading: boolean;
    error: string | null;
  };
  faq: {
    data: FaqSection | null;
    loading: boolean;
    error: string | null;
  };
  requestDemo: {
    data: RequestDemoSection | null;
    loading: boolean;
    error: string | null;
  };
  refetch: () => Promise<void>;
}

const HomeContext = createContext<HomeContextType | undefined>(undefined);

export function HomeProvider({ children }: { children: ReactNode }) {
  // States
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch everything for home page in ONE go using the Master Query
      const masterData = await getMasterData(""); // "" for homepage
      if (masterData) {
        setData(masterData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load Home data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <HomeContext.Provider
      value={{
        testimonial: {
          data: data?.testimonials || null,
          loading: loading,
          error: error,
        },
        whyItWorks: {
          data: data?.whyItWorks || null,
          loading: loading,
          error: error,
        },
        storyVisionMission: {
          data: data?.storyVisionMission || null,
          loading: loading,
          error: error,
        },
        faq: {
          data: data?.faq || null,
          loading: loading,
          error: error,
        },
        requestDemo: {
          data: data?.requestDemo || null,
          loading: loading,
          error: error,
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

export function useTestimonial() {
  const { testimonial } = useHome();
  return testimonial;
}

export function useWhyItWorks() {
  const { whyItWorks } = useHome();
  return whyItWorks;
}

export function useStoryVisionMission() {
  const { storyVisionMission } = useHome();
  return storyVisionMission;
}

export function useFaq() {
  const { faq } = useHome();
  return faq;
}

export function useRequestDemo() {
  const { requestDemo } = useHome();
  return requestDemo;
}
