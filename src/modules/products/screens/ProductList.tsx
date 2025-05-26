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

import {
  fetchPaginatedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '@/modules/products/services/productService';
import { Product } from '@/types/product';
import ProductModal from '@/modules/products/screens/ProductModal';
import DashboardLayout from '@/modules/layouts/template';
import React, { useEffect, useState } from 'react';
import { BASE_IMAGE_URL } from '@/config/constants';

export default function ProductListScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | undefined>(undefined);

  useEffect(() => {
    loadProducts(1);
  }, []);

  const loadProducts = async (pageToLoad: number) => {
    if (loadingMore || pageToLoad > lastPage) return;

    if (pageToLoad === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const data = await fetchPaginatedProducts(pageToLoad);
      setProducts((prev) => (pageToLoad === 1 ? data.data : [...prev, ...data.data]));
      setPage(data.current_page + 1);
      setLastPage(data.last_page);
    } catch (err) {
      console.error('❌ Error al cargar productos:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleRefresh = async () => {
    await loadProducts(1);
  };

  const openNewProductModal = () => {
    setProductToEdit(undefined);
    setShowModal(true);
  };

  const handleProductSave = async (formData: FormData) => {
    try {
      const isEdit = formData.has('id');
      const id = formData.get('id');

      let response: Product;

      if (!isEdit) {
        response = await createProduct(formData);
        setProducts((prev) => [response, ...prev]);
      } else {
        response = await updateProduct(Number(id), formData);
        setProducts((prev) =>
          prev.map((p) => (p.id === response.id ? response : p))
        );
      }

      setShowModal(false);
    } catch (error) {
      console.error('❌ Error al guardar producto:', error);
    }
  };

  const handleDelete = (productId: number) => {
    Alert.alert('Confirmar', '¿Deseas eliminar este producto?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteProduct(productId);
            await loadProducts(1);
          } catch (err) {
            console.error('❌ Error al eliminar producto:', err);
          }
        },
      },
    ]);
  };

  return (
    <DashboardLayout title="Productos">
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Lista de productos</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#03424E" style={{ flex: 1 }} />
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 80 }}
            onEndReached={() => loadProducts(page)}
            onEndReachedThreshold={0.3}
            ListFooterComponent={
              loadingMore ? <ActivityIndicator size="small" color="#03424E" /> : null
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.transferItem}
                onPress={() => {
                  setProductToEdit(item);
                  setShowModal(true);
                }}
                activeOpacity={0.85}
              >
                <View style={styles.transferRow}>
                  {item.file_1 && (
                    <Image
                      source={{ uri: item.file_1.startsWith('http') ? item.file_1 : BASE_IMAGE_URL + item.file_1 }}
                      style={styles.image}
                    />
                  )}

                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{item.description}</Text>
                    <Text style={styles.email}>{item.brand} - {item.model}</Text>
                    <Text style={styles.email}>Stock: {item.quantity}</Text>
                    {item.created_at && (
                      <Text style={styles.date}>
                        📅 {new Date(item.created_at).toLocaleDateString()}
                      </Text>
                    )}
                  </View>

                  <View style={styles.actions}>
                    <TouchableOpacity
                      onPress={() => {
                        setProductToEdit(item);
                        setShowModal(true);
                      }}
                    >
                      <Text style={styles.actionBtn}>✏️</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleDelete(item.id)}>
                      <Text style={styles.actionBtn}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}

        <TouchableOpacity style={styles.fab} onPress={openNewProductModal}>
          <Text style={styles.fabText}>＋</Text>
        </TouchableOpacity>

        <ProductModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onSaved={handleProductSave}
          productToEdit={productToEdit}
        />
      </SafeAreaView>
    </DashboardLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginTop: 46 },
  transferItem: {
    backgroundColor: '#eeeeee',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  transferRow: {
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
  date: { fontSize: 12, color: '#888', marginTop: 2 },
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
