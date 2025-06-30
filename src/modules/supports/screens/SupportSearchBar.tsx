import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, IconButton } from 'react-native-paper';

interface Props {
  onSearch: (query: string) => void;
}

export default function SupportSearchBar({ onSearch }: Props) {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (query.trim() !== '') {
      onSearch(query.trim());
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        mode="outlined"
        placeholder="Buscar por DNI, Razon Social o TK-0001"
        value={query}
        onChangeText={setQuery}
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
