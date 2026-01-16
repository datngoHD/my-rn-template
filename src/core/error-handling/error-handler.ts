/**
 * Error Handler
 * 
 * Centralized error handling with:
 * - Error boundary support
 * - Sentry integration
 * - User-friendly error messages
 * - Error recovery strategies
 */

import { Logger } from '../logging/logger';
import { environmentConfig } from '../config/environment';

export interface AppError {
  code: string;
  message: string;
  userMessage: string;
  recoverable: boolean;
  context?: Record<string, unknown>;
}

export class ErrorHandler {
  private static instance: ErrorHandler;

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  handleError(error: unknown, context?: Record<string, unknown>): AppError {
    const appError = this.normalizeError(error, context);
    
    Logger.error('Error handled', {
      code: appError.code,
      message: appError.message,
      context: appError.context,
    });

    if (environmentConfig.enableSentry) {
      this.reportToSentry(appError, error);
    }

    return appError;
  }

  private normalizeError(error: unknown, context?: Record<string, unknown>): AppError {
    if (this.isAppError(error)) {
      return error;
    }

    if (error instanceof Error) {
      return {
        code: 'UNKNOWN_ERROR',
        message: error.message,
        userMessage: this.getUserFriendlyMessage(error),
        recoverable: true,
        context: {
          ...context,
          stack: error.stack,
        },
      };
    }

    if (typeof error === 'string') {
      return {
        code: 'STRING_ERROR',
        message: error,
        userMessage: 'An unexpected error occurred. Please try again.',
        recoverable: true,
        context,
      };
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: 'An unknown error occurred',
      userMessage: 'An unexpected error occurred. Please try again.',
      recoverable: true,
      context,
    };
  }

  private isAppError(error: unknown): error is AppError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      'message' in error &&
      'userMessage' in error &&
      'recoverable' in error
    );
  }

  private getUserFriendlyMessage(error: Error): string {
    const errorMessage = error.message.toLowerCase();

    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      return 'Network error. Please check your connection and try again.';
    }

    if (errorMessage.includes('timeout')) {
      return 'Request timed out. Please try again.';
    }

    if (errorMessage.includes('unauthorized') || errorMessage.includes('401')) {
      return 'Your session has expired. Please log in again.';
    }

    if (errorMessage.includes('forbidden') || errorMessage.includes('403')) {
      return 'You do not have permission to perform this action.';
    }

    if (errorMessage.includes('not found') || errorMessage.includes('404')) {
      return 'The requested resource was not found.';
    }

    if (errorMessage.includes('server') || errorMessage.includes('500')) {
      return 'Server error. Please try again later.';
    }

    return 'An unexpected error occurred. Please try again.';
  }

  private reportToSentry(appError: AppError, originalError: unknown): void {
    if (!environmentConfig.enableSentry || !environmentConfig.sentryDsn) {
      return;
    }

    try {
      const Sentry = require('@sentry/react-native');
      
      if (originalError instanceof Error) {
        Sentry.captureException(originalError, {
          tags: {
            errorCode: appError.code,
            recoverable: appError.recoverable.toString(),
          },
          contexts: {
            custom: appError.context,
          },
        });
      } else {
        Sentry.captureMessage(appError.message, {
          level: 'error',
          tags: {
            errorCode: appError.code,
            recoverable: appError.recoverable.toString(),
          },
          contexts: {
            custom: appError.context,
          },
        });
      }
    } catch (sentryError) {
      Logger.warn('Failed to report to Sentry', { error: sentryError });
    }
  }
}

export const errorHandler = ErrorHandler.getInstance();




