import * as React from "react";
import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Spacer,
  useDisclosure,
} from "@chakra-ui/react";

interface PickerColumProps {
  options?: Array<string>;
  value?: string;
  wheel?: "off" | "natural" | "normal";
  onChange?: (value: string) => void;
  onClick?: (value: string) => void;
}

const PickerColum: React.FC<PickerColumProps> = (props) => {
  let { options, wheel, onChange, onClick } = {
    options: [],
    wheel: "off",
    ...props,
  };
  const [value, setValue] = useState<string>(props.value ?? "");
  const [minTranslate, setMinTranslate] = useState<number>(0);
  const [maxTranslate, setMaxTranslate] = useState<number>(0);
  const [scrollerTranslate, setScrollerTranslate] = useState<number>(0);
  const [startScrollerTranslate, setStartScrollerTranslate] =
    useState<number>(0);
  const [startTouchY, setStartTouchY] = useState<number>(0);
  const [isMoving, setIsMoving] = useState<boolean>(false);

  const translateString = useMemo(
    () => `translate3d(0, ${scrollerTranslate}px, 0)`,
    [scrollerTranslate]
  );

  const safePreventDefault = (event) => {
    const passiveEvents = ["onTouchStart", "onTouchMove", "onWheel"];
    if (!passiveEvents.includes(event._reactName)) {
      event.preventDefault();
    }
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

  const onValueSelected = (value: string) => {
    if (onChange) {
      onChange(value);
    }
    setValue(value);
  };

  const handleWheel = (e) => {
    let delta = e.deltaY * 0.1;
    if (Math.abs(delta) < 36) {
      delta = 36 * Math.sign(delta);
    }

    switch (wheel) {
      case "natural":
        // ignore and continue
        break;
      case "normal":
        delta = delta * -1;
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
      nextScrollerTranslate =
        minTranslate - Math.pow(minTranslate - nextScrollerTranslate, 0.8);
    } else if (nextScrollerTranslate > maxTranslate) {
      nextScrollerTranslate =
        maxTranslate + Math.pow(nextScrollerTranslate - maxTranslate, 0.8);
    }
    setScrollerTranslate(nextScrollerTranslate);
  };

  const handleTouchStart = (e) => {
    safePreventDefault(e);
    const startTouchY = e.targetTouches[0].pageY;
    setStartTouchY(startTouchY);
    setStartScrollerTranslate(scrollerTranslate);
  };

  const handleTouchEnd = (e) => {
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

  const handleTouchCancel = (e) => {
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
    } else {
      if (onClick && value) {
        onClick(value);
      }
    }
  };

  useEffect(() => {
    let selectedIndex = value ? options.indexOf(value) : -1;
    if (selectedIndex < 0) {
      // throw new ReferenceError();
      onValueSelected(options[0]);
      selectedIndex = 0;
    }

    setScrollerTranslate(90 - selectedIndex * 36);
    setMinTranslate(126 - 36 * options.length);
    setMaxTranslate(90);
  }, [options, value]);

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
              color={o === value ? "#333" : "#999"}
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

interface PickerProps {
  btnName?: string;
}

export const Picker: React.FC<PickerProps> = (props) => {
  const { btnName } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen}>{btnName ?? "点击"}</Button>
      <Drawer placement="bottom" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            <Flex>
              <Button variant="ghost" onClick={onClose}>
                取消
              </Button>
              <Spacer />
              <Button variant="ghost">确定</Button>
            </Flex>
          </DrawerHeader>

          <DrawerBody>
            <Box
              display="flex"
              dir="colum"
              pos="relative"
              justifyContent="center"
              h="216px"
              cursor="grab"
              __css={{
                WebkitMaskBoxImage:
                  "linear-gradient(to top, transparent, transparent 5%, white 20%, white 80%, transparent 95%, transparent)",
              }}
            >
              <PickerColum options={["one", "two", "three", "four", "five"]} value="one" onChange={(v) => console.log('1', v)}/>
              <PickerColum options={["one", "two", "three", "four", "five"]} value="two" onChange={(v) => console.log('2', v)}/>
              <PickerColum options={["one", "two", "three", "four", "five"]} value="three" onChange={(v) => console.log('2', v)}/>
              <Box
                pos="absolute"
                top="50%"
                left="0"
                w="100%"
                pointerEvents="none"
                h="36px"
                mt="-18px"
                _before={{
                  top: 0,
                  bottom: "auto",

                  content: "' '",
                  position: "absolute",
                  left: 0,
                  right: "auto",

                  display: "block",
                  width: "100%",
                  height: "1px",

                  backgroundColor: "#d9d9d9",
                  transform: "scaleY(0.5)",
                }}
                _after={{
                  bottom: 0,
                  top: "auto",

                  content: "' '",
                  position: "absolute",
                  left: 0,
                  right: "auto",

                  display: "block",
                  width: "100%",
                  height: "1px",

                  backgroundColor: "#d9d9d9",
                  transform: "scaleY(0.5)",
                }}
              />
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
