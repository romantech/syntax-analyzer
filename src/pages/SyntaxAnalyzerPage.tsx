import { yupResolver } from '@hookform/resolvers/yup';
import { analyzeSentenceSchema } from '@/constants/scheme';
import { useForm } from 'react-hook-form';

export type Model = 3.5 | 4;
type AnalyzeSentenceFormValues = { model: Model; sentence: string };
const DEFAULT_VALUES: AnalyzeSentenceFormValues = { model: 3.5, sentence: '' };

const AnalyzeSentenceForm = () => {
  const { register } = useForm<AnalyzeSentenceFormValues>({
    defaultValues: DEFAULT_VALUES,
    resolver: yupResolver(analyzeSentenceSchema),
  });

  return <form></form>;
};

export default function SyntaxAnalyzerPage() {
  return <div>SyntaxAnalyzerPage</div>;
}
