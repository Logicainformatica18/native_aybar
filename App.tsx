import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

import LoginScreen from './src/modules/users/screens/LoginScreen';
import UserListScreen from './src/modules/users/screens/UserList';
import TransferListScreen from '@/modules/transfers/screens/TransferList';
import ProductListScreen from '@/modules/products/screens/ProductList';
import ArticleList from '@/modules/articles/screens/ArticleList';
import LogoutScreen from './src/modules/users/screens/LogoutScreen';

import { RootStackParamList } from '@/types/navigation';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator();

function DrawerRoutes() {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="Usuarios" component={UserListScreen} />
      <Drawer.Screen name="Transferencias" component={TransferListScreen} />
      <Drawer.Screen name="Productos" component={ProductListScreen} />
      <Drawer.Screen name="Cerrar Sesión" component={LogoutScreen} />
    </Drawer.Navigator>
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

// ✅ Separamos esta función para claridad
function AppNavigator() {
  const { token, loading } = useAuth();

  if (loading) return null;

  return (
    <Stack.Navigator>
      {!token ? (
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      ) : (
        <>
          <Stack.Screen name="Main" component={DrawerRoutes} options={{ headerShown: false }} />
          <Stack.Screen
            name="ArticleList"
            component={ArticleList}
            options={({ route }: { route: RouteProp<RootStackParamList, 'ArticleList'> }) => ({
              title: `Artículos de la transferencia #${route.params.transferId}`,
              headerBackTitle: 'Volver',
              headerTitleAlign: 'center',
              headerStyle: { backgroundColor: '#03424E' },
              headerTintColor: '#fff',
            })}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
