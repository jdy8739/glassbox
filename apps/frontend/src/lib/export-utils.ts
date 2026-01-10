import type { AnalysisSnapshot, PortfolioItem } from '@glassbox/types';
import jsPDF from 'jspdf';

interface ExportData {
  portfolioName?: string;
  items: PortfolioItem[];
  analysis: AnalysisSnapshot;
  timestamp?: Date;
}

/**
 * Export portfolio analysis as CSV
 */
export function exportAsCSV(data: ExportData): void {
  const { portfolioName, items, analysis, timestamp } = data;

  const csv: string[] = [];
  const dateStr = timestamp ? timestamp.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

  // Header
  csv.push('Glassbox Portfolio Analysis Report');
  csv.push(`Generated: ${dateStr}`);
  if (portfolioName) {
    csv.push(`Portfolio: ${portfolioName}`);
  }
  csv.push('');

  // Portfolio Composition
  csv.push('Portfolio Composition');
  csv.push('Ticker,Quantity');
  items.forEach(item => {
    csv.push(`${item.symbol},${item.quantity}`);
  });
  csv.push('');

  // Portfolio Statistics
  csv.push('Portfolio Statistics');
  csv.push('Metric,Value');
  csv.push(`Portfolio Beta,${analysis.portfolioBeta.toFixed(2)}`);
  csv.push(`Risk-Free Rate,${(analysis.riskFreeRate * 100).toFixed(2)}%`);
  csv.push('');

  // Global Minimum Variance (GMV)
  csv.push('Global Minimum Variance (GMV) Portfolio');
  csv.push('Metric,Value');
  csv.push(`Expected Return,${(analysis.gmv.stats.return * 100).toFixed(2)}%`);
  csv.push(`Volatility,${(analysis.gmv.stats.volatility * 100).toFixed(2)}%`);
  csv.push(`Sharpe Ratio,${analysis.gmv.stats.sharpe.toFixed(2)}`);
  csv.push('');
  csv.push('GMV Weights');
  csv.push('Ticker,Weight');
  Object.entries(analysis.gmv.weights)
    .filter(([_, weight]) => (weight as number) > 0.001)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .forEach(([ticker, weight]) => {
      csv.push(`${ticker},${((weight as number) * 100).toFixed(2)}%`);
    });
  csv.push('');

  // Maximum Sharpe Ratio
  csv.push('Maximum Sharpe Ratio Portfolio');
  csv.push('Metric,Value');
  csv.push(`Expected Return,${(analysis.maxSharpe.stats.return * 100).toFixed(2)}%`);
  csv.push(`Volatility,${(analysis.maxSharpe.stats.volatility * 100).toFixed(2)}%`);
  csv.push(`Sharpe Ratio,${analysis.maxSharpe.stats.sharpe.toFixed(2)}`);
  csv.push('');
  csv.push('Max Sharpe Weights');
  csv.push('Ticker,Weight');
  Object.entries(analysis.maxSharpe.weights)
    .filter(([_, weight]) => (weight as number) > 0.001)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .forEach(([ticker, weight]) => {
      csv.push(`${ticker},${((weight as number) * 100).toFixed(2)}%`);
    });
  csv.push('');

  // Beta Hedging Recommendations
  csv.push('Beta Hedging Recommendations');
  csv.push('Hedging Method,Quantity,Notional Value');
  csv.push(
    `SPY ETF,Short ${Math.abs(analysis.hedging.spyShares).toLocaleString()} shares,$${Math.abs(analysis.hedging.spyNotional).toLocaleString('en-US', { maximumFractionDigits: 0 })}`
  );
  csv.push(
    `ES Futures,Short ${Math.abs(analysis.hedging.esContracts).toLocaleString()} contracts,$${Math.abs(analysis.hedging.esNotional).toLocaleString('en-US', { maximumFractionDigits: 0 })}`
  );

  // Generate CSV file
  const csvContent = csv.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  const filename = `glassbox-analysis-${dateStr}.csv`;
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export portfolio analysis as PDF
 */
export function exportAsPDF(data: ExportData): void {
  const { portfolioName, items, analysis, timestamp } = data;

  const dateStr = timestamp ? timestamp.toLocaleString() : new Date().toLocaleString();

  // Create PDF with portrait orientation
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 15;
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;

  // Helper function to add section
  const addSection = (title: string, yPos: number): number => {
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(title, margin, yPos);
    return yPos + 8;
  };

  // Helper function to add subsection
  const addSubsection = (title: string, yPos: number): number => {
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text(title, margin + 2, yPos);
    return yPos + 6;
  };

  // Helper function to add data row
  const addDataRow = (label: string, value: string, yPos: number): number => {
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text(label, margin + 2, yPos);
    pdf.text(value, margin + contentWidth - 30, yPos, { align: 'right' });
    return yPos + 5;
  };

  // Title
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Glassbox Portfolio Analysis', margin, yPosition);
  yPosition += 10;

  // Metadata
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Generated: ${dateStr}`, margin, yPosition);
  yPosition += 5;
  if (portfolioName) {
    pdf.text(`Portfolio: ${portfolioName}`, margin, yPosition);
    yPosition += 5;
  }
  yPosition += 3;

  // Portfolio Composition
  yPosition = addSection('Portfolio Composition', yPosition);
  items.forEach((item) => {
    yPosition = addDataRow(item.symbol, `${item.quantity} shares`, yPosition);
  });
  yPosition += 3;

  // Portfolio Statistics
  yPosition = addSection('Portfolio Statistics', yPosition);
  yPosition = addDataRow('Portfolio Beta', analysis.portfolioBeta.toFixed(2), yPosition);
  yPosition = addDataRow('Risk-Free Rate', `${(analysis.riskFreeRate * 100).toFixed(2)}%`, yPosition);
  yPosition += 3;

  // Global Minimum Variance (GMV)
  yPosition = addSection('Global Minimum Variance (GMV) Portfolio', yPosition);
  yPosition = addDataRow('Expected Return', `${(analysis.gmv.stats.return * 100).toFixed(2)}%`, yPosition);
  yPosition = addDataRow('Volatility', `${(analysis.gmv.stats.volatility * 100).toFixed(2)}%`, yPosition);
  yPosition = addDataRow('Sharpe Ratio', analysis.gmv.stats.sharpe.toFixed(2), yPosition);
  yPosition += 2;

  yPosition = addSubsection('GMV Weights', yPosition);
  Object.entries(analysis.gmv.weights)
    .filter(([_, weight]) => (weight as number) > 0.001)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, 5)
    .forEach(([ticker, weight]) => {
      yPosition = addDataRow(ticker, `${((weight as number) * 100).toFixed(2)}%`, yPosition);
    });
  yPosition += 3;

  // Check if new page needed
  if (yPosition > pageHeight - 40) {
    pdf.addPage();
    yPosition = 15;
  }

  // Maximum Sharpe Ratio
  yPosition = addSection('Maximum Sharpe Ratio Portfolio', yPosition);
  yPosition = addDataRow('Expected Return', `${(analysis.maxSharpe.stats.return * 100).toFixed(2)}%`, yPosition);
  yPosition = addDataRow('Volatility', `${(analysis.maxSharpe.stats.volatility * 100).toFixed(2)}%`, yPosition);
  yPosition = addDataRow('Sharpe Ratio', analysis.maxSharpe.stats.sharpe.toFixed(2), yPosition);
  yPosition += 2;

  yPosition = addSubsection('Max Sharpe Weights', yPosition);
  Object.entries(analysis.maxSharpe.weights)
    .filter(([_, weight]) => (weight as number) > 0.001)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, 5)
    .forEach(([ticker, weight]) => {
      yPosition = addDataRow(ticker, `${((weight as number) * 100).toFixed(2)}%`, yPosition);
    });
  yPosition += 3;

  // Check if new page needed
  if (yPosition > pageHeight - 40) {
    pdf.addPage();
    yPosition = 15;
  }

  // Beta Hedging Recommendations
  yPosition = addSection('Beta Hedging Recommendations', yPosition);
  yPosition = addSubsection('SPY ETF Hedging', yPosition);
  yPosition = addDataRow('Action', `Short ${Math.abs(analysis.hedging.spyShares).toLocaleString()} shares`, yPosition);
  yPosition = addDataRow(
    'Notional Value',
    `$${Math.abs(analysis.hedging.spyNotional).toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
    yPosition
  );
  yPosition += 2;

  yPosition = addSubsection('ES Futures Hedging', yPosition);
  yPosition = addDataRow('Action', `Short ${Math.abs(analysis.hedging.esContracts).toLocaleString()} contracts`, yPosition);
  yPosition = addDataRow(
    'Notional Value',
    `$${Math.abs(analysis.hedging.esNotional).toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
    yPosition
  );

  // Save PDF
  const filename = `glassbox-analysis-${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(filename);
}
