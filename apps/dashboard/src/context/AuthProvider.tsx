import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { type ICredentials, authService } from '../services/auth/auth.service';
import type { TUser } from '../types/User';
import { useLocation, useNavigate } from 'react-router-dom';

interface AuthContextProps {
  user: TUser | null;
  isLoading: boolean;
  login: (credentials: ICredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<TUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const withLoading = async <T,>(action: () => Promise<T>): Promise<T> => {
    setIsLoading(true);
    try {
      return await action();
    } finally {
      setIsLoading(false);
    }
  };

  const loadCurrentUser = async () => {
    const currentUser = await withLoading(() =>
      authService.getUser()
    );

    setUser(currentUser);
  };

  const login = async (credentials: ICredentials) => {
    const loggedInUser = await withLoading(() =>
      authService.login(credentials)
    );

    setUser(loggedInUser);
    navigate(state?.path || '/games');
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
