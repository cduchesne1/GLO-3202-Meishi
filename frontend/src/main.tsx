import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './Home';
import theme from './theme/theme';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);
