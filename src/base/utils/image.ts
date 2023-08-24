import { Entries } from '@/base';

/**
 * {@link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations More transform options}
 * */
interface ImageOptions {
  width?: number;
  blur?: number;
  quality?: number;
}

/**
 * Generates an image URL with ImageKit placeholder transformation parameters.
 *
 * @param {string} originalSrc - The original source URL of the image.
 * @param {ImageOptions} options - Optional parameters for the image transformation.
 * @return {string} - The transformed image URL with placeholder parameters.
 */
export const getImageKitPlaceholder = (
  originalSrc: string,
  options: ImageOptions = {},
): string => {
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
