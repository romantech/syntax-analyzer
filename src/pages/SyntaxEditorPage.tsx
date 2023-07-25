import { tokenizer } from '@/utils/common.ts';

const exampleText =
  'Many organizations need help with administrative tasks that can be completed digitally.';

export default function SyntaxEditorPage() {
  const tokenized = tokenizer(exampleText);
  console.log(tokenized);
  return <div>SyntaxEditor</div>;
}
