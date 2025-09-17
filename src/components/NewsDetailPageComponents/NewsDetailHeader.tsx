import React from 'react';
import { Button } from '@heroui/react';

interface NewsDetailHeaderProps {
  onBackClick: () => void;
}

const NewsDetailHeader: React.FC<NewsDetailHeaderProps> = ({ onBackClick }) => {
  return (
    <div className="mb-6">
      <Button
        variant="light"
        onClick={onBackClick}
        className="text-default-500"
      >
        ← Назад
      </Button>
    </div>
  );
};

export default NewsDetailHeader;
