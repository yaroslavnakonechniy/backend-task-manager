import type { Logger } from 'winston';
import { jest } from '@jest/globals';

export const loggerInstance = {
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  child: jest.fn().mockReturnThis(),
} as unknown as Logger;
