import { makeAutoObservable, runInAction } from "mobx";
import type { 
  BasketItem, 
  BasketResponse, 
  BasketCountResponse,
  BasketCheckResponse 
} from "../http/basketAPI";
import { 
  fetchBasket, 
  fetchBasketCount, 
  checkProductInBasket, 
  addToBasket, 
  removeFromBasket, 
  clearBasket 
} from "../http/basketAPI";

interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
  code?: string;
}

export default class BasketStore {
  // Состояние корзины
  items: BasketItem[] = [];
  totalCount = 0;
  totalKZT = 0;
  totalUSD = 0;
  
  // Состояние загрузки
  loading = false;
  adding = false;
  removing = false;
  error: string | null = null;
  
  // Кэш проверок товаров в корзине
  productInBasketCache: Map<string, boolean> = new Map();

  constructor() {
    makeAutoObservable(this);
  }

  // Setters
  setItems(items: BasketItem[]) {
    this.items = items;
  }

  setSummary(itemsCount: number, totalKZT: number, totalUSD: number) {
    this.totalCount = itemsCount;
    this.totalKZT = totalKZT;
    this.totalUSD = totalUSD;
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setAdding(adding: boolean) {
    this.adding = adding;
  }

  setRemoving(removing: boolean) {
    this.removing = removing;
  }

  setError(error: string | null) {
    this.error = error;
  }

  setProductInBasketCache(cacheKey: string, inBasket: boolean) {
    this.productInBasketCache.set(cacheKey, inBasket);
  }

  // Actions
  async loadBasket() {
    try {
      this.setLoading(true);
      this.setError(null);
      
      const response: BasketResponse = await fetchBasket();
      
      runInAction(() => {
        this.setItems(response.items);
        this.setSummary(
          response.summary.itemsCount,
          response.summary.totalKZT,
          response.summary.totalUSD
        );
        this.setLoading(false);
      });

      return response;
    } catch (error: unknown) {
      console.error("Error loading basket:", error);
      
      runInAction(() => {
        this.setError('Ошибка загрузки корзины');
        this.setLoading(false);
      });
      
      throw error;
    }
  }

  async loadBasketCount() {
    try {
      const response: BasketCountResponse = await fetchBasketCount();
      
      runInAction(() => {
        this.totalCount = response.count;
      });

      return response.count;
    } catch (error: unknown) {
      console.error("Error loading basket count:", error);
      throw error;
    }
  }

  async checkProductInBasket(productId: number, selectedColorId?: number, selectedSizeId?: number): Promise<boolean> {
    try {
      // Создаем уникальный ключ для кэша, включая характеристики
      const cacheKey = `${productId}-${selectedColorId || 'no-color'}-${selectedSizeId || 'no-size'}`;
      
      // Проверяем кэш
      if (this.productInBasketCache.has(cacheKey)) {
        return this.productInBasketCache.get(cacheKey)!;
      }

      // Проверяем в локальной корзине
      const existingItem = this.items.find(item => 
        item.productId === productId &&
        item.selectedColorId === selectedColorId &&
        item.selectedSizeId === selectedSizeId
      );

      if (existingItem) {
        runInAction(() => {
          this.setProductInBasketCache(cacheKey, true);
        });
        return true;
      }

      // Если не найдено локально, проверяем на сервере
      const response: BasketCheckResponse = await checkProductInBasket(productId);
      
      runInAction(() => {
        this.setProductInBasketCache(cacheKey, response.inBasket);
      });

      return response.inBasket;
    } catch (error: unknown) {
      console.error("Error checking product in basket:", error);
      return false;
    }
  }

  async addProductToBasket(productId: number, selectedColorId?: number, selectedSizeId?: number) {
    try {
      this.setAdding(true);
      this.setError(null);
      
      const response = await addToBasket(productId, selectedColorId, selectedSizeId);
      
      runInAction(() => {
        // Добавляем товар в корзину
        this.items.push(response.item);
        this.totalCount++;
        this.totalKZT += response.item.product.priceKZT;
        this.totalUSD += response.item.product.priceUSD;
        
        // Обновляем кэш с учетом характеристик
        const cacheKey = `${productId}-${selectedColorId || 'no-color'}-${selectedSizeId || 'no-size'}`;
        this.setProductInBasketCache(cacheKey, true);
        
        this.setAdding(false);
      });

      return { success: true, message: response.message };
    } catch (error: unknown) {
      console.error("Error adding to basket:", error);
      
      const err = error as ApiError;
      const errorMessage = err.response?.data?.message || 'Ошибка добавления в корзину';
      
      runInAction(() => {
        this.setError(errorMessage);
        this.setAdding(false);
      });
      
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  }

  async removeProductFromBasket(productId: number, selectedColorId?: number, selectedSizeId?: number) {
    try {
      this.setRemoving(true);
      this.setError(null);
      
      // Находим элемент корзины для удаления
      const itemToRemove = this.items.find(item => 
        item.productId === productId &&
        item.selectedColorId === selectedColorId &&
        item.selectedSizeId === selectedSizeId
      );

      if (!itemToRemove) {
        this.setRemoving(false);
        return { success: false, error: 'Товар не найден в корзине' };
      }

      await removeFromBasket(itemToRemove.id);
      
      runInAction(() => {
        // Удаляем товар из корзины
        const itemIndex = this.items.findIndex(item => item.id === itemToRemove.id);
        if (itemIndex !== -1) {
          const item = this.items[itemIndex];
          this.items.splice(itemIndex, 1);
          this.totalCount--;
          this.totalKZT -= item.product.priceKZT;
          this.totalUSD -= item.product.priceUSD;
          
          // Обновляем кэш с учетом характеристик
          const cacheKey = `${productId}-${selectedColorId || 'no-color'}-${selectedSizeId || 'no-size'}`;
          this.setProductInBasketCache(cacheKey, false);
        }
        
        this.setRemoving(false);
      });

      return { success: true, message: 'Товар удален из корзины' };
    } catch (error: unknown) {
      console.error("Error removing from basket:", error);
      
      const err = error as ApiError;
      const errorMessage = err.response?.data?.message || 'Ошибка удаления из корзины';
      
      runInAction(() => {
        this.setError(errorMessage);
        this.setRemoving(false);
      });
      
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  }

  async clearBasket() {
    try {
      this.setLoading(true);
      this.setError(null);
      
      const response = await clearBasket();
      
      runInAction(() => {
        this.setItems([]);
        this.setSummary(0, 0, 0);
        this.productInBasketCache.clear();
        this.setLoading(false);
      });

      return { success: true, message: response.message };
    } catch (error: unknown) {
      console.error("Error clearing basket:", error);
      
      const err = error as ApiError;
      const errorMessage = err.response?.data?.message || 'Ошибка очистки корзины';
      
      runInAction(() => {
        this.setError(errorMessage);
        this.setLoading(false);
      });
      
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  }

  // Вспомогательные методы
  isProductInBasket(productId: number, selectedColorId?: number, selectedSizeId?: number): boolean {
    const cacheKey = `${productId}-${selectedColorId || 'no-color'}-${selectedSizeId || 'no-size'}`;
    return this.productInBasketCache.get(cacheKey) || false;
  }

  getBasketItemByProductId(productId: number, selectedColorId?: number, selectedSizeId?: number): BasketItem | undefined {
    return this.items.find(item => 
      item.productId === productId &&
      item.selectedColorId === selectedColorId &&
      item.selectedSizeId === selectedSizeId
    );
  }

  // Getters
  get isEmpty() {
    return this.items.length === 0;
  }

  get hasItems() {
    return this.items.length > 0;
  }

  get isLoading() {
    return this.loading || this.adding || this.removing;
  }
}