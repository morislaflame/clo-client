import React from 'react';
import { Card, CardBody, Button } from '@heroui/react';

interface BasketEmptyProps {
  onBackClick: () => void;
  onGoShopping: () => void;
}

const BasketEmpty: React.FC<BasketEmptyProps> = ({ 
  onBackClick, 
  onGoShopping 
}) => {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-4">
        {/* Кнопка назад */}
        <div className="mb-6">
          <Button
            variant="light"
            onClick={onBackClick}
            className="text-default-500"
          >
            ← Назад
          </Button>
        </div>

        {/* Пустая корзина */}
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="p-4 max-w-md">
            <CardBody className="text-center space-y-4">
              <h2 className="text-2xl font-bold">Корзина пуста</h2>
              <p className="text-default-500">
                Добавьте товары в корзину, чтобы продолжить покупки
              </p>
              <Button
                color="primary"
                onClick={onGoShopping}
                className="w-full"
              >
                Перейти к покупкам
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BasketEmpty;
