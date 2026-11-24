import type { AnalyzerDependencies } from '@/config/createServer';
import type { AnalyzerRequests } from '@/services/analyzerRequests';
import type { createAnalyzerQuota } from '@/services/redis/analyzerQuota';

declare global {
  namespace Express {
    export interface Request {
      clientIP?: string;
    }

    export interface Locals {
      analyzerRequests: AnalyzerRequests;
      analyzer: AnalyzerDependencies;
      analyzerQuota: ReturnType<typeof createAnalyzerQuota>;
      isKoyeb: boolean;
      errorType?: string;
    }
  }
}
