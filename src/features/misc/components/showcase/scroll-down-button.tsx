import { IconButton, type IconButtonProps, usePrefersReducedMotion } from '@chakra-ui/react';
import { motion, type Variants } from 'framer-motion';
import { FaAnglesDown } from 'react-icons/fa6';

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
  const prefersReducedMotion = usePrefersReducedMotion({ ssr: false });

  return (
    <MotionIconButton
      isRound
      position={{ base: 'static', lg: 'absolute' }}
      alignSelf="center"
      mt={{ base: 6, lg: 0 }}
      left="50%"
      bottom="6%"
      minW={{ base: '44px', lg: 10 }}
      minH={{ base: '44px', lg: 10 }}
      fontSize="xl"
      icon={<FaAnglesDown />}
      aria-label="Scroll down"
      sx={{ translate: { lg: '-50% 0' } }}
      variants={motionVariants}
      initial="initial"
      animate={prefersReducedMotion ? 'initial' : 'bounce'}
      {...buttonProps}
    />
  );
}
