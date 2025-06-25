import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {
  ActivityIndicator,
  Card,
  FAB,
  IconButton,
  Text,
  Title,
  useTheme,
  Divider,
} from 'react-native-paper';
import { Alert } from 'react-native';
import { LayoutAnimation, Platform, UIManager } from 'react-native';
import DashboardLayout from '../../layouts/template';
import SupportModal from './SupportModal';
import { Support } from '@/types/supports';
import { Option } from '@/types/option';
import {
  fetchPaginatedSupports,
  createSupport,
  updateSupport,
  deleteSupport,
  fetchAreas,
  fetchClients,
  fetchProjects,
  fetchMotivosCita,
  fetchTiposCita,
  fetchDiasEspera,
  fetchInternalStates,
  fetchExternalStates,
  fetchTypes,
} from '@/modules/supports/services/supportService';

export default function SupportListScreen() {
  const [supports, setSupports] = useState<Support[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [supportToEdit, setSupportToEdit] = useState<Support | undefined>(undefined);
  const { colors } = useTheme();

  const [areas, setAreas] = useState<Option[]>([]);
  const [clients, setClients] = useState<Option[]>([]);
  const [projects, setProjects] = useState<Option[]>([]);
  const [motivosCita, setMotivosCita] = useState<Option[]>([]);
  const [tiposCita, setTiposCita] = useState<Option[]>([]);
  const [diasEspera, setDiasEspera] = useState<Option[]>([]);
  const [internalStates, setInternalStates] = useState<Option[]>([]);
  const [externalStates, setExternalStates] = useState<Option[]>([]);
  const [types, setTypes] = useState<Option[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);



  const toggleExpand = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId((prevId) => (prevId === id ? null : id));
  };
  useEffect(() => {
    loadSupports(1);
  }, []);

  const loadSupports = async (pageToLoad: number) => {
    if (loadingMore || pageToLoad > lastPage) return;

    pageToLoad === 1 ? setLoading(true) : setLoadingMore(true);



    try {
      const data = await fetchPaginatedSupports(pageToLoad);
      // 🔎 Imprimir en consola para analizar estructura
      console.log('📦 Supports cargados:', JSON.stringify(data.data, null, 2));
      setSupports(pageToLoad === 1 ? data.data : [...supports, ...data.data]);
      setPage(data.current_page + 1);
      setLastPage(data.last_page);
    } catch (err) {
      console.error('❌ Error al cargar soportes:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadSupportOptions = async () => {
    try {
      const [
        areaData,
        clientData,
        projectData,
        motivoData,
        tipoData,
        esperaData,
        internalStateData,
        externalStateData,
        typeData,
      ] = await Promise.all([
        fetchAreas(),
        fetchClients(),
        fetchProjects(),
        fetchMotivosCita(),
        fetchTiposCita(),
        fetchDiasEspera(),
        fetchInternalStates(),
        fetchExternalStates(),
        fetchTypes(),
      ]);
      setAreas(areaData);
      setClients(clientData);
      setProjects(projectData);
      setMotivosCita(motivoData);
      setTiposCita(tipoData);
      setDiasEspera(esperaData);
      setInternalStates(internalStateData);
      setExternalStates(externalStateData);
      setTypes(typeData);
    } catch (err) {
      console.error('❌ Error al cargar opciones:', err);
    }
  };

  const openNewSupportModal = async () => {
    await loadSupportOptions();
    setSupportToEdit(undefined);
    setShowModal(true);
  };

  const handleSupportSave = async (formData: FormData) => {
    try {
      const isEdit = formData.has('id');
      const id = formData.get('id');

      if (!isEdit) {
        await createSupport(formData);
      } else {
        await updateSupport(Number(id), formData);
      }

      await loadSupports(1);
    } catch (error) {
      console.error('❌ Error al guardar soporte:', error);
    }
  };

  //  const handleDelete = (supportId: number) => {
  //   Alert.alert(
  //     '¿Eliminar soporte?',
  //     'Esta acción no se puede deshacer. ¿Estás seguro?',
  //     [
  //       { text: 'Cancelar', style: 'cancel' },
  //       {
  //         text: 'Eliminar',
  //         style: 'destructive',
  //         onPress: async () => {
  //           try {
  //             await deleteSupport(supportId);
  //             await loadSupports(1);
  //           } catch (error) {
  //             console.error('❌ Error al eliminar soporte:', error);
  //           }
  //         },
  //       },
  //     ],
  //     { cancelable: true }
  //   );
  // };


  const renderSupport = ({ item }: { item: Support }) => (
    <Card style={styles.card} mode="outlined">
      <Card.Title
      title={'📝 Ticket #' + String(item.details[0].id).padStart(4, '0')}

        subtitle={`Estado global: ${item.status_global}`}
        right={() => (
          <View style={{ flexDirection: 'row' }}>
            <IconButton
              icon="pencil"
              onPress={async () => {
                await loadSupportOptions();
                setSupportToEdit(item);
                setShowModal(true);
              }}
            />
            {/* <IconButton icon="delete" onPress={() => handleDelete(item.id)} /> */}
          </View>
        )}
      />
      <Card.Content>
        <SectionTitle title="Cliente" />
        {item.client?.Razon_Social && (
          <Text variant="labelSmall">🏢 {item.client.Razon_Social}</Text>
        )}
        {item.client?.dni && (
          <Text variant="labelSmall">🆔 DNI/CE: {item.client.dni}</Text>
        )}
{item.client?.email && (
          <Text variant="labelSmall">Email: {item.client.email}</Text>
        )}
        <View style={{ alignItems: 'flex-end', marginTop: 0 }}>
          <IconButton
            icon={expandedId === item.id ? 'chevron-up' : 'chevron-down'}
            onPress={() => toggleExpand(item.id)}
          />
        </View>

        {expandedId === item.id && (
          <>
            <Divider style={styles.divider} />
            <SectionTitle title="Detalles de atención" />
            {item.details?.map((detail, index) => (
              <View key={detail.id}>
                <Text variant="labelSmall">🧾 Detalle #{index + 1}</Text>
                <Text variant="labelSmall">🔹 Asunto: {detail.subject}</Text>
                <Text variant="labelSmall">🧩 Tipo: {detail.type}</Text>
                <Text variant="labelSmall">📍 Área: {detail.area?.descripcion}</Text>
                <Text variant="labelSmall">🏗 Proyecto: {detail.project?.descripcion}</Text>
                <Text variant="labelSmall">⚙ Estado: {detail.status}</Text>
                <Text variant="labelSmall">🎯 Prioridad: {detail.priority}</Text>
                <Text variant="labelSmall">📦 Manzana: {detail.Manzana}</Text>
                <Text variant="labelSmall">📦 Lote: {detail.Lote}</Text>
                <Text variant="labelSmall">📅 Reserva: {detail.reservation_time ?? '-'}</Text>
                <Text variant="labelSmall">📅 Atendido: {detail.attended_at ?? '-'}</Text>
                <Divider style={styles.divider} />
              </View>
            ))}
          </>
        )}
      </Card.Content>

    </Card>
  );


  function SectionTitle({ title }: { title: string }) {
    return <Text style={styles.sectionTitle}>{title}</Text>;
  }

  return (
    <DashboardLayout title="Solicitudes">
      <View style={styles.wrapper}>
        <SafeAreaView style={styles.container}>
          <Title style={styles.title}>Solicitudes</Title>

          {loading ? (
            <ActivityIndicator animating={true} size="large" color={colors.primary} />
          ) : (
            <FlatList
              data={supports}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderSupport}
              contentContainerStyle={{ paddingBottom: 150 }}
              onEndReached={() => loadSupports(page)}
              onEndReachedThreshold={0.3}
              ListFooterComponent={
                loadingMore ? <ActivityIndicator size="small" color={colors.primary} /> : null
              }
            />
          )}
        </SafeAreaView>

        {!showModal && (
          <FAB
            icon="plus"
            style={styles.fab}
            onPress={openNewSupportModal}
            color="#fff"
          />
        )}

        <SupportModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onSaved={handleSupportSave}
          supportToEdit={supportToEdit}
          areas={areas}
          clients={clients}
          projects={projects}
          motivosCita={motivosCita}
          tiposCita={tiposCita}
          diasEspera={diasEspera}
          internalStates={internalStates}
          externalStates={externalStates}
          types={types}
        />
      </View>
    </DashboardLayout>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 22,
    marginBottom: 0,
  },
  card: {
    marginBottom: 5,
    marginHorizontal: 5,
  },
  sectionTitle: {
    marginTop: 12,
    fontWeight: 'bold',
    fontSize: 14,
    color: '#444',
  },
  divider: {
    marginVertical: 8,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#6200ee',
    zIndex: 9999,
    elevation: 6,
  },
});
