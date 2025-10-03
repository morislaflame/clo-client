import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Chip, Divider } from '@heroui/react';
// import { X } from 'lucide-react';
// import { XMarkIcon } from '@heroicons/react/24/outline';
import type { Order } from '@/http/orderAPI';
import { useTranslate } from '@/utils/useTranslate';
import { observer } from 'mobx-react-lite';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  currency: 'KZT' | 'USD';
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = observer(({
  isOpen,
  onClose,
  order,
  currency
}) => {
  const { t } = useTranslate();
  if (!order) return null;

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
      case 'CASH': return t("cash");
      case 'CARD': return t("card");
      case 'BANK_TRANSFER': return t("bank_transfer");
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
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{t("order")} #{order.id}</h2>
            <Chip
              color={getStatusColor(order.status)}
              variant="flat"
            >
              {getStatusLabel(order.status)}
            </Chip>
          </div>
        </ModalHeader>
        
        <ModalBody>
          {/* Информация о заказе */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{t("order_info")}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium">{t("date_created")}:</span> {formatDate(order.createdAt)}</p>
                  <p><span className="font-medium">{t("date_updated")}:</span> {formatDate(order.updatedAt)}</p>
                  <p><span className="font-medium">{t("payment_method")}:</span> {getPaymentMethodLabel(order.paymentMethod)}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{t("delivery_info")}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium">{t("recipient")}:</span> {order.recipientName}</p>
                  <p><span className="font-medium">{t("address")}:</span> {order.recipientAddress}</p>
                </div>
              </div>
            </div>

            {order.notes && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{t("notes")}</h3>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {order.notes}
                </p>
              </div>
            )}

            <Divider />

            {/* Товары в заказе */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">{t("items_in_order")}</h3>
              <div className="space-y-3">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                    {/* Изображение товара */}
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                      {item.product.mediaFiles && item.product.mediaFiles.length > 0 ? (
                        <img
                          src={item.product.mediaFiles[0].url}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-gray-400 text-xs">{t("no_photo")}</span>
                      )}
                    </div>
                    
                    {/* Информация о товаре */}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                      <div className="flex flex-wrap gap-2 mt-1 text-sm text-gray-600">
                        {item.selectedColor && (
                          <span>{t("color")}: {item.selectedColor.name}</span>
                        )}
                        {item.selectedSize && (
                          <span>{t("size")}: {item.selectedSize.name}</span>
                        )}
                        <span>{t("quantity")}: {item.quantity}</span>
                      </div>
                      {item.product.clothingType && (
                        <p className="text-xs text-gray-500 mt-1">
                          {item.product.clothingType.name}
                        </p>
                      )}
                    </div>
                    
                    {/* Цена */}
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {(currency === 'KZT' ? item.priceKZT : item.priceUSD) * item.quantity} {currencySymbol}
                      </p>
                      <p className="text-sm text-gray-600">
                        {(currency === 'KZT' ? item.priceKZT : item.priceUSD)} {currencySymbol} × {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Divider />

            {/* Итого */}
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>{t("total")}:</span>
              <span>{totalAmount.toLocaleString()} {currencySymbol}</span>
            </div>
          </div>
        </ModalBody>
        
        <ModalFooter>
          <Button color="primary" variant="light" onPress={onClose}>
            {t("close")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});

export default OrderDetailsModal;
