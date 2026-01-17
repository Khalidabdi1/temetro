/**
 * Error Handling Utilities for Next.js API Routes
 * 
 * Provides consistent error handling across all API routes.
 * Includes custom error classes and response helpers.
 */

import { NextResponse } from 'next/server';

/**
 * Custom API Error class with status code and optional error code
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code?: string;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    code?: string
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true; // Distinguishes from programming errors

    // Maintains proper stack trace for debugging
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Common error types with predefined status codes
 */
export const Errors = {
  BadRequest: (message: string, code?: string) => 
    new ApiError(message, 400, code || 'BAD_REQUEST'),
  
  Unauthorized: (message: string = 'Unauthorized') => 
    new ApiError(message, 401, 'UNAUTHORIZED'),
  
  Forbidden: (message: string = 'Forbidden') => 
    new ApiError(message, 403, 'FORBIDDEN'),
  
  NotFound: (message: string = 'Not found') => 
    new ApiError(message, 404, 'NOT_FOUND'),
  
  RateLimited: (message: string = 'Rate limit exceeded') => 
    new ApiError(message, 429, 'RATE_LIMITED'),
  
  Internal: (message: string = 'Internal server error') => 
    new ApiError(message, 500, 'INTERNAL_ERROR'),
  
  ServiceUnavailable: (message: string = 'Service temporarily unavailable') => 
    new ApiError(message, 503, 'SERVICE_UNAVAILABLE'),
};

/**
 * Error response structure
 */
interface ErrorResponse {
  error: string;
  code?: string;
  stack?: string;
  timestamp: string;
}

/**
 * Handle any error and return a consistent NextResponse
 * 
 * @param error - The error to handle
 * @returns NextResponse with error details
 */
export function handleApiError(error: unknown): NextResponse<ErrorResponse> {
  // Log error for debugging (server-side only)
  console.error('[API Error]', error);

  const timestamp = new Date().toISOString();
  const isDev = process.env.NODE_ENV !== 'production';

  // Handle our custom ApiError
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        timestamp,
        ...(isDev && { stack: error.stack }),
      },
      { status: error.statusCode }
    );
  }

  // Handle standard Error
  if (error instanceof Error) {
    // Check for specific error types
    if (error.message.includes('rate limit')) {
      return NextResponse.json(
        {
          error: 'GitHub API rate limit exceeded. Please try again later.',
          code: 'RATE_LIMITED',
          timestamp,
        },
        { status: 429 }
      );
    }

    if (error.message.includes('not found')) {
      return NextResponse.json(
        {
          error: error.message,
          code: 'NOT_FOUND',
          timestamp,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: error.message,
        code: 'INTERNAL_ERROR',
        timestamp,
        ...(isDev && { stack: error.stack }),
      },
      { status: 500 }
    );
  }

  // Handle unknown error types
  return NextResponse.json(
    {
      error: 'An unknown error occurred',
      code: 'UNKNOWN_ERROR',
      timestamp,
    },
    { status: 500 }
  );
}

/**
 * Wrap an async handler with error handling
 * 
 * @param handler - Async function to wrap
 * @returns Wrapped function that catches errors
 */
export function withErrorHandling<T extends unknown[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleApiError(error);
    }
  };
}
