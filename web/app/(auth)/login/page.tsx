'use client';

import { userAtom } from '@/store/user';
import { login } from '@/lib/request';
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
  InputGroup,
  InputRightElement,
  Link,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import { useState } from 'react';
import { useSetAtom } from 'jotai';

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const setUserAtom = useSetAtom(userAtom);
  const initialValues = {
    username: '',
    password: '',
  };

  const validationSchemas = Yup.object({
    username: Yup.string().required('请输入你的用户名'),
    password: Yup.string().required('请输入你的密码'),
  });

  const handleSubmit = async (
    value: Record<'username' | 'password', string>,
    { setSubmitting },
  ) => {
    const { username, password } = value;
    try {
      const { token, data: user } = await login(username, password);
      localStorage.setItem('user_token', JSON.stringify(token, null, 2));
      setUserAtom(user);
      router.push('/');
    } catch (err) {
      console.error(err);
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
              <Heading fontSize="4xl">登录</Heading>
            </Flex>
            <Box p={4}>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchemas}
                onSubmit={handleSubmit}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  isSubmitting,
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
                          <FormErrorMessage>
                            {errors.username}
                          </FormErrorMessage>
                        ) : (
                          <FormHelperText>请输入你的用户名</FormHelperText>
                        )}
                      </FormControl>
                      <FormControl
                        isInvalid={!!errors.password && touched.password}
                      >
                        <FormLabel htmlFor="password">密码</FormLabel>
                        <InputGroup>
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            placeholder="密码"
                            onChange={handleChange}
                          />
                          <InputRightElement h="full">
                            <Button
                              variant="ghost"
                              onClick={() => setShowPassword((p) => !p)}
                            >
                              {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                            </Button>
                          </InputRightElement>
                        </InputGroup>
                        {!!errors.password && touched.password ? (
                          <FormErrorMessage>
                            {errors.password}
                          </FormErrorMessage>
                        ) : (
                          <FormHelperText>请输入你的密码</FormHelperText>
                        )}
                      </FormControl>
                      <Stack spacing={10} pt={2}>
                        <Button
                          type="submit"
                          colorScheme="teal"
                          loadingText="登录中"
                          isLoading={isSubmitting}
                          disabled={isSubmitting}
                        >
                          登录
                        </Button>
                      </Stack>
                      <Box>
                        没有账号？
                        <Link href="./register">点击创建</Link>
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
