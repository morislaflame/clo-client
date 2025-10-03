import React from 'react';
import { Button } from '@heroui/react';
import { useTranslate } from '@/utils/useTranslate';
import { observer } from 'mobx-react-lite';

interface BasketHeaderProps {
  onBackClick: () => void;
}

const BasketHeader: React.FC<BasketHeaderProps> = observer(({ onBackClick }) => {
  const { t } = useTranslate();
  
  return (
    <div className="mb-6 flex items-center justify-between">
      <Button
        variant="light"
        onClick={onBackClick}
        className="text-default-500"
      >
        ← {t("back")}
      </Button>
      <h1 className="text-2xl font-bold">{t("basket")}</h1>
      <div className="w-20" /> {/* Для выравнивания */}
    </div>
  );
});

export default BasketHeader;
