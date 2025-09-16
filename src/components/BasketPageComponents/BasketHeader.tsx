import React from 'react';
import { Button } from '@heroui/react';

interface BasketHeaderProps {
  onBackClick: () => void;
}

const BasketHeader: React.FC<BasketHeaderProps> = ({ onBackClick }) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <Button
        variant="light"
        onClick={onBackClick}
        className="text-default-500"
      >
        ← Назад
      </Button>
      <h1 className="text-2xl font-bold">Корзина</h1>
      <div className="w-20" /> {/* Для выравнивания */}
    </div>
  );
};

export default BasketHeader;
