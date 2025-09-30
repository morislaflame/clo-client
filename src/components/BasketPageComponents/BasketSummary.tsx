import React from 'react';
import { Card, CardBody, Button, Divider } from '@heroui/react';

interface BasketSummaryProps {
  totalCount: number;
  totalKZT: number;
  totalUSD: number;
  currency: string;
  onCheckout: () => void;
  onClearBasket: () => void;
}

const BasketSummary: React.FC<BasketSummaryProps> = ({
  totalCount,
  totalKZT,
  totalUSD,
  currency,
  onCheckout,
  onClearBasket
}) => {
  return (
    <div className="lg:col-span-1">
      <Card className="sticky top-4 bg-transparent border-none shadow-none ">
        <CardBody className="p-4 space-y-4">
          <h3 className="text-lg font-semibold">Итого</h3>
          
          <Divider />
          
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

          <div className="space-y-3">
            <Button
              size="lg"
              className="w-full bg-white text-black"
              onClick={onCheckout}
            >
              Оформить заказ
            </Button>
            
            <Button
              color="danger"
              variant="bordered"
              size="md"
              className="w-full"
              onClick={onClearBasket}
            >
              Очистить корзину
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default BasketSummary;
