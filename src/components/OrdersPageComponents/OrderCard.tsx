import React from 'react';
import { Card, CardBody, Chip, Button } from '@heroui/react';
import { EyeIcon } from 'lucide-react';

// import { EyeIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { Order } from '@/http/orderAPI';
import { useTranslate } from '@/utils/useTranslate';
import { observer } from 'mobx-react-lite';

interface OrderCardProps {
  order: Order;
  onViewDetails: (orderId: number) => void;
  onCancelOrder: (orderId: number) => void;
  canCancel: boolean;
  currency: 'KZT' | 'USD';
}

const OrderCard: React.FC<OrderCardProps> = observer(({
  order,
  onViewDetails,
  currency
}) => {
  const { t } = useTranslate();
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
      case 'CREATED': return t("created");
      case 'PAID': return t("paid");
      case 'SHIPPED': return t("shipped");
      case 'DELIVERED': return t("delivered");
      case 'CANCELLED': return t("cancelled");
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
        <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
          {/* Основная информация */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-lg font-semibold text-default-900">
                {t("order")} #{order.id}
              </h3>
              <Chip
                color={getStatusColor(order.status)}
                variant="flat"
                size="sm"
              >
                {getStatusLabel(order.status)}
              </Chip>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-default-700">
              <div>
                <p><span className="font-medium text-default-900">{t("date")}:</span> {formatDate(order.createdAt)}</p>
                <p><span className="font-medium text-default-900">{t("recipient")}:</span> {order.recipientName}</p>
              </div>
              <div>
                <p><span className="font-medium text-default-900">{t("payment_method")}:</span> {getPaymentMethodLabel(order.paymentMethod)}</p>
                <p><span className="font-medium text-default-900">{t("items_count")}</span> {order.orderItems.length} шт.</p>
              </div>
            </div>


            <div className="mt-4">
                <p className="text-lg font-bold">
                {t("total")}: {totalAmount.toLocaleString()} {currencySymbol}
              </p>
            </div>
          </div>

          {/* Действия */}
          <div className="flex flex-col gap-2 lg:min-w-[200px]">
            <Button
              color="default"
              startContent={<EyeIcon className="w-4 h-4" />}
              onPress={() => onViewDetails(order.id)}
              className="w-full"
            >
              {t("view_details")}
            </Button>
          </div>
        </div>

      </CardBody>
    </Card>
  );
});

export default OrderCard;
