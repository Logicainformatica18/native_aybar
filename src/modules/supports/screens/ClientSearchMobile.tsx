import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import axios from '@/config/axios';

interface Client {
  id: number;
  dni: string;
  names: string;
  cellphone: string;
  email: string;
  address: string;
}

interface Props {
  onClientSelected: (client: Client) => void;
}

const ClientSearchMobile: React.FC<Props> = ({ onClientSelected }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Client[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null); // ⏱️ para controlar el debounce

  const fetchClients = async (text: string) => {
    if (text.length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    try {
      const response = await axios.get(`/clients/search?q=${text}`);
      setResults(response.data);
      setShowDropdown(true);
    } catch (err) {
      console.error('❌ Error al buscar clientes:', err);
      setShowDropdown(false);
    }
  };

  const handleChangeText = (text: string) => {
    setQuery(text);

    // Limpiar el anterior timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Esperar 500ms antes de hacer la búsqueda
    debounceRef.current = setTimeout(() => {
      fetchClients(text);
    }, 500);
  };

  const handleSelect = (client: Client) => {
    setQuery(client.names);
    setShowDropdown(false);
    onClientSelected(client);
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>Cliente</Text>
      <TextInput
        value={query}
        onChangeText={handleChangeText}
        placeholder="Buscar cliente por nombre o DNI"
        style={styles.input}
      />

      {showDropdown && results.length > 0 && (
        <View style={styles.dropdownContainer}>
          {results.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleSelect(item)}
              style={styles.dropdownItem}
            >
              <Text style={styles.dropdownItemText}>
                {item.names} ({item.dni})
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default ClientSearchMobile;


const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
    zIndex: 100, // importante si usas dentro de modales o formularios
  },
  label: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#fff',
    fontSize: 14,
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginTop: 4,
    maxHeight: 300,
    overflow: 'scroll',
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#333',
  },
});
