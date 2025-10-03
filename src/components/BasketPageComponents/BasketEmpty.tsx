import React from 'react';
import { Card, CardBody, Button } from '@heroui/react';
import { useTranslate } from '@/utils/useTranslate';
import { observer } from 'mobx-react-lite';

interface BasketEmptyProps {
  onBackClick: () => void;
  onGoShopping: () => void;
}

const BasketEmpty: React.FC<BasketEmptyProps> = observer(({ 
  onBackClick, 
  onGoShopping 
}) => {
  const { t } = useTranslate();
  
  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-4">
        {/* Кнопка назад */}
        <div className="mb-6">
          <Button
            variant="light"
            onClick={onBackClick}
            className="text-default-500"
          >
            ← {t("back")}
          </Button>
        </div>

        {/* Пустая корзина */}
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="p-4 max-w-md">
            <CardBody className="text-center space-y-4">
              <h2 className="text-2xl font-bold">{t("basket_empty")}</h2>
              <p className="text-default-500">
                {t("basket_empty_description")}
              </p>
              <Button
                color="default"
                onClick={onGoShopping}
                className="w-full"
              >
                {t("go_shopping")}
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
});

export default BasketEmpty;
