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
import * as ImagePicker from 'expo-image-picker';

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: (user: any) => void;
  userToEdit?: any;
  availableRoles: { name: string }[];
}

export default function UserModal({ open, onClose, onSaved, userToEdit, availableRoles }: Props) {
  const [formData, setFormData] = useState({
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
 const baseUrl = 'http://192.168.16.187:8000/imageusers/'; // cambia por tu IP real

  useEffect(() => {
    if (userToEdit) {
      setFormData({ ...userToEdit, password: '', photo: userToEdit.photo || null });
    } else {
      setFormData({
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
        if (key === 'photo' && typeof value === 'string') {
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

    onSaved(data); // se envía como FormData
    onClose();
  };

  return (
    <Modal visible={open} animationType="slide" onRequestClose={onClose}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>
          {userToEdit ? 'Editar Usuario' : 'Nuevo Usuario'}
        </Text>

        {[
          'dni',
          'firstname',
          'lastname',
          'names',
          'email',
          'cellphone',
          'sex',
          'datebirth',
          'password',
        ].map((field) => (
          <TextInput
            key={field}
            style={styles.input}
            placeholder={field}
            secureTextEntry={field === 'password'}
            value={formData[field as keyof typeof formData] || ''}
            onChangeText={(text) => handleChange(field, text)}
          />
        ))}

        <Text style={styles.label}>Rol:</Text>
        {availableRoles.map((role) => (
          <TouchableOpacity
            key={role.name}
            onPress={() => handleChange('role', role.name)}
            style={[
              styles.roleButton,
              formData.role === role.name && styles.roleSelected,
            ]}
          >
            <Text>{role.name}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.label}>Foto:</Text>
        {formData.photo && (
          <Image
            source={{ uri: formData.photo }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 10,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: '#ccc',
              alignSelf: 'center',
            }}
          />
        )}

        {formData.photo && (
         
           <Image
    source={{ uri: 'http://192.168.16.187:8000/imageusers/1747429371_6827a7fbcdd4b1745530977_680ab0619e0f7IMAGEN%20DE%20FAMILIA.jpg' }}
    style={{ width: 100, height: 100, borderRadius: 10, marginBottom: 10 }}
  />
        )}
        <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
          <Text style={{ color: '#fff', textAlign: 'center' }}>
            {formData.photo ? 'Cambiar Foto' : 'Seleccionar Foto'}
          </Text>
        </TouchableOpacity>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.buttonCancel} onPress={onClose}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonSave} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Guardar{encodeURI(baseUrl+formData.photo)} </Text>
          </TouchableOpacity>
        
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    borderRadius: 8,
    padding: 10,
  },
  label: { marginTop: 10, fontWeight: 'bold' },
  roleButton: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 6,
    marginVertical: 4,
  },
  roleSelected: { backgroundColor: '#cce5ff' },
  photoButton: {
    backgroundColor: '#777',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  buttonCancel: {
    padding: 12,
    backgroundColor: '#ccc',
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
  },
  buttonSave: {
    padding: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
  },
  buttonText: { color: '#fff', textAlign: 'center' },
});
