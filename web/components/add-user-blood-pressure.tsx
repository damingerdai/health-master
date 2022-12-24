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
import { UserBloodPressureNumberInput } from './user-blood-pressure-number-input';

interface AddUserBloodPressureValue {
  userId?: string;
  diastolicBloodPressure: number;
  systolicBloodPressure: number;
  pulse: number;
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
  } as unknown as AddUserBloodPressureValue;

  const validationSchemas = Yup.object().shape({
    diastolicBloodPressure: Yup.number().min(0).required('请输入你的舒张压'),
    systolicBloodPressure: Yup.number().min(0).required('请输入你的收缩压'),
    pulse: Yup.number().min(0).required('请输入你的脉搏'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await request({
        method: 'post',
        url: 'api/user_blood_pressure',
        data: {
          ...values,
          userId: id,
        },
      });
      await dispatch(fetchUserBloodPressureList());
    } catch (err) {
      setSubmitting(false);
    }
    onClose();
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
                {/* <DatePickerInput display="记录时间"
                  name="registerDate"/> */}
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
