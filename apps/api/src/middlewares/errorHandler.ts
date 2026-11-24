import { OutputParserException } from '@langchain/core/output_parsers';
import type { ErrorRequestHandler } from 'express';
import { ReplyError } from 'ioredis';
import { APIError } from 'openai';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
import { CustomError } from '@/utils/customError';

const { SERVER_ERROR } = ERROR_MESSAGES;

const getErrorType = (error: unknown): string => {
  if (error instanceof CustomError)
    return error.errorType ?? 'application-error';
  if (error instanceof APIError) return 'model-api-error';
  if (error instanceof OutputParserException) return 'invalid-model-output';
  if (error instanceof ReplyError) return 'redis-reply-error';
  return 'internal-error';
};

/* next 파라미터(4번째)가 없으면 에러처리 미들웨어 인식하지 않으므로 주의 */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (res.destroyed) return;

  switch (err.type) {
    case 'entity.parse.failed':
    case 'querystring.parse.rangeError':
    case 'request.size.invalid':
      res.locals.errorType = 'invalid-request-body';
      res
        .status(400)
        .json({ status: 'error', message: 'Invalid request body.' });
      return;
    case 'entity.too.large':
    case 'parameters.too.many':
      res.locals.errorType = 'request-body-too-large';
      res
        .status(413)
        .json({ status: 'error', message: 'Request body too large.' });
      return;
  }

  const isCustomError = err instanceof CustomError;
  const status = isCustomError ? err.status : 500;
  const message = isCustomError ? err.message : SERVER_ERROR;

  res.locals.errorType = getErrorType(err);
  res.status(status).json({ status: 'error', message });
};
