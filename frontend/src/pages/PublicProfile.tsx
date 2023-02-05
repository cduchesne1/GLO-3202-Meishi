import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Link,
  Menu,
  MenuButton,
  MenuList,
  Text,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import httpClient from '../common/http-client';

export default function PublicProfile() {
  const { username } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const [profile, setProfile] = useState<any | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await httpClient.get(`/users/${username}`);
        setProfile(data);
      } catch (error) {
        setProfile(null);
      } finally {
        setIsLoaded(true);
      }
    };
    fetchProfile();
  }, [username]);

  const copyLinkToClipboard = () => {
    const link = `${import.meta.env.VITE_APP_BASE_URL}/${username}`;
    navigator.clipboard.writeText(link);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  if (!isLoaded) return null;

  if (!profile) {
    return (
      <Flex
        h="100vh"
        w="100%"
        alignItems="center"
        justifyContent="center"
        direction="column"
      >
        <Heading fontSize="3rem" color="black">
          meishi
        </Heading>
        <Text fontSize="1.75rem">This page does not exist.</Text>
        <Text>
          {'If you want you can claim it as your username. '}
          <Link as={NavLink} to="/signup" textDecoration="underline">
            Create your meishi
          </Link>
        </Text>
      </Flex>
    );
  }

  return (
    <>
      <Box
        w="100%"
        h="100%"
        minH="100vh"
        bgImage={`url(${profile.picture})`}
        bgRepeat="no-repeat"
        bgPosition="center"
        bgSize="cover"
        filter="blur(200px)"
      />
      <Box
        w="100%"
        h="100%"
        minH="100vh"
        py="4rem"
        px={{ base: '3rem', lg: '16rem' }}
        zIndex="2"
        position="absolute"
        top="0"
        left="0"
      >
        <Flex
          w="100%"
          justifyContent="center"
          direction="column"
          alignItems="center"
          gap="2rem"
        >
          <Flex alignSelf="end">
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<ExternalLinkIcon />}
                color="main"
              >
                Share
              </MenuButton>
              <MenuList p="1rem">
                <Text textAlign="center" fontWeight="bold">
                  Share your meishi
                </Text>
                <Text mt="1rem" maxW="20rem" color="secondary.default">
                  Get some visitors by sharing your Meishi on all your
                  platforms.
                </Text>
                <InputGroup mt="2rem">
                  <InputLeftElement
                    pointerEvents="none"
                    children={<Heading fontSize="1.25rem">m</Heading>}
                  />
                  <Input
                    value={`${import.meta.env.VITE_APP_BASE_URL}/${username}`}
                    readOnly
                  />
                  <InputRightElement width="4.5rem">
                    <Button variant="ghost" onClick={copyLinkToClipboard}>
                      {isCopied ? 'Copied!' : 'Copy'}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </MenuList>
            </Menu>
          </Flex>
          <Avatar size="2xl" src={profile.picture} />
          <Heading textAlign="center">{profile.title}</Heading>
          <Text textAlign="center">{profile.bio}</Text>
          {profile.links.map((link: any) => (
            <Link key={`${link.title}-${link.url}`} href={link.url} isExternal>
              <Card minW={{ base: '18rem', md: '25rem' }} textAlign="center">
                <CardBody>
                  <Text fontWeight="bold">{link.title}</Text>
                </CardBody>
              </Card>
            </Link>
          ))}
          <Link
            justifySelf="flex-end"
            as={NavLink}
            to="/"
            _hover={{ textDecoration: 'none' }}
            my="4rem"
          >
            <Heading fontSize="1.75rem">meishi</Heading>
          </Link>
        </Flex>
      </Box>
    </>
  );
}
