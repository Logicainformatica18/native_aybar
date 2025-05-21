import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { login as loginService } from '../services/authService';
import { useAuth } from '../../../contexts/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

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

      // Limpia el formulario si todo va bien
      setEmail('');
      setPassword('');
    } catch (err: any) {
      console.log('🧨 ERROR LOGIN:', JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
      console.log('🔍 err.message:', err?.message);

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
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Ingresar</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
  },
  button: {
    backgroundColor: '#F49A1A',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
