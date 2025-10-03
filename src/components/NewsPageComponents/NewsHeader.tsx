import React from 'react';
import { Button } from '@heroui/react';
import { observer } from 'mobx-react-lite';
import { useTranslate } from '@/utils/useTranslate';

interface NewsHeaderProps {
  onBackClick: () => void;
}

const NewsHeader: React.FC<NewsHeaderProps> = observer(({ onBackClick }) => {
  const { t } = useTranslate();
  return (
    <div className="mb-6 flex items-center justify-between ">
      <Button
        variant="light"
        onClick={onBackClick}
        className="text-default-500"
      >
        ← {t("back")}
      </Button>
      <div className="w-20" /> {/* Для выравнивания */}
    </div>
  );
});

export default NewsHeader;
