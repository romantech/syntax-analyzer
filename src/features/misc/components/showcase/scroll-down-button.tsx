import { motion } from 'framer-motion';
import { Center, CenterProps } from '@chakra-ui/react';
import { FaAnglesDown } from 'react-icons/fa6';

const MotionIconButton = motion(Center);

type ScrollDownButtonProps = Omit<CenterProps, 'aria-label'>;

export default function ScrollDownButton(centerProps: ScrollDownButtonProps) {
  return (
    <MotionIconButton
      fontSize="xl"
      position="absolute"
      transform="translateX(-50%)"
      cursor="pointer"
      borderRadius="full"
      left="50%"
      bottom="6%"
      variant="unstyled"
      aria-label="Scroll down"
      initial={{ y: '0%' }}
      animate={{ y: ['0%', '40%', '0%'] }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      _hover={{
        boxShadow: '0 0 20px 30px rgba(0,0,0,0.8)',
        transition: 'box-shadow 0.3s ease-in-out',
      }}
      _after={{
        content: '""',
        display: 'block',
        position: 'absolute',
        top: '-20px', // 클릭 가능 영역 확장
        right: '-20px',
        bottom: '-20px',
        left: '-20px',
      }}
      {...centerProps}
    >
      <FaAnglesDown />
    </MotionIconButton>
  );
}
