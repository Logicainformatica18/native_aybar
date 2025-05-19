import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: (formData: FormData) => void;
  userToEdit?: any;
  availableRoles: { name: string }[];
}

export default function UserModal({ open, onClose, onSaved, userToEdit, availableRoles }: Props) {
  const [formData, setFormData] = useState({
    id: undefined,
    dni: '',
    firstname: '',
    lastname: '',
    names: '',
    email: '',
    password: '',
    sex: '',
    datebirth: '',
    cellphone: '',
    role: '',
    photo: null as string | null,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const baseUrl = 'http://192.168.16.187:8000/imageusers/';

  useEffect(() => {
    if (userToEdit) {
      setFormData({ ...userToEdit, password: '', photo: userToEdit.photo || null });
    } else {
      setFormData({
        id: undefined,
        dni: '',
        firstname: '',
        lastname: '',
        names: '',
        email: '',
        password: '',
        sex: '',
        datebirth: '',
        cellphone: '',
        role: '',
        photo: null,
      });
    }
  }, [userToEdit]);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setFormData((prev) => ({
        ...prev,
        photo: result.assets[0].uri,
      }));
    }
  };

  const handleSubmit = () => {
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        if (key === 'photo' && typeof value === 'string' && value.startsWith('file')) {
          data.append('photo', {
            uri: value,
            name: 'photo.jpg',
            type: 'image/jpeg',
          } as any);
        } else {
          data.append(key, value);
        }
      }
    });

    onSaved(data);
    onClose();
  };

  return (
    <Modal visible={open} animationType="slide" onRequestClose={onClose}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{userToEdit ? 'Editar Usuario' : 'Nuevo Usuario'}</Text>

        <TextInput style={styles.input} placeholder="DNI" value={formData.dni} onChangeText={(text) => handleChange('dni', text)} />
        <TextInput style={styles.input} placeholder="Nombres" value={formData.names} onChangeText={(text) => handleChange('names', text)} />
        <TextInput style={styles.input} placeholder="Apellido Paterno" value={formData.firstname} onChangeText={(text) => handleChange('firstname', text)} />
        <TextInput style={styles.input} placeholder="Apellido Materno" value={formData.lastname} onChangeText={(text) => handleChange('lastname', text)} />
        <TextInput style={styles.input} placeholder="Correo" value={formData.email} onChangeText={(text) => handleChange('email', text)} keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Celular" value={formData.cellphone} onChangeText={(text) => handleChange('cellphone', text)} keyboardType="phone-pad" />

        <Text style={styles.label}>Sexo</Text>
        <Picker selectedValue={formData.sex} onValueChange={(value) => handleChange('sex', value)} style={styles.input}>
          <Picker.Item label="Seleccionar..." value="" />
          <Picker.Item label="Masculino" value="M" />
          <Picker.Item label="Femenino" value="F" />
        </Picker>

        <Text style={styles.label}>Fecha de nacimiento</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={[styles.input, { justifyContent: 'center' }]}>
          <Text>{formData.datebirth ? new Date(formData.datebirth).toLocaleDateString() : 'Seleccionar fecha'}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={formData.datebirth ? new Date(formData.datebirth) : new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                handleChange('datebirth', selectedDate.toISOString().split('T')[0]);
              }
            }}
          />
        )}

        <TextInput style={styles.input} placeholder="Contraseña" secureTextEntry value={formData.password} onChangeText={(text) => handleChange('password', text)} />

        <Text style={styles.label}>Rol:</Text>
        {availableRoles.map((role) => (
          <TouchableOpacity key={role.name} onPress={() => handleChange('role', role.name)} style={[styles.roleButton, formData.role === role.name && styles.roleSelected]}>
            <Text>{role.name}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.label}>Foto:</Text>
        {formData.photo && typeof formData.photo === 'string' && !formData.photo.startsWith('file') && (
          <Image source={{ uri: baseUrl + formData.photo }} style={styles.image} />
        )}
        {formData.photo && typeof formData.photo === 'string' && formData.photo.startsWith('file') && (
          <Image source={{ uri: formData.photo }} style={styles.image} />
        )}

        <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
          <Text style={{ color: '#fff', textAlign: 'center' }}>{formData.photo ? 'Cambiar Foto' : 'Seleccionar Foto'}</Text>
        </TouchableOpacity>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.buttonCancel} onPress={onClose}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonSave} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 12, borderRadius: 8, padding: 10 },
  label: { marginTop: 10, fontWeight: 'bold' },
  roleButton: { padding: 10, backgroundColor: '#eee', borderRadius: 6, marginVertical: 4 },
  roleSelected: { backgroundColor: '#cce5ff' },
  photoButton: { backgroundColor: '#777', padding: 10, borderRadius: 8, marginBottom: 20 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  buttonCancel: { padding: 12, backgroundColor: '#ccc', borderRadius: 8, flex: 1, marginRight: 5 },
  buttonSave: { padding: 12, backgroundColor: '#4CAF50', borderRadius: 8, flex: 1, marginLeft: 5 },
  buttonText: { color: '#fff', textAlign: 'center' },
  image: { width: 100, height: 100, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#ccc', alignSelf: 'center' },
});