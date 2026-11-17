import { useBreakpointValue, useColorModeValue, usePrefersReducedMotion } from '@chakra-ui/react';
import type { ISourceOptions } from '@tsparticles/engine';
import { loadLinksPreset } from '@tsparticles/preset-links';
import Particles, { type IParticlesProps, ParticlesProvider } from '@tsparticles/react';

export default function LinkParticles({ options, ...particlesProps }: IParticlesProps) {
  const color = useColorModeValue('#5b5b5b', '#b0b0b0');
  const isCompact = useBreakpointValue({ base: true, lg: false }, { ssr: false });
  const prefersReducedMotion = usePrefersReducedMotion({ ssr: false });

  if (prefersReducedMotion) return null;

  const defaultOptions: ISourceOptions = {
    preset: 'links',
    fullScreen: { enable: true, zIndex: -1 },
    background: { color: 'transparent' },
    particles: {
      paint: { fill: { color: { value: color } } },
      opacity: { value: 0.3 },
      number: isCompact ? { value: 24 } : undefined,
      links: {
        color,
        distance: isCompact ? 80 : undefined,
        opacity: isCompact ? 0.2 : 0.3,
      },
    },
  };

  return (
    <ParticlesProvider init={loadLinksPreset}>
      <Particles options={{ ...defaultOptions, ...options }} {...particlesProps} />
    </ParticlesProvider>
  );
}
