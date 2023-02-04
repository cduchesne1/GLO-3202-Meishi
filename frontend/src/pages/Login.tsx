import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Link,
  ScaleFade,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { NavLink } from 'react-router-dom';
import httpClient from '../common/http-client';
import { useAuth } from '../context/auth-context';

export default function Login() {
  const { login } = useAuth();
  const [loginFailed, setLoginFailed] = useState(false);

  const validateUsername = async (value: string) => {
    let error;
    if (!value) {
      error = 'Username is required';
    }

    return error;
  };

  const validatePassword = (value: string) => {
    let error;
    if (!value) {
      error = 'Password is required';
    }

    return error;
  };

  return (
    <Box h="100vh">
      <Stack spacing={0}>
        <Box bg="transparent" color="black" w="100%">
          <Flex
            py="4rem"
            px={{ base: '3rem', lg: '16rem' }}
            align="center"
            justify="space-between"
          >
            <Flex>
              <Link as={NavLink} to="/" _hover={{ textDecoration: 'none' }}>
                <Heading fontSize="1.75rem">meishi</Heading>
              </Link>
            </Flex>
            <Flex flex={1} justify="flex-end" />
          </Flex>
        </Box>
        <Box
          w="100%"
          h="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          px={{ base: '3rem', lg: '16rem' }}
        >
          <Card padding="2rem">
            <CardHeader>
              <Heading
                color="main"
                fontSize={{ base: '3.125rem', lg: '6.875rem' }}
              >
                Login
              </Heading>
            </CardHeader>

            <CardBody>
              <Formik
                initialValues={{
                  username: '',
                  password: '',
                }}
                onSubmit={async (values) => {
                  setLoginFailed(false);
                  try {
                    const response = await httpClient.post('/auth/login', {
                      username: values.username,
                      password: values.password,
                    });
                    if (response.status === 200) {
                      login(response.data);
                    }
                  } catch (err) {
                    setLoginFailed(true);
                  }
                }}
              >
                {(props: any) => (
                  <Form>
                    <Stack spacing="1.5rem">
                      <Field name="username" validate={validateUsername}>
                        {({ field, form }: any) => (
                          <FormControl
                            isRequired
                            isInvalid={
                              form.errors.username && form.touched.username
                            }
                          >
                            <FormLabel>Username</FormLabel>
                            <InputGroup>
                              <InputLeftAddon children="meishi.social/" />
                              <Input {...field} placeholder="username" />
                            </InputGroup>
                            <FormErrorMessage>
                              {form.errors.username}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="password" validate={validatePassword}>
                        {({ field, form }: any) => (
                          <FormControl
                            isRequired
                            isInvalid={
                              form.errors.password && form.touched.password
                            }
                          >
                            <FormLabel>Password</FormLabel>
                            <Input
                              {...field}
                              type="password"
                              placeholder="Password"
                            />
                            <FormErrorMessage>
                              {form.errors.password}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <ScaleFade initialScale={0.9} in={loginFailed}>
                        <Alert status="error">
                          <AlertIcon />
                          <AlertTitle>Invalid username or password.</AlertTitle>
                        </Alert>
                      </ScaleFade>
                      <Button
                        isLoading={props.isSubmitting}
                        type="submit"
                        color="white"
                        bgColor="main"
                      >
                        Login
                      </Button>
                      <Text>
                        {"Don't have an account? "}
                        <Link as={NavLink} to="/signup" color="main">
                          Sign Up
                        </Link>
                      </Text>
                    </Stack>
                  </Form>
                )}
              </Formik>
            </CardBody>
          </Card>
        </Box>
      </Stack>
    </Box>
  );
}
