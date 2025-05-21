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
  const baseUrl = 'http://192.168.1.42:8000/imageusers/';

  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
  const [previewUri, setPreviewUri] = useState<string | null>(null);

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
        if (key === 'photo' && typeof value === 'string' && value.startsWith('file://')) {
          data.append('photo', {
            uri: value,
            name: 'photo.jpg',
            type: 'image/jpeg',
          } as any);
        } else if (key !== 'photo') {
          data.append(key, value);
        }
      }
    });

    onSaved(data);
    onClose();
  };

  const handleImagePress = () => {
    const uri = formData.photo?.startsWith('file')
      ? formData.photo
      : baseUrl + formData.photo;
    setPreviewUri(uri);
    setImagePreviewVisible(true);
  };

  return (
    <Modal visible={open} animationType="slide" onRequestClose={onClose}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{userToEdit ? 'Editar Usuario' : 'Nuevo Usuario'}</Text>

        <TextInput style={styles.inputSmall} placeholder="DNI" value={formData.dni} onChangeText={(text) => handleChange('dni', text)} />
        <TextInput style={styles.inputSmall} placeholder="Nombres" value={formData.names} onChangeText={(text) => handleChange('names', text)} />
        <TextInput style={styles.inputSmall} placeholder="Apellido Paterno" value={formData.firstname} onChangeText={(text) => handleChange('firstname', text)} />
        <TextInput style={styles.inputSmall} placeholder="Apellido Materno" value={formData.lastname} onChangeText={(text) => handleChange('lastname', text)} />
        <TextInput style={styles.inputSmall} placeholder="Correo" value={formData.email} onChangeText={(text) => handleChange('email', text)} keyboardType="email-address" />
        <TextInput style={styles.inputSmall} placeholder="Celular" value={formData.cellphone} onChangeText={(text) => handleChange('cellphone', text)} keyboardType="phone-pad" />

        <Text style={styles.label}>Sexo</Text>
        <Picker selectedValue={formData.sex} onValueChange={(value) => handleChange('sex', value)} style={styles.inputSmall}>
          <Picker.Item label="Seleccionar..." value="" />
          <Picker.Item label="Masculino" value="M" />
          <Picker.Item label="Femenino" value="F" />
        </Picker>

        <Text style={styles.label}>Fecha de nacimiento</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={[styles.inputSmall, { justifyContent: 'center' }]}>
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

        <TextInput style={styles.inputSmall} placeholder="Contraseña" secureTextEntry value={formData.password} onChangeText={(text) => handleChange('password', text)} />

        <Text style={styles.label}>Rol:</Text>
        {availableRoles.map((role) => (
          <TouchableOpacity key={role.name} onPress={() => handleChange('role', role.name)} style={[styles.roleButton, formData.role === role.name && styles.roleSelected]}>
            <Text>{role.name}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.label}>Foto:</Text>
        {formData.photo && (
          <TouchableOpacity onPress={handleImagePress}>
            <Image
              source={{
                uri: formData.photo.startsWith('file') ? formData.photo : baseUrl + formData.photo,
              }}
              style={styles.image}
            />
          </TouchableOpacity>
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

      {/* Modal para vista previa de imagen */}
      <Modal visible={imagePreviewVisible} transparent onRequestClose={() => setImagePreviewVisible(false)}>
        <View style={styles.previewOverlay}>
          <TouchableOpacity style={styles.previewBackground} onPress={() => setImagePreviewVisible(false)}>
            {previewUri && <Image source={{ uri: previewUri }} style={styles.previewImage} />}
          </TouchableOpacity>
        </View>
      </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  inputSmall: { fontSize: 13, borderWidth: 1, borderColor: '#ccc', marginBottom: 8, borderRadius: 6, padding: 8 },
  label: { marginTop: 10, fontWeight: '600', fontSize: 13 },
  roleButton: { padding: 8, backgroundColor: '#eee', borderRadius: 6, marginVertical: 3 },
  roleSelected: { backgroundColor: '#cce5ff' },
  photoButton: { backgroundColor: '#777', padding: 8, borderRadius: 8, marginBottom: 16 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  buttonCancel: { padding: 10, backgroundColor: '#ccc', borderRadius: 8, flex: 1, marginRight: 5 },
  buttonSave: { padding: 10, backgroundColor: '#4CAF50', borderRadius: 8, flex: 1, marginLeft: 5 },
  buttonText: { color: '#fff', textAlign: 'center', fontSize: 13 },
  image: { width: 80, height: 80, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#ccc', alignSelf: 'center' },

  // Estilos del modal de vista previa
  previewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '90%',
    height: '70%',
    resizeMode: 'contain',
    borderRadius: 10,
  },
});
