import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, IconButton } from 'react-native-paper';

interface Props {
  onSearch: (query: string) => void;
  onClear?: () => void; // ✅ opcional, para recargar todo si query está vacío
}

export default function SupportSearchBar({ onSearch, onClear }: Props) {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    const trimmed = query.trim();
    console.log('🧪 Buscando con:', trimmed);
    if (trimmed !== '') {
      onSearch(trimmed);
    } else {
      console.log('⚠️ Entrada vacía, no se busca');
      onClear?.(); // ✅ al presionar buscar con vacío, también puedes recargar
    }
  };

  const handleChangeText = (text: string) => {
    console.log('⌨️ Escribiendo:', text);
    setQuery(text);

    if (text.trim() === '') {
      onClear?.(); // ✅ si se vacía el input, recarga la lista
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        mode="outlined"
        placeholder="Buscar por DNI, Razón Social o TK-0001"
        value={query}
        onChangeText={handleChangeText}
        style={styles.input}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
      />
      <IconButton icon="magnify" onPress={handleSearch} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  input: {
    flex: 1,
    marginRight: 5,
  },
});
