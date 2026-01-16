/**
 * Logger
 * 
 * Centralized logging system with:
 * - Environment-aware logging levels
 * - Structured logging
 * - Sentry integration ready
 * - Performance monitoring
 */

import { environmentConfig } from '../config/environment';

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  error?: Error;
}

class LoggerClass {
  private static instance: LoggerClass;
  private logs: LogEntry[] = [];
  private maxLogs = 100;

  private constructor() {}

  static getInstance(): LoggerClass {
    if (!LoggerClass.instance) {
      LoggerClass.instance = new LoggerClass();
    }
    return LoggerClass.instance;
  }

  private shouldLog(level: LogLevel): boolean {
    if (!environmentConfig.enableLogging) {
      return false;
    }

    if (environmentConfig.environment === 'production') {
      return level === LogLevel.ERROR || level === LogLevel.WARN;
    }

    return true;
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    };

    this.logs.push(entry);

    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    const logMethod = this.getLogMethod(level);
    const logMessage = this.formatMessage(entry);

    logMethod(logMessage);

    if (error && environmentConfig.enableSentry) {
      this.reportToSentry(level, message, context, error);
    }
  }

  private getLogMethod(level: LogLevel): (message: string) => void {
    switch (level) {
      case LogLevel.DEBUG:
        return console.debug;
      case LogLevel.INFO:
        return console.info;
      case LogLevel.WARN:
        return console.warn;
      case LogLevel.ERROR:
        return console.error;
      default:
        return console.log;
    }
  }

  private formatMessage(entry: LogEntry): string {
    const parts = [
      `[${entry.timestamp}]`,
      `[${entry.level}]`,
      entry.message,
    ];

    if (entry.context) {
      parts.push(JSON.stringify(entry.context, null, 2));
    }

    if (entry.error) {
      parts.push(`\nError: ${entry.error.message}`);
      if (entry.error.stack) {
        parts.push(`\nStack: ${entry.error.stack}`);
      }
    }

    return parts.join(' ');
  }

  private reportToSentry(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    error?: Error
  ): void {
    if (!environmentConfig.enableSentry || !environmentConfig.sentryDsn) {
      return;
    }

    try {
      const Sentry = require('@sentry/react-native');
      
      if (level === LogLevel.ERROR && error) {
        Sentry.captureException(error, {
          contexts: {
            custom: context,
          },
          tags: {
            logLevel: level,
          },
        });
      } else {
        Sentry.captureMessage(message, {
          level: level.toLowerCase() as 'debug' | 'info' | 'warning' | 'error',
          contexts: {
            custom: context,
          },
        });
      }
    } catch (sentryError) {
      console.warn('Failed to report to Sentry', sentryError);
    }
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Record<string, unknown>, error?: Error): void {
    this.log(LogLevel.WARN, message, context, error);
  }

  error(message: string, context?: Record<string, unknown>, error?: Error): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }
}

export const Logger = LoggerClass.getInstance();
