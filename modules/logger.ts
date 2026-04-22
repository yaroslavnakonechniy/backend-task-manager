import path from "node:path";
import winston from "winston";

export const createLogger = (logDir: string) => {
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
