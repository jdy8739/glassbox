import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { analyzePortfolio, getPortfolio, savePortfolio, updatePortfolio } from '@/lib/api/portfolio';
import { loadAnalysisSession } from '@/lib/storage/analysis-session';
import type { AnalyzePortfolioRequest, CreatePortfolioRequest, UpdatePortfolioRequest } from '@/lib/api/portfolio';
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
        const sessionData = loadAnalysisSession();

        if (!sessionData) {
          throw new Error('No analysis data found');
        }

        return {
          analysis: sessionData.analysis,
          items: sessionData.items,
          savedPortfolio: null
        };
      }
    },
    retry: false,
    staleTime: Infinity, // Keep data fresh for the session
  });

  // Mutation for re-analyzing
  const reanalyzeMutation = useMutation({
    mutationFn: async (data: { tickers: string[], quantities: number[], startDate?: string, endDate?: string }) => {
      const request: AnalyzePortfolioRequest = {
        tickers: data.tickers,
        quantities: data.quantities,
        startDate: data.startDate,
        endDate: data.endDate,
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
    onSuccess: () => {
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
    savePortfolio: savePortfolioMutation.mutateAsync,
    isSaving: savePortfolioMutation.isPending,
    updatePortfolio: updatePortfolioMutation.mutateAsync,
    isUpdating: updatePortfolioMutation.isPending,
  };
}