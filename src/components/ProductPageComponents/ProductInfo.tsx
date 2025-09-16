import React from 'react';
import { Chip, Divider } from '@heroui/react';
import type { Product } from '@/types/types';

interface ProductInfoProps {
  product: Product;
  currency: string;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product, currency }) => {
  // Получаем доступные размеры и цвета
  const availableSizes = product.sizes?.map(size => size.name).join(', ') || '';
  const availableColors = product.colors?.map(color => color.name).join(', ') || '';



  const getGenderLabel = (gender: string) => {
    switch (gender) {
      case 'MAN': return 'Мужское';
      case 'WOMAN': return 'Женское';
      default: return gender;
    }
  };

  return (
    <div className="space-y-4">
      {/* Заголовок и статус */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold text-foreground">
            {product.name}
          </h1>
          <Chip 
          color="default" 
          size="sm" 
          variant="bordered"
        >
          {getGenderLabel(product.gender)}
        </Chip>
        </div>
        
       
      </div>

      <Divider />

      {/* Цена */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="text-xl font-bold">
            {currency === 'KZT' 
              ? `${product.priceKZT.toLocaleString()} ₸` 
              : `$${product.priceUSD.toLocaleString()}`
            }
          </div>
          <span className="text-small text-default-400 font-bold"> | </span>
          <div className="text-lg text-default-400">
            {currency === 'KZT' 
              ? `$${product.priceUSD}` 
              : `${product.priceKZT.toLocaleString()} ₸`
            }
          </div>
        </div>
      </div>

      <Divider />

      {/* Характеристики */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Характеристики</h3>
        
        
        {product.collection && (
          <div className="flex justify-between">
            <span className="text-default-500 text-sm">Коллекция:</span>
            <span className="font-medium text-sm">{product.collection.name}</span>
          </div>
        )}
        
        {availableSizes && (
          <div className="flex justify-between">
            <span className="text-default-500 text-sm">Размеры:</span>
            <span className="font-medium text-sm">{availableSizes}</span>
          </div>
        )}
        
        {availableColors && (
          <div className="flex justify-between">
            <span className="text-default-500 text-sm">Цвета:</span>
            <span className="font-medium text-sm">{availableColors}</span>
          </div>
        )}
      </div>

      {/* Описание */}
      {product.description && (
        <>
          <Divider />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Описание</h3>
            <p className="text-default-600 leading-relaxed text-sm">
              {product.description}
            </p>
          </div>
        </>
      )}

      {/* Состав */}
      {product.ingredients && (
        <>
          <Divider />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Состав</h3>
            <p className="text-default-600 leading-relaxed text-sm">
              {product.ingredients}
            </p>
          </div>
          <Divider />
        </>
      )}
    </div>
  );
};

export default ProductInfo;
