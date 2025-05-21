// import React, { createContext, useContext, useEffect, useState } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// interface User {
//   id: number;
//   email: string;
//   firstname?: string;
//   lastname?: string;
//   names?: string;
//   // puedes agregar más campos según tu modelo
// }

// interface AuthContextProps {
//   user: User | null;
//   token: string | null;
//   loading: boolean;
//   login: (user: User, token: string) => Promise<void>;
//   logout: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextProps>({
//   user: null,
//   token: null,
//   loading: true,
//   login: async () => {},
//   logout: async () => {},
// });

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [token, setToken] = useState<string | null>(null);
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadSession = async () => {
//       const storedToken = await AsyncStorage.getItem('authToken');
//       const storedUser = await AsyncStorage.getItem('user');

//       if (storedToken) setToken(storedToken);
//       if (storedUser) setUser(JSON.parse(storedUser));

//       setLoading(false);
//     };

//     loadSession();
//   }, []);

//   const login = async (userData: User, authToken: string) => {
//     await AsyncStorage.setItem('authToken', authToken);
//     await AsyncStorage.setItem('user', JSON.stringify(userData));
//     setToken(authToken);
//     setUser(userData);
//   };

//   const logout = async () => {
//     await AsyncStorage.removeItem('authToken');
//     await AsyncStorage.removeItem('user');
//     setToken(null);
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, loading, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
