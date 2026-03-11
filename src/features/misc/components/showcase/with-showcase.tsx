import type { ComponentType } from 'react';

import { getDisplayName } from '@/base';
import type { ShowcaseTemplateProps } from './showcase-template';

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
