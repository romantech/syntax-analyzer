import { getImageKitPlaceholder } from '@/base';
import { SITE_URLS } from '@/routes';
import { ShowcaseTemplate } from './showcase-template';
import { withShowcase } from './with-showcase';

const baseUrl = import.meta.env.VITE_IMAGE_KIT_BASE_URL;
const src = `${baseUrl}/syntax-analyzer/generator.png`;

const GeneratorShowcase = withShowcase(ShowcaseTemplate, (t) => ({
  imageProps: {
    src,
    placeholderSrc: getImageKitPlaceholder(src),
    alt: t('home.generatorImage'),
  },
  title: t('home.generatorTitle'),
  description: t('home.generatorDescription'),
  linkUrl: SITE_URLS.EDITOR.ROOT,
}));

export default GeneratorShowcase;
