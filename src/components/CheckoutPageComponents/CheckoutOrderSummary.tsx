import React from 'react';
import { Card, CardBody, Button, Divider, Image, Spinner } from '@heroui/react';
import type { BasketItem as BasketItemType } from '@/http/basketAPI';

interface CheckoutOrderSummaryProps {
  items: BasketItemType[];
  totalCount: number;
  totalKZT: number;
  totalUSD: number;
  currency: string;
  onSubmitOrder: () => void;
  isCreating: boolean;
}

const CheckoutOrderSummary: React.FC<CheckoutOrderSummaryProps> = ({
  items,
  totalCount,
  totalKZT,
  totalUSD,
  currency,
  onSubmitOrder,
  isCreating
}) => {
  return (
    <div className="lg:col-span-1">
      <Card className="sticky top-4">
        <CardBody className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">Ваш заказ</h3>
          
          <Divider />
          
          {/* Список товаров */}
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3">
                {/* Изображение товара */}
                <div className="flex-shrink-0">
                  {item.product.mediaFiles && item.product.mediaFiles.length > 0 ? (
                    <Image
                      src={item.product.mediaFiles[0].url}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-xs">Нет фото</span>
                    </div>
                  )}
                </div>

                {/* Информация о товаре */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium truncate">
                    {item.product.name}
                  </h4>
                  
                  {/* Характеристики */}
                  <div className="text-xs text-default-500 mt-1">
                    {item.selectedSize && (
                      <span>Размер: {item.selectedSize.name}</span>
                    )}
                    {item.selectedSize && item.selectedColor && <span> • </span>}
                    {item.selectedColor && (
                      <span className="flex items-center gap-1">
                        Цвет: 
                        {item.selectedColor.hexCode && (
                          <div 
                            className="w-2 h-2 rounded-full border border-gray-300"
                            style={{ backgroundColor: item.selectedColor.hexCode }}
                          />
                        )}
                        {item.selectedColor.name}
                      </span>
                    )}
                  </div>
                  
                  {/* Количество и цена */}
                  <div className="text-xs text-default-500 mt-1">
                    Количество: {item.quantity} × {currency === 'KZT' 
                      ? `${item.product.priceKZT.toLocaleString()} ₸` 
                      : `$${item.product.priceUSD.toLocaleString()}`
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Divider />
          
          {/* Итого */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Товаров:</span>
              <span className="font-medium">{totalCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Сумма:</span>
              <span className="font-bold text-lg">
                {currency === 'KZT' 
                  ? `${totalKZT.toLocaleString()} ₸` 
                  : `$${totalUSD.toLocaleString()}`
                }
              </span>
            </div>
            <div className="text-sm text-default-400">
              {currency === 'KZT' 
                ? `$${totalUSD.toLocaleString()}` 
                : `${totalKZT.toLocaleString()} ₸`
              }
            </div>
          </div>

          <Divider />

          {/* Кнопка оформления заказа */}
          <Button
            color="primary"
            size="lg"
            className="w-full"
            onClick={onSubmitOrder}
            disabled={isCreating}
          >
            {isCreating ? (
              <>
                <Spinner size="sm" />
                Оформление заказа...
              </>
            ) : (
              'Оформить заказ'
            )}
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default CheckoutOrderSummary;
