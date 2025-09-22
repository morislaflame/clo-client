import React from 'react';
import { Card, CardBody, Button, Spinner, Chip, Image } from '@heroui/react';
import { TrashIcon } from '@/components/ui/Icons';
import type { BasketItem as BasketItemType } from '@/http/basketAPI';

interface BasketItemProps {
  item: BasketItemType;
  currency: string;
  onRemoveItem: (basketItemId: number) => void;
  isRemoving: boolean;
}

const BasketItem: React.FC<BasketItemProps> = ({
  item,
  currency,
  onRemoveItem,
  isRemoving
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'success';
      case 'SOLD': return 'danger';
      case 'DELETED': return 'default';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'В наличии';
      case 'SOLD': return 'Продано';
      case 'DELETED': return 'Удалено';
      default: return status;
    }
  };

  const getGenderLabel = (gender: string) => {
    switch (gender) {
      case 'MAN': return 'Мужское';
      case 'WOMAN': return 'Женское';
      default: return gender;
    }
  };

  return (
    <Card className="w-full bg-transparent border-small border-default-200 shadow-none">
      <CardBody className="p-4">
        <div className="flex gap-4">
          {/* Изображение товара */}
          <div className="flex-shrink-0">
            {item.product.mediaFiles && item.product.mediaFiles.length > 0 ? (
              <Image
                src={item.product.mediaFiles[0].url}
                alt={item.product.name}
                className="w-fit h-40 object-cover rounded-lg"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 text-xs">Нет фото</span>
              </div>
            )}
          </div>

          {/* Информация о товаре */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold truncate">
                  {item.product.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Chip 
                    color={getStatusColor(item.product.status)}
                    size="sm"
                    variant="flat"
                  >
                    {getStatusLabel(item.product.status)}
                  </Chip>
                  <Chip 
                    color="default" 
                    size="sm" 
                    variant="bordered"
                  >
                    {getGenderLabel(item.product.gender)}
                  </Chip>
                </div>
              </div>

              {/* Кнопка удаления */}
              <Button
                isIconOnly
                variant="light"
                color="danger"
                size="sm"
                onClick={() => onRemoveItem(item.id)}
                disabled={isRemoving}
                aria-label="Удалить из корзины"
              >
                {isRemoving ? (
                  <Spinner size="md" />
                ) : (
                  <TrashIcon className="w-5 h-5" />
                )}
              </Button>
            </div>

            {/* Цена */}
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">
                  {currency === 'KZT' 
                    ? `${item.product.priceKZT.toLocaleString()} ₸` 
                    : `$${item.product.priceUSD.toLocaleString()}`
                  }
                </span>
                <span className="text-small text-default-400"> | </span>
                <span className="text-sm text-default-400">
                  {currency === 'KZT' 
                    ? `$${item.product.priceUSD}` 
                    : `${item.product.priceKZT.toLocaleString()} ₸`
                  }
                </span>
              </div>
            </div>

            {/* Характеристики */}
            <div className="mt-2 text-sm text-default-500 flex flex-col gap-1">
              {/* Выбранные характеристики */}
              {item.selectedSize && (
                <span className="font-medium text-foreground">
                  Размер: {item.selectedSize.name}
                </span>
              )}
              {item.selectedColor && (
                <span className="font-medium text-foreground flex items-center gap-1">
                  Цвет: 
                  {item.selectedColor.hexCode && (
                    <div 
                      className="w-3 h-3 rounded-full border border-gray-300"
                      style={{ backgroundColor: item.selectedColor.hexCode }}
                    />
                  )}
                  {item.selectedColor.name}
                </span>
              )}
              
              {/* Доступные характеристики (если не выбраны) */}
              {!item.selectedSize && item.product.sizes && item.product.sizes.length > 0 && (
                <span>
                  Размеры: {item.product.sizes.map(s => s.name).join(', ')}
                </span>
              )}
              {!item.selectedColor && item.product.colors && item.product.colors.length > 0 && (
                <span>
                  Цвета: {item.product.colors.map(c => c.name).join(', ')}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default BasketItem;
