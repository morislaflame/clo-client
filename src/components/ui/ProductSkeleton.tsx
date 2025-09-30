import { Card, CardBody } from "@heroui/react";

const ProductSkeleton = () => {
  return (
    <Card className="w-full h-full bg-transparent">
      {/* Скелетон изображения */}
      <div className="relative w-full h-78 overflow-hidden bg-default-200 rounded-lg">
        <div className="w-full h-full bg-gradient-to-r from-default-200 via-default-300 to-default-200 animate-pulse"></div>
      </div>

      <CardBody className="pb-2">
        {/* Скелетон названия */}
        <div className="space-y-2">
          <div className="h-4 bg-default-200 rounded animate-pulse"></div>
          <div className="h-4 bg-default-200 rounded w-3/4 animate-pulse"></div>
        </div>
        
        {/* Скелетон цены */}
        <div className="flex justify-between items-center w-full mt-3">
          <div className="flex gap-2 items-center">
            <div className="h-4 bg-default-200 rounded w-20 animate-pulse"></div>
            <div className="h-3 bg-default-200 rounded w-1 animate-pulse"></div>
            <div className="h-3 bg-default-200 rounded w-16 animate-pulse"></div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default ProductSkeleton;
