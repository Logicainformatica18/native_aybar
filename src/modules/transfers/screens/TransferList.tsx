import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';

import {
  fetchPaginatedTransfers,
  createTransfer,
  updateTransfer,
  deleteTransfer,
} from '@/modules/transfers/services/transferService';
import { Transfer } from '@/types/transfer';
import TransferModal from '@/modules/transfers/screens/TransferModal';
import DashboardLayout from '@/modules/layouts/template';
import React, { useEffect, useState } from 'react';
import { BASE_IMAGE_URL } from '@/config/constants';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';


type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ArticleList'>;



export default function TransferListScreen() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [transferToEdit, setTransferToEdit] = useState<Transfer | undefined>(undefined);
  const navigation = useNavigation<NavigationProp>();



  useEffect(() => {
    loadTransfers(1);
  }, []);

  const loadTransfers = async (pageToLoad: number) => {
    if (loadingMore || pageToLoad > lastPage) return;

    if (pageToLoad === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const data = await fetchPaginatedTransfers(pageToLoad);
      setTransfers((prev) => (pageToLoad === 1 ? data.data : [...prev, ...data.data]));
      setPage(data.current_page + 1);
      setLastPage(data.last_page);
    } catch (err) {
      console.error('❌ Error al cargar transfers:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleRefresh = async () => {
    await loadTransfers(1);
  };

  const openNewTransferModal = () => {
    setTransferToEdit(undefined);
    setShowModal(true);
  };

  const handleTransferSave = async (formData: FormData) => {
    try {
      const isEdit = formData.has('id');
      const id = formData.get('id');

      let response: Transfer;

      if (!isEdit) {
        response = await createTransfer(formData);
        setTransfers((prev) => [response, ...prev]);
      } else {
        response = await updateTransfer(Number(id), formData);
        setTransfers((prev) =>
          prev.map((t) => (t.id === response.id ? response : t))
        );
      }

      setShowModal(false);
    } catch (error) {
      console.error('❌ Error al guardar transferencia:', error);
    }
  };

  const handleDelete = (transferId: number) => {
    Alert.alert('Confirmar', '¿Deseas eliminar esta transferencia?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteTransfer(transferId);
            await loadTransfers(1);
          } catch (err) {
            console.error('❌ Error al eliminar transferencia:', err);
          }
        },
      },
    ]);
  };

  return (
    <DashboardLayout title="Transferencias">
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Lista de transferencias</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#F49A1A" style={{ flex: 1 }} />
        ) : (
          <FlatList
            data={transfers}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 80 }}
            onEndReached={() => loadTransfers(page)}
            onEndReachedThreshold={0.3}
            ListFooterComponent={
              loadingMore ? <ActivityIndicator size="small" color="#F49A1A" /> : null
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.transferItem}
                onPress={() => {
                  setTransferToEdit(item);
                  setShowModal(true);
                }}
                activeOpacity={0.85}
              >
                <View style={styles.transferRow}>
                  {item.file_1 && (
                    <Image
                      source={{ uri: item.file_1.startsWith('http') ? item.file_1 : BASE_IMAGE_URL + item.file_1 }}
                      style={styles.image}
                    />
                  )}

                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{item.description}</Text>
                    <Text style={styles.email}>De: {item.sender_email}</Text>
                    <Text style={styles.email}>Para: {item.receiver_email}</Text>
                    {item.created_at && (
                      <Text style={styles.date}>
                        📅 {new Date(item.created_at).toLocaleDateString()}
                      </Text>
                    )}
                  </View>

                  <View style={styles.actions}>
                    <TouchableOpacity
                      onPress={() => {
                        setTransferToEdit(item);
                        setShowModal(true);
                      }}
                    >
                      <Text style={styles.actionBtn}>✏️</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleDelete(item.id)}>
                      <Text style={styles.actionBtn}>🗑️</Text>
                    </TouchableOpacity>


                    <TouchableOpacity

                      onPress={() => {
                        // Aquí navegas al módulo de artículos, pasando el transfer_id
                        // Asegúrate de tener configurado el stack navigator
                        navigation.navigate('ArticleList', { transferId: item.id });
                      }}
                    >
                      <Text style={[styles.actionBtn, { color: '#F49A1A' }]}>📦</Text>
                    </TouchableOpacity>


                  </View>
                </View>
              </TouchableOpacity>


            )}
          />
        )}

        <TouchableOpacity style={styles.fab} onPress={openNewTransferModal}>
          <Text style={styles.fabText}>＋</Text>
        </TouchableOpacity>

        <TransferModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onSaved={handleTransferSave}
          transferToEdit={transferToEdit}
        />
      </SafeAreaView>
    </DashboardLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginTop: 46 },
  transferItem: {
    backgroundColor: '#eeeeee',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  transferRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 6,
    marginRight: 10,
    backgroundColor: '#ccc',
  },
  name: { fontSize: 16, fontWeight: '600' },
  email: { fontSize: 14, color: '#555' },
  date: { fontSize: 12, color: '#888', marginTop: 2 },
  actions: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  actionBtn: {
    fontSize: 18,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#F49A1A',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  fabText: {
    color: '#fff',
    fontSize: 30,
    lineHeight: 30,
  },
});
