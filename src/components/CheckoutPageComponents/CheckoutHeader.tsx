import React from 'react';
import { Button } from '@heroui/react';
import { useTranslate } from '@/utils/useTranslate';
import { observer } from 'mobx-react-lite';

interface CheckoutHeaderProps {
  onBackClick: () => void;
}

const CheckoutHeader: React.FC<CheckoutHeaderProps> = observer(({ onBackClick }) => {
  const { t } = useTranslate();
  return (
    <div className="mb-4 flex items-center justify-between">
      <Button
        variant="light"
        onClick={onBackClick}
        className="text-default-500"
      >
        ← {t("back")}
      </Button>
      <h1 className="text-2xl font-bold text-center">{t("checkout")}</h1>
      <div className="w-32" /> {/* Для выравнивания */}
    </div>
  );
});

export default CheckoutHeader;
