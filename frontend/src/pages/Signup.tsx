import {
  Alert,
  AlertDescription,
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
import { NavLink, useNavigate } from 'react-router-dom';
import httpClient from '../api/http-client';
import { useAuth } from '../context/auth-context';

export default function SignUp() {
  const { updateUser } = useAuth();
  const [previousUsername, setPreviousUsername] = useState('');
  const [signUpFailed, setSignUpFailed] = useState(false);
  const navigate = useNavigate();

  const validateUsername = async (value: string) => {
    let error;
    if (!value) {
      error = 'Username is required';
    } else if (value.length < 3) {
      error = 'Username must be at least 3 characters';
    } else if (value.length > 30) {
      error = 'Username must be at most 30 characters';
    } else if (value !== previousUsername) {
      const response = await httpClient.post('/users/check-username', {
        username: value,
      });
      const { data } = response;
      if (!data.available) {
        error = data.message;
      }
    }

    if (value !== previousUsername) {
      setPreviousUsername(value);
    }

    return error;
  };

  const validateEmail = (value: string) => {
    let error;
    if (!value) {
      error = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      error = 'Invalid email address';
    }
    return error;
  };

  const validatePassword = (value: string) => {
    let error;
    if (!value) {
      error = 'Password is required';
    } else if (value.length < 8) {
      error = 'Password must be at least 8 characters';
    }
    return error;
  };

  return (
    <Box h="100vh">
      <Stack spacing={0}>
        <Box bg="transparent" color="black" w="100%">
          <Flex
            py="4rem"
            px={{ base: '2rem', lg: '16rem' }}
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
          px={{ base: '2rem', lg: '16rem' }}
        >
          <Card padding="2rem">
            <CardHeader>
              <Heading
                color="main"
                fontSize={{ base: '3.125rem', lg: '6.875rem' }}
              >
                Sign Up
              </Heading>
            </CardHeader>

            <CardBody>
              <Formik
                initialValues={{
                  username: '',
                  email: '',
                  password: '',
                }}
                onSubmit={async (values) => {
                  setSignUpFailed(false);
                  try {
                    const response = await httpClient.post(
                      '/auth/signup',
                      values
                    );
                    if (response.status === 201) {
                      updateUser(response.data);
                      navigate('/profile', { replace: true });
                    }
                  } catch (err) {
                    setSignUpFailed(true);
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
                      <Field name="email" validate={validateEmail}>
                        {({ field, form }: any) => (
                          <FormControl
                            isRequired
                            isInvalid={form.errors.email && form.touched.email}
                          >
                            <FormLabel>Email address</FormLabel>
                            <Input
                              {...field}
                              type="email"
                              placeholder="Email"
                            />
                            <FormErrorMessage>
                              {form.errors.email}
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
                      <ScaleFade initialScale={0.9} in={signUpFailed}>
                        <Alert status="error">
                          <AlertIcon />
                          <AlertTitle>Something went wrong.</AlertTitle>
                          <AlertDescription>
                            Please try again later.
                          </AlertDescription>
                        </Alert>
                      </ScaleFade>
                      <Button
                        isLoading={props.isSubmitting}
                        type="submit"
                        color="white"
                        bgColor="main"
                      >
                        Sign Up
                      </Button>
                      <Text>
                        {'Already have an account? '}
                        <Link as={NavLink} to="/login" color="main">
                          Login
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
