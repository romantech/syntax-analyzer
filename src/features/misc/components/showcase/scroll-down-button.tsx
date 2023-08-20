import { motion } from 'framer-motion';
import { IconButton, IconButtonProps } from '@chakra-ui/react';
import { FaAnglesDown } from 'react-icons/fa6';

const MotionIconButton = motion(IconButton);

type ScrollDownButtonProps = Omit<IconButtonProps, 'aria-label'>;

const motionVariants = {
  initial: { y: '0%' },
  bounce: {
    y: ['0%', '50%', '0%'],
    transition: {
      y: {
        duration: 0.7,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  },
};

export default function ScrollDownButton(buttonProps: ScrollDownButtonProps) {
  return (
    <MotionIconButton
      isRound
      position="absolute"
      left="50%"
      bottom="6%"
      fontSize="xl"
      icon={<FaAnglesDown />}
      aria-label="Scroll down"
      transform="translateX(-50%)"
      variants={motionVariants}
      initial="initial"
      animate="bounce"
      {...buttonProps}
    />
  );
}
