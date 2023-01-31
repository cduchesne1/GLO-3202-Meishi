import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react';
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { NavLink } from 'react-router-dom';

export default function SignUp() {
  return (
    <Stack spacing={0}>
      <Box
        bg="transparent"
        color="black"
        w="100%"
        position="fixed"
        top="0"
        zIndex="100"
        transition="all 0.3s ease-in-out"
      >
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
        h="100vh"
        bgImg="hero_background.png"
        bgRepeat="no-repeat"
        bgPosition="left bottom"
        bgSize="cover"
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
              Sign Up
            </Heading>
          </CardHeader>

          <CardBody>
            <Stack spacing="1.5rem">
              <FormControl isRequired>
                <FormLabel>Username</FormLabel>
                <InputGroup>
                  <InputLeftAddon children="meishi.social/" />
                  <Input placeholder="username" />
                </InputGroup>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Email address</FormLabel>
                <Input type="email" placeholder="Email" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input type="password" placeholder="Password" />
              </FormControl>
              <Button color="white" bgColor="main">
                Sign Up
              </Button>
              <Text>
                {'Already have an account? '}
                <Link as={NavLink} to="/login" color="main">
                  Login
                </Link>
              </Text>
            </Stack>
          </CardBody>
        </Card>
      </Box>
    </Stack>
  );
}
