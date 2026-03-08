import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PythonShell } from 'python-shell';
import { join } from 'path';

export interface PythonExecutorInput {
  tickers: string[];
  quantities: number[];
  portfolioValue?: number;
  targetBeta?: number;
  startDate?: string;
  endDate?: string;
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
      const result = await new Promise<PythonExecutorResult>((resolve, reject) => {
        const pyshell = new PythonShell('efficient_frontier.py', options);

        // Send input data to Python script via stdin
        pyshell.send(JSON.stringify(input));

        // Collect output from Python script
        let outputLines: string[] = [];
        let shellError: Error | null = null;

        pyshell.on('message', (message: string) => {
          this.logger.debug('Python output line:', message);
          outputLines.push(message);
        });

        pyshell.on('stderr', (stderr: string) => {
          this.logger.warn('Python stderr:', stderr);
        });

        // Capture shell-level error but don't reject yet —
        // Python may have printed a JSON error to stdout before exiting.
        pyshell.end((err) => {
          if (err) {
            this.logger.warn('Python process exit error:', err.message);
            shellError = err;
          }
        });

        // All resolution happens here after stdout is fully collected.
        pyshell.on('close', () => {
          if (outputLines.length === 0) {
            reject(shellError ?? new Error('No output from Python script'));
            return;
          }

          const outputText = outputLines.join('\n');

          try {
            const output = JSON.parse(outputText);

            if (output.error) {
              // Surface the actual Python error message
              this.logger.error(`Python script error: [${output.type}] ${output.error}`);
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
