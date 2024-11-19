import { Input, InputProps } from '@chakra-ui/react';
import { useField } from 'formik';
import { range } from 'lodash';
import * as React from 'react';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { BsClock } from 'react-icons/bs';
import { useDisclosure } from '@reactuses/core';
import { Picker } from './picker';
import { Field } from '@chakra-ui/field';
import { Button } from '@/components/ui/button';
import { InputGroup } from '@chakra-ui/input-group';

interface TimePickerInputProps extends InputProps {
  label: string;
  name: string;
}

export const TimePickerInput: React.FC<TimePickerInputProps> = props => {
  const { name, label, ...rest } = props;
  const [field, meta, helpers] = useField(name);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const currentDate = useMemo(() => new Date(), []);
  const [value, setValue] = useState<string[]>([
    currentDate.getHours().toString(10).padStart(2, '0'),
    currentDate.getMinutes().toString(10).padStart(2, '0'),
  ]);
  const options = [
    range(24).map(i => (i < 10 ? `0${i}` : i.toString(10))),
    range(60).map(i => (i < 10 ? `0${i}` : i.toString(10))),
  ];
  const displayValue = useMemo(() => `${value[0]}:${value[1]}`, [value]);
  const onToggle = useCallback(() => {
    if (isOpen) {
      onClose();
    } else {
      onOpen();
    }
  }, [isOpen, onOpen, onClose]);

  useEffect(() => {
    helpers.setValue(value);
  }, [value]);

  return (
    <>
      <Field label={label} invalid={!!meta.error && meta.touched} mt={1}>
        <InputGroup
          endElement={
            <Button h="1.75rem" size="sm" onClick={onToggle}>
              <BsClock />
            </Button>
          }
        >
          <Input readOnly name={field.name} value={displayValue} {...rest} />
        </InputGroup>
      </Field>
      <Picker
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        options={options}
        value={value}
        onValueChange={val => {
          setValue([...val]);
          helpers.setTouched(true);
        }}
      />
    </>
  );
};
