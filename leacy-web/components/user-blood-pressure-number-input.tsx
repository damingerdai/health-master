import { Field } from '@chakra-ui/field';
import {
  NumberInputRoot,
  NumberInputField,
  NumberInputProps,
} from '@chakra-ui/number-input';
import { useField } from 'formik';
import * as React from 'react';

interface UserBloodPressureNumberInputProps extends NumberInputProps {
  label: string;
  name: string;
}

export const UserBloodPressureNumberInput: React.FC<
  UserBloodPressureNumberInputProps
> = props => {
  const { name, label, ...rest } = props;

  const [field, meta, helpers] = useField(name);

  return (
    <Field
      label={label}
      invalid={!!meta.error && meta.touched}
      errorText={meta.error}
      mt={1}
    >
      <NumberInputRoot
        name={field.name}
        onChange={e => {
          helpers.setValue(typeof e === 'string' ? parseInt(e, 10) : e);
        }}
        {...rest}
      >
        <NumberInputField />
      </NumberInputRoot>
    </Field>
  );
};
