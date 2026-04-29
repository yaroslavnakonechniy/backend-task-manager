import path from "node:path";
import winston, { type Logger } from "winston";

let loggerInstance: Logger;

const createLogger = (logDir: string): Logger => {
  return winston.createLogger({
    defaultMeta: { service: 'tasks-manager' },
    level: 'info',
    format: winston.format.combine(
      winston.format.errors({ stack: true }),
      winston.format.timestamp(),
      winston.format.json(),
    ),

    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: path.join(logDir, '/error.log'), level: 'error' }),
        new winston.transports.File({ filename: path.join(logDir, '/all.log') }),
    ],
  });
};

const initLogger = (logDir: string): Logger => {
  if (loggerInstance) {
    return loggerInstance;
  }

  loggerInstance = createLogger(logDir);

  return loggerInstance;
};

const getLogger = (): Logger => {
  if (!loggerInstance) {
    throw new Error('Logger instance is not created yet');
  }

  return loggerInstance;
};

export { initLogger, getLogger };
