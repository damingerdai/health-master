import { Input, InputProps } from '@chakra-ui/react';
import { useField } from 'formik';
import * as React from 'react';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { useDisclosure } from '@reactuses/core';
import { Button } from '@/components/ui/button';
import { Picker } from './picker';
import { Field } from '@chakra-ui/field';
import { InputGroup } from '@chakra-ui/input-group';
import { CalendarIcon } from '@/components/icons';

const generateNumberArray = (begin: number, end: number) => {
  const array = [] as string[];
  for (let i = begin; i <= end; i++) {
    array.push((i < 10 ? '0' : '') + i);
  }

  return array;
};

interface IDatePickerInputProps extends InputProps {
  label: string;
  name: string;
  valueChange?: (val: string[]) => void;
}

export const DatePickerInput: React.FC<IDatePickerInputProps> = props => {
  const { name, label, valueChange, ...rest } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [field, meta, helpers] = useField(name);
  const currentDate = useMemo(() => new Date(), []);
  const [years] = useState<string[]>(
    generateNumberArray(1975, currentDate.getFullYear())
  );
  const [months] = useState<string[]>(generateNumberArray(1, 12));
  const [days, setDays] = useState<string[]>(generateNumberArray(1, 31));
  const [value, setValue] = useState<string[]>([
    currentDate.getFullYear().toString(),
    (currentDate.getMonth() + 1).toString(),
    currentDate.getDate().toString(),
  ]);

  const options = useMemo(() => [years, months, days], [years, months, days]);

  const displayValue = useMemo(
    () => `${value[0]}-${value[1]}-${value[2]}`,
    [value]
  );

  const onToggle = useCallback(() => {
    if (isOpen) {
      onClose();
    } else {
      onOpen();
    }
  }, [isOpen, onOpen, onClose]);

  useEffect(() => {
    const newYear = value[0];
    const newMonth = value[1];
    if (newMonth === '02') {
      const yearValue = parseInt(newYear, 10);
      if (
        (yearValue % 4 === 0 && yearValue % 100 !== 0) ||
        yearValue % 400 === 0
      ) {
        setDays(generateNumberArray(1, 29));
      } else {
        setDays(generateNumberArray(1, 28));
      }
    } else if (['01', '03', '05', '07', '08', '10', '12'].includes(newMonth)) {
      setDays(generateNumberArray(1, 31));
    } else {
      setDays(generateNumberArray(1, 30));
    }
    if (valueChange) {
      valueChange(value);
    }
    helpers.setValue(value);
  }, [value]);

  return (
    <>
      <Field
        invalid={!!meta.error && meta.touched}
        label={label}
        errorText={meta.error}
      >
        <InputGroup
          flex="1"
          endElement={
            <Button h="1.75rem" size="sm" onClick={onToggle}>
              <CalendarIcon />
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
