import { getSyntaxEditorPath } from '@/routes';
import { ShowcaseTemplate, withShowcase } from '@/features/misc';

const baseUrl = import.meta.env.VITE_IMAGE_KIT_BASE_URL;
const src = `${baseUrl}/syntax-analyzer/editor.png`;
const placeholderSrc = `${src}?tr=bl-30,q-50`;

const EditorShowcase = withShowcase(ShowcaseTemplate, {
  imageProps: { src, placeholderSrc, alt: 'Editor Overview' },
  title: `Elevated Visual\nSyntax Experience`,
  description:
    'Engage in direct tagging of words, phrases, and clauses. Access over 30 of the most frequented syntax tags. Amplify your English learning with enriched visual enhancements.',
  linkUrl: getSyntaxEditorPath('sample', 4),
  imageFirst: false,
});

export default EditorShowcase;
