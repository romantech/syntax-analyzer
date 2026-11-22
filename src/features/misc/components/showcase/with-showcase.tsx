import type { TFunction } from 'i18next';
import type { ComponentType } from 'react';
import { useTranslation } from 'react-i18next';

import { getDisplayName } from '@/base';
import type { ShowcaseTemplateProps } from './showcase-template';

export const withShowcase = (
  Component: ComponentType<ShowcaseTemplateProps>,
  getShowcaseProps: (t: TFunction) => ShowcaseTemplateProps,
) => {
  const WithShowcase = (props: Partial<ShowcaseTemplateProps>) => {
    const { t } = useTranslation();
    return <Component {...props} {...getShowcaseProps(t)} />;
  };

  WithShowcase.displayName = getDisplayName<ShowcaseTemplateProps>(Component);
  return WithShowcase;
};
