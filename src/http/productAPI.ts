import { $host } from "./index";

export interface ProductFilters {
  gender?: 'MAN' | 'WOMAN';
  size?: string;
  color?: string;
  status?: 'AVAILABLE' | 'SOLD' | 'DELETED';
  clothingTypeId?: number;
  collectionId?: number;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export interface ProductResponse {
  products: Product[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface Product {
  id: number;
  name: string;
  priceKZT: number;
  priceUSD: number;
  description?: string;
  ingredients?: string;
  gender: 'MAN' | 'WOMAN';
  status: 'AVAILABLE' | 'SOLD' | 'DELETED';
  clothingTypeId?: number;
  collectionId?: number;
  createdAt: string;
  updatedAt: string;
  clothingType?: ClothingType;
  collection?: Collection;
  mediaFiles?: MediaFile[];
  sizes?: Size[];
  colors?: Color[];
}

export interface ClothingType {
  id: number;
  name: string;
}

export interface Collection {
  id: number;
  name: string;
  description?: string;
}

export interface MediaFile {
  id: number;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  mediaType: 'IMAGE' | 'VIDEO';
  url: string;
  entityType: string;
  entityId: number;
  userId?: number;
}

export interface Size {
  id: number;
  name: string;
}

export interface Color {
  id: number;
  name: string;
  hexCode?: string;
}

// Получение списка товаров с фильтрацией
export const fetchProducts = async (filters: ProductFilters = {}): Promise<ProductResponse> => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });

  const { data } = await $host.get(`api/product?${params.toString()}`);
  return data;
};

// Получение одного товара
export const fetchProduct = async (id: number): Promise<Product> => {
  const { data } = await $host.get(`api/product/${id}`);
  return data;
};

// Получение размеров
export const fetchSizes = async (): Promise<Size[]> => {
  const { data } = await $host.get('api/size');
  return data;
};

// Получение цветов
export const fetchColors = async (): Promise<Color[]> => {
  const { data } = await $host.get('api/color');
  return data;
};

// Получение типов одежды
export const fetchClothingTypes = async (): Promise<ClothingType[]> => {
  const { data } = await $host.get('api/clothing-type');
  return data;
};
