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
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import * as React from 'react';
import { DatePickerInput } from './date-picker-input';
import { TimePickerInput } from './time-picker-input';
import { request } from '@/lib/request';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/store/user';
import { toastInstance } from './toast';
import { formatDateToGinFormat } from '../lib/date';

interface AddWeightModalProps {
  isOpen: boolean;
  onClose: () => void;
  addWeightModalCallback?: () => void;
}

export const AddWeightModal: React.FC<AddWeightModalProps> = props => {
  const { isOpen, onClose, addWeightModalCallback } = props;
  const user = useAtomValue(userAtom);
  const { id } = user;

  const initialValues = {
    weight: undefined as unknown as number,
    logDate: [] as unknown as [string, string, string],
    logTime: [] as string[],
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
        onSubmit={async values => {
          try {
            const weight = values.weight;
            const logDate = (values.logDate as [string, string, string]).map(
              v => parseInt(v, 10)
            );
            const logTime = (values.logTime as [string, string]).map(v =>
              parseInt(v, 10)
            );
            const logDateTime = new Date(
              logDate[0],
              logDate[1] - 1,
              logDate[2],
              logTime[0],
              logTime[1]
            );
            const data = {
              weight:
                typeof weight === 'string' ? parseInt(weight, 10) : weight,
              logDateTime: formatDateToGinFormat(logDateTime),
              recordDate: logDateTime,
              userId: id,
            };
            await request({
              method: 'post',
              url: 'api/weight-record',
              data,
            });
            toastInstance({
              title: '添加体重成功',
              status: 'success',
              isClosable: true,
            });
            if (addWeightModalCallback) {
              addWeightModalCallback();
            }
            onClose();
          } catch (err) {
            toastInstance({
              id: 'SERVICE_ERROR',
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              title: (err as any).message,
              position: 'bottom',
              status: 'error',
              duration: 9000,
              isClosable: true,
            });
          }
        }}
      >
        {({ errors, touched, isValid, isSubmitting, values }) => (
          <Form>
            <ModalContent>
              <ModalHeader>
                <Heading size="md">添加体重</Heading> <ModalCloseButton />
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
