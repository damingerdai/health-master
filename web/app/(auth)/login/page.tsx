'use client';

import { userAtom } from '@/store/user';
import { login } from '@/lib/request';
import { Box, Flex, Heading, Input, Stack, Link } from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import { useState } from 'react';
import { useSetAtom } from 'jotai';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { InputGroup } from '@/components/ui/input-group';

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
    { setSubmitting }
  ) => {
    const { username, password } = value;
    try {
      const { token, data: user } = await login(username, password);
      localStorage.setItem('user_token', JSON.stringify(token, null, 2));
      setUserAtom(user);
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
    }

    setSubmitting(false);
  };

  return (
    <Flex flexDirection="column" w="100%" justify="center" p={4}>
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
                  isValid,
                  touched,
                  handleChange,
                  isSubmitting,
                }) => (
                  <Form>
                    <Stack>
                      <Field
                        label="用户名"
                        invalid={!!errors.username && touched.username}
                        errorText={errors.username}
                        helperText="请输入用户名"
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
                        label="密码"
                        invalid={!!errors.password && touched.password}
                        errorText={errors.password}
                        helperText="请输入密码"
                      >
                        <InputGroup
                          flex="1"
                          endElement={
                            <Button
                              variant="ghost"
                              onClick={() => setShowPassword(p => !p)}
                            >
                              {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                            </Button>
                          }
                        >
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            placeholder="密码"
                            onChange={handleChange}
                          />
                        </InputGroup>
                      </Field>
                      <Stack pt={2}>
                        <Button
                          type="submit"
                          colorPalette="teal"
                          colorScheme="teal"
                          loadingText="登录中"
                          loading={isSubmitting}
                          disabled={!isValid}
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
