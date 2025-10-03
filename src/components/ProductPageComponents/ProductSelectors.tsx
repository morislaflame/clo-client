import React from 'react';
import { Select, SelectItem, Divider } from '@heroui/react';
import type { Product } from '@/types/types';
import { useTranslate } from '@/utils/useTranslate';
import { observer } from 'mobx-react-lite';

interface ProductSelectorsProps {
  product: Product;
  selectedColorId: string;
  setSelectedColorId: (colorId: string) => void;
  selectedSizeId: string;
  setSelectedSizeId: (sizeId: string) => void;
  colorError: boolean;
  setColorError: (error: boolean) => void;
  sizeError: boolean;
  setSizeError: (error: boolean) => void;
}

const ProductSelectors: React.FC<ProductSelectorsProps> = observer(({
  product,
  selectedColorId,
  setSelectedColorId,
  selectedSizeId,
  setSelectedSizeId,
  colorError,
  setColorError,
  sizeError,
  setSizeError
}) => {
  const { t } = useTranslate();
  const hasColors = product.colors && product.colors.length > 0;
  const hasSizes = product.sizes && product.sizes.length > 0;

  if (!hasColors && !hasSizes) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{t("select_characteristics")}:</h3>
      
      {/* Выбор цвета */}
      {hasColors && (
        <div className="space-y-2">
          <Select
            placeholder={t("select_color")}
            selectedKeys={selectedColorId ? [selectedColorId] : []}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string;
              setSelectedColorId(selected || "");
              // Сбрасываем ошибку при выборе
              if (selected) {
                setColorError(false);
              }
            }}
            className="max-w-xs"
            color={colorError ? "warning" : "default"}
            errorMessage={colorError ? t("please_select_color") : ""}
            renderValue={(items) => {
              return items.map((item) => {
                const color = product.colors?.find(c => c.id.toString() === item.key);
                return (
                  <div key={item.key} className="flex items-center gap-2">
                    {color?.hexCode && (
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: color.hexCode }}
                      />
                    )}
                    {color?.name}
                  </div>
                );
              });
            }}
          >
            {product.colors?.map((color) => (
              <SelectItem key={color.id.toString()}>
                <div className="flex items-center gap-2">
                  {color.hexCode && (
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: color.hexCode }}
                    />
                  )}
                  {color.name}
                </div>
              </SelectItem>
            ))}
          </Select>
        </div>
      )}

      {/* Выбор размера */}
      {hasSizes && (
        <div className="space-y-2">
          <Select
            placeholder={t("select_size")}
            selectedKeys={selectedSizeId ? [selectedSizeId] : []}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string;
              setSelectedSizeId(selected || "");
              // Сбрасываем ошибку при выборе
              if (selected) {
                setSizeError(false);
              }
            }}
            className="max-w-xs"
            color={sizeError ? "warning" : "default"}
            errorMessage={sizeError ? t("please_select_size") : ""}
          >
            {product.sizes?.map((size) => (
              <SelectItem key={size.id.toString()}>
                {size.name}
              </SelectItem>
            ))}
          </Select>
        </div>
      )}
      
      <Divider />
    </div>
  );
});

export default ProductSelectors;
