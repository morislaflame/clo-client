import { $host } from "./index";

export interface Collection {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  products?: Product[];
  mediaFiles?: MediaFile[];
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
  sizes: Size[];
  colors: Color[];
}

export interface ClothingType {
  id: number;
  name: string;
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

export interface CollectionFilters {
  page?: number;
  limit?: number;
}

export interface CollectionResponse {
  collections: Collection[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

// Получение всех коллекций
export const fetchCollections = async (filters?: CollectionFilters): Promise<CollectionResponse> => {
  const params = new URLSearchParams();
  
  Object.entries(filters || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });

  const { data } = await $host.get(`api/collection?${params.toString()}`);
  return data;
};

// Получение одной коллекции
export const fetchCollection = async (id: number): Promise<Collection> => {
  const { data } = await $host.get(`api/collection/${id}`);
  return data;
};
