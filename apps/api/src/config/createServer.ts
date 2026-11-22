import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors, { type CorsOptions } from 'cors';
import express, { type Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { envConfig } from '@/config/environment';

const morganFormat = envConfig.isProd ? 'combined' : 'dev';
const corsOptions: CorsOptions = {
  /** Access-Control-Allow-Origin 응답 헤더 설정 (허용할 오리진 목록) */
  origin: envConfig.corsOrigins,
  /** Access-Control-Allow-Methods 응답 헤더 설정 (허용할 HTTP 메서드 목록) */
  methods: ['GET', 'POST'],
  /** Access-Control-Allow-Headers 응답 헤더 설정 (허용할 요청 헤더 목록) */
  allowedHeaders: ['Content-Type', 'Authorization'],
  /**
   * Access-Control-Allow-Credentials 응답 헤더 설정
   * 기본적으로 자격증명이 포함된 응답은 JS 에서 접근할 수 없음.
   * true 설정시 자격증명과 함께 요청을 수행할 때 해당 응답을 JS 에서 접근 가능
   * true 설정시 Access-Control-Allow-Origin 헤더에 와일드카드(*) 사용 불가
   * 프론트엔드에서 자격 증명을 포함하여 요청할 땐 withCredentials: true 옵션 추가 필요
   * */
  credentials: true,
  /**
   * CORS 사전 요청(Preflight Request)의 성공 상태 코드 설정
   * 기본적으로 Preflight Request 응답은 204 No Content 상태 코드를 반환하지만,
   * 레거시 브라우저에선 204 No Content 상태 코드에 문제가 발생할 수 있어 200으로 설정
   * */
  optionsSuccessStatus: 200,
};

export const createServer = (): Application => {
  const app = express();
  app.set('query parser', 'extended');

  /**
   * Helmet 라이브러리를 이용해 보안 관련 HTTP 헤더 자동 설정
   * Strict-Transport-Security(HTTPS 강제), X-Frame-Options(클릭 재킹 방지) 등
   * */
  app.use(helmet());
  app.use(cors(corsOptions));

  /**
   * URL-encoded(Hello World! 문자열을 인코딩하면 Hello+World%21) 문자열 파싱
   * { extended: true } 옵션으로 qs 라이브러리를 사용해서 더 다양한 데이터 형식 지원
   * HTTP 프로토콜과 URL 은 ASCII 문자셋만 지원. 공백, 특수문자 등을 사용하기 위해 URL 인코딩
   * */
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(compression());
  app.use(morgan(morganFormat));
  app.use(cookieParser());

  /**
   * X-Powered-By 헤더는 백엔드 프레임워크, 언어 등에 대한 정보를 나타냄
   * Express 는 기본적으로 X-Powered-By: Express 라고 설정됨
   * 보안을 위해 X-Powered-By 헤더 제거
   * */
  app.disable('x-powered-by');

  return app;
};
