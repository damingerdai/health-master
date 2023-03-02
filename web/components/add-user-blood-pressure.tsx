import { useAppDispatch, useAppSelector } from '@/lib/redux-hooks';
import { request } from '@/lib/request';
import { fetchUserBloodPressureList } from '@/slices/user-blood-pressure-slice';
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import * as React from 'react';
import * as Yup from 'yup';
import { DatePickerInput } from './date-picker-input';
import { TimePickerInput } from './time-picker-input';
import { toastInstance } from './toast';
import { UserBloodPressureNumberInput } from './user-blood-pressure-number-input';

interface AddUserBloodPressureValue {
  userId?: string;
  diastolicBloodPressure: number;
  systolicBloodPressure: number;
  pulse: number;
  logDate: Date;
  logTime: Date;
}

interface AddUserBloodPressureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddUserBloodPressureModal: React.FC<
AddUserBloodPressureModalProps
> = (props) => {
  const { isOpen, onClose } = props;
  const dispatch = useAppDispatch();
  const { id } = useAppSelector((state) => state.user);

  const initialValues = {
    diastolicBloodPressure: null,
    systolicBloodPressure: null,
    pulse: null,
    logDate: null,
    logTime: null,
  } as unknown as AddUserBloodPressureValue;

  const validationSchemas = Yup.object().shape({
    diastolicBloodPressure: Yup.number().min(0).required('请输入你的舒张压'),
    systolicBloodPressure: Yup.number().min(0).required('请输入你的收缩压'),
    pulse: Yup.number().min(0).required('请输入你的脉搏'),
    logDate: Yup.string().required('请输入记录日期'),
    logTime: Yup.string().required('请输入记录时间'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // eslint-disable-next-line max-len
      const logDateTime = `${values.logDate[0]}-${values.logDate[1].padStart(2, '0')}-${values.logDate[2]}T${values.logTime[0]}:${values.logTime[1]}:00Z`;
      const data = {
        ...values,
        logDateTime,
        userId: id,
      };
      delete data.logDate;
      delete data.logTime;
      await request({
        method: 'post',
        url: 'api/user_blood_pressure',
        data,
      });
      await dispatch(fetchUserBloodPressureList());
      onClose();
      setSubmitting(false);
    } catch (err: any) {
      toastInstance({
        id: 'SERVICE_ERROR',
        title: err.message,
        position: 'bottom',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchemas}
        onSubmit={handleSubmit}
      >
        {({ isValid, isSubmitting }) => (
          <Form>
            <ModalContent>
              <ModalHeader>
                <Flex justifyContent="center" alignContent="center">
                  添加血压记录
                </Flex>
                <ModalCloseButton />
              </ModalHeader>
              <ModalBody>
                <UserBloodPressureNumberInput
                  display="舒张压（mmHg）"
                  name="diastolicBloodPressure"
                  min={0}
                />
                <UserBloodPressureNumberInput
                  display="收缩压（mmHg）"
                  name="systolicBloodPressure"
                  min={0}
                />
                <UserBloodPressureNumberInput
                  display="脉搏"
                  name="pulse"
                  min={0}
                />
                <DatePickerInput display="记录日期" name="logDate" />
                <TimePickerInput display="记录时间" name="logTime" />
              </ModalBody>
              <ModalFooter justifyContent="center">
                <Button
                  w="85px"
                  type="submit"
                  colorScheme="teal"
                  mr="1rem"
                  disabled={!isValid}
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
