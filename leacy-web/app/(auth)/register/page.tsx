'use client';

import { request } from '@/lib/request';
import {
  Box,
  Flex,
  HStack,
  Heading,
  Input,
  Link,
  Stack,
} from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { useRouter } from 'next/navigation';
import { PasswordInput } from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Radio, RadioGroup } from '@/components/ui/radio';
import { toaster } from '@/components/ui/toaster';
import * as Yup from 'yup';

export default function Register() {
  const router = useRouter();
  const initialValues = {
    username: '',
    firstName: '',
    lastName: '',
    gender: 'M',
    password: '',
    confirmPassword: '',
  };

  const validationSchemas = Yup.object({
    username: Yup.string()
      .required('请输入你的用户名')
      .matches(/^[A-Za-z0-9]+$/, '用户名只能由数字和26个英文字母组成'),
    firstName: Yup.string().required('请输入你的姓'),
    lastName: Yup.string().required('请输入你的名'),
    gender: Yup.string().matches(/(M|F)/),
    password: Yup.string()
      .required('请输入你的密码')
      .matches(
        /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/,
        '密码只能由数字和字母组成，并且要同时含有数字和字母，且长度要在8-16位之间'
      ),
    confirmPassword: Yup.string()
      .required('请输入你的密码')
      .matches(
        /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/,
        '密码只能由数字和字母组成，并且要同时含有数字和字母，且长度要在8-16位之间'
      ),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await request({
        method: 'post',
        url: '/api/user',
        data: {
          username: values.username,
          firstName: values.firstName,
          lastName: values.lastName,
          gender: values.gender,
          password: values.password,
        },
      });
      router.push('/login');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toaster.create({
        title: '注册报错',
        description: error?.response?.data || error?.message || '注册报错',
        position: 'bottom',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }

    setSubmitting(false);
  };

  return (
    <Flex h="100%" justify="center" p={4}>
      <Flex mx="auto" maxW="lg">
        <Box w="100%" p={4}>
          <Flex
            direction="column"
            bg="background"
            w="100%"
            rounded="lg"
            boxShadow="lg"
            p={4}
            maxW="380px"
          >
            <Flex justify="center">
              <Heading fontSize="4xl">注册</Heading>
            </Flex>
            <Box p={4}>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchemas}
                validate={values => {
                  if (
                    values.password &&
                    values.confirmPassword &&
                    values.password !== values.confirmPassword
                  ) {
                    return { confirmPassword: '两次密码不一致' };
                  }

                  return {};
                }}
                onSubmit={handleSubmit}
              >
                {({
                  values,
                  errors,
                  touched,
                  isSubmitting,
                  handleChange,
                  setFieldValue,
                }) => (
                  <Form>
                    <Stack width="300px">
                      <Field
                        label="用户名"
                        invalid={!!errors.username && touched.username}
                        errorText={errors.username}
                        heplerText="请输入你的用户名"
                      >
                        <Input
                          type="text"
                          id="username"
                          name="username"
                          placeholder="用户名"
                          onChange={handleChange}
                          value={values.username}
                        />
                      </Field>
                      <Field
                        label="姓"
                        invalid={!!errors.firstName && touched.firstName}
                        errorText={errors.firstName}
                        heplerText="请输入你的姓"
                      >
                        <Input
                          type="text"
                          id="firstName"
                          name="firstName"
                          placeholder="姓"
                          onChange={handleChange}
                          value={values.firstName}
                        />
                      </Field>
                      <Field
                        label="名"
                        invalid={!!errors.lastName && touched.lastName}
                        errorText={errors.lastName}
                        heplerText="请输入你的名"
                      >
                        <Input
                          type="text"
                          id="lastName"
                          name="lastName"
                          placeholder="名"
                          onChange={handleChange}
                          value={values.lastName}
                        />
                      </Field>
                      <Field
                        label="性别"
                        invalid={!!errors.gender && touched.gender}
                        errorText={errors.gender}
                        heplerText="请选择性别"
                      >
                        <RadioGroup
                          id="gender"
                          name="gender"
                          onValueChange={v => {
                            setFieldValue('gender', v.value);
                          }}
                          value={values.gender}
                        >
                          <HStack gap="6">
                            <Radio value="M">男</Radio>
                            <Radio value="F">女</Radio>
                          </HStack>
                        </RadioGroup>
                      </Field>
                      <Field
                        label="密码"
                        width="full"
                        invalid={!!errors.password && touched.password}
                        errorText={errors.password}
                        heplerText="请输入密码"
                      >
                        <PasswordInput
                          id="password"
                          name="password"
                          width="full"
                          onChange={handleChange}
                          placeholder="请输入密码"
                          value={values.password}
                        />
                      </Field>
                      <Field
                        label="确认密码"
                        invalid={
                          !!errors.confirmPassword && touched.confirmPassword
                        }
                        errorText={errors.confirmPassword}
                        heplerText="请再次输入密码"
                      >
                        <PasswordInput
                          id="confirmPassword"
                          name="confirmPassword"
                          width="full"
                          onChange={handleChange}
                          placeholder="请再次输入密码"
                          value={values.confirmPassword}
                        />
                      </Field>
                      <Stack gap={10} pt={2}>
                        <Button
                          type="submit"
                          colorPalette="teal"
                          loadingText="注册中"
                          loading={isSubmitting}
                          disabled={isSubmitting}
                        >
                          注册
                        </Button>
                      </Stack>
                      <Box mt={4}>
                        已有账号？
                        <Link href="./login">点击登录</Link>
                      </Box>
                    </Stack>
                  </Form>
                )}
              </Formik>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
}
