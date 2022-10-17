import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  NumberInputProps,
  useNumberInput,
} from "@chakra-ui/react";
import { useField } from "formik";
import * as React from "react";

interface UserBloodPressureNumberInputProps extends NumberInputProps {
  name: string;
}

export const UserBloodPressureNumberInput: React.FC<
  UserBloodPressureNumberInputProps
> = (props) => {
  const { name, ...rest } = props;

  const [field, meta, helpers] = useField(name);

  return (
    <NumberInput name={field.name} onChange={(e) => {
       helpers.setValue(typeof e === 'string' ? parseInt(e, 10) : e);
    }} { ...rest}>
      <NumberInputField />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  );
};
