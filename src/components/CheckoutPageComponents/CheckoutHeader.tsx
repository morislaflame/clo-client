import React from 'react';
import { Button } from '@heroui/react';

interface CheckoutHeaderProps {
  onBackClick: () => void;
}

const CheckoutHeader: React.FC<CheckoutHeaderProps> = ({ onBackClick }) => {
  return (
    <div className="mb-4 flex items-center justify-between">
      <Button
        variant="light"
        onClick={onBackClick}
        className="text-default-500"
      >
        ← Назад
      </Button>
      <h1 className="text-2xl font-bold text-center">Оформление заказа</h1>
      <div className="w-32" /> {/* Для выравнивания */}
    </div>
  );
};

export default CheckoutHeader;
