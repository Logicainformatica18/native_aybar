import React, { useEffect, useState } from 'react';
import {
  Modal,
  ScrollView,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  Button,
  Dialog,
  Portal,
  Text,
  TextInput,
  Title,
  useTheme,
  RadioButton,
} from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import HourglassLoader from 'src/modules/layouts/components/HourglassLoader';
import { BASE_IMAGE_URL_USER } from '@/config/constants';

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: (formData: FormData) => void;
  userToEdit?: any;
  availableRoles: { name: string }[];
}

export default function UserModal({ open, onClose, onSaved, userToEdit, availableRoles }: Props) {
  const { colors } = useTheme();
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
  const [loading, setLoading] = useState(false);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);

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

  const handleSubmit = async () => {
    setLoading(true);
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

    try {
      await onSaved(data);
      onClose();
    } catch (err) {
      console.error('Error al guardar:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImagePress = () => {
    const uri = formData.photo?.startsWith('file')
      ? formData.photo
      : BASE_IMAGE_URL_USER + formData.photo;
    setPreviewUri(uri);
    setImagePreviewVisible(true);
  };

  return (
    <Portal>
      <Dialog visible={open} onDismiss={onClose} style={{ maxHeight: '90%' }}>
        <Dialog.ScrollArea>
          <ScrollView contentContainerStyle={styles.container}>
            <Title>{userToEdit ? 'Editar Usuario' : 'Nuevo Usuario'}</Title>

            <TextInput label="DNI" value={formData.dni} onChangeText={(text) => handleChange('dni', text)} style={styles.input} />
            <TextInput label="Nombres" value={formData.names} onChangeText={(text) => handleChange('names', text)} style={styles.input} />
            <TextInput label="Apellido Paterno" value={formData.firstname} onChangeText={(text) => handleChange('firstname', text)} style={styles.input} />
            <TextInput label="Apellido Materno" value={formData.lastname} onChangeText={(text) => handleChange('lastname', text)} style={styles.input} />
            <TextInput label="Correo" value={formData.email} onChangeText={(text) => handleChange('email', text)} keyboardType="email-address" style={styles.input} />
            <TextInput label="Celular" value={formData.cellphone} onChangeText={(text) => handleChange('cellphone', text)} keyboardType="phone-pad" style={styles.input} />

            <Text style={styles.label}>Sexo</Text>
            <Picker selectedValue={formData.sex} onValueChange={(value) => handleChange('sex', value)} style={styles.input}>
              <Picker.Item label="Seleccionar..." value="" />
              <Picker.Item label="Masculino" value="M" />
              <Picker.Item label="Femenino" value="F" />
            </Picker>

            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
              <Text>{formData.datebirth ? new Date(formData.datebirth).toLocaleDateString() : 'Seleccionar fecha de nacimiento'}</Text>
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

            <TextInput label="Contraseña" secureTextEntry value={formData.password} onChangeText={(text) => handleChange('password', text)} style={styles.input} />

            <Text style={styles.label}>Rol:</Text>
            <RadioButton.Group onValueChange={(value) => handleChange('role', value)} value={formData.role}>
              {availableRoles.map((role) => (
                <RadioButton.Item key={role.name} label={role.name} value={role.name} />
              ))}
            </RadioButton.Group>

            {formData.photo && (
              <TouchableOpacity onPress={handleImagePress}>
                <Image
                  source={{ uri: formData.photo.startsWith('file') ? formData.photo : BASE_IMAGE_URL_USER + formData.photo }}
                  style={styles.image}
                />
              </TouchableOpacity>
            )}

            <Button mode="outlined" onPress={pickImage} style={{ marginTop: 10 }}>
              {formData.photo ? 'Cambiar Foto' : 'Seleccionar Foto'}
            </Button>

            <View style={styles.actions}>
              <Button mode="outlined" onPress={onClose} style={styles.actionButton}>Cancelar</Button>
              <Button mode="contained" onPress={handleSubmit} style={styles.actionButton}>Guardar</Button>
            </View>
          </ScrollView>
        </Dialog.ScrollArea>
      </Dialog>
      <Modal visible={imagePreviewVisible} transparent onRequestClose={() => setImagePreviewVisible(false)}>
        <View style={styles.previewOverlay}>
          <TouchableOpacity style={styles.previewBackground} onPress={() => setImagePreviewVisible(false)}>
            {previewUri && <Image source={{ uri: previewUri }} style={styles.previewImage} />}
          </TouchableOpacity>
        </View>
      </Modal>
      <HourglassLoader visible={loading} />
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { marginBottom: 10 },
  label: { marginTop: 10, fontWeight: '600' },
  image: { width: 100, height: 100, borderRadius: 10, alignSelf: 'center', marginVertical: 10 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  actionButton: { flex: 1, marginHorizontal: 4 },
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
