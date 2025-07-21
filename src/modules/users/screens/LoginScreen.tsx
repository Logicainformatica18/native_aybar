import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import {
  TextInput,
  Button,
  Text,
  Card,
  Checkbox,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as loginService } from '../services/authService';
import { useAuth } from '../../../contexts/AuthContext';
import { BASE_SRC } from '@/config/constants';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const passwordRef = useRef(null);
  const { login } = useAuth();

  useEffect(() => {
    const loadRemembered = async () => {
      const storedEmail = await AsyncStorage.getItem('rememberedEmail');
      if (storedEmail) {
        setEmail(storedEmail);
        setRememberMe(true);
      }
    };
    loadRemembered();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Campos requeridos', 'Completa ambos campos para iniciar sesión');
      return;
    }

    setLoading(true);
    try {
      const res = await loginService(email, password);
      await login(res.user, res.token);

      if (rememberMe) {
        await AsyncStorage.setItem('rememberedEmail', email);
      } else {
        await AsyncStorage.removeItem('rememberedEmail');
      }

      setEmail('');
      setPassword('');
    } catch (err: any) {
      let message = 'No se pudo iniciar sesión';
      if (err?.response?.data?.message) {
        message = err.response.data.message;
      } else if (err?.message === 'Network Error') {
        message = 'Sin conexión al servidor';
      } else if (err?.message) {
        message = err.message;
      }
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fefefe' }}>
      {/* SVG Superior */}
      <View style={{ position: 'absolute', top: 0 }}>
        <Svg height="160" width={width} viewBox={`0 0 ${width} 160`}>
          <Path
            fill="#03424E"
            d={`M0,0 C${width * 0.3},100 ${width * 0.7},20 ${width},120 L${width},0 L0,0 Z`}
          />
        </Svg>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1, justifyContent: 'center', padding: 24 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Card style={{ padding: 20, elevation: 4 }}>
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <Card.Cover
              source={{ uri: BASE_SRC + '/logo/1.png' }}
              style={{
                resizeMode: 'contain',
                backgroundColor: 'transparent',
                height: 100,
                width: 100,
              }}
            />
          </View>

          <Text variant="titleLarge" style={{ marginVertical: 16, textAlign: 'center', fontWeight: 'bold' }}>
           Sistema de Atención al Cliente
          </Text>

          <TextInput
            label="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            style={{ marginBottom: 12 }}
          />

          <TextInput
            ref={passwordRef}
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            returnKeyType="go"
            onSubmitEditing={handleLogin}
            style={{ marginBottom: 8 }}
          />

          {/* Checkbox Recordarme */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Checkbox
              status={rememberMe ? 'checked' : 'unchecked'}
              onPress={() => setRememberMe(!rememberMe)}
            />
            <Text onPress={() => setRememberMe(!rememberMe)}>Recordarme</Text>
          </View>

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={{ backgroundColor: '#03424E' }}
          >
            Ingresar
          </Button>
        </Card>
      </KeyboardAvoidingView>

      {/* SVG Inferior */}
      <View style={{ position: 'absolute', bottom: 0 }}>
        <Svg height="160" width={width} viewBox={`0 0 ${width} 160`}>
          <Path
            fill="#03424E"
            d={`M0,80 C${width * 0.3},140 ${width * 0.7},20 ${width},80 L${width},160 L0,160 Z`}
          />
        </Svg>
      </View>
    </View>
  );
}
