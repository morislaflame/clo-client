import React from 'react';
import BasketItem from './BasketItem';
import type { BasketItem as BasketItemType } from '@/http/basketAPI';

interface BasketListProps {
  items: BasketItemType[];
  currency: string;
  onRemoveItem: (basketItemId: number) => void;
  onUpdateQuantity: (basketItemId: number, quantity: number) => void;
  onAddMore: (productId: number, selectedColorId?: number, selectedSizeId?: number) => void;
  isRemoving: boolean;
  isUpdating: boolean;
  isAdding: boolean;
}

const BasketList: React.FC<BasketListProps> = ({
  items,
  currency,
  onRemoveItem,
  onUpdateQuantity,
  onAddMore,
  isRemoving,
  isUpdating,
  isAdding
}) => {
  return (
    <div className="lg:col-span-2 space-y-4">
      {items.map((item) => (
        <BasketItem
          key={item.id}
          item={item}
          currency={currency}
          onRemoveItem={onRemoveItem}
          onUpdateQuantity={onUpdateQuantity}
          onAddMore={onAddMore}
          isRemoving={isRemoving}
          isUpdating={isUpdating}
          isAdding={isAdding}
        />
      ))}
    </div>
  );
};

export default BasketList;
