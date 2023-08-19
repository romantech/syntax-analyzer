import { ComponentType } from 'react';
import { getDisplayName } from '@/base';
import { ShowcaseTemplateProps } from '@/features/misc';

export const withShowcase = (
  Component: ComponentType<ShowcaseTemplateProps>,
  showcaseProps: ShowcaseTemplateProps,
) => {
  const WithShowcase = (props: Partial<ShowcaseTemplateProps>) => (
    <Component {...props} {...showcaseProps} />
  );

  WithShowcase.displayName = getDisplayName<ShowcaseTemplateProps>(Component);
  return WithShowcase;
};
