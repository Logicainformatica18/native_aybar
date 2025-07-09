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
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
    priority: 'Baja',
    type: 'Consulta',
    status: 'Pendiente',
    reservation_time: '',
    attended_at: '',
    derived: '',
    cellphone: '',
    Manzana: '',
    comment: '',
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
  const [clientSales, setClientSales] = useState<any[]>([]);

  useEffect(() => {
    if (supportToEdit) {
      setFormData({
        ...supportToEdit,
        dni: supportToEdit.client?.dni || '',
        email: supportToEdit.client?.email || '',
        address: supportToEdit.client?.direccion || '',
      });
    } else {
      setFormData({
        subject: '',
        description: '',
        priority: 'Baja',
        type: 'Consulta',
        status: 'Pendiente',
        reservation_time: '',
        attended_at: '',
        derived: '',
        cellphone: '',
        Manzana: '',
        comment: '',
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
        comment: formData.comment,
      },
    ];

    data.append('details', JSON.stringify(details));

    try {
      if (supportToEdit?.id) data.append('id', supportToEdit.id.toString());
      await onSaved(data);
      onClose();
    } catch (err) {
      console.error('❌ Error al guardar Solicitud:', err);
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
        style={styles.select}
      >
        <Picker.Item label="Seleccionar..." value="" />
        {options.map((opt) => (
          <Picker.Item key={opt.id} label={opt.name} value={opt.id} />
        ))}
      </Picker>
    </>
  );
  // 🔎 IDs de proyectos del cliente
  const projectIdsFromSales = clientSales.map((s) => s.project_id);

  // 🔁 Proyectos disponibles solo para este cliente
  const filteredProjects = projects.filter((p) =>
    projectIdsFromSales.includes(p.id)
  );


  return (
    <Portal>
      <Dialog visible={open} onDismiss={onClose} style={{ maxHeight: '95%' }}>
        <Dialog.ScrollArea>
          <ScrollView contentContainerStyle={styles.container}>
            <Title style={{ marginBottom: 12 }}>
              {supportToEdit ? 'Editar Solicitud' : 'Nueva Solicitud'}
            </Title>

            {/* 🔵 Sección: Datos del Cliente */}
            <View style={[styles.section, { backgroundColor: '#f5f7fa' }]}>
              <Text style={styles.sectionTitle}>
                <MaterialCommunityIcons name="account-box-outline" size={18} /> Datos del Cliente
              </Text>

              <ClientSearchMobile
                onClientSelected={(client) => {
                  setFormData((prev) => ({
                    ...prev,
                    client_id: client.id,
                    dni: client.dni,
                    cellphone: client.cellphone,
                    email: client.email,
                    address: client.address,
                    project_id: null,
                    Manzana: '',
                    comment: '',
                  }));
                  setClientSales(client.sales || []); // ✅ necesario para filtrar luego
                }}
              />


              <TextInput
                placeholder="DNI"
                value={formData.dni}
                onChangeText={(value) => handleChange('dni', value)}
                style={styles.input}
              />
              <TextInput
                placeholder="Celular"
                value={formData.cellphone}
                onChangeText={(value) => handleChange('cellphone', value)}
                style={styles.input}
              />
              <TextInput
                placeholder="Email"
                value={formData.email}
                onChangeText={(value) => handleChange('email', value)}
                style={styles.input}
              />
              <TextInput
                placeholder="Dirección"
                value={formData.address}
                onChangeText={(value) => handleChange('address', value)}
                style={styles.input}
              />
            </View>

            {/* 🟡 Sección: Estado Global */}
            {/* <View style={[styles.section, { backgroundColor: '#fdecea', borderColor: '#f44336' }]}>
          <Text style={[styles.sectionTitle, { color: '#c62828' }]}>
            <MaterialCommunityIcons name="alert" size={18} /> Estado Global
          </Text>
          <Picker
            selectedValue={formData.status_global}
            onValueChange={(value) => handleChange('status_global', value)}
            style={{
              backgroundColor: '#fff',
              borderColor: '#f44336',
              borderWidth: 1,
              borderRadius: 6,
              marginBottom: 8,
              color: '#000',
            }}
          >
            <Picker.Item label="Elija un Estado de Atención Global" value="" />
            <Picker.Item label="Incompleto" value="Incompleto" />
            <Picker.Item label="Completo" value="Completo" />
          </Picker>
        </View> */}

            {/* 🟦 Sección: Detalle de Solicitud */}
            <View style={[styles.section, { backgroundColor: '#eaf8fa' }]}>
              <Text style={[styles.sectionTitle, { color: '#9c6b00' }]}>
                <MaterialCommunityIcons name="file-document-outline" size={18} /> Detalle de Solicitud
              </Text>

              <Text style={styles.label}>Asunto</Text>
              <Picker
                selectedValue={formData.subject}
                onValueChange={(value) => handleChange('subject', value)}
                style={styles.select}
              >
                <Picker.Item label="Seleccione un asunto" value="" />
                <Picker.Item label="Boletas" value="Boletas" />
                <Picker.Item label="EE.CC" value="EE.CC" />
                <Picker.Item label="Pagos" value="Pagos" />
                <Picker.Item label="Recojo de Letras" value="Recojo de Letras" />
                <Picker.Item label="Información de su lote" value="Información de su lote" />
                <Picker.Item label="Avance de Proyecto" value="Avance de Proyecto" />
                <Picker.Item label="Desestimiento" value="Desestimiento" />
                <Picker.Item label="Traspaso de aportes" value="Traspaso de aportes" />
                <Picker.Item label="Cesión" value="Cesion" />
                <Picker.Item label="Constancia de no adeudo" value="Constancia de no adeudo" />
                <Picker.Item label="Certificado de lote" value="Certificado de lote" />
                <Picker.Item label="Recojo de contrato" value="Recojo de contrato" />
                <Picker.Item label="Formalización" value="Formalización" />
                <Picker.Item label="Cita con legal" value="Cita con legal" />
                <Picker.Item label="Visita a proyecto" value="Visita a proyecto" />
              </Picker>


              <TextInput
                label="Descripción"
                value={formData.description || ''}
                onChangeText={(text) => handleChange('description', text)}
                multiline
                numberOfLines={4}
                style={[styles.input, styles.textArea]}
              />

              {renderPicker('Proyecto', 'project_id', filteredProjects)}




              {formData.project_id && (
                <>
                  <Text style={styles.label}>Manzana / Lote</Text>
                  <Picker
                    selectedValue={formData.Manzana}
                    onValueChange={(value) => {
                      handleChange('Manzana', value);
                      const parts = value.split('-');
                      if (parts.length === 2) {
                        handleChange('comment', parts[1]); // autocompleta Lote
                      } else {
                        handleChange('comment', '');
                      }
                    }}
                    style={styles.select}
                  >
                    <Picker.Item label="Seleccione manzana/lote" value="" />
                    {[...new Set(
                      clientSales
                        .filter((sale) => sale.project_id === formData.project_id)
                        .map((sale) => sale.mz_lote)
                    )].map((mz, index) => (
                      <Picker.Item key={index} label={mz} value={mz} />
                    ))}
                  </Picker>
                </>
              )}
              <Text style={styles.label}>Prioridad</Text>
              <Picker
                selectedValue={formData.priority}
                onValueChange={(itemValue) => handleChange('priority', itemValue)}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 6,
                  borderColor: '#ccc',
                  borderWidth: 1,
                  marginBottom: 8,
                  color: '#000',
                }}
              >
                <Picker.Item label="Alta" value="Alta" />
                <Picker.Item label="Media" value="Media" />
                <Picker.Item label="Baja" value="Baja" />
              </Picker>
          
            </View>

            {/* ✅ Botones */}
            <View style={styles.actions}>
              <Button mode="outlined" onPress={onClose} style={styles.actionButton}>
                Cancelar
              </Button>
              <Button mode="contained" onPress={handleSubmit} style={styles.actionButton}>
                Guardar
              </Button>
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
  select: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 0,
    fontSize: 14,
    height: 50, // Altura realista para móviles
    color: '#000', // ✅ Texto negro
    backgroundColor: '#fff', // ✅ Fondo blanco
    marginBottom: 5,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    height: 18,
    marginBottom: 8,
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
    height: 50,
    textAlignVertical: 'top',
  },


  section: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

});
