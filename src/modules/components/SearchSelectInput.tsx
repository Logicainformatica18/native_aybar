import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

interface Option {
  id: number;
  label: string;
}

interface Props {
  value: string;
  onChange: (id: number, label: string) => void;
  fetcher: (query: string) => Promise<Option[]>;
  placeholder?: string;
}

export default function SearchSelectInput({
  value,
  onChange,
  fetcher,
  placeholder = 'Buscar...',
}: Props) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<Option[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.length > 1) {
        fetcher(query)
          .then((data) => setResults(data))
          .catch((err) => console.error('❌ Error en búsqueda:', err));
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSelect = (item: Option) => {
    setQuery(item.label);
    setShowResults(false);
    onChange(item.id, item.label);
  };

  return (
    <View style={styles.wrapper}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          setShowResults(true);
        }}
      />

      {/* FIX para evitar el warning de ScrollView + FlatList */}
      {showResults && results.length > 0 && (
        <View style={styles.dropdownWrapper}>
          <FlatList
            scrollEnabled={false} // ✅ Desactiva scroll del FlatList
            data={results}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.item} onPress={() => handleSelect(item)}>
                <Text>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: 'relative', zIndex: 999 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
  },
  dropdownWrapper: {
    maxHeight: 200,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 2,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});
