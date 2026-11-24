import type { Response } from 'express';
import { CustomError } from '@/utils/customError';

const ANALYZER_TIMEOUT_MS = 45_000;

export class AnalyzerRequests {
  private readonly shutdown = new AbortController();
  private readonly active = new Set<Promise<unknown>>();
  private readonly shutdownError = new CustomError(
    503,
    'Server is shutting down.',
  );
  private acceptingRequests = true;

  constructor(private readonly timeoutMs = ANALYZER_TIMEOUT_MS) {}

  get accepting() {
    return this.acceptingRequests;
  }

  stopAccepting() {
    this.acceptingRequests = false;
  }

  cancelPending() {
    this.shutdown.abort(this.shutdownError);
  }

  async waitForPending() {
    await Promise.allSettled(this.active);
  }

  async run<Result>(
    res: Response,
    run: (signal: AbortSignal) => Promise<Result>,
  ) {
    if (!this.accepting) throw this.shutdownError;

    const request = new AbortController();
    const disconnect = () => {
      if (!res.writableFinished) {
        request.abort(new CustomError(499, 'Client disconnected.'));
      }
    };
    const signal = AbortSignal.any([request.signal, this.shutdown.signal]);
    const timeout = setTimeout(() => {
      request.abort(new CustomError(504, 'Analyzer request timed out.'));
    }, this.timeoutMs);

    res.once('close', disconnect);
    if (res.destroyed) disconnect();

    try {
      signal.throwIfAborted();
      const pending = run(signal);
      this.active.add(pending);
      try {
        return await pending;
      } finally {
        this.active.delete(pending);
      }
    } finally {
      clearTimeout(timeout);
      res.off('close', disconnect);
    }
  }
}
