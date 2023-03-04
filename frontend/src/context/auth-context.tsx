import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import httpClient from '../api/http-client';

interface IAuthContext {
  isLoaded: boolean;
  user?: any;
  isAuthenticated: boolean;
  updateUser: (updatedUser: any) => void;
  login: (username: string, password: string) => Promise<boolean>;
  signUp: (
    username: string,
    email: string,
    password: string
  ) => Promise<boolean>;
  checkToken: () => void;
  logout: () => void;
}

const AuthContext = createContext({
  isLoaded: false,
  user: undefined,
  isAuthenticated: false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateUser: (updatedUser: any) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  login: (username: string, password: string) => Promise.resolve(false),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  signUp: (username: string, email: string, password: string) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    Promise.resolve(false),
  checkToken: () => {},
  logout: () => {},
} as IAuthContext);

export default function AuthProvider({ children }: any) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<any | undefined>(undefined);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await httpClient.get('/users/profile');
        setUser(data);
        setIsAuthenticated(true);
      } catch (e) {
        setUser(undefined);
        setIsAuthenticated(false);
      } finally {
        setIsLoaded(true);
      }
    };
    fetchUser();
  }, []);

  const login = useCallback(
    async (username: string, password: string) => {
      try {
        setIsLoaded(false);

        const captchaToken = await window.grecaptcha.execute(
          import.meta.env.VITE_CAPTCHA_SITE_KEY,
          { action: 'submit' }
        );
        await httpClient.post('/auth/captcha', { token: captchaToken });

        const { data } = await httpClient.post('/auth/login', {
          username,
          password,
        });
        setUser(data);
        setIsAuthenticated(true);
        navigate('/profile', { replace: true });
        return true;
      } catch (e) {
        console.log(e);
        setUser(undefined);
        setIsAuthenticated(false);
        return false;
      } finally {
        setIsLoaded(true);
      }
    },
    [navigate]
  );

  const signUp = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        setIsLoaded(false);

        const captchaToken = await window.grecaptcha.execute(
          import.meta.env.VITE_CAPTCHA_SITE_KEY,
          { action: 'submit' }
        );
        await httpClient.post('/auth/captcha', { token: captchaToken });

        const { data } = await httpClient.post('/auth/signup', {
          username,
          email,
          password,
        });
        setUser(data);
        setIsAuthenticated(true);
        navigate('/profile', { replace: true });
        return true;
      } catch (e) {
        setUser(undefined);
        setIsAuthenticated(false);
        return false;
      } finally {
        setIsLoaded(true);
      }
    },
    [navigate]
  );

  const updateUser = useCallback((updatedUser: any) => {
    setUser(updatedUser);
  }, []);

  const logout = useCallback(async () => {
    try {
      setIsLoaded(false);
      await httpClient.post('/auth/logout', { withCredentials: true });
    } catch (e) {
      // ignore
    } finally {
      setUser(undefined);
      setIsAuthenticated(false);
      setIsLoaded(true);
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const checkToken = useCallback(async () => {
    try {
      await httpClient.post('/auth/checkToken');
    } catch (e) {
      await logout();
    }
  }, [logout]);

  const value = useMemo(
    () => ({
      isLoaded,
      user,
      isAuthenticated,
      login,
      signUp,
      updateUser,
      checkToken,
      logout,
    }),
    [
      isLoaded,
      user,
      isAuthenticated,
      login,
      signUp,
      updateUser,
      checkToken,
      logout,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
