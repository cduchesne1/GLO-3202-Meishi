import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import httpClient from '../common/http-client';

interface IAuthContext {
  isLoaded: boolean;
  user?: any;
  isAuthenticated: boolean;
  login: (currentUser: any) => void;
  refresh: () => void;
  logout: () => void;
}

const AuthContext = createContext({
  isLoaded: false,
  user: undefined,
  isAuthenticated: false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  login: (currentUser: any) => {},
  refresh: () => {},
  logout: () => {},
} as IAuthContext);

export default function AuthProvider({ children }: any) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<any | undefined>(undefined);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') as string);
    if (
      storedUser &&
      storedUser.tokenManager &&
      new Date(storedUser.tokenManager.expirationTime) > new Date()
    ) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    window.addEventListener('storage', (event) => {
      if (event.key === 'user' && !event.newValue) {
        setUser(undefined);
        setIsAuthenticated(false);
      }
    });
  });

  const login = useCallback(
    (currentUser: any) => {
      setUser(currentUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(currentUser));
      navigate('/profile', { replace: true });
    },
    [navigate]
  );

  const logout = useCallback(() => {
    setUser(undefined);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  }, [navigate]);

  const refresh = useCallback(async () => {
    try {
      const response = await httpClient.post('/auth/token', {
        refreshToken: user.tokenManager.refreshToken,
      });
      setUser({ ...user, tokenManager: response.data });
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(response.data));
    } catch (e) {
      logout();
    }
  }, [user, logout]);

  const value = useMemo(
    () => ({ isLoaded, user, isAuthenticated, login, refresh, logout }),
    [isLoaded, user, isAuthenticated, login, refresh, logout]
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