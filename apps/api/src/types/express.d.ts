export {};

declare global {
  namespace Express {
    export interface Request {
      clientIP?: string;
    }

    export interface Locals {
      errorType?: string;
    }
  }
}
