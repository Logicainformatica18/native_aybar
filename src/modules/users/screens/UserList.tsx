import React, { useEffect, useState } from 'react';
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
import { fetchPaginatedUsers, createUser, updateUser, deleteUser } from '../services/authService';
import { User } from 'src/types/user';
import UserModal from './UserModal';
import DashboardLayout from '../../layouts/template';
import { BASE_IMAGE_URL } from '@/config/constants';

export default function UserListScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | undefined>(undefined);

  const availableRoles = [{ name: 'admin' }, { name: 'editor' }, { name: 'viewer' }];

  useEffect(() => {
    loadUsers(1);
  }, []);

  const loadUsers = async (pageToLoad: number) => {
    if (loadingMore || pageToLoad > lastPage) return;

    if (pageToLoad === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const data = await fetchPaginatedUsers(pageToLoad);
      if (pageToLoad === 1) {
        setUsers(data.data);
      } else {
        setUsers(prev => [...prev, ...data.data]);
      }
      setPage(data.current_page + 1);
      setLastPage(data.last_page);
    } catch (err) {
      console.error('❌ Error al cargar usuarios:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const openNewUserModal = () => {
    setUserToEdit(undefined);
    setShowModal(true);
  };

  const handleUserSave = async (formData: FormData) => {
    try {
      const isEdit = formData.has('id');
      const id = formData.get('id');

      if (!isEdit) {
        await createUser(formData);
      } else {
        await updateUser(Number(id), formData);
      }

      await loadUsers(1);
    } catch (error) {
      console.error('❌ Error al guardar usuario:', error);
    }
  };

  const handleDelete = (userId: number) => {
    Alert.alert('Confirmar', '¿Deseas eliminar este usuario?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteUser(userId);
            await loadUsers(1);
          } catch (err) {
            console.error('❌ Error al eliminar usuario:', err);
          }
        },
      },
    ]);
  };

  return (
    <DashboardLayout title="App Cargos">
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Usuarios</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#F49A1A" style={{ flex: 1 }} />
        ) : (
          <FlatList
            data={users}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 80 }}
            renderItem={({ item }) => (
              <View style={styles.userItem}>
                <View style={styles.userRow}>
                  {item.photo && (
                    <Image
                      source={{ uri: item.photo.startsWith('http') ? item.photo : BASE_IMAGE_URL + item.photo }}
                      style={styles.avatar}
                    />
                  )}

                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{item.id} {item.names}</Text>
                    <Text style={styles.email}>- {item.email}</Text>
                    {/* {item.role && <Text style={[styles.role, styles[`role_${item.role}`]]}>{item.role}</Text>} */}
                    {item.created_at && (
                      <Text style={styles.date}>
                        📅 {new Date(item.created_at).toLocaleDateString()}
                      </Text>
                    )}
                  </View>

                  <View style={styles.actions}>
                    <TouchableOpacity onPress={() => {
                      setUserToEdit(item);
                      setShowModal(true);
                    }}>
                      <Text style={styles.actionBtn}>✏️</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleDelete(item.id)}>
                      <Text style={styles.actionBtn}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
            onEndReached={() => loadUsers(page)}
            onEndReachedThreshold={0.3}
            ListFooterComponent={
              loadingMore ? <ActivityIndicator size="small" color="#F49A1A" /> : null
            }
          />
        )}

        <TouchableOpacity style={styles.fab} onPress={openNewUserModal}>
          <Text style={styles.fabText}>＋</Text>
        </TouchableOpacity>

        <UserModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onSaved={handleUserSave}
          userToEdit={userToEdit}
          availableRoles={availableRoles}
        />
      </SafeAreaView>
    </DashboardLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginTop: 46 },
  userItem: {
    backgroundColor: '#eeeeee',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: '#ccc',
  },
  name: { fontSize: 16, fontWeight: '600' },
  email: { fontSize: 14, color: '#555' },
  date: { fontSize: 12, color: '#888', marginTop: 2 },
  role: {
    fontSize: 12,
    marginTop: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
    color: 'white',
    overflow: 'hidden',
  },
  role_admin: { backgroundColor: '#E53935' },
  role_editor: { backgroundColor: '#F9A825' },
  role_viewer: { backgroundColor: '#43A047' },
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
