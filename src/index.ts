import { Server } from 'node:http';
import path from 'node:path';
import dotenv from 'dotenv';

import { createApp } from './app';
import { initLogger } from './modules/logger';
import { connect, closeDB } from './repositories/mongoose';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

let server: Server | null = null;

const startServer = async (): Promise<void> => {
  try {
    const {
      PORT,
      DB_URI,
      DB_PORT,
      DB_NAME,
      DB_USER,
      DB_PASSWORD,
      JWT_SECRET_KEY,
      COOKIE_SECRET_KEY,
      CLIENT_URLS
    } = process.env;

    // Validate env variables
    if (!PORT) {
      throw new Error('PORT is not defined in environment variables');
    }

    if (!DB_URI || !DB_PORT || !DB_NAME || !DB_USER || !DB_PASSWORD) {
      throw new Error(
        'One or more database environment variables are not defined (DB_URI, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD)'
      );
    }

    if (!JWT_SECRET_KEY || !COOKIE_SECRET_KEY) {
      throw new Error(
        'JWT_SECRET_KEY or COOKIE_SECRET_KEY is not defined in environment variables'
      );
    }

    if (!CLIENT_URLS) {
      throw new Error('CLIENT_URLS is not defined in environment variables');
    }

    // Connect to MongoDB FIRST
    await connect({
      uri: DB_URI,
      name: DB_NAME,
      user: DB_USER,
      password: DB_PASSWORD
    });

    // Initialize logger
    const logsPath = path.join(__dirname, 'logs');
    const logger = initLogger(logsPath);

    logger.info('Connected to MongoDB');

    // Create app
    const app = createApp({
      loggerInstance: logger
    });

    // Start server
    server = app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Failed to start application', error);

    process.exit(1);
  }
};

const closeServer = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!server) {
      return resolve();
    }

    server.close((err) => {
      if (err) {
        return reject(err);
      }

      console.log('HTTP server closed');

      resolve();
    });
  });
};

const gracefulShutdown = async (signal: string): Promise<void> => {
  console.log(`Received ${signal}. Shutting down gracefully...`);

  const timeout = setTimeout(() => {
    console.error('Shutdown timeout exceeded. Force exiting...');
    process.exit(1);
  }, 10000);

  try {
    await closeServer();

    await closeDB();

    clearTimeout(timeout);

    console.log('Graceful shutdown completed');

    process.exit(0);

  } catch (error) {
    console.error('Error during graceful shutdown', error);

    process.exit(1);
  }
};

// Handle process termination
['SIGINT', 'SIGTERM'].forEach((signal) => {
  process.on(signal, () => {
    gracefulShutdown(signal);
  });
});

// Start app
startServer();
