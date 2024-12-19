import { request } from '@/lib/request';
import { Form, Formik } from 'formik';
import * as React from 'react';
import * as Yup from 'yup';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/store/user';
import { DatePickerInput } from './date-picker-input';
import { TimePickerInput } from './time-picker-input';
import { UserBloodPressureNumberInput } from './user-blood-pressure-number-input';
import { Button } from '@chakra-ui/button';
import { toaster } from '@chakra-ui/toaster';
import {
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogBody,
} from '@chakra-ui/dialog';

interface OpenChangeDetails {
  open: boolean;
}

interface AddUserBloodPressureValue {
  userId?: string;
  diastolicBloodPressure: number;
  systolicBloodPressure: number;
  pulse: number;
  logDate: Date;
  logTime: Date;
}

interface AddUserBloodPressureDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddUserBloodPressureDialog: React.FC<
  AddUserBloodPressureDialogProps
> = props => {
  const { isOpen, onClose } = props;
  const user = useAtomValue(userAtom);
  const { id } = user;

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
    logDate: Yup.array().of(Yup.string()).min(3).required('请输入记录日期'),
    logTime: Yup.array().of(Yup.string()).min(2).required('请输入记录时间'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const logDate = (values.logDate as [string, string, string]).map(v =>
        parseInt(v, 10)
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
        ...values,
        logDateTime,
        userId: id,
      };
      delete data.logDate;
      delete data.logTime;
      await request({
        method: 'post',
        url: 'api/user-blood-pressure',
        data,
      });

      onClose();
      setSubmitting(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toaster.create({
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
    <DialogRoot
      open={isOpen}
      onOpenChange={(details: OpenChangeDetails) => {
        if (details.open) {
          onClose();
        }
      }}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchemas}
        onSubmit={handleSubmit}
      >
        {({ isValid, isSubmitting }) => (
          <Form>
            <DialogContent>
              <DialogCloseTrigger />
              <DialogHeader>
                <DialogTitle>添加血压记录</DialogTitle>
              </DialogHeader>
              <DialogBody>
                <UserBloodPressureNumberInput
                  label="舒张压（mmHg）"
                  name="diastolicBloodPressure"
                  min={0}
                />
                <UserBloodPressureNumberInput
                  label="收缩压（mmHg）"
                  name="systolicBloodPressure"
                  min={0}
                />
                <UserBloodPressureNumberInput
                  label="脉搏"
                  name="pulse"
                  min={0}
                />
                <DatePickerInput label="记录日期" name="logDate" />
                <TimePickerInput label="记录时间" name="logTime" />
              </DialogBody>
              <DialogFooter justifyContent="center">
                <Button
                  w="85px"
                  type="submit"
                  colorScheme="teal"
                  mr="1rem"
                  disabled={!isValid}
                  loading={isSubmitting}
                >
                  提交
                </Button>
                <Button variant="outline" colorScheme="teal" onClick={onClose}>
                  取消
                </Button>
              </DialogFooter>
            </DialogContent>
          </Form>
        )}
      </Formik>
    </DialogRoot>
  );
};
