import { getImageKitPlaceholder } from '@/base';
import { ShowcaseTemplate, withShowcase } from '@/features/misc';
import { getSyntaxEditorPath } from '@/routes';

const baseUrl = import.meta.env.VITE_IMAGE_KIT_BASE_URL;
const src = `${baseUrl}/syntax-analyzer/editor.png`;

const EditorShowcase = withShowcase(ShowcaseTemplate, {
  imageProps: {
    src,
    placeholderSrc: getImageKitPlaceholder(src),
    alt: 'Editor Overview',
  },
  title: `Refined Visual\nSyntax Exploration`,
  description:
    'Engage with precise tagging of words, phrases, and clauses. Discover over 30 essential syntax tags and enhance your English mastery with sleek visual cues.',
  linkUrl: getSyntaxEditorPath('sample', 4),
  imageFirst: false,
});

export default EditorShowcase;
