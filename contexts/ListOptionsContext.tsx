'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getIndustryOptions, getCompanySizeOptions } from '@/hooks/getListOptions';
import { IndustryOption, CompanySizeOption } from '@/types/list/ListOptions';

interface ListOptionsContextType {
  industryOptions: IndustryOption[];
  companySizeOptions: CompanySizeOption[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const ListOptionsContext = createContext<ListOptionsContextType | undefined>(undefined);

export function ListOptionsProvider({ children }: { children: ReactNode }) {
  const [industryOptions, setIndustryOptions] = useState<IndustryOption[]>([]);
  const [companySizeOptions, setCompanySizeOptions] = useState<CompanySizeOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOptions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [industries, companySizes] = await Promise.all([
        getIndustryOptions(),
        getCompanySizeOptions(),
      ]);

      setIndustryOptions(industries);
      setCompanySizeOptions(companySizes);
    } catch (err) {
      setError('Failed to load options');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  const refetch = async () => {
    await fetchOptions();
  };

  return (
    <ListOptionsContext.Provider
      value={{
        industryOptions,
        companySizeOptions,
        isLoading,
        error,
        refetch,
      }}
    >
      {children}
    </ListOptionsContext.Provider>
  );
}

export function useListOptions() {
  const context = useContext(ListOptionsContext);
  if (context === undefined) {
    throw new Error('useListOptions must be used within a ListOptionsProvider');
  }
  return context;
}