import { Box, BoxProps, HStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const DotGroup = motion(HStack);
const Dot = motion(Box);

const dotVariants = {
  initial: { y: '0%' },
  animate: { y: '100%' },
};

const dotTransition = {
  duration: 0.5,
  repeat: Infinity,
  repeatType: 'reverse',
  ease: 'easeInOut',
};

const containerVariants = {
  initial: { transition: { staggerChildren: 0.2 } },
  animate: { transition: { staggerChildren: 0.2 } },
};

const DOT_COUNT = 3;

interface ThreeDotsLoadingProps {
  size?: number;
  color?: BoxProps['color'];
  gap?: number;
  delay?: number;
}

/**
 * {@link https://codesandbox.io/s/loading-animation-with-framer-motion-cfk8n Implement Reference}
 * */
export const ThreeDotsWave = ({
  size = 4,
  color = 'teal.200',
  delay,
  gap,
}: ThreeDotsLoadingProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!delay) return undefined;

    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!visible && delay) return null;

  return (
    <DotGroup
      variants={containerVariants}
      initial="initial"
      animate="animate"
      w="fit-content"
      gap={gap ?? Math.max(size / 2, 3)}
    >
      {Array.from({ length: DOT_COUNT }).map((_, i) => (
        <Dot
          key={i}
          w={size}
          h={size}
          bg={color}
          borderRadius="full"
          variants={dotVariants}
          transition={dotTransition}
        />
      ))}
    </DotGroup>
  );
};

export default ThreeDotsWave;
