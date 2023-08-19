import { motion } from 'framer-motion';
import { IconButton, IconButtonProps } from '@chakra-ui/react';
import { FaAnglesDown } from 'react-icons/fa6';

const MotionIconButton = motion(IconButton);

type ScrollDownButtonProps = Omit<IconButtonProps, 'aria-label'>;

export default function ScrollDownButton(buttonProps: ScrollDownButtonProps) {
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
      {...buttonProps}
    />
  );
}
