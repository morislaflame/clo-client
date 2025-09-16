import React from 'react';
import BasketItem from './BasketItem';
import type { BasketItem as BasketItemType } from '@/http/basketAPI';

interface BasketListProps {
  items: BasketItemType[];
  currency: string;
  onRemoveItem: (basketItemId: number) => void;
  isRemoving: boolean;
}

const BasketList: React.FC<BasketListProps> = ({
  items,
  currency,
  onRemoveItem,
  isRemoving
}) => {
  return (
    <div className="lg:col-span-2 space-y-4">
      {items.map((item) => (
        <BasketItem
          key={item.id}
          item={item}
          currency={currency}
          onRemoveItem={onRemoveItem}
          isRemoving={isRemoving}
        />
      ))}
    </div>
  );
};

export default BasketList;
