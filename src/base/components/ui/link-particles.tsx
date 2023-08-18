import { loadLinksPreset } from 'tsparticles-preset-links';
import Particles, { IParticlesProps } from 'react-tsparticles';

const options: IParticlesProps['options'] = {
  preset: 'links',
  fullScreen: { enable: false, zIndex: -1 },
  background: { color: 'transparent' },
  particles: {
    opacity: { value: 0.3 },
    line_linked: { opacity: 0.3 },
  },
};

export default function LinkParticles(particleProps: IParticlesProps) {
  return (
    <Particles
      style={{ position: 'absolute', top: 0, left: 0 }}
      options={options}
      init={loadLinksPreset}
      {...particleProps}
    />
  );
}
