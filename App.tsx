import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/modules/users/screens/LoginScreen';
import UserListScreen from './src/modules/users/screens/UserList';
import TransferListScreen from '@/modules/transfers/screens/TransferList';


import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import LogoutScreen from './src/modules/users/screens/LogoutScreen';
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerRoutes() {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="Usuarios" component={UserListScreen} />
        <Drawer.Screen name="Transferencias" component={TransferListScreen} />
      <Drawer.Screen name="Cerrar Sesión" component={LogoutScreen} />

      {/* Aquí puedes agregar más pantallas */}
    </Drawer.Navigator>
  );
}

function AppNavigator() {
  const { token, loading } = useAuth();

  if (loading) return null; // o spinner de carga

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!token ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <Stack.Screen name="Main" component={DrawerRoutes} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}