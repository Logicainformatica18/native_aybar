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
  RadioButton,
} from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import HourglassLoader from '@/modules/layouts/components/HourglassLoader';
import { Support } from '@/types/supports';

interface Option {
  id: number;
  name: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: (formData: FormData) => void;
  supportToEdit?: Support;

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
  const [formData, setFormData] = useState<Partial<Support>>({
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
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (supportToEdit) {
      setFormData({ ...supportToEdit });
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
      });
    }
  }, [supportToEdit]);

  const handleChange = (key: keyof Support, value: any) => {
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

  const renderPicker = (label: string, field: keyof Support, options: Option[]) => (
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
            <TextInput label="Descripción" value={formData.description || ''} onChangeText={(text) => handleChange('description', text)} multiline style={styles.input} />

            {renderPicker('Área', 'area_id', areas)}
            {renderPicker('Cliente', 'client_id', clients)}
            {renderPicker('Proyecto', 'project_id', projects)}
            {renderPicker('Motivo de Cita', 'id_motivos_cita', motivosCita)}
            {renderPicker('Tipo de Cita', 'id_tipo_cita', tiposCita)}
            {renderPicker('Día de Espera', 'id_dia_espera', diasEspera)}
            {renderPicker('Estado Interno', 'internal_state_id', internalStates)}
            {renderPicker('Estado Externo', 'external_state_id', externalStates)}
            {renderPicker('Tipo', 'type_id', types)}

            <Text style={styles.label}>Prioridad</Text>
            <RadioButton.Group onValueChange={(value) => handleChange('priority', value)} value={formData.priority}>
              <RadioButton.Item label="Normal" value="Normal" />
              <RadioButton.Item label="Alta" value="Alta" />
              <RadioButton.Item label="Urgente" value="Urgente" />
            </RadioButton.Group>

            <Text style={styles.label}>Tipo</Text>
            <RadioButton.Group onValueChange={(value) => handleChange('type', value)} value={formData.type}>
              <RadioButton.Item label="Consulta" value="Consulta" />
              <RadioButton.Item label="Reclamo" value="Reclamo" />
              <RadioButton.Item label="Sugerencia" value="Sugerencia" />
            </RadioButton.Group>

            <Text style={styles.label}>Estado</Text>
            <RadioButton.Group onValueChange={(value) => handleChange('status', value)} value={formData.status}>
              <RadioButton.Item label="Pendiente" value="Pendiente" />
              <RadioButton.Item label="Atendido" value="Atendido" />
              <RadioButton.Item label="Cerrado" value="Cerrado" />
            </RadioButton.Group>

            <TextInput label="Derivado a" value={formData.derived || ''} onChangeText={(text) => handleChange('derived', text)} style={styles.input} />
            <TextInput label="Celular" value={formData.cellphone || ''} onChangeText={(text) => handleChange('cellphone', text)} keyboardType="phone-pad" style={styles.input} />
            <TextInput label="Manzana" value={formData.Manzana || ''} onChangeText={(text) => handleChange('Manzana', text)} style={styles.input} />
            <TextInput label="Lote" value={formData.Lote || ''} onChangeText={(text) => handleChange('Lote', text)} style={styles.input} />

            <Text style={styles.label}>Fecha de Reserva</Text>
            <Button mode="outlined" onPress={() => setShowDatePicker(true)}>{formData.reservation_time ? new Date(formData.reservation_time).toLocaleDateString() : 'Seleccionar fecha'}</Button>
            {showDatePicker && (
              <DateTimePicker
                value={formData.reservation_time ? new Date(formData.reservation_time) : new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    handleChange('reservation_time', selectedDate.toISOString().split('T')[0]);
                  }
                }}
              />
            )}

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
  container: { padding: 20 },
  input: { marginBottom: 10 },
  label: { marginTop: 10, fontWeight: '600' },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  actionButton: { flex: 1, marginHorizontal: 4 },
});
