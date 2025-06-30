import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, IconButton } from 'react-native-paper';

interface Props {
  onSearch: (query: string) => void;
}

export default function SupportSearchBar({ onSearch }: Props) {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    const trimmed = query.trim();
    console.log('🧪 Buscando con:', trimmed);
    if (trimmed !== '') {
      onSearch(trimmed);
    } else {
      console.log('⚠️ Entrada vacía, no se busca');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        mode="outlined"
        placeholder="Buscar por DNI, Razón Social o TK-0001"
        value={query}
        onChangeText={(text) => {
          console.log('⌨️ Escribiendo:', text);
          setQuery(text);
        }}
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
