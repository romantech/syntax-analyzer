import { SITE_URLS } from '@/routes';
import { ShowcaseTemplate, withShowcase } from '@/features/misc';

const baseUrl = import.meta.env.VITE_IMAGE_KIT_BASE_URL;
const src = `${baseUrl}/syntax-analyzer/analysis.png`;
const placeholderSrc = `${src}?tr=bl-30,q-50`;

const AnalyzerShowcase = withShowcase(ShowcaseTemplate, {
  imageProps: { src, placeholderSrc, alt: 'Analyzer Overview' },
  title: `Syntax Unpacked\n with a Single Click`,
  description:
    'Input a sentence, choose your model, and see it deftly unravel the complex ties between subjects, verbs, objects, and beyond.',
  linkUrl: SITE_URLS.SYNTAX_ANALYZER.ROOT,
});

export default AnalyzerShowcase;
