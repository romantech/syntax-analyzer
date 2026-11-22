import type { RequestHandler } from 'express';
import { ERROR_MESSAGES } from '@/constants';
import { throwCustomError } from '@/utils';

export const notFoundHandler: RequestHandler = (req, _res, _next) => {
  const { originalUrl } = req;
  throwCustomError(ERROR_MESSAGES.NOT_FOUND(originalUrl), 404);
};
