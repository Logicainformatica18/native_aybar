import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
} from 'react-native';
import {
  Button,
  Dialog,
  Portal,
  Text,
  TextInput,
  Title,
  useTheme,
} from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import HourglassLoader from '@/modules/layouts/components/HourglassLoader';
import { SupportFormData } from '@/types/supports';
import ClientSearchMobile from '@/modules/supports/screens/ClientSearchMobile';

interface Option {
  id: number;
  name: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: (formData: FormData) => void;
  supportToEdit?: SupportFormData | null;
  areas: Option[];
  clients: Option[];
  projects: Option[];
  motivosCita: Option[];
  tiposCita: Option[];
  diasEspera: Option[];
  internalStates: Option[];
  externalStates: Option[];
  types: Option[];
}

export default function SupportModal({
  open,
  onClose,
  onSaved,
  supportToEdit,
  areas,
  clients,
  projects,
  motivosCita,
  tiposCita,
  diasEspera,
  internalStates,
  externalStates,
  types,
}: Props) {
  const { colors } = useTheme();
  const [formData, setFormData] = useState<SupportFormData>({
    subject: '',
    description: '',
    priority: 'Normal',
    type: 'Consulta',
    status: 'Pendiente',
    reservation_time: '',
    attended_at: '',
    derived: '',
    cellphone: '',
    Manzana: '',
    Lote: '',
    client_id: null,
    dni: '',
    email: '',
    address: '',
    project_id: null,
    area_id: null,
    id_motivos_cita: null,
    id_tipo_cita: null,
    id_dia_espera: null,
    internal_state_id: null,
    external_state_id: null,
    type_id: null,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (supportToEdit) {
      setFormData({
        subject: '',
        description: '',
        priority: 'Normal',
        type: 'Consulta',
        status: 'Pendiente',
        reservation_time: '',
        attended_at: '',
        derived: '',
        cellphone: supportToEdit.cellphone || '',
        Manzana: '',
        Lote: '',
        client_id: supportToEdit.client_id,
        dni: supportToEdit.client?.dni || '',
        email: supportToEdit.client?.email || '',
        address: supportToEdit.client?.direccion || '',
        project_id: null,
        area_id: null,
        id_motivos_cita: null,
        id_tipo_cita: null,
        id_dia_espera: null,
        internal_state_id: null,
        external_state_id: null,
        type_id: null,
      });
    } else {
      setFormData({
        subject: '',
        description: '',
        priority: 'Normal',
        type: 'Consulta',
        status: 'Pendiente',
        reservation_time: '',
        attended_at: '',
        derived: '',
        cellphone: '',
        Manzana: '',
        Lote: '',
        client_id: null,
        dni: '',
        email: '',
        address: '',
        project_id: null,
        area_id: null,
        id_motivos_cita: null,
        id_tipo_cita: null,
        id_dia_espera: null,
        internal_state_id: null,
        external_state_id: null,
        type_id: null,
      });
    }
  }, [supportToEdit]);

  const handleChange = (key: keyof SupportFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        data.append(key, String(value));
      }
    });

    const details = [
      {
        subject: formData.subject,
        description: formData.description,
        priority: formData.priority,
        type: formData.type,
        status: formData.status,
        reservation_time: new Date().toISOString(),
        attended_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        derived: formData.derived,
        project_id: formData.project_id,
        area_id: formData.area_id,
        id_motivos_cita: formData.id_motivos_cita,
        id_tipo_cita: formData.id_tipo_cita,
        id_dia_espera: formData.id_dia_espera,
        internal_state_id: formData.internal_state_id,
        external_state_id: formData.external_state_id,
        type_id: formData.type_id,
        Manzana: formData.Manzana,
        Lote: formData.Lote,
      },
    ];

    data.append('details', JSON.stringify(details));

    try {
      if (supportToEdit?.id) data.append('id', supportToEdit.id.toString());
      await onSaved(data);
      onClose();
    } catch (err) {
      console.error('❌ Error al guardar soporte:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderPicker = (label: string, field: keyof SupportFormData, options: Option[]) => (
    <>
      <Text style={styles.label}>{label}</Text>
      <Picker
        selectedValue={formData[field] || ''}
        onValueChange={(value) => handleChange(field, value)}
        style={styles.input}
      >
        <Picker.Item label="Seleccionar..." value="" />
        {options.map((opt) => (
          <Picker.Item key={opt.id} label={opt.name} value={opt.id} />
        ))}
      </Picker>
    </>
  );

  return (
    <Portal>
      <Dialog visible={open} onDismiss={onClose} style={{ maxHeight: '95%' }}>
        <Dialog.ScrollArea>
          <ScrollView contentContainerStyle={styles.container}>
            <Title>{supportToEdit ? 'Editar Soporte' : 'Nuevo Soporte'}</Title>

            <TextInput label="Asunto" value={formData.subject || ''} onChangeText={(text) => handleChange('subject', text)} style={styles.input} />
            <TextInput
              label="Descripción"
              value={formData.description || ''}
              onChangeText={(text) => handleChange('description', text)}
              multiline
              numberOfLines={4}
              style={[styles.input, styles.textArea]}
            />

            <ClientSearchMobile
              onClientSelected={(client) => {
                setFormData((prev) => ({
                  ...prev,
                  client_id: client.id,
                  dni: client.dni,
                  cellphone: client.cellphone,
                  email: client.email,
                  address: client.address,
                }));
              }}
            />

            <TextInput label="DNI" value={formData.dni} onChangeText={(value) => handleChange('dni', value)} style={styles.input} />
            <TextInput label="Celular" value={formData.cellphone} onChangeText={(value) => handleChange('cellphone', value)} style={styles.input} />
            <TextInput label="Email" value={formData.email} onChangeText={(value) => handleChange('email', value)} style={styles.input} />
            <TextInput label="Dirección" value={formData.address} onChangeText={(value) => handleChange('address', value)} style={styles.input} />

            {renderPicker('Proyecto', 'project_id', projects)}

            <Text style={styles.label}>Prioridad</Text>
            <Picker
              selectedValue={formData.priority}
              onValueChange={(itemValue) => handleChange('priority', itemValue)}
              style={{ backgroundColor: '#fff', borderRadius: 4 }}
            >
              <Picker.Item label="Urgente" value="Urgente" />
              <Picker.Item label="Moderado" value="Moderado" />
              <Picker.Item label="Normal" value="Normal" />
              <Picker.Item label="Baja Prioridad" value="Baja Prioridad" />
            </Picker>

            <TextInput label="Manzana" value={formData.Manzana || ''} onChangeText={(text) => handleChange('Manzana', text)} style={styles.input} />
            <TextInput label="Lote" value={formData.Lote || ''} onChangeText={(text) => handleChange('Lote', text)} style={styles.input} />

            <View style={styles.actions}>
              <Button mode="outlined" onPress={onClose} style={styles.actionButton}>Cancelar</Button>
              <Button mode="contained" onPress={handleSubmit} style={styles.actionButton}>Guardar</Button>
            </View>
          </ScrollView>
        </Dialog.ScrollArea>
      </Dialog>
      <HourglassLoader visible={loading} />
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  label: {
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
});
