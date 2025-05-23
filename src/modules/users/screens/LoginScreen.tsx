import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { login as loginService } from '../services/authService';
import { useAuth } from '../../../contexts/AuthContext';
import { API_URL } from '@/config/constants';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const passwordRef = useRef<TextInput>(null);

  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Campos requeridos', 'Completa ambos campos para iniciar sesión');
      return;
    }

    setLoading(true);
    try {
      const res = await loginService(email, password);
      await login(res.user, res.token);

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
    <View style={styles.root}>
      {/* SVG FONDO ONDULADO */}
      <View style={styles.svgContainer}>
        <Svg height="160" width={width} viewBox={`0 0 ${width} 160`}>
          <Path
            fill="#F49A1A"
            d={`M0,0 C${width * 0.3},100 ${width * 0.7},20 ${width},120 L${width},0 L0,0 Z`}
          />
        </Svg>
      </View>

      <SafeAreaView style={styles.container}>
        <Image
          source={{ uri: API_URL + '/logo/1.png' }}
          style={styles.logo}
        />

        <Text style={styles.title}>Iniciar Sesión</Text>

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            ref={passwordRef}
            style={styles.passwordInput}
            placeholder="Contraseña"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            returnKeyType="go"
            onSubmitEditing={handleLogin}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text style={styles.toggle}>{showPassword ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Ingresar</Text>
          )}
        </TouchableOpacity>
      </SafeAreaView>

      <View style={styles.svgBottom}>
  <Svg height="160" width={width} viewBox={`0 0 ${width} 160`}>
    <Path
      fill="#F49A1A"
      d={`M0,80 C${width * 0.3},140 ${width * 0.7},20 ${width},80 L${width},160 L0,160 Z`}
    />
  </Svg>
</View>

    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fefefe',
  },
  svgContainer: {
    position: 'absolute',
    top: 0,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
    backgroundColor: '#fff',
  },
  passwordContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 14,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingRight: 10,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
  },
  toggle: {
    fontSize: 18,
    color: '#555',
  },
  button: {
    backgroundColor: '#F49A1A',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  svgBottom: {
  position: 'absolute',
  bottom: 0,
},

});
