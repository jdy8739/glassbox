#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import { analyzeCommand } from './commands/analyze';
import { version } from '../package.json';

program
  .name('glassbox')
  .description('Portfolio optimization and beta hedging CLI tool')
  .version(version);

program
  .command('analyze')
  .description('Analyze a portfolio and generate efficient frontier')
  .option('-t, --tickers <tickers...>', 'Stock tickers (e.g., AAPL MSFT NVDA)')
  .option('--start <date>', 'Start date for historical data (YYYY-MM-DD)', '2021-01-01')
  .option('--end <date>', 'End date for historical data (YYYY-MM-DD)')
  .option(
    '-s, --samples <number>',
    'Number of random portfolios to sample',
    (val) => parseInt(val, 10),
    50000,
  )
  .option(
    '--target-beta <number>',
    'Target portfolio beta (default: 0 for market-neutral)',
    (val) => parseFloat(val),
    0,
  )
  .option('-o, --output <path>', 'Output file path for results (JSON)')
  .action(analyzeCommand);

program.on('--help', () => {
  console.log('');
  console.log(chalk.cyan('Examples:'));
  console.log('  $ glassbox analyze -t AAPL MSFT NVDA --samples 10000');
  console.log('  $ glassbox analyze -t TSLA NVDA -s 50000 --target-beta 0.5 -o results.json');
});

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
