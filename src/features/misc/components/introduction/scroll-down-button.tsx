import { motion } from 'framer-motion';
import { IconButton } from '@chakra-ui/react';
import { FaAnglesDown } from 'react-icons/fa6';

const MotionIconButton = motion(IconButton);

export default function ScrollDownButton({ onClick }: { onClick: () => void }) {
  return (
    <MotionIconButton
      fontSize="xl"
      position="absolute"
      transform="translateX(-50%)"
      left="50%"
      bottom="5%"
      variant="unstyled"
      aria-label="Scroll down"
      icon={<FaAnglesDown />}
      initial={{ y: '0%' }}
      animate={{ y: ['0%', '50%', '0%'] }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      onClick={onClick}
    />
  );
}
