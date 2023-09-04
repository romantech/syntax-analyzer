import { getImageKitPlaceholder } from '@/base';
import { ShowcaseTemplate, withShowcase } from '@/features/misc';
import { SITE_URLS } from '@/routes';

const baseUrl = import.meta.env.VITE_IMAGE_KIT_BASE_URL;
const src = `${baseUrl}/syntax-analyzer/analysis.png`;

const AnalyzerShowcase = withShowcase(ShowcaseTemplate, {
  imageProps: {
    src,
    placeholderSrc: getImageKitPlaceholder(src),
    alt: 'Analyzer Overview',
  },
  title: `Syntax Unpacked\n with a Single Click`,
  description:
    'Input a sentence, choose your model, and see it deftly unravel the complex ties between subjects, verbs, objects, and beyond.',
  linkUrl: SITE_URLS.ANALYZER.ROOT,
});

export default AnalyzerShowcase;
