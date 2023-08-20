import { SITE_URLS } from '@/routes';
import { ShowcaseTemplate, withShowcase } from '@/features/misc';

const baseUrl = import.meta.env.VITE_IMAGE_KIT_BASE_URL;
const src = `${baseUrl}/syntax-analyzer/generator.png`;
const placeholderSrc = `${src}?tr=bl-30,q-50`;

const EditorShowcase = withShowcase(ShowcaseTemplate, {
  imageProps: { src, placeholderSrc, alt: 'Editor Overview' },
  title: `Generate Tailored\nRandom Sentences`,
  description:
    'Select themes and watch as sentences are uniquely crafted for your preference. Mix up to 3 topics to form an assortment of distinguished expressions.',
  linkUrl: SITE_URLS.SYNTAX_EDITOR.ROOT,
});

export default EditorShowcase;
