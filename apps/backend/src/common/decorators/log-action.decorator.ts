import { Logger } from '@nestjs/common';

/**
 * Decorator that wraps async controller methods with automatic logging
 *
 * Usage:
 *   @LogAction('CREATE_PORTFOLIO')
 *   async createPortfolio(@Body() dto: CreatePortfolioDto) {
 *     // Your code here
 *   }
 *
 * Logs: action start, success, and errors with context
 */
export function LogAction(actionName: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const logger = new Logger(`${target.constructor.name}.${propertyKey}`);

    descriptor.value = async function (...args: any[]) {
      const request = args[0];
      const context = extractContext(request);
      const timestamp = new Date().toISOString();

      try {
        logger.log({ event: `${actionName}_START`, ...context, timestamp });
        const result = await originalMethod.apply(this, args);
        logger.log({ event: `${actionName}_SUCCESS`, ...context, timestamp });
        return result;
      } catch (error) {
        logger.error({
          event: `${actionName}_FAILED`,
          ...context,
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          timestamp,
        });
        throw error;
      }
    };

    return descriptor;
  };
}

function extractContext(obj: any): Record<string, any> {
  if (!obj || typeof obj !== 'object') return {};

  if (obj.user) return { userId: obj.user.userId, email: obj.user.email };
  if (obj.email) return { email: obj.email };
  if (obj.id) return { id: obj.id };

  return {};
}
