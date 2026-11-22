import { Router } from 'express';

const robotsRouter = Router();

robotsRouter.get('/robots.txt', (_req, res, _next) => {
  res.type('text/plain');
  /*
   * User-agent: * (모든 웹 크롤러를 대상으로 함, 예: Googlebot, Bingbot 등)
   * Disallow: / (루트 및 하위 경로에 대한 크롤러 접근 비허용)
   * */
  res.send('User-agent: *\nDisallow: /');
});

export { robotsRouter };
