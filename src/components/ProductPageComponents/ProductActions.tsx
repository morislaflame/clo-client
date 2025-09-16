import React from 'react';
import { Button, Spinner } from '@heroui/react';

interface ProductActionsProps {
  isProductAvailable: boolean;
  checkingBasket: boolean;
  isInBasket: boolean;
  basketAdding: boolean;
  onBuyNow: () => void;
  onAddToBasket: () => void;
}

const ProductActions: React.FC<ProductActionsProps> = ({
  isProductAvailable,
  checkingBasket,
  isInBasket,
  basketAdding,
  onBuyNow,
  onAddToBasket,
}) => {
  return (
    <div className="space-y-3">
      <Button
        size="lg"
        className="w-full bg-white text-black"
        disabled={!isProductAvailable}
        onClick={onBuyNow}
      >
        Заказать
      </Button>
      
      {isProductAvailable && (
        <>
          {checkingBasket ? (
            <Button
              color="default"
              variant="bordered"
              size="lg"
              className="w-full"
              isDisabled
            >
              <Spinner size="sm" />
              Проверка...
            </Button>
          ) : isInBasket ? (
            <Button
              size="lg"
              className="w-full"
              isDisabled
            >
                Добавлено в корзину
            </Button>
          ) : (
            <Button
              color="default"
              variant="bordered"
              size="lg"
              className="w-full"
              onClick={onAddToBasket}
              disabled={basketAdding}
            >
              {basketAdding ? (
                <>
                  <Spinner size="sm" />
                  Добавление...
                </>
              ) : (
                'Добавить в корзину'
              )}
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default ProductActions;
