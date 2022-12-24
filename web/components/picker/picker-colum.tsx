/* eslint-disable react/no-unused-prop-types,react/destructuring-assignment,react/no-array-index-key */
import { Box, useColorModeValue } from '@chakra-ui/react';
import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';

interface PickerColumProps {
  options?: Array<string>;
  value?: string;
  wheel?: 'off' | 'natural' | 'normal';
  onChange?: (value: string) => void;
  onClick?: (value: string) => void;
}

export const PickerColum: React.FC<PickerColumProps> = (props) => {
  const {
    options, wheel, onChange, onClick,
  } = {
    options: [],
    wheel: 'off',
    ...props,
  } as Required<PickerColumProps>;
  const [value, setValue] = useState<string>('');
  const [minTranslate, setMinTranslate] = useState<number>(0);
  const [maxTranslate, setMaxTranslate] = useState<number>(0);
  const [scrollerTranslate, setScrollerTranslate] = useState<number>(0);
  const [startScrollerTranslate, setStartScrollerTranslate] = useState<number>(0);
  const [startTouchY, setStartTouchY] = useState<number>(0);
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const selectedColor = useColorModeValue('#333', '#ccc');

  const translateString = useMemo(
    () => `translate3d(0, ${scrollerTranslate}px, 0)`,
    [scrollerTranslate],
  );

  const safePreventDefault = (event) => {
    const passiveEvents = ['onTouchStart', 'onTouchMove', 'onWheel'];
    // eslint-disable-next-line
    if (!passiveEvents.includes(event._reactName)) {
      event.preventDefault();
    }
  };

  const onValueSelected = (val: string) => {
    if (onChange) {
      onChange(val);
    }
    setValue(val);
  };

  const onScrollerTranslateSettled = (scrollerTranslateValue: number) => {
    let activeIndex = 0;

    if (scrollerTranslateValue >= maxTranslate) {
      activeIndex = 0;
    } else if (scrollerTranslateValue <= minTranslate) {
      activeIndex = (options ? options.length : 0) - 1;
    } else {
      activeIndex = -Math.round((scrollerTranslateValue - maxTranslate) / 36);
    }
    const newSelectedValue = options[activeIndex];
    if (newSelectedValue) {
      onValueSelected(newSelectedValue);
    }
  };

  const handleWheel = (e) => {
    let delta = e.deltaY * 0.1;
    if (Math.abs(delta) < 36) {
      delta = 36 * Math.sign(delta);
    }

    switch (wheel) {
      case 'natural':
        // ignore and continue
        break;
      case 'normal':
        delta *= -1;
        break;
      default:
        return;
    }

    onScrollerTranslateSettled(scrollerTranslate + delta);
  };

  const handleTouchMove = (e) => {
    safePreventDefault(e);
    const touchY = e.targetTouches[0].pageY;
    if (!isMoving) {
      setIsMoving(true);
      return;
    }
    let nextScrollerTranslate = startScrollerTranslate + touchY - startTouchY;
    if (nextScrollerTranslate < minTranslate) {
      nextScrollerTranslate = minTranslate - (minTranslate - nextScrollerTranslate) ** 0.8;
    } else if (nextScrollerTranslate > maxTranslate) {
      nextScrollerTranslate = maxTranslate + (nextScrollerTranslate - maxTranslate) ** 0.8;
    }
    setScrollerTranslate(nextScrollerTranslate);
  };

  const handleTouchStart = (e) => {
    safePreventDefault(e);
    const newStartTouchY = e.targetTouches[0].pageY;
    setStartTouchY(newStartTouchY);
    setStartScrollerTranslate(scrollerTranslate);
  };

  const handleTouchEnd = () => {
    if (!isMoving) {
      return;
    }

    setIsMoving(false);
    setStartTouchY(0);
    setStartScrollerTranslate(0);
    setTimeout(() => {
      onScrollerTranslateSettled(scrollerTranslate);
    }, 0);
  };

  const handleTouchCancel = () => {
    if (!isMoving) {
      return;
    }

    setIsMoving(false);
    setStartTouchY(0);
    setScrollerTranslate(startScrollerTranslate);
    setStartScrollerTranslate(0);
  };

  const handleItemClick = (option) => {
    if (option !== value) {
      onValueSelected(option);
    } else if (onClick && value) {
      onClick(value);
    }
  };

  useEffect(() => {
    let selectedIndex = value ? options.indexOf(value) : -1;
    if (selectedIndex < 0) {
      setValue(options[0]);
      selectedIndex = 0;
    }

    setScrollerTranslate(90 - selectedIndex * 36);
    setMinTranslate(126 - 36 * options.length);
    setMaxTranslate(90);
  }, [options, value]);

  useEffect(() => {
    if (props.value) {
      setValue(props.value);
    }
  }, [props.value]);

  return (
    <Box
      flex="1 1"
      pos="relative"
      maxH="100%"
      overflow="hidden"
      textAlign="center"
      onWheel={(e) => handleWheel(e)}
      onTouchMove={(e) => handleTouchMove(e)}
      onTouchStart={(e) => handleTouchStart(e)}
      onTouchEnd={(e) => handleTouchEnd(e)}
      onTouchCancel={(e) => handleTouchCancel(e)}
    >
      {options && (
        <Box
          transition="300ms"
          transitionTimingFunction="ease-out"
          transform={translateString}
        >
          {options.map((o, i) => (
            <Box
              key={i}
              h="36px"
              pos="relative"
              lineHeight="36px"
              justifyContent="center"
              fontSize="1.2em"
              p="0 6px"
              alignItems="center"
              whiteSpace="nowrap"
              color={o === value ? selectedColor : '#999'}
              overflow="hidden"
              textOverflow="ellipsis"
              onClick={() => handleItemClick(o)}
            >
              {o}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};
