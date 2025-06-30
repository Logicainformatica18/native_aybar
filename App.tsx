import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import LoginScreen from './src/modules/users/screens/LoginScreen';
import UserListScreen from './src/modules/users/screens/UserList';
import TransferListScreen from '@/modules/transfers/screens/TransferList';
import ProductListScreen from '@/modules/products/screens/ProductList';
import ArticleList from '@/modules/articles/screens/ArticleList';
import SupportListScreen from '@/modules/supports/screens/SupportList';
import LogoutScreen from './src/modules/users/screens/LogoutScreen';

import { RootStackParamList } from '@/types/navigation';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';

import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Image } from 'react-native';
import { BASE_SRC } from '@/config/constants';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator();

// 🎨 Tema claro forzado
const customLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#03424E',
    background: '#fefefe',
    surface: '#ffffff',
    onSurface: '#000000',
    text: '#000000',
  },
};

// 📦 Drawer con logo
function CustomDrawerContent(props: any) {
  return (
    <DrawerContentScrollView {...props}>
      <View style={{ alignItems: 'center', paddingVertical: 24 }}>
        <Image
          source={{ uri: BASE_SRC + '/logo/1.png' }}
          style={{ width: 100, height: 100, resizeMode: 'contain' }}
        />
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

// 🧭 Navegador del Drawer
function DrawerRoutes() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: '#03424E',
        drawerLabelStyle: { marginLeft: -5 },
      }}
    >
      <Drawer.Screen
        name="Solicitudes"
        component={SupportListScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="headset" size={size} color={color} />
          ),
        }}
      />
      {/* Puedes activar más rutas aquí si deseas */}
      <Drawer.Screen
        name="Cerrar Sesión"
        component={LogoutScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="logout" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

// 🚀 App principal
export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={customLightTheme}>
        <AuthProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

// 🧭 Stack de navegación principal
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
