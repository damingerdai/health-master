import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Spacer,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Form, Formik } from 'formik';
import * as React from 'react';
import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import * as Yup from 'yup';
import { useSetAtom } from 'jotai';
import { login } from '@/lib/request';
import { useRouter } from 'next/router';
import { ToggleThemeButton } from '@/components/toggle-theme-button';
import { userAtom } from '@/store/user';
import { Header } from '@/components/header';

const Login: NextPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const setUserAtom = useSetAtom(userAtom);

  const initialValues = {
    username: '',
    password: '',
  };
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
  const validationSchemas = Yup.object({
    username: Yup.string().required('请输入你的用户名'),
    password: Yup.string().required('请输入你的密码'),
  });

  useEffect(() => {
    localStorage.removeItem('user_token');
  }, []);

  return (
    <>
      <Header bgColor="Background">
        <Spacer />
        <HStack spacing={{ base: '1', md: '2' }}>
          <ToggleThemeButton />
        </HStack>
      </Header>
      <Flex
        bg={useColorModeValue('#f0f2f5', '#20202380')}
        height="calc(100vh - 64px)"
        justify="center"
        p={4}
      >
        <Flex
          mx="auto"
          maxW="lg"
        >
          <Box w="100%" p={4} mt={{ md: '150px' }}>
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
          {/* <Flex  bg="background" w='100%'  rounded="lg" boxShadow="lg" p={4}>
              <Box>
                <Heading fontSize="4xl">登录</Heading>
              </Box>
          </Flex> */}
          {/* <Stack  bg="background" spacing={8} w='100%'  rounded="lg" boxShadow="lg">
            <Stack align="center">
              <Heading fontSize="4xl">登录</Heading>
            </Stack>

          </Stack> */}
        </Flex>
      </Flex>
      {/* <Box>

        <Flex minH="100wh" align="center" justify="center">
          <Stack spacing={8} mx="auto" maxW="lg" py={12} px={6} pt={4}>
            <Stack align="center">
              <Heading fontSize="4xl">登录</Heading>
            </Stack>
            <Box rounded="lg" boxShadow="lg" p={8} pt={4}>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchemas}
                onSubmit={handleSubmit}
              >
                {({ values, errors, touched, handleChange, isSubmitting }) => (
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
                              onClick={() => setShowPassword(p => !p)}
                            >
                              {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                            </Button>
                          </InputRightElement>
                        </InputGroup>
                        {!!errors.password && touched.password ? (
                          <FormErrorMessage>{errors.password}</FormErrorMessage>
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
          </Stack>
        </Flex>
      </Box> */}
    </>
  );
};

export default Login;
