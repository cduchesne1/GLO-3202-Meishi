import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/auth-context';

interface ProfileBarProps {
  picture: string;
}

export default function ProfileBar({ picture }: ProfileBarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { logout } = useAuth();

  const scrollListener = useCallback(() => {
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;

    if (winScroll > 0) {
      if (!isScrolled) {
        setIsScrolled(true);
      }
    } else {
      setIsScrolled(false);
    }
  }, [isScrolled]);

  useEffect(() => {
    window.addEventListener('scroll', scrollListener);
    return () => window.removeEventListener('scroll', scrollListener);
  }, [scrollListener]);

  const copyLinkToClipboard = () => {
    const link = 'https://meishi.social/cduchesne';
    navigator.clipboard.writeText(link);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <Box
      bg={isScrolled ? 'white' : 'transparent'}
      color="black"
      boxShadow={
        isScrolled ? '0 0.25rem 1rem -1rem rgba(0, 0, 0, 0.75)' : 'none'
      }
      w="100%"
      position="fixed"
      top="0"
      zIndex="100"
      transition="all 0.3s ease-in-out"
    >
      <Flex
        py={isScrolled ? '1rem' : '4rem'}
        px={{ base: '3rem', lg: '16rem' }}
        align="center"
        justify="space-between"
      >
        <Flex>
          <Link as={NavLink} to="/" _hover={{ textDecoration: 'none' }}>
            <Heading fontSize="1.75rem">meishi</Heading>
          </Link>
        </Flex>
        <Flex flex={1} justify="flex-end" gap="1rem">
          <Menu>
            <MenuButton
              as={Button}
              leftIcon={<ExternalLinkIcon />}
              color="main"
            >
              Share
            </MenuButton>
            <MenuList p="1rem">
              <Text textAlign="center" fontWeight="bold">
                Share your meishi
              </Text>
              <Text mt="1rem" maxW="20rem" color="secondary.default">
                Get some visitors by sharing your Meishi on all your platforms.
              </Text>
              <InputGroup mt="2rem">
                <InputLeftElement
                  pointerEvents="none"
                  children={<Heading fontSize="1.25rem">m</Heading>}
                />
                <Input value="meishi.social/cduchesne" readOnly />
                <InputRightElement width="4.5rem">
                  <Button variant="ghost" onClick={copyLinkToClipboard}>
                    {isCopied ? 'Copied!' : 'Copy'}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton>
              <Avatar size="sm" bgColor="main" src={picture} />
            </MenuButton>
            <MenuList>
              <MenuItem onClick={logout}>
                <ExternalLinkIcon boxSize="1rem" mr="1rem" />
                <Text>Sign Out</Text>
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Box>
  );
}
