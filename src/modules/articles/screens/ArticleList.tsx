import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/types/navigation';
import { BASE_IMAGE_URL } from '@/config/constants';
import { fetchArticlesByTransfer, createArticle } from '@/modules/articles/services/articleServices';
import { Article } from '@/types/article';
import ArticleModal from './ArticleModal'; // Asegúrate que esta ruta sea correcta

export default function ArticleList() {
  const route = useRoute<RouteProp<RootStackParamList, 'ArticleList'>>();
  const { transferId } = route.params;
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [articleToEdit, setArticleToEdit] = useState<Article | undefined>(undefined);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const data = await fetchArticlesByTransfer(transferId);
      setArticles(data.data);
    } catch (error: any) {
      console.error('❌ Error al cargar artículos:', error?.response?.data || error.message || error);
      Alert.alert('Error', 'No se pudieron cargar los artículos.');
    } finally {
      setLoading(false);
    }
  };

  const handleArticleSave = async (formData: FormData) => {
    try {
      formData.append('transfer_id', String(transferId));
      const newArticle = await createArticle(formData);
      setArticles(prev => [newArticle, ...prev]);
    } catch (err) {
      Alert.alert('Error', 'No se pudo guardar el artículo.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#03424E" style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 80 }}
          renderItem={({ item }) => (
            <View style={styles.articleItem}>
              {item.file_1 && (
                <Image
                  source={{ uri: item.file_1.startsWith('http') ? item.file_1 : BASE_IMAGE_URL + item.file_1 }}
                  style={styles.image}
                />
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.title}</Text>
                <Text style={styles.email}>Cantidad: {item.quanty}</Text>
                <Text style={styles.email}>Estado: {item.state}</Text>
              </View>
            </View>
          )}
        />
      )}

      {/* Botón flotante */}
      <TouchableOpacity style={styles.fab} onPress={() => {
        setArticleToEdit(undefined);
        setShowModal(true);
      }}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>

      {/* Modal de creación */}
      <ArticleModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSaved={handleArticleSave}
        articleToEdit={articleToEdit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  articleItem: {
    backgroundColor: '#eeeeee',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
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
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#03424E',
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
