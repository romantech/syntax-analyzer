import { Entries } from '@/base';

/**
 * {@link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations More transform options}
 * */
interface ImageOptions {
  width?: number;
  blur?: number;
  quality?: number;
}

export const getImageKitPlaceholder = (
  originalSrc: string,
  options: ImageOptions = {},
) => {
  const paramMapping: Record<keyof ImageOptions, string> = {
    width: 'w',
    blur: 'bl',
    quality: 'q',
  };

  const defaultOptions = { width: 200, blur: 30, quality: 50 };
  const mergedOptions = { ...defaultOptions, ...options };
  type Options = typeof mergedOptions;

  const entries = Object.entries(mergedOptions) as Entries<Options>;

  const params = entries
    .reduce((acc: string[], [key, value]) => {
      if (value) acc.push(`${paramMapping[key]}-${value}`);
      return acc;
    }, [])
    .join(',');

  return `${originalSrc}?tr=${params}`;
};
