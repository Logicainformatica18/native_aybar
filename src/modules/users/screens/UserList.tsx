import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { getUsers, createUser, updateUser } from '../services/userService'; // ← nuevo import


import { User } from '../types';
import UserModal from '../UserModal';

export default function UserListScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | undefined>(undefined);

  const availableRoles = [{ name: 'admin' }, { name: 'editor' }, { name: 'viewer' }]; // temporal

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch((err) => console.error('❌ Error al cargar usuarios:', err))
      .finally(() => setLoading(false));
  }, []);

  const openNewUserModal = () => {
    setUserToEdit(undefined);
    setShowModal(true);
  };

 const handleUserSave = async (user: Partial<User>) => {
  try {
    let savedUser = {} as User;
    if (user.id) {
      savedUser = await updateUser(user.id, user);
      setUsers((prev) =>
        prev.map((u) => (u.id === savedUser.id ? savedUser : u))
      );
    } else {
      savedUser = await createUser(user);
      setUsers((prev) => [...prev, savedUser]);
    }
  } catch (error) {
    console.error('❌ Error al guardar usuario:', error);
  }
};


  if (loading) {
    return <ActivityIndicator size="large" color="#F49A1A" />;
  }

  return (
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
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
