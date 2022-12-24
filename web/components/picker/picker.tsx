/* eslint-disable react/no-unused-prop-types,react/destructuring-assignment,react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-shadow,@typescript-eslint/no-use-before-define,@typescript-eslint/no-unused-vars */
import * as React from 'react';
import { useEffect, useState } from 'react';
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
} from '@chakra-ui/react';
import { times } from 'lodash';
import { PickerColum } from './picker-colum';

interface PickerProps {
  confirmText?: React.ReactNode;
  cancelText?: React.ReactNode;
  options: Array<string[]>;
  value: string | string[];
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  onValueChange?: (val: string | string[]) => void;
}

export const Picker: React.FC<PickerProps> = (props) => {
  const {
    confirmText, cancelText, isOpen, onClose, onOpen, options, onValueChange,
  } = props;

  const [values, setValues] = useState<string[]>([]);

  useEffect(() => {
    if (props.value) {
      setValues(Array.isArray(props.value) ? [...props.value] : [props.value]);
    }
  }, [props, props.value]);

  const highlightCss = {
    content: "' '",
    position: 'absolute',
    left: 0,
    right: 'auto',

    display: 'block',
    width: '100%',
    height: '1px',

    backgroundColor: '#d9d9d9',
    transform: 'scaleY(0.5)',
  };

  return (
    <Drawer placement="bottom" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader borderBottomWidth="1px">
          <Flex>
            <Button variant="ghost" onClick={onClose}>
              {cancelText ?? '取消'}
            </Button>
            <Spacer />
            <Button
              variant="ghost"
              onClick={() => {
                onClose();
                if (onValueChange) {
                  onValueChange(values);
                }
              }}
            >
              {confirmText ?? '确定'}
            </Button>
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
                'linear-gradient(to top, transparent, transparent 5%, white 20%, white 80%, transparent 95%, transparent)',
            }}
          >
            {
              times(options.length).map((i) => (
                <PickerColum
                  key={i}
                  options={options[i]}
                  value={values[i]}
                  onChange={(val) => {
                    const newValues = Array.isArray(values) ? [...values] : [values];
                    newValues[i] = val;
                    setValues(newValues);
                  }}
                />
              ))
            }
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
                bottom: 'auto',
                ...highlightCss,
              }}
              _after={{
                bottom: 0,
                top: 'auto',
                ...highlightCss,
              }}
            />
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
