import { makeAutoObservable, runInAction } from "mobx";
import type { Product } from "../http/productAPI";
import type { 
  BasketItem as ServerBasketItem,
  BasketResponse 
} from "../http/basketAPI";
import { 
  fetchBasket, 
  fetchBasketCount,
  addToBasket as addToBasketAPI, 
  removeFromBasket as removeFromBasketAPI, 
  updateBasketItemQuantity,
  clearBasket as clearBasketAPI 
} from "../http/basketAPI";
import type { LocalBasketItem } from "../types/basket";

interface LocalBasketData {
  items: LocalBasketItem[];
  timestamp: number;
}

interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
  code?: string;
}

const BASKET_STORAGE_KEY = 'local_basket';
const BASKET_EXPIRY_DAYS = 30;

/**
 * Универсальный BasketStore
 * Автоматически работает с localStorage для гостей и с сервером для авторизованных
 */
export default class BasketStore {
  // Локальная корзина (для гостей)
  private localItems: LocalBasketItem[] = [];
  
  // Серверная корзина (для авторизованных)
  private serverItems: ServerBasketItem[] = [];
  private serverTotalKZT = 0;
  private serverTotalUSD = 0;
  private serverTotalCount = 0;
  
  // Состояние загрузки
  loading = false;
  adding = false;
  removing = false;
  updating = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
    this.loadLocalFromStorage();
  }

  // ==================== ПРОВЕРКА АУТЕНТИФИКАЦИИ ====================
  
  private get isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    const isGuest = localStorage.getItem('isGuest') === 'true';
    
    // Авторизован = есть токен И НЕ гость
    // Если нет токена вообще - тоже гость (локальная корзина)
    return !!token && !isGuest;
  }
  
  // Проверка, является ли пользователь гостем
  public get isGuest(): boolean {
    return !this.isAuthenticated;
  }

  // ==================== ЛОКАЛЬНОЕ ХРАНИЛИЩЕ (ГОСТИ) ====================

  private loadLocalFromStorage() {
    try {
      const stored = localStorage.getItem(BASKET_STORAGE_KEY);
      if (stored) {
        const data: LocalBasketData = JSON.parse(stored);
        
        // Проверяем срок хранения
        const daysPassed = (Date.now() - data.timestamp) / (1000 * 60 * 60 * 24);
        if (daysPassed < BASKET_EXPIRY_DAYS) {
          this.localItems = data.items;
        } else {
          this.clearLocalBasket();
        }
      }
    } catch (error) {
      console.error("Error loading basket from storage:", error);
      this.clearLocalBasket();
    }
  }

  private saveLocalToStorage() {
    try {
      const data: LocalBasketData = {
        items: this.localItems,
        timestamp: Date.now()
      };
      localStorage.setItem(BASKET_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving basket to storage:", error);
    }
  }

  private clearLocalBasket() {
    this.localItems = [];
    localStorage.removeItem(BASKET_STORAGE_KEY);
  }

  // ==================== ПУБЛИЧНЫЕ ГЕТТЕРЫ ====================

  get items(): (ServerBasketItem | LocalBasketItem)[] {
    return this.isAuthenticated ? this.serverItems : this.localItems;
  }

  get totalKZT(): number {
    if (this.isAuthenticated) {
      return this.serverTotalKZT;
    }
    return this.localItems.reduce((sum, item) => 
      sum + (item.product.priceKZT * item.quantity), 0
    );
  }

  get totalUSD(): number {
    if (this.isAuthenticated) {
      return this.serverTotalUSD;
    }
    return this.localItems.reduce((sum, item) => 
      sum + (item.product.priceUSD * item.quantity), 0
    );
  }

  get totalCount(): number {
    if (this.isAuthenticated) {
      return this.serverTotalCount;
    }
    return this.localItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  get isEmpty(): boolean {
    return this.items.length === 0;
  }

  get hasItems(): boolean {
    return this.items.length > 0;
  }

  get isLoading(): boolean {
    return this.loading || this.adding || this.removing || this.updating;
  }

  // ==================== ЗАГРУЗКА КОРЗИНЫ ====================

  async loadBasket() {
    if (!this.isAuthenticated) {
      // Для гостей просто загружаем из localStorage
      this.loadLocalFromStorage();
      return;
    }

    // Для авторизованных загружаем с сервера
    try {
      this.loading = true;
      this.error = null;
      
      const response: BasketResponse = await fetchBasket();
      
      runInAction(() => {
        this.serverItems = response.items;
        this.serverTotalKZT = response.summary.totalKZT;
        this.serverTotalUSD = response.summary.totalUSD;
        this.serverTotalCount = response.summary.itemsCount;
        this.loading = false;
      });
    } catch (error: unknown) {
      console.error("Error loading basket:", error);
      
      runInAction(() => {
        this.error = 'Ошибка загрузки корзины';
        this.loading = false;
      });
      
      throw error;
    }
  }

  async loadBasketCount() {
    if (!this.isAuthenticated) {
      // Для гостей считаем локально
      return this.totalCount;
    }

    try {
      const response = await fetchBasketCount();
      
      runInAction(() => {
        this.serverTotalCount = response.count;
      });

      return response.count;
    } catch (error: unknown) {
      console.error("Error loading basket count:", error);
      return this.totalCount;
    }
  }

  // ==================== ДОБАВЛЕНИЕ ТОВАРА ====================

  async addProductToBasket(
    product: Product, 
    selectedColorId?: number, 
    selectedSizeId?: number
  ) {
    if (!this.isAuthenticated) {
      // Для гостей добавляем локально
      return this.addToLocalBasket(product, selectedColorId, selectedSizeId);
    }

    // Для авторизованных используем API
    return this.addToServerBasket(product.id, selectedColorId, selectedSizeId);
  }

  private addToLocalBasket(
    product: Product,
    selectedColorId?: number,
    selectedSizeId?: number
  ) {
    const existingItemIndex = this.localItems.findIndex(item =>
      item.productId === product.id &&
      item.selectedColorId === selectedColorId &&
      item.selectedSizeId === selectedSizeId
    );

    if (existingItemIndex !== -1) {
      // Увеличиваем количество
      this.localItems[existingItemIndex].quantity += 1;
    } else {
      // Находим выбранный цвет и размер из product
      const selectedColor = selectedColorId 
        ? product.colors?.find(c => c.id === selectedColorId)
        : undefined;
      
      const selectedSize = selectedSizeId
        ? product.sizes?.find(s => s.id === selectedSizeId)
        : undefined;

      // Добавляем новый товар
      this.localItems.push({
        productId: product.id,
        selectedColorId,
        selectedSizeId,
        quantity: 1,
        product,
        selectedColor,
        selectedSize
      });
    }

    this.saveLocalToStorage();
    return { success: true, message: 'Товар добавлен в корзину' };
  }

  private async addToServerBasket(
    productId: number,
    selectedColorId?: number,
    selectedSizeId?: number
  ) {
    try {
      this.adding = true;
      this.error = null;
      
      const response = await addToBasketAPI(productId, selectedColorId, selectedSizeId);
      
      runInAction(() => {
        const existingItemIndex = this.serverItems.findIndex(item => 
          item.productId === productId &&
          item.selectedColorId === selectedColorId &&
          item.selectedSizeId === selectedSizeId
        );

        if (existingItemIndex !== -1) {
          const oldQuantity = this.serverItems[existingItemIndex].quantity;
          const newQuantity = response.item.quantity;
          
          this.serverItems[existingItemIndex] = response.item;
          this.serverTotalCount += (newQuantity - oldQuantity);
          this.serverTotalKZT += response.item.product.priceKZT * (newQuantity - oldQuantity);
          this.serverTotalUSD += response.item.product.priceUSD * (newQuantity - oldQuantity);
        } else {
          this.serverItems.push(response.item);
          this.serverTotalCount += response.item.quantity;
          this.serverTotalKZT += response.item.product.priceKZT * response.item.quantity;
          this.serverTotalUSD += response.item.product.priceUSD * response.item.quantity;
        }
        
        this.adding = false;
      });

      return { success: true, message: response.message };
    } catch (error: unknown) {
      console.error("Error adding to basket:", error);
      
      const err = error as ApiError;
      const errorMessage = err.response?.data?.message || 'Ошибка добавления в корзину';
      
      runInAction(() => {
        this.error = errorMessage;
        this.adding = false;
      });
      
      return { success: false, error: errorMessage };
    }
  }

  // ==================== УДАЛЕНИЕ ТОВАРА ====================

  async removeProductFromBasket(
    productId: number, 
    selectedColorId?: number, 
    selectedSizeId?: number
  ) {
    if (!this.isAuthenticated) {
      return this.removeFromLocalBasket(productId, selectedColorId, selectedSizeId);
    }

    return this.removeFromServerBasket(productId, selectedColorId, selectedSizeId);
  }

  private removeFromLocalBasket(
    productId: number,
    selectedColorId?: number,
    selectedSizeId?: number
  ) {
    this.localItems = this.localItems.filter(item =>
      !(item.productId === productId &&
        item.selectedColorId === selectedColorId &&
        item.selectedSizeId === selectedSizeId)
    );
    this.saveLocalToStorage();
    return { success: true, message: 'Товар удален из корзины' };
  }

  private async removeFromServerBasket(
    productId: number,
    selectedColorId?: number,
    selectedSizeId?: number
  ) {
    try {
      this.removing = true;
      this.error = null;
      
      const itemToRemove = this.serverItems.find(item => 
        item.productId === productId &&
        item.selectedColorId === selectedColorId &&
        item.selectedSizeId === selectedSizeId
      );

      if (!itemToRemove) {
        this.removing = false;
        return { success: false, error: 'Товар не найден в корзине' };
      }

      await removeFromBasketAPI(itemToRemove.id);
      
      runInAction(() => {
        const itemIndex = this.serverItems.findIndex(item => item.id === itemToRemove.id);
        if (itemIndex !== -1) {
          const item = this.serverItems[itemIndex];
          this.serverItems.splice(itemIndex, 1);
          this.serverTotalCount -= item.quantity;
          this.serverTotalKZT -= item.product.priceKZT * item.quantity;
          this.serverTotalUSD -= item.product.priceUSD * item.quantity;
        }
        
        this.removing = false;
      });

      return { success: true, message: 'Товар удален из корзины' };
    } catch (error: unknown) {
      console.error("Error removing from basket:", error);
      
      const err = error as ApiError;
      const errorMessage = err.response?.data?.message || 'Ошибка удаления из корзины';
      
      runInAction(() => {
        this.error = errorMessage;
        this.removing = false;
      });
      
      return { success: false, error: errorMessage };
    }
  }

  // ==================== ОБНОВЛЕНИЕ КОЛИЧЕСТВА ====================

  async updateItemQuantity(
    productId: number,
    quantity: number,
    selectedColorId?: number,
    selectedSizeId?: number
  ) {
    if (!this.isAuthenticated) {
      return this.updateLocalQuantity(productId, quantity, selectedColorId, selectedSizeId);
    }

    return this.updateServerQuantity(productId, quantity, selectedColorId, selectedSizeId);
  }

  private updateLocalQuantity(
    productId: number,
    quantity: number,
    selectedColorId?: number,
    selectedSizeId?: number
  ) {
    const itemIndex = this.localItems.findIndex(item =>
      item.productId === productId &&
      item.selectedColorId === selectedColorId &&
      item.selectedSizeId === selectedSizeId
    );

    if (itemIndex !== -1) {
      if (quantity <= 0) {
        this.localItems.splice(itemIndex, 1);
      } else {
        this.localItems[itemIndex].quantity = quantity;
      }
      this.saveLocalToStorage();
    }

    return { success: true, message: 'Количество обновлено' };
  }

  private async updateServerQuantity(
    productId: number,
    quantity: number,
    selectedColorId?: number,
    selectedSizeId?: number
  ) {
    try {
      this.updating = true;
      this.error = null;
      
      const item = this.serverItems.find(item =>
        item.productId === productId &&
        item.selectedColorId === selectedColorId &&
        item.selectedSizeId === selectedSizeId
      );

      if (!item) {
        this.updating = false;
        return { success: false, error: 'Товар не найден' };
      }

      const response = await updateBasketItemQuantity(item.id, quantity);
      
      runInAction(() => {
        const itemIndex = this.serverItems.findIndex(i => i.id === item.id);
        if (itemIndex !== -1) {
          const oldItem = this.serverItems[itemIndex];
          const newItem = response.item;
          
          this.serverItems[itemIndex] = newItem;
          this.serverTotalCount += (newItem.quantity - oldItem.quantity);
          this.serverTotalKZT += newItem.product.priceKZT * (newItem.quantity - oldItem.quantity);
          this.serverTotalUSD += newItem.product.priceUSD * (newItem.quantity - oldItem.quantity);
        }
        
        this.updating = false;
      });

      return { success: true, message: response.message };
    } catch (error: unknown) {
      console.error("Error updating quantity:", error);
      
      const err = error as ApiError;
      const errorMessage = err.response?.data?.message || 'Ошибка обновления количества';
      
      runInAction(() => {
        this.error = errorMessage;
        this.updating = false;
      });
      
      return { success: false, error: errorMessage };
    }
  }

  // ==================== ОЧИСТКА КОРЗИНЫ ====================

  async clearBasket() {
    if (!this.isAuthenticated) {
      this.clearLocalBasket();
      return { success: true, message: 'Корзина очищена' };
    }

    try {
      this.loading = true;
      this.error = null;
      
      await clearBasketAPI();
      
      runInAction(() => {
        this.serverItems = [];
        this.serverTotalKZT = 0;
        this.serverTotalUSD = 0;
        this.serverTotalCount = 0;
        this.loading = false;
      });

      return { success: true, message: 'Корзина очищена' };
    } catch (error: unknown) {
      console.error("Error clearing basket:", error);
      
      const err = error as ApiError;
      const errorMessage = err.response?.data?.message || 'Ошибка очистки корзины';
      
      runInAction(() => {
        this.error = errorMessage;
        this.loading = false;
      });
      
      return { success: false, error: errorMessage };
    }
  }

  // ==================== ПРОВЕРКА НАЛИЧИЯ ====================

  isProductInBasket(productId: number, selectedColorId?: number, selectedSizeId?: number): boolean {
    return this.items.some(item =>
      item.productId === productId &&
      item.selectedColorId === selectedColorId &&
      item.selectedSizeId === selectedSizeId
    );
  }

  // ==================== МИГРАЦИЯ ПРИ АВТОРИЗАЦИИ ====================

  async migrateLocalToServer() {
    if (this.localItems.length === 0) {
      return;
    }

    console.log('Migrating local basket to server...');
    const itemsToMigrate = [...this.localItems];

    for (const item of itemsToMigrate) {
      try {
        // Добавляем каждый товар с его количеством
        for (let i = 0; i < item.quantity; i++) {
          await addToBasketAPI(item.productId, item.selectedColorId, item.selectedSizeId);
        }
      } catch (error) {
        console.error(`Error migrating item ${item.productId}:`, error);
      }
    }

    // Очищаем локальную корзину
    this.clearLocalBasket();
    
    // Перезагружаем корзину с сервера
    await this.loadBasket();
    
    console.log('Migration completed');
  }

  // ==================== ДАННЫЕ ДЛЯ ЗАКАЗА ====================

  getCheckoutData() {
    if (!this.isAuthenticated) {
      // Для гостей возвращаем данные из локальной корзины
      return {
        items: this.localItems.map(item => ({
          productId: item.productId,
          selectedColorId: item.selectedColorId,
          selectedSizeId: item.selectedSizeId,
          quantity: item.quantity,
          priceKZT: item.product.priceKZT,
          priceUSD: item.product.priceUSD
        })),
        totalKZT: this.totalKZT,
        totalUSD: this.totalUSD
      };
    }

    // Для авторизованных возвращаем данные с сервера
    return {
      items: this.serverItems.map(item => ({
        productId: item.productId,
        selectedColorId: item.selectedColorId,
        selectedSizeId: item.selectedSizeId,
        quantity: item.quantity,
        priceKZT: item.product.priceKZT,
        priceUSD: item.product.priceUSD
      })),
      totalKZT: this.serverTotalKZT,
      totalUSD: this.serverTotalUSD
    };
  }
}
