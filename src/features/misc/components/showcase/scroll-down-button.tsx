import { IconButton, type IconButtonProps } from '@chakra-ui/react';
import { motion, type Variants } from 'framer-motion';
import { FaAnglesDown } from 'react-icons/fa6';

import { usePrefersReducedMotion } from '@/base';

const MotionIconButton = motion.create(IconButton);

type ScrollDownButtonProps = Pick<IconButtonProps, 'hidden' | 'onClick'>;

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
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <MotionIconButton
      borderRadius="full"
      position="absolute"
      alignSelf="center"
      left="50%"
      bottom={{ base: 'calc(48px + env(safe-area-inset-bottom, 0px))', lg: '6%' }}
      minW={{ base: '44px', lg: 10 }}
      minH={{ base: '44px', lg: 10 }}
      fontSize="xl"
      aria-label="Scroll down"
      variant="subtle"
      css={{ translate: '-50% 0' }}
      variants={motionVariants}
      initial="initial"
      animate={prefersReducedMotion ? 'initial' : 'bounce'}
      {...buttonProps}
    >
      <FaAnglesDown />
    </MotionIconButton>
  );
}
