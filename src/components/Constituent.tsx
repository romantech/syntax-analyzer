import { Constituent as TConstituent } from '@/types/analysis.ts';
import { PropsWithChildren, useState, MouseEvent } from 'react';
import { Text, Tooltip, useColorModeValue } from '@chakra-ui/react';
import { CONSTITUENT_COLORS } from '@/constants/constituents.ts';
import { getNearestConstituent } from '@/utils/common.ts';
import { NumberTuple } from '@/types/common.ts';

interface ConstituentProps {
  constituent: TConstituent;
}

export default function Constituent({
  children,
  constituent,
}: PropsWithChildren<ConstituentProps>) {
  const { dark, light } = CONSTITUENT_COLORS[constituent.type];
  const colorValue = useColorModeValue(light, dark);
  const [openTooltip, setOpenTooltip] = useState(false);

  const onMouseOver = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const element = getNearestConstituent(e.currentTarget as HTMLElement);
    if (element) {
      const constituentId = Number(element.dataset.constituentId);
      setOpenTooltip(constituentId === constituent.id);
    }
  };

  const onMouseLeave = () => setOpenTooltip(false);
  const offset: NumberTuple = constituent.type !== 'token' ? [0, -10] : [0, 5];

  return (
    <Tooltip
      label={constituent.label}
      isOpen={openTooltip}
      textTransform="capitalize"
      offset={offset}
    >
      <Text
        as="span"
        color={colorValue}
        onMouseOver={onMouseOver}
        onMouseLeave={onMouseLeave}
        data-constituent={constituent.abbreviation}
        data-constituent-id={constituent.id}
        className={`constituent ${constituent.type}`}
      >
        {children}
      </Text>
    </Tooltip>
  );
}
