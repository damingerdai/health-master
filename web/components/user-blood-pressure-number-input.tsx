import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  NumberInputProps,
  useNumberInput,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useField } from "formik";
import * as React from "react";

interface UserBloodPressureNumberInputProps extends NumberInputProps {
  display: string;
  name: string;
}

export const UserBloodPressureNumberInput: React.FC<
  UserBloodPressureNumberInputProps
> = (props) => {
  const { name, display, ...rest } = props;

  const [field, meta, helpers] = useField(name);

  return (
    <FormControl isInvalid={!!meta.error && meta.touched} mt={1}>
      <FormLabel>{display}</FormLabel>
      <NumberInput
        name={field.name}
        onChange={(e) => {
          helpers.setValue(typeof e === "string" ? parseInt(e, 10) : e);
        }}
        {...rest}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      {meta.error && <FormErrorMessage>{meta.error}</FormErrorMessage>}
    </FormControl>
  );
};
