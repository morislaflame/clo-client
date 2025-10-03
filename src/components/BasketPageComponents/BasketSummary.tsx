import React from 'react';
import { Card, CardBody, Button, Divider } from '@heroui/react';
import { useTranslate } from '@/utils/useTranslate';
import { observer } from 'mobx-react-lite';

interface BasketSummaryProps {
  totalCount: number;
  totalKZT: number;
  totalUSD: number;
  currency: string;
  onCheckout: () => void;
  onClearBasket: () => void;
}

const BasketSummary: React.FC<BasketSummaryProps> = observer(({
  totalCount,
  totalKZT,
  totalUSD,
  currency,
  onCheckout,
  onClearBasket
}) => {
  const { t } = useTranslate();
  
  return (
    <div className="lg:col-span-1">
      <Card className="sticky top-4 bg-transparent border-none shadow-none ">
        <CardBody className="p-4 space-y-4">
          <h3 className="text-lg font-semibold">{t("total")}</h3>
          
          <Divider />
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>{t("items_count")}</span>
              <span className="font-medium">{totalCount}</span>
            </div>
            <div className="flex justify-between">
              <span>{t("sum")}</span>
              <span className="font-bold text-lg">
                {currency === 'KZT' 
                  ? `${totalKZT.toLocaleString()} ₸` 
                  : `$${totalUSD.toLocaleString()}`
                }
              </span>
            </div>
            <div className="text-sm text-default-400">
              {currency === 'KZT' 
                ? `$${totalUSD.toLocaleString()}` 
                : `${totalKZT.toLocaleString()} ₸`
              }
            </div>
          </div>

          <Divider />

          <div className="space-y-3">
            <Button
              size="lg"
              className="w-full bg-white text-black"
              onClick={onCheckout}
            >
              {t("checkout")}
            </Button>
            
            <Button
              color="danger"
              variant="bordered"
              size="md"
              className="w-full"
              onClick={onClearBasket}
            >
              {t("clear_basket")}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
});

export default BasketSummary;
