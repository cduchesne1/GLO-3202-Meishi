import { extendTheme } from '@chakra-ui/react';

const fonts = {
  heading: "'Outfit', sans-serif",
  body: "'Inter', sans-serif",
};

const theme = extendTheme({
  colors: {
    white: '#fff',
    black: '#000964',
    main: '#502EFF',
    secondary: {
      default: '#BEBEBE',
    },
  },
  fonts,
});

export default theme;
