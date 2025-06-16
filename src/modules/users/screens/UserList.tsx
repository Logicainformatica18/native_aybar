import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import {
  ActivityIndicator,
  Avatar,
  Card,
  FAB,
  IconButton,
  Text,
  Title,
  useTheme
} from 'react-native-paper';

import { fetchPaginatedUsers, createUser, updateUser, deleteUser } from '../services/authService';
import { User } from 'src/types/user';
import UserModal from './UserModal';
import DashboardLayout from '../../layouts/template';
import { BASE_IMAGE_URL_USER } from '@/config/constants';


export default function UserListScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | undefined>(undefined);
  const { colors } = useTheme();

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

  const handleDelete = async (userId: number) => {
    // En producción puedes usar Dialog.confirm
    await deleteUser(userId);
    await loadUsers(1);
  };

  const renderUser = ({ item }: { item: User }) => (
    <Card style={styles.card} mode="outlined">
      <Card.Title
        title={`${item.names}`}
        subtitle={item.email}
        left={() =>
          item.photo ? (
            <Avatar.Image
              size={48}
              source={{ uri: item.photo.startsWith('http') ? item.photo : BASE_IMAGE_URL_USER + item.photo }}
            />
          ) : (
            <Avatar.Icon size={48} icon="account" />
          )
        }
        right={() => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <IconButton
              icon="pencil"
              onPress={() => {
                setUserToEdit(item);
                setShowModal(true);
              }}
            />
            <IconButton icon="delete" onPress={() => handleDelete(item.id)} />
          </View>
        )}
      />
      <Card.Content>
        <Text variant="labelSmall">📅 {new Date(item.created_at).toLocaleDateString()}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <DashboardLayout title="App Cargos">
      <SafeAreaView style={styles.container}>
        <Title style={styles.title}>Usuarios</Title>

        {loading ? (
          <ActivityIndicator animating={true} size="large" color={colors.primary} />
        ) : (
          <FlatList
            data={users}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderUser}
            contentContainerStyle={{ paddingBottom: 100 }}
            onEndReached={() => loadUsers(page)}
            onEndReachedThreshold={0.3}
            ListFooterComponent={
              loadingMore ? <ActivityIndicator size="small" color={colors.primary} /> : null
            }
          />
        )}

        <FAB
          icon="plus"
          style={styles.fab}
          onPress={openNewUserModal}
          color="#fff"
        />

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
  title: { fontSize: 22, marginBottom: 10 },
  card: { marginBottom: 12 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#6200ee',
  },
});
