import { ERROR_MESSAGES } from '@/constants/errorMessages';

type ModelErrorType = 'invalid-model-output' | 'model-json-repair-failed';

export class CustomError extends Error {
  constructor(
    readonly status: number,
    message: string = ERROR_MESSAGES.SERVER_ERROR,
    readonly errorType?: ModelErrorType,
  ) {
    super(message);
    Error.captureStackTrace(this, CustomError);
  }
}

export const throwCustomError = (
  message: string,
  status = 500,
  errorType?: ModelErrorType,
): never => {
  throw new CustomError(status, message, errorType);
};
