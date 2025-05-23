export interface Article {
  id: number;
  title: string;
  description?: string;
  details?: string;
  quanty: number;
  price?: number;
  code?: string;
  condition?: string;
  state?: string;
  transfer_id: number;
  product_id: number;
  file_1?: string;
  file_2?: string;
  file_3?: string;
  file_4?: string;
  created_at: string;
  updated_at: string;
}
export interface PaginatedArticleResponse {
  data: Article[];
  current_page: number;
  last_page: number;
}
