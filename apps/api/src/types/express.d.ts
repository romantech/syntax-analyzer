import type Redis from 'ioredis';
import type { AnalyzerRequests } from '@/services/analyzerRequests';

declare global {
  namespace Express {
    export interface Request {
      clientIP?: string;
    }

    export interface Locals {
      analyzerRequests: AnalyzerRequests;
      errorType?: string;
      redis?: Redis;
    }
  }
}
