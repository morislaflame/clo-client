import { $authHost } from './index';

// Типы для заказов
export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  selectedColorId?: number;
  selectedSizeId?: number;
  quantity: number;
  priceKZT: number;
  priceUSD: number;
  product: {
    id: number;
    name: string;
    priceKZT: number;
    priceUSD: number;
    status: string;
    gender: string;
    description?: string;
    ingredients?: string;
    mediaFiles?: Array<{
      id: number;
      url: string;
      fileName: string;
      mimeType: string;
    }>;
    clothingType?: {
      id: number;
      name: string;
    };
    collection?: {
      id: number;
      name: string;
    };
  };
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

export interface Order {
  id: number;
  userId: number;
  status: 'CREATED' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  recipientName: string;
  recipientAddress: string;
  paymentMethod: 'CASH' | 'CARD' | 'BANK_TRANSFER';
  totalKZT: number;
  totalUSD: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
  user?: {
    id: number;
    email: string;
  };
}

export interface CreateOrderRequest {
  recipientName: string;
  recipientAddress: string;
  paymentMethod: 'CASH' | 'CARD' | 'BANK_TRANSFER';
  notes?: string;
}

export interface CreateGuestOrderRequest {
  recipientName: string;
  recipientAddress: string;
  recipientPhone?: string;
  recipientEmail?: string;
  paymentMethod: 'CASH' | 'CARD' | 'BANK_TRANSFER';
  notes?: string;
  items: Array<{
    productId: number;
    selectedColorId?: number;
    selectedSizeId?: number;
    quantity: number;
  }>;
}

export interface CreateOrderResponse {
  message: string;
  order: Order;
}

export interface GetOrdersResponse {
  orders: Order[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface UpdateOrderStatusRequest {
  status: 'CREATED' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  notes?: string;
}

export interface OrderStatsResponse {
  totalOrders: number;
  ordersByStatus: Array<{
    status: string;
    count: number;
  }>;
  totalRevenue: {
    totalKZT: number;
    totalUSD: number;
  };
  ordersByPayment: Array<{
    paymentMethod: string;
    count: number;
  }>;
}

// API методы для заказов
export const createOrder = async (orderData: CreateOrderRequest): Promise<CreateOrderResponse> => {
  const response = await $authHost.post('/api/order/create', orderData);
  return response.data;
};

// Создание гостевого заказа (товары передаются в запросе)
export const createGuestOrder = async (orderData: CreateGuestOrderRequest): Promise<CreateOrderResponse> => {
  const response = await $authHost.post('/api/order/guest', orderData);
  return response.data;
};

export const getUserOrders = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<GetOrdersResponse> => {
  const response = await $authHost.get('/api/order/my-orders', { params });
  return response.data;
};

export const getUserOrder = async (orderId: number): Promise<Order> => {
  const response = await $authHost.get(`/api/order/my-orders/${orderId}`);
  return response.data;
};

export const cancelOrder = async (orderId: number): Promise<{ message: string; order: Order }> => {
  const response = await $authHost.patch(`/api/order/my-orders/${orderId}/cancel`);
  return response.data;
};

// Админские методы
export const getAllOrders = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
  userId?: number;
  paymentMethod?: string;
  startDate?: string;
  endDate?: string;
}): Promise<GetOrdersResponse> => {
  const response = await $authHost.get('/api/order', { params });
  return response.data;
};

export const getOrder = async (orderId: number): Promise<Order> => {
  const response = await $authHost.get(`/api/order/${orderId}`);
  return response.data;
};

export const updateOrderStatus = async (
  orderId: number, 
  statusData: UpdateOrderStatusRequest
): Promise<{ message: string; order: Order }> => {
  const response = await $authHost.patch(`/api/order/${orderId}/status`, statusData);
  return response.data;
};

export const getOrderStats = async (params?: {
  startDate?: string;
  endDate?: string;
}): Promise<OrderStatsResponse> => {
  const response = await $authHost.get('/api/order/stats/overview', { params });
  return response.data;
};
