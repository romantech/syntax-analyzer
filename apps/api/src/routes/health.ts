import { Router } from 'express';
import requestIP from 'request-ip';

const healthRouter = Router();

healthRouter.get(['/', '/health'], (req, res, _next) => {
  const request_ip = requestIP.getClientIp(req);

  res.status(200).send({
    uptime: process.uptime(),
    message: 'Server is up and running',
    timestamp: Date.now(),
    status: 'OK',
    request_ip,
  });
});

export { healthRouter };
