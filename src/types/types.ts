import type { MediaFile } from "@/http/productAPI";


export interface UserInfo {
    id: number;
    email: string;
}

export interface Tag {
  id: number;
  name: string;
  color: string;
}

export interface News {
  id: number;
  title: string;
  content: string;
  tags: Tag[];
  mediaFiles: MediaFile[];
  newsType: NewsType;
  createdAt: string;
  updatedAt: string;
  status: string;
  publishedAt: string;
  links: string[];
  description: string;
}

export interface TagResponse {
  tags: Tag[];
  totalPages: number;
  totalCount: number;
}

export interface NewsResponse {
  news: News[];
  totalPages: number;
  totalCount: number;
}

export interface NewsTypeResponse {
  newsTypes: NewsType[];
  totalPages: number;
  totalCount: number;
}

export interface NewsTypeFilters {
  page?: number;
  limit?: number;
  search?: string;
}

export interface NewsFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  newsTypeId?: number;
}

export interface NewsType {
  id: number;
  name: string;
  description: string;
}



// Реэкспорт типов из productAPI для удобства
export type {
  Product,
  ProductFilters,
  ProductResponse,
  ClothingType,
  Collection,
  MediaFile,
  Size,
  Color
} from '../http/productAPI';