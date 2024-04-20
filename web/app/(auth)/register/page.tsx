'use client';

import { PasswordInput } from '@/components/password-input';
import { toastInstance } from '@/components/toast';
import { request } from '@/lib/request';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Link,
  Radio,
  RadioGroup,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { useRouter } from 'next/navigation';
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
        '密码只能由数字和字母组成，并且要同时含有数字和字母，且长度要在8-16位之间',
      ),
    confirmPassword: Yup.string()
      .required('请输入你的密码')
      .matches(
        /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/,
        '密码只能由数字和字母组成，并且要同时含有数字和字母，且长度要在8-16位之间',
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
    } catch (error: any) {
      toastInstance({
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
    <Flex
      bg={useColorModeValue('#f0f2f5', '#20202380')}
      h="100%"
      justify="center"
      p={4}
    >
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
                validate={(values) => {
                  if (
                    values.password
                    && values.confirmPassword
                    && values.password !== values.confirmPassword
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
                    <Stack spacing={4}>
                      <FormControl
                        isInvalid={!!errors.username && touched.username}
                      >
                        <FormLabel htmlFor="username">用户名</FormLabel>
                        <Input
                          type="text"
                          id="username"
                          name="username"
                          placeholder="用户名"
                          onChange={handleChange}
                          value={values.username}
                        />
                        {!!errors.username && touched.username ? (
                          <FormErrorMessage>{errors.username}</FormErrorMessage>
                        ) : (
                          <FormHelperText>请输入你的用户名</FormHelperText>
                        )}
                      </FormControl>
                      <FormControl
                        isInvalid={!!errors.firstName && touched.firstName}
                      >
                        <FormLabel htmlFor="firstName">姓</FormLabel>
                        <Input
                          type="text"
                          id="firstName"
                          name="firstName"
                          placeholder="姓"
                          onChange={handleChange}
                          value={values.firstName}
                        />
                        {!!errors.firstName && touched.firstName ? (
                          <FormErrorMessage>
                            {errors.firstName}
                          </FormErrorMessage>
                        ) : (
                          <FormHelperText>请输入你的姓</FormHelperText>
                        )}
                      </FormControl>
                      <FormControl
                        isInvalid={!!errors.lastName && touched.lastName}
                      >
                        <FormLabel htmlFor="lastName">名</FormLabel>
                        <Input
                          type="text"
                          id="lastName"
                          name="lastName"
                          placeholder="名"
                          onChange={handleChange}
                          value={values.lastName}
                        />
                        {!!errors.lastName && touched.lastName ? (
                          <FormErrorMessage>{errors.lastName}</FormErrorMessage>
                        ) : (
                          <FormHelperText>请输入你的名</FormHelperText>
                        )}
                      </FormControl>
                      <FormControl
                        isInvalid={!!errors.gender && touched.gender}
                      >
                        <FormLabel htmlFor="gender">性别</FormLabel>
                        <RadioGroup
                          id="gender"
                          name="gender"
                          onChange={(v) => setFieldValue('gender', v)}
                          value={values.gender}
                        >
                          <Stack direction="row">
                            <Radio value="M">男</Radio>
                            <Radio value="F">女</Radio>
                          </Stack>
                        </RadioGroup>
                        {!!errors.gender && touched.gender ? (
                          <FormErrorMessage>{errors.gender}</FormErrorMessage>
                        ) : (
                          <FormHelperText>请选择你的性别</FormHelperText>
                        )}
                      </FormControl>
                      <FormControl
                        isInvalid={!!errors.password && touched.password}
                      >
                        <FormLabel htmlFor="password">密码</FormLabel>
                        <PasswordInput
                          id="password"
                          name="password"
                          onChange={handleChange}
                          placeholder="请输入密码"
                          value={values.password}
                        />
                        {!!errors.password && touched.password ? (
                          <FormErrorMessage>{errors.password}</FormErrorMessage>
                        ) : (
                          <FormHelperText>请输入密码</FormHelperText>
                        )}
                      </FormControl>
                      <FormControl
                        isInvalid={
                          !!errors.confirmPassword && touched.confirmPassword
                        }
                      >
                        <FormLabel htmlFor="confirmPassword">
                          确认密码
                        </FormLabel>
                        <PasswordInput
                          id="confirmPassword"
                          name="confirmPassword"
                          onChange={handleChange}
                          placeholder="请再次输入密码"
                          value={values.confirmPassword}
                        />
                        {!!errors.confirmPassword && touched.confirmPassword ? (
                          <FormErrorMessage>
                            {errors.confirmPassword}
                          </FormErrorMessage>
                        ) : (
                          <FormHelperText>请再次输入密码</FormHelperText>
                        )}
                      </FormControl>
                      <Stack spacing={10} pt={2}>
                        <Button
                          type="submit"
                          colorScheme="teal"
                          loadingText="注册中"
                          isLoading={isSubmitting}
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
