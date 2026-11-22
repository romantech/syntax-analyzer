import { Router } from 'express';
import { analyzerController } from '@/controllers';

export enum AnalyzerRoute {
  ANALYSIS = '/',
  RANDOM_SENTENCES = '/random-sentences',
  REMAINING_COUNTS = '/remaining-counts',
}

const analyzerRouter = Router();

/** 구문 분석 데이터 생성 */
analyzerRouter.post(
  AnalyzerRoute.ANALYSIS,
  ...analyzerController.createAnalysis,
);

/** 잔여 요청 횟수 */
analyzerRouter.get(
  AnalyzerRoute.REMAINING_COUNTS,
  analyzerController.getRemainingCounts,
);

/** 랜덤 영어 문장 생성 */
analyzerRouter.get(
  AnalyzerRoute.RANDOM_SENTENCES,
  ...analyzerController.getRandomSentences,
);

export { analyzerRouter };
