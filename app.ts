import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import crypto from 'node:crypto';
import express, { type Request, type Response, type NextFunction } from 'express';
import multer from 'multer';
import { router as apiV1 } from './api/v1/routes';
import { createLogger, currentUser, logTimestamp, throwError } from './middlewares';

import type { ExtendedRequest } from './interfaces';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//const staticPath = path.join(__dirname, '..' ,'public');
const logsPath = path.join(__dirname, 'logs');
/* const filesPath = path.join(__dirname, 'uploads');

if (!fs.existsSync(filesPath)) {
    fs.mkdirSync(filesPath, { recursive: true });
    console.log('✅ Directory created:', filesPath);
} */

// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, filesPath)
//   },
//   filename(req, file, cb) {
//     console.log('File received:', file);
//     const uniqueSuffix = crypto.randomBytes(8).toString('hex');
//     cb(null, `${uniqueSuffix}-${file.originalname}`)
//   },
// });

if (!fs.existsSync(logsPath)) {
    fs.mkdirSync(logsPath, { recursive: true });
    console.log('📁 Logs directory created:', logsPath);
}

const app = express();
// const upload = multer({ storage });

app.get(
  '/middleware-test',
  (req: ExtendedRequest, res: Response, next: NextFunction) => {
    console.log('First middleware');

    next(); 
  },
  (req: ExtendedRequest, res: Response, next: NextFunction) => {
    console.log('Second middleware');

    next(); 
  },
  (req: ExtendedRequest, res: Response, next: NextFunction) => {
    console.log('Third middleware');

    res.send('Hello from middleware test');
  }
);

// app.post(
//   "/upload",
//   upload.single("file"),
//   (req: ExtendedRequest, res: Response, next: NextFunction) => {
//     console.log('File uploaded:', req.file);
//     console.log('File uploaded:', req.body.description);
//     res.json({ message: "Successfully uploaded file" });
//   });

app.use(express.json());
//app.use('/static', express.static(staticPath));

app.use(createLogger(logsPath)); // Use the logger middleware for all routes
app.use(logTimestamp);
// app.use(throwError);
app.use(currentUser);

app.get('/', throwError, (req: ExtendedRequest, res: Response, next: NextFunction) => {
  res.send('Welcome to Tasks Manager API');
});

app.use('/api/v1', apiV1);

app.use((req: ExtendedRequest, res: Response, next: NextFunction) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((error: Error, req: ExtendedRequest, res: Response, next: NextFunction) => {
  console.error(error.stack);
  req.log?.error(`Error: ${error.message}`, error);

  res.status(500).json({ message: error.message || 'Something went wrong' });
});

export { app }
