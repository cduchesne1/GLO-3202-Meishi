import { Box, Button, Flex, Heading } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);

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
          <Heading fontSize="1.75rem">meishi</Heading>
        </Flex>
        <Flex flex={1} justify="flex-end" gap="1rem">
          <Button color="main">Login</Button>
          <Button color="white" bgColor="main">
            Sign Up
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}
