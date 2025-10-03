import React from 'react';
import { Button } from '@heroui/react';
import { useTranslate } from '@/utils/useTranslate';
import { observer } from 'mobx-react-lite';

interface ProductHeaderProps {
  onBackClick: () => void;
}

const ProductHeader: React.FC<ProductHeaderProps> = observer(({ onBackClick }) => {
  const { t } = useTranslate();
  return (
    <div className="mb-6">
      <Button
        variant="light"
        onClick={onBackClick}
        className="text-default-500"
      >
        ← {t("back")}
      </Button>
    </div>
  );
});

export default ProductHeader;
