import React from 'react';
import { Card, CardBody, Button } from '@heroui/react';
import { ShoppingBagIcon } from 'lucide-react';
// import { ShoppingBagIcon } from '@heroicons/react/24/outline';

interface EmptyOrdersStateProps {
  onGoShopping: () => void;
}

const EmptyOrdersState: React.FC<EmptyOrdersStateProps> = ({ onGoShopping }) => {
  return (
    <Card className="w-full">
      <CardBody className="flex flex-col items-center justify-center py-12 px-6">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6">
          <ShoppingBagIcon className="w-12 h-12 " />
        </div>
        
        <h3 className="text-xl font-semibold mb-2">
          У вас пока нет заказов
        </h3>
        
        <p className="text-center mb-6 max-w-md text-default-500">
          Когда вы сделаете свой первый заказ, он появится здесь. 
          Вы сможете отслеживать статус доставки и просматривать историю покупок.
        </p>
        
        <Button
          color="primary"
          size="lg"
          onPress={onGoShopping}
          className="px-8"
        >
          Начать покупки
        </Button>
      </CardBody>
    </Card>
  );
};

export default EmptyOrdersState;
