import { $authHost } from "./index";
import type { Product } from "./productAPI";

export interface BasketItem {
  id: number;
  userId: number;
  productId: number;
  selectedColorId?: number;
  selectedSizeId?: number;
  createdAt: string;
  updatedAt: string;
  product: Product;
  selectedColor?: {
    id: number;
    name: string;
    hexCode?: string;
  };
  selectedSize?: {
    id: number;
    name: string;
  };
}

export interface BasketResponse {
  items: BasketItem[];
  summary: {
    itemsCount: number;
    totalKZT: number;
    totalUSD: number;
  };
}

export interface BasketCountResponse {
  count: number;
}

export interface BasketCheckResponse {
  inBasket: boolean;
  item: BasketItem | null;
}

// Получение корзины пользователя
export const fetchBasket = async (): Promise<BasketResponse> => {
  const { data } = await $authHost.get('api/basket');
  return data;
};

// Получение количества товаров в корзине
export const fetchBasketCount = async (): Promise<BasketCountResponse> => {
  const { data } = await $authHost.get('api/basket/count');
  return data;
};

// Проверка, находится ли товар в корзине
export const checkProductInBasket = async (productId: number): Promise<BasketCheckResponse> => {
  const { data } = await $authHost.get(`api/basket/check/${productId}`);
  return data;
};

// Добавление товара в корзину
export const addToBasket = async (
  productId: number, 
  selectedColorId?: number, 
  selectedSizeId?: number
): Promise<{ message: string; item: BasketItem }> => {
  const { data } = await $authHost.post('api/basket/add', { 
    productId, 
    selectedColorId, 
    selectedSizeId 
  });
  return data;
};

// Удаление товара из корзины
export const removeFromBasket = async (basketItemId: number): Promise<{ message: string }> => {
  const { data } = await $authHost.delete(`api/basket/remove/${basketItemId}`);
  return data;
};

// Очистка корзины
export const clearBasket = async (): Promise<{ message: string; deletedItems: number }> => {
  const { data } = await $authHost.delete('api/basket/clear');
  return data;
};