import React from 'react';
import { Card, CardBody, Button } from '@heroui/react';

interface NewsDetailErrorProps {
  error?: string;
  onGoToNews: () => void;
  onGoBack: () => void;
}

const NewsDetailError: React.FC<NewsDetailErrorProps> = ({ 
  error, 
  onGoToNews, 
  onGoBack 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="p-8 max-w-md">
        <CardBody className="text-center">
          <p className="text-danger mb-4">
            {error || "Новость не найдена"}
          </p>
          <div className="flex gap-2 justify-center">
            <Button
              color="primary"
              variant="flat"
              onClick={onGoToNews}
            >
              К новостям
            </Button>
            <Button
              color="default"
              variant="bordered"
              onClick={onGoBack}
            >
              Назад
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default NewsDetailError;
