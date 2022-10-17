import { useAppSelector } from "@/lib/redux-hooks";
import { request } from "@/lib/request";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import * as React from "react";
import { UserBloodPressureNumberInput } from "./user-blood-pressure-number-input";

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

  const { id } = useAppSelector(state => state.user);

  const initialValues = {
    diastolicBloodPressure: null,
    systolicBloodPressure: null,
    pulse: null
  } as unknown as AddUserBloodPressureValue;

  const handleSubmit = async(values, {setSubmitting}) => {
    try {
      await request({
        method: 'post',
        url: 'api/user_blood_pressure',
        data: {
          ...values,
          userId: id
        }
      });
    } catch (err) {

      setSubmitting(false);
    }
    onClose()
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
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
                <FormControl>
                  <FormLabel>舒张压（mmHg）</FormLabel>
                  <UserBloodPressureNumberInput name="diastolicBloodPressure" />
                </FormControl>
                <FormControl>
                  <FormLabel>收缩压（mmHg）</FormLabel>
                  <UserBloodPressureNumberInput name="systolicBloodPressure" />
                </FormControl>
                <FormControl>
                  <FormLabel>脉搏</FormLabel>
                  <UserBloodPressureNumberInput name="pulse" />
                </FormControl>
              </ModalBody>
              <ModalFooter justifyContent="center">
                <Button
                  w="85px"
                  type="submit"
                  colorScheme="orange"
                  mr="1rem"
                  disabled={!isValid}
                  isLoading={isSubmitting}
                >
                  提交
                </Button>
                <Button variant="outline" colorScheme="orange" onClick={onClose}>
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
