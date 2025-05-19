import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextProps {
  token: string | null;
  loading: boolean;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextProps>({
  token: null,
  loading: true,
  setToken: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem('authToken');
      setTokenState(storedToken);
      setLoading(false);
    };
    loadToken();
  }, []);

  const setToken = async (newToken: string | null) => {
    if (newToken) {
      await AsyncStorage.setItem('authToken', newToken);
    } else {
      await AsyncStorage.removeItem('authToken');
    }
    setTokenState(newToken);
  };

  return (
    <AuthContext.Provider value={{ token, loading, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
