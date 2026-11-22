import type { RequestHandler } from 'express';

export const ignoreFavicon: RequestHandler = (req, res, next) => {
  if (req.originalUrl === '/favicon.ico') {
    res.status(204).end();
    return;
  }
  next();
};
