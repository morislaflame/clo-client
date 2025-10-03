import React from 'react';
import { Card, CardBody, Button } from '@heroui/react';
import { useTranslate } from '@/utils/useTranslate';  
import { observer } from 'mobx-react-lite';

interface NewsDetailErrorProps {
  error?: string;
  onGoToNews: () => void;
  onGoBack: () => void;
}

const NewsDetailError: React.FC<NewsDetailErrorProps> = observer(({ 
  error, 
  onGoToNews, 
  onGoBack 
}) => {
  const { t } = useTranslate();
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="p-8 max-w-md">
        <CardBody className="text-center">
          <p className="text-danger mb-4">
            {error || t("news_not_found")}
          </p>
          <div className="flex gap-2 justify-center">
            <Button
              color="primary"
              variant="flat"
              onClick={onGoToNews}
            >
              {t("to_news")}
            </Button>
            <Button
              color="default"
              variant="bordered"
              onClick={onGoBack}
            >
              {t("back")}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
});

export default NewsDetailError;
