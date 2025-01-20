import { ComponentProps } from 'react';

import { IconButton } from '@chakra-ui/react';
import { motion, Variants } from 'framer-motion';
import { FaAnglesDown } from 'react-icons/fa6';

const MotionIconButton = motion.create(IconButton);

type ScrollDownButtonProps = ComponentProps<typeof MotionIconButton>;

const motionVariants: Variants = {
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
