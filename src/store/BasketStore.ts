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
  updateBasketItemQuantity,
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
  updating = false;
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

  setUpdating(updating: boolean) {
    this.updating = updating;
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
        // Проверяем, есть ли уже такой товар в корзине
        const existingItemIndex = this.items.findIndex(item => 
          item.productId === productId &&
          item.selectedColorId === selectedColorId &&
          item.selectedSizeId === selectedSizeId
        );

        if (existingItemIndex !== -1) {
          // Если товар уже есть, обновляем его количество
          const existingItem = this.items[existingItemIndex];
          const oldQuantity = existingItem.quantity;
          const newQuantity = response.item.quantity;
          
          this.items[existingItemIndex] = response.item;
          this.totalCount += (newQuantity - oldQuantity);
          this.totalKZT += response.item.product.priceKZT * (newQuantity - oldQuantity);
          this.totalUSD += response.item.product.priceUSD * (newQuantity - oldQuantity);
        } else {
          // Если товара нет, добавляем новый
          this.items.push(response.item);
          this.totalCount += response.item.quantity;
          this.totalKZT += response.item.product.priceKZT * response.item.quantity;
          this.totalUSD += response.item.product.priceUSD * response.item.quantity;
        }
        
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
          this.totalCount -= item.quantity;
          this.totalKZT -= item.product.priceKZT * item.quantity;
          this.totalUSD -= item.product.priceUSD * item.quantity;
          
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

  async updateItemQuantity(basketItemId: number, quantity: number) {
    try {
      this.setUpdating(true);
      this.setError(null);
      
      const response = await updateBasketItemQuantity(basketItemId, quantity);
      
      runInAction(() => {
        // Находим и обновляем элемент корзины
        const itemIndex = this.items.findIndex(item => item.id === basketItemId);
        if (itemIndex !== -1) {
          const oldItem = this.items[itemIndex];
          const newItem = response.item;
          
          // Обновляем элемент
          this.items[itemIndex] = newItem;
          
          // Пересчитываем общие суммы
          this.totalCount += (newItem.quantity - oldItem.quantity);
          this.totalKZT += newItem.product.priceKZT * (newItem.quantity - oldItem.quantity);
          this.totalUSD += newItem.product.priceUSD * (newItem.quantity - oldItem.quantity);
        }
        
        this.setUpdating(false);
      });

      return { success: true, message: response.message, item: response.item };
    } catch (error: unknown) {
      console.error("Error updating item quantity:", error);
      
      const err = error as ApiError;
      const errorMessage = err.response?.data?.message || 'Ошибка обновления количества';
      
      runInAction(() => {
        this.setError(errorMessage);
        this.setUpdating(false);
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
    return this.loading || this.adding || this.removing || this.updating;
  }
}