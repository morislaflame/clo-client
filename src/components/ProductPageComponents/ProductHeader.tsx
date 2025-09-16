import React from 'react';
import { Button } from '@heroui/react';

interface ProductHeaderProps {
  onBackClick: () => void;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({ onBackClick }) => {
  return (
    <div className="mb-6">
      <Button
        variant="light"
        onClick={onBackClick}
        className="text-default-500"
      >
        ← Назад
      </Button>
    </div>
  );
};

export default ProductHeader;
