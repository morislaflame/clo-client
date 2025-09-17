import React from 'react';
import { Card, CardBody } from '@heroui/react';

const NewsEmpty: React.FC = () => {
  return (
    <Card className="p-8">
      <CardBody className="text-center">
        <h2 className="text-xl font-semibold mb-2">Новости не найдены</h2>
        <p className="text-default-500">
          По выбранным фильтрам новости не найдены
        </p>
      </CardBody>
    </Card>
  );
};

export default NewsEmpty;
