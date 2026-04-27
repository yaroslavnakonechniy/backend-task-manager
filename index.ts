import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'node:path';
import dotenv from 'dotenv';
import { createApp } from './app';
import { initLogger } from './modules/logger';
import { connect } from './repositories/json-db/base';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.join(__dirname, '', '.env') });

try {
  const { PORT, DB_URI, DB_PORT } = process.env;
  
  if (!PORT) {
    console.error('PORT is not defined in environment variables');

    throw new Error('PORT is not defined in environment variables');
  }

  if (!DB_URI || !DB_PORT) {
    console.error('DB_URI or DB_PORT is not defined in environment variables');

    throw new Error('DB_URI or DB_PORT is not defined in environment variables');
  }

  // Connect to the JSON Server database and start the server
  connect(`${DB_URI}:${DB_PORT}`)
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

