import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { analyzePortfolio } from '@/lib/api/portfolio';
import type { AnalyzePortfolioResponse, AnalyzePortfolioRequest } from '@/lib/api/portfolio';
import type { PortfolioItem, AnalysisSnapshot } from '@glassbox/types';

export interface SavedPortfolio {
  id: string;
  name: string;
  tickers: string[];
  quantities: number[];
  analysisSnapshot: AnalysisSnapshot;
  updatedAt: string;
}

export interface PortfolioData {
  analysis: AnalysisSnapshot;
  items: PortfolioItem[];
  savedPortfolio?: SavedPortfolio | null;
}

export function useFetchPortfolioData(portfolioId: string | null) {
  const queryClient = useQueryClient();

  // Query for fetching portfolio data
  const portfolioQuery = useQuery<PortfolioData>({
    queryKey: ['portfolio', portfolioId || 'local'],
    queryFn: async () => {
      if (portfolioId) {
        // TODO: Implement API call to GET /api/portfolios/:id
        // const { data } = await axios.get<SavedPortfolio>(`/api/portfolios/${portfolioId}`);
        // return {
        //   analysis: data.analysisSnapshot,
        //   items: data.tickers.map((t, i) => ({ symbol: t, quantity: data.quantities[i] })),
        //   savedPortfolio: data
        // };
        
        throw new Error('Portfolio fetching not implemented yet');
      } else {
        // Load fresh analysis from sessionStorage
        if (typeof window === 'undefined') {
          throw new Error('Window not defined');
        }
        
        const storedResult = sessionStorage.getItem('portfolioAnalysisResult');
        const storedItems = sessionStorage.getItem('portfolioItems');

        if (storedResult && storedItems) {
          try {
            return {
              analysis: JSON.parse(storedResult),
              items: JSON.parse(storedItems),
              savedPortfolio: null
            };
          } catch (error) {
            throw new Error('Failed to parse stored data');
          }
        } else {
          throw new Error('No analysis data found');
        }
      }
    },
    retry: false,
    staleTime: Infinity, // Keep data fresh for the session
  });

  // Mutation for re-analyzing
  const reanalyzeMutation = useMutation({
    mutationFn: async (data: { tickers: string[], quantities: number[] }) => {
      const request: AnalyzePortfolioRequest = {
        tickers: data.tickers,
        quantities: data.quantities,
        // Add other params if needed
      };
      return analyzePortfolio(request);
    },
    onSuccess: (newAnalysis) => {
      // Update the query cache with the new analysis
      queryClient.setQueryData<PortfolioData>(['portfolio', portfolioId || 'local'], (old) => {
        if (!old) return old;
        return {
          ...old,
          analysis: newAnalysis as AnalysisSnapshot, // Cast if types align or map
        };
      });
    },
  });

  return {
    portfolioData: portfolioQuery.data,
    isLoading: portfolioQuery.isLoading,
    isError: portfolioQuery.isError,
    reanalyze: reanalyzeMutation.mutate,
    isReanalyzing: reanalyzeMutation.isPending,
  };
}