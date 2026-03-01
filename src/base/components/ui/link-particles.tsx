import { useEffect, useState } from 'react';

import { useColorMode } from '@chakra-ui/react';
import { type ISourceOptions } from '@tsparticles/engine';
import { loadLinksPreset } from '@tsparticles/preset-links';
// eslint-disable-next-line import-x/no-named-as-default
import Particles, {
  initParticlesEngine,
  type IParticlesProps,
} from '@tsparticles/react';

export default function LinkParticles({
  options,
  ...particlesProps
}: IParticlesProps) {
  const isLightMode = useColorMode().colorMode === 'light';
  const color = isLightMode ? '#5b5b5b' : '#b0b0b0';

  const [init, setInit] = useState(false);

  const defaultOptions: ISourceOptions = {
    preset: 'links',
    fullScreen: { enable: true, zIndex: -1 },
    background: { color: 'transparent' },
    particles: {
      color: { value: color },
      opacity: { value: 0.3 },
      links: { opacity: 0.3, color },
    },
  };

  /** {@link https://particles.js.org/docs/modules/_tsparticles_react.html 초기 설정 참고} */
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadLinksPreset(engine);
    }).then(() => setInit(true));
  }, []);

  if (!init) return null;

  return (
    <Particles
      options={{ ...defaultOptions, ...options }}
      {...particlesProps}
    />
  );
}
