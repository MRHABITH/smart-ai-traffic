/**
 * Logger utility for consistent logging across the app
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

const COLORS = {
  DEBUG: '\x1b[36m', // Cyan
  INFO: '\x1b[32m',  // Green
  WARN: '\x1b[33m',  // Yellow
  ERROR: '\x1b[31m', // Red
  RESET: '\x1b[0m',  // Reset
};

const currentLogLevel = import.meta.env.MODE === 'development' ? LOG_LEVELS.DEBUG : LOG_LEVELS.INFO;

export const logger = {
  /**
   * Log debug messages (development only)
   */
  debug: (message, data = null) => {
    if (currentLogLevel <= LOG_LEVELS.DEBUG) {
      console.log(`${COLORS.DEBUG}[DEBUG]${COLORS.RESET}`, message, data || '');
    }
  },

  /**
   * Log info messages
   */
  info: (message, data = null) => {
    if (currentLogLevel <= LOG_LEVELS.INFO) {
      console.log(`${COLORS.INFO}[INFO]${COLORS.RESET}`, message, data || '');
    }
  },

  /**
   * Log warning messages
   */
  warn: (message, data = null) => {
    if (currentLogLevel <= LOG_LEVELS.WARN) {
      console.warn(`${COLORS.WARN}[WARN]${COLORS.RESET}`, message, data || '');
    }
  },

  /**
   * Log error messages
   */
  error: (message, error = null) => {
    if (currentLogLevel <= LOG_LEVELS.ERROR) {
      console.error(`${COLORS.ERROR}[ERROR]${COLORS.RESET}`, message);
      if (error) {
        console.error('Details:', error);
      }
    }
  },

  /**
   * Time an operation
   */
  time: (label) => {
    if (import.meta.env.MODE === 'development') {
      console.time(label);
    }
  },

  timeEnd: (label) => {
    if (import.meta.env.MODE === 'development') {
      console.timeEnd(label);
    }
  },

  /**
   * Create a performance group
   */
  group: (label) => {
    if (import.meta.env.MODE === 'development') {
      console.group(label);
    }
  },

  groupEnd: () => {
    if (import.meta.env.MODE === 'development') {
      console.groupEnd();
    }
  },
};

export default logger;
