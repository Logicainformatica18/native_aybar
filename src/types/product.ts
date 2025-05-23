// products/types/Product.ts

export interface Product {
  id: number;
  code?: string;              // Código interno o patrimonial
  sku?: string;               // SKU del producto
  description: string;        // Nombre del producto (ej. "Monitor LG 24”")
  detail?: string;            // Detalles adicionales
  brand?: string;             // Marca del producto
  model?: string;             // Modelo
  serial_number?: string;     // Número de serie
  condition?: string;         // Estado físico (Nuevo, Usado, Reparado)
  state?: string;             // Estado lógico en sistema (Disponible, Asignado, etc.)
  quantity?: number;          // Stock disponible
  price?: number;             // Precio referencial
  location?: string;          // Ubicación física (ej. Estante A)
  file_1?: string;            // Imagen o archivo adjunto
  created_at?: string;
  updated_at?: string;
}
