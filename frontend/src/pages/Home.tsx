import { Box, Heading, Image, Stack } from '@chakra-ui/react';
import React from 'react';
import NavBar from '../components/NavBar';

function Home() {
  return (
    <Stack spacing={0}>
      <NavBar />
      <Box
        w="100%"
        h="100vh"
        bgImg="hero_background.png"
        bgRepeat="no-repeat"
        bgPosition="left bottom"
        bgSize="cover"
        display="flex"
        flexDirection={{ base: 'column', lg: 'row' }}
        alignItems="center"
        justifyContent={{ base: 'center', lg: 'space-between' }}
        px={{ base: '3rem', lg: '16rem' }}
      >
        <Heading
          color="main"
          whiteSpace="pre-wrap"
          fontSize={{ base: '3.125rem', lg: '9.313rem' }}
          textAlign={{ base: 'center', lg: 'left' }}
        >
          {'All of you.\nIn one place.'}
        </Heading>
        <Image
          maxH="33rem"
          src="hero_preview.png"
          alt="Meishi profile preview"
        />
      </Box>
      <Box
        w="100%"
        h="100vh"
        bgImg="section_background.png"
        bgRepeat="no-repeat"
        bgPosition="right top"
        bgSize="cover"
        display="flex"
        flexDirection={{ base: 'column', lg: 'row' }}
        alignItems="center"
        justifyContent={{ base: 'center', lg: 'space-between' }}
        px={{ base: '3rem', lg: '16rem' }}
      >
        <Heading
          color="white"
          fontSize={{ base: '3.125rem', lg: '6.875rem' }}
          textAlign={{ base: 'center', lg: 'left' }}
          maxW="30rem"
        >
          engage with your audience
        </Heading>
        <Image
          maxH="33rem"
          src="hero_preview.png"
          alt="Meishi profile preview"
        />
      </Box>
    </Stack>
  );
}

export default Home;
