import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { analyzePortfolio, getPortfolio, savePortfolio, updatePortfolio } from '@/lib/api/portfolio';
import type { AnalyzePortfolioResponse, AnalyzePortfolioRequest, CreatePortfolioRequest, UpdatePortfolioRequest } from '@/lib/api/portfolio';
import type { PortfolioItem, AnalysisSnapshot, Portfolio } from '@glassbox/types';

export interface PortfolioData {
  analysis: AnalysisSnapshot;
  items: PortfolioItem[];
  savedPortfolio?: Portfolio | null;
}

export function useFetchPortfolioData(portfolioId: string | null) {
  const queryClient = useQueryClient();

  // Query for fetching portfolio data
  const portfolioQuery = useQuery<PortfolioData>({
    queryKey: ['portfolio', portfolioId || 'local'],
    queryFn: async () => {
      if (portfolioId) {
        try {
          const portfolio = await getPortfolio(portfolioId);
          // Assuming the saved portfolio has quantities and tickers
          const items = portfolio.tickers.map((ticker, index) => ({
            symbol: ticker,
            quantity: portfolio.quantities[index] || 0,
          }));
          
          if (!portfolio.analysisSnapshot) {
             throw new Error('Portfolio has no analysis snapshot');
          }

          return {
            analysis: portfolio.analysisSnapshot as AnalysisSnapshot,
            items,
            savedPortfolio: portfolio
          };
        } catch (error) {
          throw new Error('Failed to fetch portfolio');
        }
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

  // Mutation for saving new portfolio
  const savePortfolioMutation = useMutation({
    mutationFn: async (data: CreatePortfolioRequest) => {
      return savePortfolio(data);
    },
    onSuccess: (newPortfolio) => {
      // In a real app, we might redirect to the new portfolio ID URL
      // For now, just invalidate list
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
    }
  });

  // Mutation for updating existing portfolio
  const updatePortfolioMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: UpdatePortfolioRequest }) => {
      return updatePortfolio(id, data);
    },
    onSuccess: (updatedPortfolio) => {
      queryClient.invalidateQueries({ queryKey: ['portfolio', updatedPortfolio.id] });
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
    }
  });

  return {
    portfolioData: portfolioQuery.data,
    isLoading: portfolioQuery.isLoading,
    isError: portfolioQuery.isError,
    reanalyze: reanalyzeMutation.mutate,
    isReanalyzing: reanalyzeMutation.isPending,
    savePortfolio: savePortfolioMutation.mutate,
    isSaving: savePortfolioMutation.isPending,
    updatePortfolio: updatePortfolioMutation.mutate,
    isUpdating: updatePortfolioMutation.isPending,
  };
}