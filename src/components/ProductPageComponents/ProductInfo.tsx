import React from 'react';
import { Chip, Divider } from '@heroui/react';
import type { Product } from '@/types/types';
import { useTranslate } from '@/utils/useTranslate';
import { observer } from 'mobx-react-lite';

interface ProductInfoProps {
  product: Product;
  currency: string;
}

const ProductInfo: React.FC<ProductInfoProps> = observer(({ product, currency }) => {
  const { t } = useTranslate();
  // Получаем доступные размеры и цвета
  const availableSizes = product.sizes?.map(size => size.name).join(', ') || '';
  const availableColors = product.colors?.map(color => color.name).join(', ') || '';


  return (
    <div className="space-y-4">
      {/* Заголовок и статус */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-foreground">
            {product.name}
          </h1>
          <Chip 
          color="default" 
          size="sm" 
          variant="bordered"
        >
          NEW
        </Chip>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xl font-medium">
            {currency === 'KZT' 
              ? `₸ ${product.priceKZT.toLocaleString()}` 
              : `$ ${product.priceUSD.toLocaleString()}`
            }
          </div>
          <span className="text-small text-default-400 font-bold"> | </span>
          <div className="text-lg text-default-400">
            {currency === 'KZT' 
              ? `$ ${product.priceUSD}` 
              : `₸ ${product.priceKZT.toLocaleString()}`
            }
          </div>
        </div>
      </div>

      {/* Описание */}
      {product.description && (
        <>
          <div className="space-y-2">
            <p className="text-default-600 leading-relaxed text-sm">
              {product.description}
            </p>
          </div>
        </>
      )}

      <div className="space-y-2">
      <Divider />
        {product.collection && (
          <div className="flex justify-between">
            <span className="text-default-500 text-sm">{t("collection")}:</span>
            <span className="font-medium text-sm">{product.collection.name}</span>
          </div>
        )}
        
        {availableSizes && (
          <div className="flex justify-between">
            <span className="text-default-500 text-sm">{t("sizes")}:</span>
            <span className="font-medium text-sm">{availableSizes}</span>
          </div>
        )}
        
        {availableColors && (
          <div className="flex justify-between">
            <span className="text-default-500 text-sm">{t("colors")}:</span>
            <span className="font-medium text-sm">{availableColors}</span>
          </div>
        )}
      </div>

      {/* Состав */}
      {product.ingredients && (
        <>
          
          <div className="space-y-2">
            <h3 className="text-md font-medium">{t("ingredients")}:</h3>
            <p className="text-default-600 leading-relaxed text-sm">
              {product.ingredients}
            </p>
          </div>
          
        </>
      )}
    </div>
  );
});

export default ProductInfo;
