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
import { BASE_IMAGE_URL } from '@/config/constants';
import HourglassLoader from '@/modules/layouts/components/HourglassLoader';
import { Product } from '@/types/product';

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: (formData: FormData) => void;
  articleToEdit?: any;
}

export default function ArticleModal({ open, onClose, onSaved, articleToEdit }: Props) {
  const [formData, setFormData] = useState({
    id: undefined,
    title: '',
    description: '',
    details: '',
    quanty: '',
    price: '',
    state: '',
    file_1: null as string | null,
  });

  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (articleToEdit) {
      setFormData({ ...articleToEdit, file_1: null });
    } else {
      setFormData({
        id: undefined,
        title: '',
        description: '',
        details: '',
        quanty: '',
        price: '',
        state: '',
        file_1: null,
      });
    }
  }, [articleToEdit]);

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
        file_1: result.assets[0].uri,
      }));
    }
  };

  const handleImagePress = () => {
    const uri = formData.file_1
      ? formData.file_1
      : BASE_IMAGE_URL + articleToEdit?.file_1;
    setPreviewUri(uri);
    setImagePreviewVisible(true);
  };

  const handleSubmit = async () => {
    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        if (key === 'file_1' && typeof value === 'string' && value.startsWith('file://')) {
          data.append('file_1', {
            uri: value,
            name: 'archivo.jpg',
            type: 'image/jpeg',
          } as any);
        } else if (key !== 'file_1') {
          data.append(key, value);
        }
      }
    });

    try {
      await onSaved(data);
      onClose();
    } catch (err) {
      console.error('Error al guardar artículo:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={open} animationType="slide" onRequestClose={onClose}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{articleToEdit ? 'Editar Artículo' : 'Nuevo Artículo'}</Text>

        <TextInput style={styles.input} placeholder="Título" value={formData.title} onChangeText={(text) => handleChange('title', text)} />
        <TextInput style={styles.input} placeholder="Descripción" value={formData.description} onChangeText={(text) => handleChange('description', text)} />
        <TextInput style={styles.input} placeholder="Detalles" value={formData.details} onChangeText={(text) => handleChange('details', text)} multiline />
        <TextInput style={styles.input} placeholder="Cantidad" value={formData.quanty} onChangeText={(text) => handleChange('quanty', text)} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Precio" value={formData.price} onChangeText={(text) => handleChange('price', text)} keyboardType="decimal-pad" />
        <TextInput style={styles.input} placeholder="Estado" value={formData.state} onChangeText={(text) => handleChange('state', text)} />

        <Text style={styles.section}>Archivo</Text>
        {(formData.file_1 || articleToEdit?.file_1) && (
          <TouchableOpacity onPress={handleImagePress}>
            <Image
              source={{
                uri: formData.file_1 ? formData.file_1 : BASE_IMAGE_URL + articleToEdit.file_1,
              }}
              style={styles.image}
            />
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>{formData.file_1 ? 'Cambiar imagen' : 'Seleccionar imagen'}</Text>
        </TouchableOpacity>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.cancel} onPress={onClose}>
            <Text style={styles.actionText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.save} onPress={handleSubmit}>
            <Text style={styles.actionText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={imagePreviewVisible} transparent onRequestClose={() => setImagePreviewVisible(false)}>
        <View style={styles.previewOverlay}>
          <TouchableOpacity style={styles.previewBackground} onPress={() => setImagePreviewVisible(false)}>
            {previewUri && <Image source={{ uri: previewUri }} style={styles.previewImage} />}
          </TouchableOpacity>
        </View>
      </Modal>

      <HourglassLoader visible={loading} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 8 },
  section: { fontWeight: '600', marginTop: 15, marginBottom: 5 },
  button: { backgroundColor: '#777', padding: 10, borderRadius: 8, marginBottom: 15 },
  buttonText: { color: '#fff', textAlign: 'center' },
  image: { width: 80, height: 80, borderRadius: 8, marginBottom: 10, alignSelf: 'center' },
  actions: { flexDirection: 'row', justifyContent: 'space-between' },
  cancel: { backgroundColor: '#ccc', padding: 10, borderRadius: 8, flex: 1, marginRight: 5 },
  save: { backgroundColor: '#4CAF50', padding: 10, borderRadius: 8, flex: 1, marginLeft: 5 },
  actionText: { color: '#fff', textAlign: 'center' },
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