import React from 'react';
import { Card, CardBody, Button, Spinner, Image } from '@heroui/react';
import { TrashIcon } from '@/components/ui/Icons';
import type { BasketItem as BasketItemType } from '@/http/basketAPI';
import type { LocalBasketItem } from '@/types/basket';
import { useTranslate } from '@/utils/useTranslate';
import { observer } from 'mobx-react-lite';

interface BasketItemProps {
  item: BasketItemType | LocalBasketItem;
  currency: string;
  onRemoveItem: (productId: number, selectedColorId?: number, selectedSizeId?: number) => void;
  onUpdateQuantity: (productId: number, quantity: number, selectedColorId?: number, selectedSizeId?: number) => void;
  onAddMore: (productId: number, selectedColorId?: number, selectedSizeId?: number) => void;
  isRemoving: boolean;
  isUpdating: boolean;
  isAdding: boolean;
}

const BasketItem: React.FC<BasketItemProps> = observer(({
  item,
  currency,
  onRemoveItem,
  onUpdateQuantity,
  onAddMore,
  isRemoving,
  isUpdating,
  isAdding
}) => {
  const { t } = useTranslate();

  const handleIncreaseQuantity = () => {
    onUpdateQuantity(item.productId, item.quantity + 1, item.selectedColorId, item.selectedSizeId);
  };

  const handleDecreaseQuantity = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.productId, item.quantity - 1, item.selectedColorId, item.selectedSizeId);
    }
  };

  const handleAddMore = () => {
    onAddMore(
      item.productId,
      item.selectedColorId,
      item.selectedSizeId
    );
  };
  
  const handleRemove = () => {
    onRemoveItem(
      item.productId,
      item.selectedColorId,
      item.selectedSizeId
    );
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
                className="w-fit h-32 object-cover rounded-lg"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 text-xs">{t("no_photo")}</span>
              </div>
            )}
          </div>

          {/* Информация о товаре */}
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-semibold truncate">
                  {item.product.name}
                </h3>

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

              {/* Управление количеством и удаление */}
              <div className="flex items-center gap-2">
                {/* Кнопки управления количеством */}
                {item.quantity > 1 ? (
                  <div className="flex items-center gap-1">
                    <Button
                      isIconOnly
                      variant="light"
                      color="default"
                      size="sm"
                      onClick={handleDecreaseQuantity}
                      disabled={isUpdating}
                      aria-label={t("decrease_quantity")}
                    >
                      {isUpdating ? (
                        <Spinner size="sm" />
                      ) : (
                        <span className="text-lg">−</span>
                      )}
                    </Button>
                    <div className="bg-default text-default-foreground text-sm font-medium px-2 py-1 rounded-full min-w-[24px] text-center">
                      {item.quantity}
                    </div>
                    <Button
                      isIconOnly
                      variant="light"
                      color="default"
                      size="sm"
                      onClick={handleIncreaseQuantity}
                      disabled={isUpdating}
                      aria-label={t("increase_quantity")}
                    >
                      {isUpdating ? (
                        <Spinner size="sm" />
                      ) : (
                        <span className="text-lg">+</span>
                      )}
                    </Button>
                  </div>
                ) : (
                  /* Кнопка "Добавить еще" для товаров с количеством 1 */
                  <Button
                    size="sm"
                    color="default"
                    onClick={handleAddMore}
                    disabled={isAdding}
                    className="text-xs"
                  >
                    {isAdding ? (
                      <>
                        <Spinner size="sm" />
                        {t("adding")}
                      </>
                    ) : (
                      t("add_more")
                    )}
                  </Button>
                )}
                
                {/* Кнопка удаления */}
                <Button
                  isIconOnly
                  variant="light"
                  color="danger"
                  size="sm"
                  onClick={handleRemove}
                  disabled={isRemoving}
                  aria-label={t("remove_from_basket")}
                >
                  {isRemoving ? (
                    <Spinner size="md" />
                  ) : (
                    <TrashIcon className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>

            {/* Характеристики */}
            <div className=" text-sm text-default-500 flex flex-col gap-1">
              {/* Выбранные характеристики */}
              {item.selectedSize && (
                <span className="font-medium">
                  {t("size_label")}: {item.selectedSize.name}
                </span>
              )}
              {item.selectedColor && (
                <span className="font-medium flex items-center gap-1">
                  {t("color_label")}: 
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
                  {t("sizes")}: {item.product.sizes.map(s => s.name).join(', ')}
                </span>
              )}
              {!item.selectedColor && item.product.colors && item.product.colors.length > 0 && (
                <span>
                  {t("colors")}: {item.product.colors.map(c => c.name).join(', ')}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
});

export default BasketItem;
