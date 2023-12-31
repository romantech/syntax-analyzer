import { useColorMode } from '@chakra-ui/react';
import { IParticlesProps, Particles } from 'react-tsparticles';
import { loadLinksPreset } from 'tsparticles-preset-links';

export default function LinkParticles(particleProps: IParticlesProps) {
  const isLightMode = useColorMode().colorMode === 'light';
  const color = isLightMode ? '#5b5b5b' : '#b0b0b0';

  const options: IParticlesProps['options'] = {
    preset: 'links',
    fullScreen: { enable: true, zIndex: -1 },
    background: { color: 'transparent' },
    particles: {
      color: { value: color },
      opacity: { value: 0.3 },
      line_linked: { opacity: 0.3, color: { value: color } },
    },
  };

  return (
    <Particles options={options} init={loadLinksPreset} {...particleProps} />
  );
}
