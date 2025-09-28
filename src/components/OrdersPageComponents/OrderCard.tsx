import React from 'react';
import { Card, CardBody, Chip, Button, Divider } from '@heroui/react';
import { EyeIcon } from 'lucide-react';

// import { EyeIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { Order } from '@/http/orderAPI';

interface OrderCardProps {
  order: Order;
  onViewDetails: (orderId: number) => void;
  onCancelOrder: (orderId: number) => void;
  canCancel: boolean;
  currency: 'KZT' | 'USD';
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onViewDetails,
  onCancelOrder,
  canCancel,
  currency
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CREATED': return 'default';
      case 'PAID': return 'primary';
      case 'SHIPPED': return 'secondary';
      case 'DELIVERED': return 'success';
      case 'CANCELLED': return 'danger';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'CREATED': return 'Создан';
      case 'PAID': return 'Оплачен';
      case 'SHIPPED': return 'В пути';
      case 'DELIVERED': return 'Доставлен';
      case 'CANCELLED': return 'Отменен';
      default: return status;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'CASH': return 'Наличные';
      case 'CARD': return 'Карта';
      case 'BANK_TRANSFER': return 'Банковский перевод';
      default: return method;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const totalAmount = currency === 'KZT' ? order.totalKZT : order.totalUSD;
  const currencySymbol = currency === 'KZT' ? '₸' : '$';

  return (
    <Card className="w-full">
      <CardBody className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Основная информация */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Заказ #{order.id}
              </h3>
              <Chip
                color={getStatusColor(order.status)}
                variant="flat"
                size="sm"
              >
                {getStatusLabel(order.status)}
              </Chip>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p><span className="font-medium">Дата:</span> {formatDate(order.createdAt)}</p>
                <p><span className="font-medium">Получатель:</span> {order.recipientName}</p>
              </div>
              <div>
                <p><span className="font-medium">Способ оплаты:</span> {getPaymentMethodLabel(order.paymentMethod)}</p>
                <p><span className="font-medium">Товаров:</span> {order.orderItems.length} шт.</p>
              </div>
            </div>

            {order.notes && (
              <div className="mt-3">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Заметки:</span> {order.notes}
                </p>
              </div>
            )}

            <div className="mt-4">
              <p className="text-lg font-bold text-gray-900">
                Итого: {totalAmount.toLocaleString()} {currencySymbol}
              </p>
            </div>
          </div>

          {/* Действия */}
          <div className="flex flex-col gap-2 lg:min-w-[200px]">
            <Button
              color="primary"
              variant="flat"
              startContent={<EyeIcon className="w-4 h-4" />}
              onPress={() => onViewDetails(order.id)}
              className="w-full"
            >
              Подробнее
            </Button>
            
            {canCancel && order.status === 'CREATED' && (
              <Button
                color="danger"
                variant="light"
                onPress={() => onCancelOrder(order.id)}
                className="w-full"
              >
                Отменить
              </Button>
            )}
          </div>
        </div>

        {/* Список товаров (краткий) */}
        <Divider className="my-4" />
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Товары в заказе:</h4>
          <div className="space-y-2">
            {order.orderItems.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.product.name}</p>
                  <div className="flex gap-2 text-gray-600">
                    {item.selectedColor && (
                      <span>Цвет: {item.selectedColor.name}</span>
                    )}
                    {item.selectedSize && (
                      <span>Размер: {item.selectedSize.name}</span>
                    )}
                    <span>Кол-во: {item.quantity}</span>
                  </div>
                </div>
                <p className="font-medium text-gray-900">
                  {(currency === 'KZT' ? item.priceKZT : item.priceUSD) * item.quantity} {currencySymbol}
                </p>
              </div>
            ))}
            {order.orderItems.length > 3 && (
              <p className="text-sm text-gray-500 text-center">
                и еще {order.orderItems.length - 3} товаров...
              </p>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default OrderCard;
