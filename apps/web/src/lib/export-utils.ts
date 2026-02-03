import type { AnalysisSnapshot, PortfolioItem } from '@glassbox/types';
import jsPDF from 'jspdf';

// ============================================================================
// Types
// ============================================================================

interface ExportData {
  portfolioName?: string;
  items: PortfolioItem[];
  analysis: AnalysisSnapshot;
  timestamp?: Date;
}

type WeightEntry = [string, number];

// ============================================================================
// Pure Formatters
// ============================================================================

const formatPercent = (value: number, decimals = 2): string =>
  `${(value * 100).toFixed(decimals)}%`;

const formatNumber = (value: number, decimals = 2): string =>
  value.toFixed(decimals);

const formatCurrency = (value: number): string =>
  `$${Math.abs(value).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

const formatDateISO = (date?: Date): string =>
  (date ?? new Date()).toISOString().split('T')[0];

const formatDateLocale = (date?: Date): string =>
  (date ?? new Date()).toLocaleString();

// ============================================================================
// Data Transformers
// ============================================================================

const sortedWeights = (weights: Record<string, number>, minWeight = 0.001): WeightEntry[] =>
  Object.entries(weights)
    .filter(([, w]) => w > minWeight)
    .sort(([, a], [, b]) => b - a);

const topWeights = (weights: Record<string, number>, limit = 5): WeightEntry[] =>
  sortedWeights(weights).slice(0, limit);

// ============================================================================
// CSV Builders (Pure)
// ============================================================================

const csvHeader = (portfolioName?: string, date?: Date): string[] => [
  'Glassbox Portfolio Analysis Report',
  `Generated: ${formatDateISO(date)}`,
  ...(portfolioName ? [`Portfolio: ${portfolioName}`] : []),
  '',
];

const csvComposition = (items: PortfolioItem[]): string[] => [
  'Portfolio Composition',
  'Ticker,Quantity',
  ...items.map((i) => `${i.symbol},${i.quantity}`),
  '',
];

const csvStats = (analysis: AnalysisSnapshot): string[] => [
  'Portfolio Statistics',
  'Metric,Value',
  `Portfolio Beta,${formatNumber(analysis.portfolioBeta)}`,
  `Risk-Free Rate,${formatPercent(analysis.riskFreeRate)}`,
  '',
];

const csvPortfolio = (
  title: string,
  stats: { return: number; volatility: number; sharpe: number },
  weights: Record<string, number>,
  weightsTitle: string
): string[] => [
  title,
  'Metric,Value',
  `Expected Return,${formatPercent(stats.return)}`,
  `Volatility,${formatPercent(stats.volatility)}`,
  `Sharpe Ratio,${formatNumber(stats.sharpe)}`,
  '',
  weightsTitle,
  'Ticker,Weight',
  ...sortedWeights(weights).map(([t, w]) => `${t},${formatPercent(w)}`),
  '',
];

const csvHedging = (hedging: AnalysisSnapshot['hedging']): string[] => [
  'Beta Hedging Recommendations',
  'Hedging Method,Quantity,Notional Value',
  `SPY ETF,Short ${Math.abs(hedging.spyShares).toLocaleString()} shares,${formatCurrency(hedging.spyNotional)}`,
  `ES Futures,Short ${Math.abs(hedging.esContracts).toLocaleString()} contracts,${formatCurrency(hedging.esNotional)}`,
];

const buildCSV = (data: ExportData): string =>
  [
    ...csvHeader(data.portfolioName, data.timestamp),
    ...csvComposition(data.items),
    ...csvStats(data.analysis),
    ...csvPortfolio('Global Minimum Variance (GMV) Portfolio', data.analysis.gmv.stats, data.analysis.gmv.weights, 'GMV Weights'),
    ...csvPortfolio('Maximum Sharpe Ratio Portfolio', data.analysis.maxSharpe.stats, data.analysis.maxSharpe.weights, 'Max Sharpe Weights'),
    ...csvHedging(data.analysis.hedging),
  ].join('\n');

// ============================================================================
// PDF Builders (Pure Helpers)
// ============================================================================

type PDFState = { pdf: jsPDF; y: number; margin: number; contentWidth: number; pageHeight: number };

const createPDFState = (): PDFState => {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  return {
    pdf,
    y: 15,
    margin: 15,
    contentWidth: pdf.internal.pageSize.getWidth() - 30,
    pageHeight: pdf.internal.pageSize.getHeight(),
  };
};

const checkPageBreak = (state: PDFState, needed = 40): PDFState => {
  if (state.y > state.pageHeight - needed) {
    state.pdf.addPage();
    return { ...state, y: 15 };
  }
  return state;
};

const addTitle = (state: PDFState, text: string): PDFState => {
  state.pdf.setFontSize(16).setFont('helvetica', 'bold').text(text, state.margin, state.y);
  return { ...state, y: state.y + 10 };
};

const addMeta = (state: PDFState, text: string): PDFState => {
  state.pdf.setFontSize(9).setFont('helvetica', 'normal').text(text, state.margin, state.y);
  return { ...state, y: state.y + 5 };
};

const addSection = (state: PDFState, text: string): PDFState => {
  state.pdf.setFontSize(12).setFont('helvetica', 'bold').text(text, state.margin, state.y);
  return { ...state, y: state.y + 8 };
};

const addSubsection = (state: PDFState, text: string): PDFState => {
  state.pdf.setFontSize(10).setFont('helvetica', 'bold').text(text, state.margin + 2, state.y);
  return { ...state, y: state.y + 6 };
};

const addRow = (state: PDFState, label: string, value: string): PDFState => {
  state.pdf.setFontSize(9).setFont('helvetica', 'normal');
  state.pdf.text(label, state.margin + 2, state.y);
  state.pdf.text(value, state.margin + state.contentWidth - 30, state.y, { align: 'right' });
  return { ...state, y: state.y + 5 };
};

const addGap = (state: PDFState, gap = 3): PDFState => ({ ...state, y: state.y + gap });

const pdfHeader = (state: PDFState, portfolioName?: string, date?: Date): PDFState => {
  let s = addTitle(state, 'Glassbox Portfolio Analysis');
  s = addMeta(s, `Generated: ${formatDateLocale(date)}`);
  if (portfolioName) s = addMeta(s, `Portfolio: ${portfolioName}`);
  return addGap(s);
};

const pdfComposition = (state: PDFState, items: PortfolioItem[]): PDFState => {
  let s = addSection(state, 'Portfolio Composition');
  items.forEach((item) => { s = addRow(s, item.symbol, `${item.quantity} shares`); });
  return addGap(s);
};

const pdfStats = (state: PDFState, analysis: AnalysisSnapshot): PDFState => {
  let s = addSection(state, 'Portfolio Statistics');
  s = addRow(s, 'Portfolio Beta', formatNumber(analysis.portfolioBeta));
  s = addRow(s, 'Risk-Free Rate', formatPercent(analysis.riskFreeRate));
  return addGap(s);
};

const pdfPortfolio = (
  state: PDFState,
  title: string,
  stats: { return: number; volatility: number; sharpe: number },
  weights: Record<string, number>,
  weightsTitle: string
): PDFState => {
  let s = addSection(state, title);
  s = addRow(s, 'Expected Return', formatPercent(stats.return));
  s = addRow(s, 'Volatility', formatPercent(stats.volatility));
  s = addRow(s, 'Sharpe Ratio', formatNumber(stats.sharpe));
  s = addGap(s, 2);
  s = addSubsection(s, weightsTitle);
  topWeights(weights).forEach(([t, w]) => { s = addRow(s, t, formatPercent(w)); });
  return addGap(s);
};

const pdfHedging = (state: PDFState, hedging: AnalysisSnapshot['hedging']): PDFState => {
  let s = addSection(state, 'Beta Hedging Recommendations');
  s = addSubsection(s, 'SPY ETF Hedging');
  s = addRow(s, 'Action', `Short ${Math.abs(hedging.spyShares).toLocaleString()} shares`);
  s = addRow(s, 'Notional Value', formatCurrency(hedging.spyNotional));
  s = addGap(s, 2);
  s = addSubsection(s, 'ES Futures Hedging');
  s = addRow(s, 'Action', `Short ${Math.abs(hedging.esContracts).toLocaleString()} contracts`);
  s = addRow(s, 'Notional Value', formatCurrency(hedging.esNotional));
  return s;
};

const buildPDF = (data: ExportData): jsPDF => {
  let state = createPDFState();
  state = pdfHeader(state, data.portfolioName, data.timestamp);
  state = pdfComposition(state, data.items);
  state = pdfStats(state, data.analysis);
  state = pdfPortfolio(state, 'Global Minimum Variance (GMV) Portfolio', data.analysis.gmv.stats, data.analysis.gmv.weights, 'GMV Weights');
  state = checkPageBreak(state);
  state = pdfPortfolio(state, 'Maximum Sharpe Ratio Portfolio', data.analysis.maxSharpe.stats, data.analysis.maxSharpe.weights, 'Max Sharpe Weights');
  state = checkPageBreak(state);
  state = pdfHedging(state, data.analysis.hedging);
  return state.pdf;
};

// ============================================================================
// Download Utilities
// ============================================================================

const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = Object.assign(document.createElement('a'), { href: url, download: filename, style: 'display:none' });
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// ============================================================================
// Public API
// ============================================================================

export const exportAsCSV = (data: ExportData): void => {
  const csv = buildCSV(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `glassbox-analysis-${formatDateISO(data.timestamp)}.csv`);
};

export const exportAsPDF = (data: ExportData): void => {
  const pdf = buildPDF(data);
  pdf.save(`glassbox-analysis-${formatDateISO(data.timestamp)}.pdf`);
};
