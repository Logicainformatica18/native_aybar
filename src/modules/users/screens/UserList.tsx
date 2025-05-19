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
} from 'react-native';
import { getUsers, createUser, updateUser, deleteUser } from '../services/userService';
import { User } from '../types';
import UserModal from '../UserModal';
import DashboardLayout from '../../layouts/template';

export default function UserListScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | undefined>(undefined);

  const availableRoles = [{ name: 'admin' }, { name: 'editor' }, { name: 'viewer' }];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error('❌ Error al cargar usuarios:', err);
    } finally {
      setLoading(false);
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
        const createdUser = await createUser(formData);
        setUsers((prev) => [...prev, createdUser]);
      } else {
        const updatedUser = await updateUser(Number(id), formData);
        setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
      }
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
            setUsers((prev) => prev.filter((u) => u.id !== userId));
          } catch (err) {
            console.error('❌ Error al eliminar usuario:', err);
          }
        },
      },
    ]);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#F49A1A" style={{ flex: 1 }} />;
  }

  return (
      <DashboardLayout title="App Cargos">
      
 
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Usuarios</Text>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userItem}
            onPress={() => {
              setUserToEdit(item);
              setShowModal(true);
            }}
            onLongPress={() => handleDelete(item.id)}
          >
            <Text style={styles.name}>{item.names}</Text>
            <Text style={styles.email}>{item.email}</Text>
          </TouchableOpacity>
        )}
      />

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
    padding: 12,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginBottom: 10,
  },
  name: { fontSize: 16, fontWeight: '600' },
  email: { fontSize: 14, color: '#555' },
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
