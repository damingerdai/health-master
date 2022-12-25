import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
  useDisclosure,
} from '@chakra-ui/react';
import { useField } from 'formik';
import { range } from 'lodash';
import * as React from 'react';
import { useEffect, useState, useMemo } from 'react';
import { BsClock } from 'react-icons/bs';
import { Picker } from './picker';

interface TimePickerInputProps extends InputProps {
  display: string;
  name: string;
}

export const TimePickerInput: React.FC<TimePickerInputProps> = (props) => {
  const { display, name, ...rest } = props;
  const [field, meta, helpers] = useField(name);
  const {
    isOpen, onOpen, onClose, onToggle,
  } = useDisclosure();
  const currentDate = new Date();
  const [value, setValue] = useState<string[]>([
    currentDate.getHours().toString(10).padStart(2, '0'),
    currentDate.getMinutes().toString(10).padStart(2, '0'),
  ]);
  const options = [
    range(24).map((i) => (i < 10 ? `0${i}` : i.toString(10))),
    range(60).map((i) => (i < 10 ? `0${i}` : i.toString(10))),
  ];
  const displayValue = useMemo(() => `${value[0]}:${value[1]}`, [value]);

  useEffect(() => {
    helpers.setValue([...value]);
  }, [value]);

  return (
    <>
      <FormControl isInvalid={!!meta.error && meta.touched} mt={1}>
        <FormLabel>{display}</FormLabel>
        <InputGroup size="md">
          <Input readOnly name={field.name} value={displayValue} {...rest} />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={onToggle}>
              <BsClock />
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Picker
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        options={options}
        value={value}
        onValueChange={(val) => {
          setValue([...val]);
          helpers.setTouched(true);
        }}
      />
    </>
  );
};
