import type { ErrorRequestHandler } from 'express';
import { logger } from '@/config';
import { ERROR_MESSAGES } from '@/constants';
import { CustomError } from '@/utils';

const { SERVER_ERROR } = ERROR_MESSAGES;
/* next 파라미터(4번째)가 없으면 에러처리 미들웨어 인식하지 않으므로 주의 */
export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const isCustomError = err instanceof CustomError;
  const status = isCustomError ? err.status : 500;
  const message = isCustomError ? err.message : SERVER_ERROR;

  logger.error('Error Caught in Request Handler', {
    error_message: err.message,
    path: req.path,
    method: req.method,
    headers: req.headers,
    body: req.body,
    stack: err.stack,
  });

  res.status(status).json({ status: 'error', message });
};
