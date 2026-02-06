import * as Joi from 'joi';

/**
 * Environment variable validation schema
 * Ensures all required environment variables are set and valid on application startup
 */
export const envValidationSchema = Joi.object({
  // Application
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(4000),

  // Database
  DATABASE_URL: Joi.string()
    .uri()
    .required()
    .messages({
      'string.empty': 'DATABASE_URL is required',
      'string.uri': 'DATABASE_URL must be a valid database connection string',
    }),

  // Authentication & Security
  // Note: At least one of JWT_SECRET or NEXTAUTH_SECRET must be set (validated in custom function)
  JWT_SECRET: Joi.string()
    .min(32)
    .optional()
    .messages({
      'string.min': 'JWT_SECRET must be at least 32 characters long for security',
    }),

  NEXTAUTH_SECRET: Joi.string()
    .min(32)
    .optional()
    .messages({
      'string.min': 'NEXTAUTH_SECRET must be at least 32 characters long for security',
    }),

  JWT_EXPIRATION: Joi.number().default(604800), // 7 days in seconds

  // Frontend
  FRONTEND_URL: Joi.string()
    .uri()
    .required()
    .messages({
      'string.empty': 'FRONTEND_URL is required for CORS configuration',
      'string.uri': 'FRONTEND_URL must be a valid URL',
    }),

  // Google OAuth (optional - handled by NextAuth in frontend)
  GOOGLE_CLIENT_ID: Joi.string().optional(),
  GOOGLE_CLIENT_SECRET: Joi.string().optional(),

  // Python worker (optional)
  PYTHON_PATH: Joi.string().optional(),
})
  .unknown(true) // Allow other environment variables
  .custom((value, helpers) => {
    // Custom validation: ensure JWT_SECRET or NEXTAUTH_SECRET exists
    if (!value.JWT_SECRET && !value.NEXTAUTH_SECRET) {
      return helpers.error('any.custom', {
        message: 'Either JWT_SECRET or NEXTAUTH_SECRET must be set',
      });
    }

    // Warn if JWT_SECRET and NEXTAUTH_SECRET don't match (they should be the same)
    if (
      value.JWT_SECRET &&
      value.NEXTAUTH_SECRET &&
      value.JWT_SECRET !== value.NEXTAUTH_SECRET
    ) {
      console.warn(
        '\n⚠️  WARNING: JWT_SECRET and NEXTAUTH_SECRET should be identical for proper authentication flow\n'
      );
    }

    return value;
  });

/**
 * Type-safe environment variables interface
 */
export interface EnvironmentVariables {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  NEXTAUTH_SECRET: string;
  JWT_EXPIRATION: number;
  FRONTEND_URL: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  PYTHON_PATH?: string;
}
