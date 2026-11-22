import type { RequestHandler } from 'express';
import { validationResult } from 'express-validator';

/** express-validator 유효성 검사시 사용할 에러 핸들러 */
export const handleValidationErrors: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  next();
};
