"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getLayoutData } from "@/lib/sanity.realtime";
import type { LayoutData } from "@/types";

interface LayoutContextType {
  layoutData: LayoutData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData?: LayoutData | null;
}) {
  const [layoutData, setLayoutData] = useState<LayoutData | null>(
    initialData || null,
  );
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);

  const fetchLayoutData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fallback (browser-side re-fetching or if initialData wasn't provided)
      const { getLayoutData } = await import("@/lib/sanity");
      const data = await getLayoutData();
      setLayoutData(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load layout data",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialData) {
      fetchLayoutData();
    }
  }, [initialData]);

  return (
    <LayoutContext.Provider
      value={{
        layoutData,
        loading,
        error,
        refetch: fetchLayoutData,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
}
