import { getImageKitPlaceholder } from '@/base';
import { SITE_URLS } from '@/routes';
import { ShowcaseTemplate } from './showcase-template';
import { withShowcase } from './with-showcase';

const baseUrl = import.meta.env.VITE_IMAGE_KIT_BASE_URL;
const src = `${baseUrl}/syntax-analyzer/analysis.png`;

const AnalyzerShowcase = withShowcase(ShowcaseTemplate, (t) => ({
  imageProps: {
    src,
    placeholderSrc: getImageKitPlaceholder(src),
    alt: t('home.analyzerImage'),
  },
  title: t('home.analyzerTitle'),
  description: t('home.analyzerDescription'),
  linkUrl: SITE_URLS.ANALYZER.ROOT,
}));

export default AnalyzerShowcase;
