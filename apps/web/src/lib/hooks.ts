/**
 * Custom React hooks for TanStack Query and general utilities
 * Use these hooks in your client components to fetch, mutate data, and manage state
 */

import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { get, post, put, del } from './api-client';



// Example: Fetch portfolios list
export function usePortfolios(options?: Omit<UseQueryOptions, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['portfolios'],
    queryFn: () => get('/api/portfolios'),
    ...options,
  });
}

// Example: Fetch single portfolio
export function usePortfolio(id: string, options?: Omit<UseQueryOptions, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['portfolio', id],
    queryFn: () => get(`/api/portfolios/${id}`),
    enabled: !!id, // Only run if id is provided
    ...options,
  });
}

// Example: Create/Save portfolio
export function useSavePortfolio(options?: Omit<UseMutationOptions<unknown, Error, Record<string, unknown>>, 'mutationFn'>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Record<string, unknown>) => post('/api/portfolios', data),
    onSuccess: () => {
      // Invalidate the portfolios list to refetch it
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
    },
    ...options,
  });
}

// Example: Update portfolio
export function useUpdatePortfolio(id: string, options?: Omit<UseMutationOptions<unknown, Error, Record<string, unknown>>, 'mutationFn'>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Record<string, unknown>) => put(`/api/portfolios/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio', id] });
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
    },
    ...options,
  });
}

// Example: Delete portfolio
export function useDeletePortfolio(options?: Omit<UseMutationOptions<unknown, Error, string>, 'mutationFn'>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => del(`/api/portfolios/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
    },
    ...options,
  });
}

// Example: Run portfolio analysis
export function useAnalyzePortfolio(options?: Omit<UseMutationOptions<unknown, Error, Record<string, unknown>>, 'mutationFn'>) {
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => post('/api/analyze', data),
    ...options,
  });
}
