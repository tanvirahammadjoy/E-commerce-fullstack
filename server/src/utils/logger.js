const winston = require('winston');
const { format } = require('winston');
require('winston-daily-rotate-file');

/**
 * Creates a logger instance using Winston.
 * The logger is configured to log messages with timestamps and custom formats.
 */
const logger = winston.createLogger({
  // Set the default log level to "info"
  level: 'info',

  // Define the log message format
  format: format.combine(
    format.colorize(), // Colorize log output based on level
    format.timestamp(), // Add a timestamp to each log message
    format.errors({ stack: true }), // Include stack trace for error messages
    format.splat(), // Support string interpolation
    format.printf(({ timestamp, level, message, stack }) => {
      return stack
        ? `${timestamp} ${level}: ${message} - ${stack}`
        : `${timestamp} ${level}: ${message}`;
    })
  ),

  // Define log transports
  transports: [
    // Log messages to the console
    new winston.transports.Console({
      format: format.combine(
        format.colorize(), // Colorize log output for console
        format.simple() // Use simple format for console output
      ),
    }),

    // Log error messages to a separate file (error.log)
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),

    // Log all messages to a combined log file (combined.log)
    new winston.transports.File({
      filename: 'logs/combined.log',
    }),

    // Rotate log files daily with a maximum size of 20MB per file
    new winston.transports.DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d', // Keep logs for 14 days
      zippedArchive: true, // Compress old log files
    }),
  ],

  // Handle uncaught exceptions
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' }),
  ],

  // Handle unhandled promise rejections
  rejectionHandlers: [
    new winston.transports.File({ filename: 'logs/rejections.log' }),
  ],
});

module.exports = logger;

// const winston = require('winston');

// /**
//  * Creates a logger instance using Winston.
//  * The logger is configured to log messages with timestamps and custom formats.
//  */
// const logger = winston.createLogger({
//   level: 'info', // Set the default log level to "info"
//   format: winston.format.combine(
//     winston.format.timestamp(), // Add a timestamp to each log message
//     winston.format.printf(({ timestamp, level, message }) => {
//       // Define the log message format
//       return `${timestamp} ${level}: ${message}`;
//     })
//   ),
//   transports: [
//     // Log messages to the console
//     new winston.transports.Console(),

//     // Log error messages to a separate file (error.log)
//     new winston.transports.File({ filename: 'error.log', level: 'error' }),

//     // Log all messages to a combined log file (combined.log)
//     new winston.transports.File({ filename: 'combined.log' }),
//   ],
// });

// module.exports = logger;
