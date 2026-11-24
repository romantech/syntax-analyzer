import type { BlockList } from 'node:net';
import type { AnalyzerDependencies } from '@/config/createServer';
import type { AnalyzerRequests } from '@/services/analyzerRequests';
import type {
  AnalyzerClient,
  createAnalyzerQuota,
} from '@/services/redis/analyzerQuota';

declare global {
  namespace Express {
    export interface Request {
      analyzerClient?: AnalyzerClient;
    }

    export interface Locals {
      analyzerRequests: AnalyzerRequests;
      analyzer: AnalyzerDependencies;
      analyzerQuota: ReturnType<typeof createAnalyzerQuota>;
      isKoyeb: boolean;
      cloudflarePeers?: BlockList;
      analyzerCookie?: { secure: boolean };
      errorType?: string;
    }
  }
}
