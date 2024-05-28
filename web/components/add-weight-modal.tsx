import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/react';
import { ErrorMessage, Field, Form, Formik, useFormik } from 'formik';
import * as Yup from 'yup';
import * as React from 'react';
import { DatePickerInput } from './date-picker-input';
import { TimePickerInput } from './time-picker-input';

interface AddWeightModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddWeightModal: React.FC<AddWeightModalProps> = props => {
  const { isOpen, onClose } = props;

  const initialValues = {
    weight: undefined as unknown as number,
    logDate: undefined as unknown as Date,
    logTime: undefined as unknown as Date,
  };

  const validateSchemas = Yup.object({
    weight: Yup.number()
      .max(500, '体重不能超过500公斤')
      .min(0, '请输入正确的体重')
      .required('请输入体重数据'),
    logDate: Yup.array().of(Yup.string()).min(3).required('请输入记录日期'),
    logTime: Yup.array().of(Yup.string()).min(2).required('请输入记录时间'),
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <Formik
        initialValues={initialValues}
        validateOnMount={true}
        validateOnBlur={true}
        validateOnChange={true}
        validationSchema={validateSchemas}
        onSubmit={values => {
          console.log(values);
        }}
      >
        {({ errors, touched, isValid, isSubmitting, values, handleChange }) => (
          <Form>
            <ModalContent>
              <ModalHeader>
                <Heading>添加体重</Heading> <ModalCloseButton />
              </ModalHeader>
              <ModalBody>
                <Field name="weight">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={!!(errors.weight && touched.weight)}
                      mt={1}
                    >
                      <FormLabel>体重</FormLabel>
                      <NumberInput
                        name="weight"
                        onChange={val => form.setFieldValue('weight', val)}
                        value={values.weight}
                      >
                        <NumberInputField {...field} />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <FormErrorMessage>
                        <ErrorMessage name="weight" />
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <DatePickerInput display="记录日期" name="logDate" />
                <TimePickerInput display="记录时间" name="logTime" />
              </ModalBody>
              <ModalFooter gap={1}>
                <Button
                  w="85px"
                  type="submit"
                  colorScheme="teal"
                  isDisabled={!isValid}
                  isLoading={isSubmitting}
                >
                  提交
                </Button>
                <Button variant="outline" colorScheme="teal" onClick={onClose}>
                  取消
                </Button>
              </ModalFooter>
            </ModalContent>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
