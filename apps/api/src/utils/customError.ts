import { ERROR_MESSAGES } from '@/constants';

export class CustomError extends Error {
  status: number;

  constructor(status: number, message: string = ERROR_MESSAGES.SERVER_ERROR) {
    super(message);
    this.status = status;
    Error.captureStackTrace(this, CustomError);
  }
}

export const throwCustomError = (message: string, status = 500): never => {
  throw new CustomError(status, message);
};
