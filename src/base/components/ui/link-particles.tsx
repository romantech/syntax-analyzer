import { useColorModeValue } from '@chakra-ui/react';
import type { ISourceOptions } from '@tsparticles/engine';
import { loadLinksPreset } from '@tsparticles/preset-links';
import Particles, { type IParticlesProps, ParticlesProvider } from '@tsparticles/react';

import { usePrefersReducedMotion } from '@/base/hooks';

export default function LinkParticles({ options, ...particlesProps }: IParticlesProps) {
  const color = useColorModeValue('#5b5b5b', '#b0b0b0');
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) return null;

  const defaultOptions: ISourceOptions = {
    preset: 'links',
    fullScreen: { enable: true, zIndex: -1 },
    background: { color: 'transparent' },
    particles: {
      paint: { fill: { color: { value: color } } },
      opacity: { value: 0.3 },
      number: { value: 100, density: { enable: true, width: 1280, height: 800 } },
      links: { color, opacity: 0.3 },
    },
  };

  return (
    <ParticlesProvider init={loadLinksPreset}>
      <Particles options={{ ...defaultOptions, ...options }} {...particlesProps} />
    </ParticlesProvider>
  );
}
