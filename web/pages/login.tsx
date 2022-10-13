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
  Stack,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Form, Formik, FormikValues } from "formik";
import * as React from "react";
import { useState } from "react";
import type { NextPage } from "next";
import * as Yup from 'yup';
import { login } from "../lib/request";
import { useRouter } from "next/router";

const Login: NextPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const initialValues = {
    username: "",
    password: "",
  };
  const handleSubmit = async(value: Record<'username' | 'password', string>, {setSubmitting}) => {
    const { username, password } = value;
    try {
      await login(username, password ); 
      router.push('/');
    } catch(err) {
      console.error(err);
    }
  
    setSubmitting(false);
  };
  const validationSchemas = Yup.object({
    username: Yup.string().required('请输入你的用户名'),
    password: Yup.string().required('请输入你的密码')
  })

  return (
    <Flex minH="100vh" align="center" justify="center">
      <Stack spacing={8} mx="auto" maxW="lg" py={8} px={6}>
        <Stack align="center">
          <Heading fontSize="4xl">登录</Heading>
        </Stack>
        <Box rounded={"lg"} boxShadow="lg" p={8}>
          <Formik initialValues={initialValues} validationSchema={validationSchemas} onSubmit={handleSubmit}>
            {({ values, errors, touched, handleSubmit, handleChange, isSubmitting }) => {
              return (
                <form onSubmit={handleSubmit}>
                  <Stack spacing={4}>
                    <FormControl isInvalid={!!errors.username && touched.username}>
                      <FormLabel htmlFor="username">用户名</FormLabel>
                      <Input type="text" id="username" name="username" placeholder="用户名" onChange={handleChange} value={values.username}/>
                      {
                        !!errors.username && touched.username
                        ? <FormErrorMessage>{errors.username}</FormErrorMessage>
                        : <FormHelperText>请输入你的用户名</FormHelperText>
                      }
                    </FormControl>
                    <FormControl isInvalid={!!errors.password && touched.password}>
                      <FormLabel htmlFor="password">密码</FormLabel>
                      <InputGroup>
                        <Input type={showPassword ? "text" : "password"} id="password" name="password" placeholder="密码" onChange={handleChange}/>
                        <InputRightElement h="full">
                          <Button
                            variant="ghost"
                            onClick={() => setShowPassword((p) => !p)}
                          >
                            {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                      {
                        !!errors.password && touched.password
                        ? <FormErrorMessage>{errors.password}</FormErrorMessage>
                        : <FormHelperText>请输入你的密码</FormHelperText>
                      }
                    </FormControl>
                    <Stack spacing={10} pt={2}>
                      <Button type="submit" loadingText="登录中" isLoading={isSubmitting} disabled={isSubmitting}>
                        登录
                      </Button>
                    </Stack>
                  </Stack>
                </form>
              );
            }}
          </Formik>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Login;
