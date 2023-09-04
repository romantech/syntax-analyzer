import { getImageKitPlaceholder } from '@/base';
import { ShowcaseTemplate, withShowcase } from '@/features/misc';
import { SITE_URLS } from '@/routes';

const baseUrl = import.meta.env.VITE_IMAGE_KIT_BASE_URL;
const src = `${baseUrl}/syntax-analyzer/generator.png`;

const EditorShowcase = withShowcase(ShowcaseTemplate, {
  imageProps: {
    src,
    placeholderSrc: getImageKitPlaceholder(src),
    alt: 'Editor Overview',
  },
  title: `Generate Tailored\nRandom Sentences`,
  description:
    'Select themes and watch as sentences are uniquely crafted for your preference. Mix up to 3 topics to form an assortment of distinguished expressions.',
  linkUrl: SITE_URLS.EDITOR.ROOT,
});

export default EditorShowcase;
