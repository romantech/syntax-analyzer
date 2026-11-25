import { useLayoutEffect, useRef, useState } from 'react';

export function useLabelWidth(enabled = true) {
  const labelRef = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState<number>();

  useLayoutEffect(() => {
    const label = labelRef.current;
    if (!enabled || !label) return;

    const measure = () => setWidth(label.getBoundingClientRect().width);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(label);
    return () => observer.disconnect();
  }, [enabled]);

  return { labelRef, width: enabled ? width : undefined };
}
