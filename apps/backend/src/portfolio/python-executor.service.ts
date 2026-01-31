import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PythonShell } from 'python-shell';
import { join } from 'path';

export interface PythonExecutorInput {
  tickers: string[];
  quantities: number[];
  portfolioValue?: number;
  targetBeta?: number;
  startDate?: string;
}

export interface PythonExecutorResult {
  gmv: {
    weights: Record<string, number>;
    stats: {
      return: number;
      volatility: number;
      sharpe: number;
    };
  };
  maxSharpe: {
    weights: Record<string, number>;
    stats: {
      return: number;
      volatility: number;
      sharpe: number;
    };
  };
  efficientFrontier: Array<{
    return: number;
    volatility: number;
    sharpeRatio: number;
  }>;
  randomPortfolios?: Array<{
    return: number;
    volatility: number;
    sharpeRatio: number;
  }>;
  portfolioBeta: number;
  hedging: {
    spyShares: number;
    spyNotional: number;
    esContracts: number;
    esNotional: number;
  };
  riskFreeRate: number;
  error?: string;
  type?: string;
}

@Injectable()
export class PythonExecutorService {
  private readonly logger = new Logger(PythonExecutorService.name);
  private readonly pythonScriptPath: string;

  constructor() {
    // Path to Python script
    this.pythonScriptPath = join(__dirname, '..', '..', 'python', 'efficient_frontier.py');
  }

  /**
   * Execute Python script for efficient frontier calculation
   * @param input Input data for portfolio analysis
   * @returns Promise with analysis results
   */
  async executeEfficientFrontier(input: PythonExecutorInput): Promise<PythonExecutorResult> {
    this.logger.log(`Executing Python script for tickers: ${input.tickers.join(', ')}`);

    try {
      // Prepare options for PythonShell
      const options = {
        mode: 'text' as const,  // Use text mode to avoid JSON parsing issues
        pythonPath: 'python3', // or 'python' depending on system
        scriptPath: join(__dirname, '..', '..', 'python'),
        args: [],
      };

      // Create promise to handle Python execution
      // TEMPORARY: Use mock script to avoid Yahoo Finance rate limiting
      // Change back to 'efficient_frontier.py' when rate limit clears (usually 15-30 min)
      const result = await new Promise<PythonExecutorResult>((resolve, reject) => {
        const pyshell = new PythonShell('efficient_frontier_mock.py', options);

        // Send input data to Python script via stdin
        pyshell.send(JSON.stringify(input));
        pyshell.end((err) => {
          if (err) {
            this.logger.error('Python script execution error:', err);
            this.logger.error('Error details:', JSON.stringify(err, null, 2));
            reject(new Error(`Python script failed: ${err.message || String(err)}`));
          }
        });

        // Collect output from Python script
        let outputLines: string[] = [];

        pyshell.on('message', (message: string) => {
          this.logger.debug('Python output line:', message);
          outputLines.push(message);
        });

        pyshell.on('stderr', (stderr: string) => {
          // Log stderr for debugging - these could be warnings or errors
          this.logger.warn('Python stderr:', stderr);
        });

        pyshell.on('close', () => {
          if (outputLines.length === 0) {
            reject(new Error('No output from Python script'));
            return;
          }

          // Join all output lines and try to parse as JSON
          const outputText = outputLines.join('\n');

          try {
            const output = JSON.parse(outputText);

            if (output.error) {
              this.logger.error('Python script returned error:', output.error);
              reject(new Error(output.error));
            } else {
              resolve(output);
            }
          } catch (parseError: unknown) {
            this.logger.error('Failed to parse Python output as JSON:', outputText);
            const errorMsg = parseError instanceof Error ? parseError.message : String(parseError);
            reject(new Error(`Failed to parse Python output: ${errorMsg}`));
          }
        });
      });

      this.logger.log('Python script executed successfully');
      return result;
    } catch (error: unknown) {
      this.logger.error('Failed to execute Python script:', error);
      throw new InternalServerErrorException({
        message: 'Failed to analyze portfolio',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Check if Python environment is properly set up
   * @returns Promise<boolean>
   */
  async checkPythonEnvironment(): Promise<boolean> {
    try {
      const options = {
        mode: 'text' as const,
        pythonPath: 'python3',
        args: ['--version'],
      };

      await PythonShell.run('--version', options);
      this.logger.log('Python environment is available');
      return true;
    } catch (error: unknown) {
      this.logger.error('Python environment not available:', error instanceof Error ? error.message : String(error));
      return false;
    }
  }
}
