import React from 'react';
import { Button } from '@heroui/react';

interface NewsHeaderProps {
  onBackClick: () => void;
}

const NewsHeader: React.FC<NewsHeaderProps> = ({ onBackClick }) => {
  return (
    <div className="mb-6 flex items-center justify-between ">
      <Button
        variant="light"
        onClick={onBackClick}
        className="text-default-500"
      >
        ← Назад
      </Button>
      <div className="w-20" /> {/* Для выравнивания */}
    </div>
  );
};

export default NewsHeader;
