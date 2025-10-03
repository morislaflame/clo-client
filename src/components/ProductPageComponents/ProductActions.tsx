import React from 'react';
import { Button, Spinner } from '@heroui/react';
import { useTranslate } from '@/utils/useTranslate';
import { observer } from 'mobx-react-lite';

interface ProductActionsProps {
  isProductAvailable: boolean;
  checkingBasket: boolean;
  isInBasket: boolean;
  basketAdding: boolean;
  onBuyNow: () => void;
  onAddToBasket: () => void;
}

const ProductActions: React.FC<ProductActionsProps> = observer(({
  isProductAvailable,
  checkingBasket,
  isInBasket,
  basketAdding,
  onBuyNow,
  onAddToBasket,
}) => {
  const { t } = useTranslate();
  return (
    <div className="space-y-3">
      <Button
        size="lg"
        className="w-full bg-white text-black"
        disabled={!isProductAvailable}
        onClick={onBuyNow}
      >
        {t("order")}
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
              {t("checking")}
            </Button>
          ) : isInBasket ? (
            <Button
              size="lg"
              className="w-full"
              isDisabled
            >
                {t("added_to_basket")}
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
                  {t("adding")}
                </>
              ) : (
                <>
                  {t("add_to_basket")}
                </>
              )}
            </Button>
          )}
        </>
      )}
    </div>
  );
});

export default ProductActions;
