import React from 'react';
import { Button } from '@heroui/react';
import { ArrowLeftIcon } from 'lucide-react';
// import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useTranslate } from '@/utils/useTranslate';
import { observer } from 'mobx-react-lite';

interface OrdersHeaderProps {
  onBackClick: () => void;
}

const OrdersHeader: React.FC<OrdersHeaderProps> = observer(({ onBackClick }) => {
  const { t } = useTranslate();
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
          <h1 className="text-2xl font-bold ">{t("my_orders")}</h1>
        </div>
      </div>
    </div>
  );
});

export default OrdersHeader;
