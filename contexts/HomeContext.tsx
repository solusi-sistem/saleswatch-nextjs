'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  getTestimonialData,
  listenToTestimonialChanges,
  getWhyItWorksData,
  listenToWhyItWorksChanges,
  getStoryVisionMissionData, 
  listenToStoryVisionMissionChanges,
  getFaqData, 
  listenToFaqChanges,
  getRequestDemoData, 
  listenToRequestDemoChanges,
} from '@/lib/sanity.home';
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
  // Hero State

  // Testimonial State
  const [testimonial, setTestimonial] = useState<TestimonialSection | null>(null);
  const [testimonialLoading, setTestimonialLoading] = useState(true);
  const [testimonialError, setTestimonialError] = useState<string | null>(null);

  // Why It Works State
  const [whyItWorks, setWhyItWorks] = useState<WhyItWorksSection | null>(null);
  const [whyItWorksLoading, setWhyItWorksLoading] = useState(true);
  const [whyItWorksError, setWhyItWorksError] = useState<string | null>(null);

  // Story Vision Mission State
  const [storyVisionMission, setStoryVisionMission] = useState<StoryVisionMissionSection | null>(null);
  const [storyLoading, setStoryLoading] = useState(true);
  const [storyError, setStoryError] = useState<string | null>(null);

  // FAQ State
  const [faq, setFaq] = useState<FaqSection | null>(null);
  const [faqLoading, setFaqLoading] = useState(true);
  const [faqError, setFaqError] = useState<string | null>(null);

  // Request Demo State
  const [requestDemo, setRequestDemo] = useState<RequestDemoSection | null>(null);
  const [demoLoading, setDemoLoading] = useState(true);
  const [demoError, setDemoError] = useState<string | null>(null);

  const fetchAllData = async () => {
    // Fetch semua data secara PARALLEL (bersamaan) sesuai urutan page
    await Promise.allSettled([
      // 1. Hero
 

      // 2. Testimonial
      (async () => {
        try {
          setTestimonialLoading(true);
          setTestimonialError(null);
          const testimonialData = await getTestimonialData();
          setTestimonial(testimonialData);
        } catch (err) {
          setTestimonialError(err instanceof Error ? err.message : 'Failed to load Testimonial');
        } finally {
          setTestimonialLoading(false);
        }
      })(),

      // 3. Why It Works
      (async () => {
        try {
          setWhyItWorksLoading(true);
          setWhyItWorksError(null);
          const whyItWorksData = await getWhyItWorksData();
          setWhyItWorks(whyItWorksData);
        } catch (err) {
          setWhyItWorksError(err instanceof Error ? err.message : 'Failed to load Why It Works');
        } finally {
          setWhyItWorksLoading(false);
        }
      })(),

      // 4. Story Vision Mission
      (async () => {
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
      })(),

      // 5. FAQ
      (async () => {
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
      })(),

      // 6. Request Demo
      (async () => {
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
      })(),
    ]);
  };

  useEffect(() => {
    // Fetch data immediately saat component mount
    fetchAllData();

    const unsubscribeTestimonial = listenToTestimonialChanges((newData) => {
      setTestimonial(newData);
    });

    const unsubscribeWhyItWorks = listenToWhyItWorksChanges((newData) => {
      setWhyItWorks(newData);
    });

    const unsubscribeStory = listenToStoryVisionMissionChanges((newData) => {
      setStoryVisionMission(newData);
    });

    const unsubscribeFaq = listenToFaqChanges((newData) => {
      setFaq(newData);
    });

    const unsubscribeDemo = listenToRequestDemoChanges((newData) => {
      setRequestDemo(newData);
    });

    return () => {
      unsubscribeTestimonial();
      unsubscribeWhyItWorks();
      unsubscribeStory();
      unsubscribeFaq();
      unsubscribeDemo();
    };
  }, []);

  return (
    <HomeContext.Provider
      value={{

        testimonial: {
          data: testimonial,
          loading: testimonialLoading,
          error: testimonialError,
        },
        whyItWorks: {
          data: whyItWorks,
          loading: whyItWorksLoading,
          error: whyItWorksError,
        },
        storyVisionMission: {
          data: storyVisionMission,
          loading: storyLoading,
          error: storyError,
        },
        faq: {
          data: faq,
          loading: faqLoading,
          error: faqError,
        },
        requestDemo: {
          data: requestDemo,
          loading: demoLoading,
          error: demoError,
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

// Custom hooks untuk setiap section (sesuai urutan page)

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