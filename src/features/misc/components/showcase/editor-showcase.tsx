import { getImageKitPlaceholder } from '@/base';
import { getSyntaxEditorPath } from '@/routes';
import { ShowcaseTemplate } from './showcase-template';
import { withShowcase } from './with-showcase';

const baseUrl = import.meta.env.VITE_IMAGE_KIT_BASE_URL;
const src = `${baseUrl}/syntax-analyzer/editor.png`;

const EditorShowcase = withShowcase(ShowcaseTemplate, (t) => ({
  imageProps: {
    src,
    placeholderSrc: getImageKitPlaceholder(src),
    alt: t('home.editorImage'),
  },
  title: t('home.editorTitle'),
  description: t('home.editorDescription'),
  linkUrl: getSyntaxEditorPath('sample', 4),
  imageFirst: false,
}));

export default EditorShowcase;
