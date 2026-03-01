const { createLogger, format, transports } = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const path = require("path");
const Sentry = require("@sentry/node");

const logDir = path.join(__dirname, "../../logs");

const logger = createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    // Console (Coolify / local)
    new transports.Console(),

    // 🔁 Daily rotated combined logs
    new DailyRotateFile({
      filename: path.join(logDir, "combined-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "14d",
      zippedArchive: true,
    }),

    // 🔁 Daily rotated error logs
    new DailyRotateFile({
      level: "error",
      filename: path.join(logDir, "error-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "30d",
      zippedArchive: true,
    }),
  ],
});


// 🔥 Forward ONLY error-level logs to Sentry
const originalError = logger.error.bind(logger);

logger.error = (message, meta) => {
  if (meta instanceof Error) {
    Sentry.captureException(meta);
  } else {
    Sentry.captureMessage(
      typeof message === "string" ? message : "Unknown error",
      {
        level: "error",
        extra: meta,
      }
    );
  }

  return originalError(message, meta);
};

module.exports = logger;