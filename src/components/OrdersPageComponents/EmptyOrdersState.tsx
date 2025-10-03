import React from 'react';
import { Card, CardBody, Button } from '@heroui/react';
import { ShoppingBagIcon } from 'lucide-react';
// import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { observer } from 'mobx-react-lite';
import { useTranslate } from '@/utils/useTranslate';

interface EmptyOrdersStateProps {
  onGoShopping: () => void;
}

const EmptyOrdersState: React.FC<EmptyOrdersStateProps> = observer(({ onGoShopping }) => {
  const { t } = useTranslate();
  return (
    <Card className="w-full">
      <CardBody className="flex flex-col items-center justify-center py-12 px-6">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6">
          <ShoppingBagIcon className="w-12 h-12 " />
        </div>
        
        <h3 className="text-xl font-semibold mb-2">
          {t("no_orders")}
        </h3>
        
        <p className="text-center mb-6 max-w-md text-default-500">
          {t("no_orders_description")}
          {t("no_orders_description2")}
        </p>
        
        <Button
          color="primary"
          size="lg"
          onPress={onGoShopping}
          className="px-8"
        >
          {t("start_shopping")}
        </Button>
      </CardBody>
    </Card>
  );
});

export default EmptyOrdersState;
