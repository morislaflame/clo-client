import React from 'react';
import { Card, CardBody } from '@heroui/react';
import { useTranslate } from '@/utils/useTranslate';

const NewsEmpty: React.FC = () => {
  const { t } = useTranslate();
  
  return (
    <Card className="p-8">
      <CardBody className="text-center">
        <h2 className="text-xl font-semibold mb-2">{t("news_not_found")}</h2>
        <p className="text-default-500">
          {t("news_not_found_description")}
        </p>
      </CardBody>
    </Card>
  );
};

export default NewsEmpty;
