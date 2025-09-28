import React from 'react';
import { Button } from '@heroui/react';
import { ArrowLeftIcon } from 'lucide-react';
// import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface OrdersHeaderProps {
  onBackClick: () => void;
}

const OrdersHeader: React.FC<OrdersHeaderProps> = ({ onBackClick }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <Button
          isIconOnly
          variant="light"
          onPress={onBackClick}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold ">Мои заказы</h1>
        </div>
      </div>
    </div>
  );
};

export default OrdersHeader;
