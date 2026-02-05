import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { analyzePortfolio, getPortfolio, savePortfolio, updatePortfolio } from '@/lib/api/portfolio';
import type { AnalyzePortfolioRequest, CreatePortfolioRequest, UpdatePortfolioRequest } from '@/lib/api/portfolio';
import type { PortfolioItem, AnalysisSnapshot, Portfolio } from '@glassbox/types';

export interface PortfolioData {
  analysis: AnalysisSnapshot;
  items: PortfolioItem[];
  savedPortfolio?: Portfolio | null;
}

// Helper: Create portfolio items from tickers and quantities
const createItems = (tickers: string[], quantities: number[]): PortfolioItem[] => {
  return tickers.map((ticker, index) => ({
    symbol: ticker,
    quantity: quantities[index] || 0,
  }));
};

// Helper: Fetch saved portfolio
const fetchSavedPortfolio = async (portfolioId: string): Promise<PortfolioData> => {
  const portfolio = await getPortfolio(portfolioId);

  if (!portfolio.analysisSnapshot) {
    throw new Error('Portfolio has no analysis snapshot');
  }

  return {
    analysis: portfolio.analysisSnapshot as AnalysisSnapshot,
    items: createItems(portfolio.tickers, portfolio.quantities),
    savedPortfolio: portfolio,
  };
};

// Helper: Fetch fresh analysis from URL params
const fetchFreshAnalysis = async (params: URLSearchParams): Promise<PortfolioData> => {
  const tickers = params.get('tickers')?.split(',') || [];
  const quantities = params.get('quantities')?.split(',').map(Number) || [];
  const startDate = params.get('startDate') || undefined;
  const endDate = params.get('endDate') || undefined;

  if (!tickers.length) {
    throw new Error('No portfolio data found');
  }

  const analysis = await analyzePortfolio({
    tickers,
    quantities,
    startDate,
    endDate,
  });

  return {
    analysis: analysis as AnalysisSnapshot,
    items: createItems(tickers, quantities),
    savedPortfolio: null,
  };
};

export function useFetchPortfolioData(portfolioId: string | null) {
  const queryClient = useQueryClient();
  const params = useSearchParams();

  const portfolioQuery = useQuery<PortfolioData>({
    queryKey: ['portfolio', portfolioId || params.get('tickers')],
    queryFn: () => portfolioId ? fetchSavedPortfolio(portfolioId) : fetchFreshAnalysis(params),
    retry: false,
    staleTime: Infinity,
  });

  const reanalyzeMutation = useMutation({
    mutationFn: (data: AnalyzePortfolioRequest) => analyzePortfolio(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['portfolio'] }),
  });

  const savePortfolioMutation = useMutation({
    mutationFn: (data: CreatePortfolioRequest) => savePortfolio(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['portfolios'],
        refetchType: 'none'
      });
    },
  });

  const updatePortfolioMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePortfolioRequest }) => updatePortfolio(id, data),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['portfolio', variables.id],
        refetchType: 'none'
      });
      queryClient.invalidateQueries({
        queryKey: ['portfolios'],
        refetchType: 'none'
      });
    },
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
