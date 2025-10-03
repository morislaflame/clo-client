import type { Product } from '@/http/productAPI';

// Общий тип для элемента корзины (и локальной, и серверной)
export interface BaseBasketItem {
  productId: number;
  selectedColorId?: number;
  selectedSizeId?: number;
  quantity: number;
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

// Локальный элемент корзины (для гостей)
export interface LocalBasketItem extends BaseBasketItem {
  // Локальные элементы не имеют id, userId, дат
}

