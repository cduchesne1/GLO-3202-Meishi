import { ChakraProvider } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { AuthProvider, useAuth } from './context/auth-context';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import PublicProfile from './pages/PublicProfile';
import SignUp from './pages/Signup';
import theme from './theme/theme';

function ProtectedRoute({ children }: any) {
  const { isLoaded, user, refresh, isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log('checking token');
    console.log('isLoaded2.1', isLoaded);
    if (isLoaded && user && user.tokenManager.expirationTime < Date.now()) {
      console.log('refreshing token');
      refresh();
    }
  }, [isLoaded, user, refresh]);

  if (!isLoaded) {
    console.log('retruning null');
    return null;
  }

  return isAuthenticated && isLoaded ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="/:username" element={<PublicProfile />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);
