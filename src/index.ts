import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');
import path from 'node:path';
import dotenv from 'dotenv';
import { createApp } from './app';
import { initLogger } from './modules/logger';
import { connect } from './repositories/mongoose';

dotenv.config({ path: path.join(__dirname, '..', '.env.test') });

try {
  const { PORT, DB_URI, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, JWT_SECRET_KEY, COOKIE_SECRET_KEY, CLIENT_URLS } = process.env;
  
  if (!PORT) {
    console.error('PORT is not defined in environment variables');

    throw new Error('PORT is not defined in environment variables');
  }

  if (!DB_URI || !DB_PORT || !DB_NAME || !DB_USER || !DB_PASSWORD) {
    console.error('One or more database environment variables are not defined (DB_URI, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD)');

    throw new Error('One or more database environment variables are not defined (DB_URI, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD)');
  }

  if (!JWT_SECRET_KEY || !COOKIE_SECRET_KEY) {
    console.error('JWT_SECRET_KEY or COOKIE_SECRET_KEY is not defined in environment variables');

    throw new Error('JWT_SECRET_KEY or COOKIE_SECRET_KEY is not defined in environment variables');
  }

  if (!CLIENT_URLS) {
    console.error('CLIENT_URLS is not defined in environment variables');

    throw new Error('CLIENT_URLS is not defined in environment variables');
  }

  // Connect to the JSON Server database and start the server
  connect({
    uri: DB_URI,
    name: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD
  })
    .then(() => {
      // Initialize logger and create the application instance
      const logsPath = path.join(__dirname, 'logs');
      const logger = initLogger(logsPath);
      const app = createApp({ loggerInstance: logger });

      logger.info('Connected to JSON Server database');

      // Start the server
      app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error('Failed to connect to JSON Server database', { error });

      throw new Error('Failed to connect to JSON Server database');
    });

} catch (error) {
  console.error('Failed to start the application', { error });

  process.exit(1);
}
