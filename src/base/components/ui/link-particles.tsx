import { useColorMode } from '@chakra-ui/react';
import type { ISourceOptions } from '@tsparticles/engine';
import { loadLinksPreset } from '@tsparticles/preset-links';
import Particles, { type IParticlesProps, ParticlesProvider } from '@tsparticles/react';

export default function LinkParticles({ options, ...particlesProps }: IParticlesProps) {
  const isLightMode = useColorMode().colorMode === 'light';
  const color = isLightMode ? '#5b5b5b' : '#b0b0b0';

  const defaultOptions: ISourceOptions = {
    preset: 'links',
    fullScreen: { enable: true, zIndex: -1 },
    background: { color: 'transparent' },
    particles: {
      paint: { fill: { color: { value: color } } },
      opacity: { value: 0.3 },
      links: { opacity: 0.3, color },
    },
  };

  return (
    <ParticlesProvider init={loadLinksPreset}>
      <Particles options={{ ...defaultOptions, ...options }} {...particlesProps} />
    </ParticlesProvider>
  );
}
