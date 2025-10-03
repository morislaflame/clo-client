import { makeAutoObservable, runInAction } from "mobx";
import type { 
  Order, 
  CreateOrderRequest,
  CreateGuestOrderRequest,
  CreateOrderResponse,
  GetOrdersResponse,
  UpdateOrderStatusRequest 
} from "../http/orderAPI";
import { 
  createOrder,
  createGuestOrder,
  getUserOrders, 
  getUserOrder, 
  cancelOrder,
  getAllOrders,
  getOrder,
  updateOrderStatus,
  getOrderStats
} from "../http/orderAPI";
import type BasketStore from "./BasketStore";

interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
  code?: string;
}

export default class OrderStore {
  // Состояние заказов
  orders: Order[] = [];
  currentOrder: Order | null = null;
  totalCount = 0;
  currentPage = 1;
  totalPages = 0;
  
  // Состояние загрузки
  loading = false;
  creating = false;
  updating = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  // Setters
  setOrders(orders: Order[]) {
    this.orders = orders;
  }

  setCurrentOrder(order: Order | null) {
    this.currentOrder = order;
  }

  setPagination(totalCount: number, currentPage: number, totalPages: number) {
    this.totalCount = totalCount;
    this.currentPage = currentPage;
    this.totalPages = totalPages;
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setCreating(creating: boolean) {
    this.creating = creating;
  }

  setUpdating(updating: boolean) {
    this.updating = updating;
  }

  setError(error: string | null) {
    this.error = error;
  }

  // Actions
  async createOrder(orderData: CreateOrderRequest | CreateGuestOrderRequest, basketStore?: BasketStore) {
    try {
      this.setCreating(true);
      this.setError(null);
      
      // Определяем, гость ли пользователь
      const isGuest = basketStore ? basketStore.isGuest : false;
      let response: CreateOrderResponse;
      
      if (isGuest && basketStore) {
        // Для гостей создаем заказ с товарами из корзины
        const basketData = basketStore.getCheckoutData();
        const guestOrderData: CreateGuestOrderRequest = {
          ...(orderData as CreateGuestOrderRequest),
          items: basketData.items
        };
        response = await createGuestOrder(guestOrderData);
        
        // Очищаем локальную корзину после создания заказа
        basketStore.clearBasket();
      } else {
        // Для авторизованных используем обычный метод
        response = await createOrder(orderData as CreateOrderRequest);
      }
      
      runInAction(() => {
        // Добавляем новый заказ в начало списка
        this.orders.unshift(response.order);
        this.currentOrder = response.order;
        this.setCreating(false);
      });

      return { success: true, order: response.order, message: response.message };
    } catch (error: unknown) {
      console.error("Error creating order:", error);
      
      const err = error as ApiError;
      const errorMessage = err.response?.data?.message || 'Ошибка создания заказа';
      
      runInAction(() => {
        this.setError(errorMessage);
        this.setCreating(false);
      });
      
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  }

  async loadUserOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    try {
      this.setLoading(true);
      this.setError(null);
      
      const response: GetOrdersResponse = await getUserOrders(params);
      
      runInAction(() => {
        this.setOrders(response.orders);
        this.setPagination(response.totalCount, response.currentPage, response.totalPages);
        this.setLoading(false);
      });

      return response;
    } catch (error: unknown) {
      console.error("Error loading user orders:", error);
      
      runInAction(() => {
        this.setError('Ошибка загрузки заказов');
        this.setLoading(false);
      });
      
      throw error;
    }
  }

  async loadUserOrder(orderId: number) {
    try {
      this.setLoading(true);
      this.setError(null);
      
      const order: Order = await getUserOrder(orderId);
      
      runInAction(() => {
        this.setCurrentOrder(order);
        this.setLoading(false);
      });

      return order;
    } catch (error: unknown) {
      console.error("Error loading user order:", error);
      
      runInAction(() => {
        this.setError('Ошибка загрузки заказа');
        this.setLoading(false);
      });
      
      throw error;
    }
  }

  async cancelUserOrder(orderId: number) {
    try {
      this.setUpdating(true);
      this.setError(null);
      
      const response = await cancelOrder(orderId);
      
      runInAction(() => {
        // Обновляем заказ в списке
        const orderIndex = this.orders.findIndex(order => order.id === orderId);
        if (orderIndex !== -1) {
          this.orders[orderIndex] = response.order;
        }
        
        // Обновляем текущий заказ, если это он
        if (this.currentOrder?.id === orderId) {
          this.setCurrentOrder(response.order);
        }
        
        this.setUpdating(false);
      });

      return { success: true, order: response.order, message: response.message };
    } catch (error: unknown) {
      console.error("Error cancelling order:", error);
      
      const err = error as ApiError;
      const errorMessage = err.response?.data?.message || 'Ошибка отмены заказа';
      
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

  // Админские методы
  async loadAllOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
    userId?: number;
    paymentMethod?: string;
    startDate?: string;
    endDate?: string;
  }) {
    try {
      this.setLoading(true);
      this.setError(null);
      
      const response: GetOrdersResponse = await getAllOrders(params);
      
      runInAction(() => {
        this.setOrders(response.orders);
        this.setPagination(response.totalCount, response.currentPage, response.totalPages);
        this.setLoading(false);
      });

      return response;
    } catch (error: unknown) {
      console.error("Error loading all orders:", error);
      
      runInAction(() => {
        this.setError('Ошибка загрузки заказов');
        this.setLoading(false);
      });
      
      throw error;
    }
  }

  async loadOrder(orderId: number) {
    try {
      this.setLoading(true);
      this.setError(null);
      
      const order: Order = await getOrder(orderId);
      
      runInAction(() => {
        this.setCurrentOrder(order);
        this.setLoading(false);
      });

      return order;
    } catch (error: unknown) {
      console.error("Error loading order:", error);
      
      runInAction(() => {
        this.setError('Ошибка загрузки заказа');
        this.setLoading(false);
      });
      
      throw error;
    }
  }

  async updateOrderStatus(orderId: number, statusData: UpdateOrderStatusRequest) {
    try {
      this.setUpdating(true);
      this.setError(null);
      
      const response = await updateOrderStatus(orderId, statusData);
      
      runInAction(() => {
        // Обновляем заказ в списке
        const orderIndex = this.orders.findIndex(order => order.id === orderId);
        if (orderIndex !== -1) {
          this.orders[orderIndex] = response.order;
        }
        
        // Обновляем текущий заказ, если это он
        if (this.currentOrder?.id === orderId) {
          this.setCurrentOrder(response.order);
        }
        
        this.setUpdating(false);
      });

      return { success: true, order: response.order, message: response.message };
    } catch (error: unknown) {
      console.error("Error updating order status:", error);
      
      const err = error as ApiError;
      const errorMessage = err.response?.data?.message || 'Ошибка обновления статуса заказа';
      
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

  async loadOrderStats(params?: {
    startDate?: string;
    endDate?: string;
  }) {
    try {
      this.setLoading(true);
      this.setError(null);
      
      const response = await getOrderStats(params);
      
      runInAction(() => {
        this.setLoading(false);
      });

      return response;
    } catch (error: unknown) {
      console.error("Error loading order stats:", error);
      
      runInAction(() => {
        this.setError('Ошибка загрузки статистики заказов');
        this.setLoading(false);
      });
      
      throw error;
    }
  }

  // Вспомогательные методы
  getOrderById(orderId: number): Order | undefined {
    return this.orders.find(order => order.id === orderId);
  }

  getOrdersByStatus(status: string): Order[] {
    return this.orders.filter(order => order.status === status);
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'CREATED': return 'Создан';
      case 'PAID': return 'Оплачен';
      case 'SHIPPED': return 'В пути';
      case 'DELIVERED': return 'Доставлен';
      case 'CANCELLED': return 'Отменен';
      default: return status;
    }
  }

  getStatusColor(status: string): 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' {
    switch (status) {
      case 'CREATED': return 'default';
      case 'PAID': return 'primary';
      case 'SHIPPED': return 'secondary';
      case 'DELIVERED': return 'success';
      case 'CANCELLED': return 'danger';
      default: return 'default';
    }
  }

  getPaymentMethodLabel(method: string): string {
    switch (method) {
      case 'CASH': return 'Наличные';
      case 'CARD': return 'Карта';
      case 'BANK_TRANSFER': return 'Банковский перевод';
      default: return method;
    }
  }

  // Getters
  get isEmpty() {
    return this.orders.length === 0;
  }

  get hasOrders() {
    return this.orders.length > 0;
  }

  get isLoading() {
    return this.loading || this.creating || this.updating;
  }
}
