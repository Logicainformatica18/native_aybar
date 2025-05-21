import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define tu tipo de usuario según lo que recibes del backend
interface User {
  id: number;
  email: string;
  firstname?: string;
  lastname?: string;
  names?: string;
  // agrega más campos si es necesario
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        const storedUser = await AsyncStorage.getItem('user');

        if (storedToken) setToken(storedToken);
        if (storedUser) setUser(JSON.parse(storedUser));
      } catch (error) {
        console.warn('Error al cargar sesión:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  const login = async (userData: User, authToken: string) => {
    await AsyncStorage.setItem('authToken', authToken);
    await AsyncStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setToken(authToken);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
