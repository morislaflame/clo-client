import { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import {
  Card,
  CardBody,
  CardHeader,
  Select,
  SelectItem,
  Input,
  Button,
  Divider,
  ButtonGroup,
} from "@heroui/react";
import { Context, type IStoreContext } from "@/store/StoreProvider";
import type { ProductFilters } from "@/http/productAPI";
import { ChevronDownIcon } from "@/components/ui/Icons";
import { useTranslate } from "@/utils/useTranslate";

function ProductFilters() {
  const { product } = useContext(Context) as IStoreContext;
  const { t } = useTranslate();
  
  // Состояние для сворачивания фильтров на мобильных
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Локальные состояния для фильтров
  const [localFilters, setLocalFilters] = useState({
    gender: product.filters.gender || '',
    size: product.filters.size || '',
    color: product.filters.color || '',
    clothingTypeId: product.filters.clothingTypeId || '',
    minPrice: product.filters.minPrice || '',
    maxPrice: product.filters.maxPrice || '',
  });

  // Отдельное состояние для валюты (только для отображения)
  const [selectedCurrency, setSelectedCurrency] = useState<'KZT' | 'USD'>(
    product.currency || 'KZT'
  );

  // Загружаем справочники при монтировании
  useEffect(() => {
    product.loadFilters();
  }, [product]);

  // Обновляем локальные фильтры при изменении в сторе
  useEffect(() => {
    setLocalFilters({
      gender: product.filters.gender || '',
      size: product.filters.size || '',
      color: product.filters.color || '',
      clothingTypeId: product.filters.clothingTypeId || '',
      minPrice: product.filters.minPrice || '',
      maxPrice: product.filters.maxPrice || '',
    });
  }, [product.filters]);

  // Обновляем состояние валюты при изменении в сторе
  useEffect(() => {
    setSelectedCurrency(product.currency);
  }, [product.currency]);

  // Функция для обработки изменений фильтров
  const handleFilterChange = (key: keyof ProductFilters, value: string | number) => {
    // Преобразуем строковые значения в числа для цены и clothingTypeId
    let processedValue: string | number = value;
    if ((key === 'minPrice' || key === 'maxPrice') && value !== '') {
      processedValue = Number(value);
    } else if (key === 'clothingTypeId' && value !== '') {
      processedValue = Number(value);
    }
    
    const newFilters = { ...localFilters, [key]: processedValue };
    setLocalFilters(newFilters);
    
    // Обновляем фильтры в сторе и применяем их
    product.updateFilter(key, processedValue);
    product.applyFilters();
  };


  const clearFilters = () => {
    const clearedFilters = {
      gender: '',
      size: '',
      color: '',
      clothingTypeId: '',
      minPrice: '',
      maxPrice: '',
    };
    
    setLocalFilters(clearedFilters);
    
    // Очищаем фильтры в сторе и применяем их
    product.clearFilters();
    product.applyFilters();
  };

  const currencyOptions = [
    { value: 'KZT', label: t("tenge") },
    { value: 'USD', label: t("dollar") },
  ];

  const genderOptions = [
    { value: 'MAN', label: t("male") },
    { value: 'WOMAN', label: t("female") },
  ];

  return (
    <Card className="w-full bg-transparent border-zinc-800 border-small ">
      <CardHeader className="">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold">{t("filters")}</h3>
          </div>
          
          {/* Валюта и кнопка разворачивания на мобильных */}
          <div className="flex items-center gap-2 lg:hidden">
            <ButtonGroup size="sm">
              {currencyOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={selectedCurrency === option.value ? "solid" : "bordered"}
                  color="default"
                  onClick={() => product.setCurrency(option.value as 'KZT' | 'USD')}
                  size="sm"
                >
                  {option.value}
                </Button>
              ))}
            </ButtonGroup>
            <Button
              variant="light"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="min-w-unit-8 w-8 h-8 p-0"
            >
              <ChevronDownIcon 
                className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardBody className={`space-y-4 ${isExpanded ? 'block' : 'hidden'} lg:block`}>
        {/* Валюта на широких экранах */}
        <div className="hidden lg:block">
          <label className="text-sm font-medium mb-2 block">{t("currency")}</label>
          <ButtonGroup className="w-full">
            {currencyOptions.map((option) => (
              <Button
                key={option.value}
                variant={selectedCurrency === option.value ? "solid" : "bordered"}
                color="default"
                onClick={() => product.setCurrency(option.value as 'KZT' | 'USD')}
                className="flex-1"
              >
                {option.label}
              </Button>
            ))}
          </ButtonGroup>
        </div>

        <Divider className="hidden lg:block" />

        {/* Пол */}
        <Select
          label={t("gender")}
          placeholder={t("select_gender")}
          selectedKeys={localFilters.gender ? [localFilters.gender] : []}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as string;
            handleFilterChange('gender', value || '');
          }}
        >
          {genderOptions.map((option) => (
            <SelectItem key={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </Select>

        {/* Размер */}
        <Select
          label={t("size")}
          placeholder={t("select_size")}
          selectedKeys={localFilters.size ? [localFilters.size] : []}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as string;
            handleFilterChange('size', value || '');
          }}
          isLoading={product.filtersLoading}
        >
          {product.sizes.map((size) => (
            <SelectItem key={size.name}>
              {size.name}
            </SelectItem>
          ))}
        </Select>

        {/* Цвет */}
        <Select
          label={t("color")}
          placeholder={t("select_color")}
          selectedKeys={localFilters.color ? [localFilters.color] : []}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as string;
            handleFilterChange('color', value || '');
          }}
          isLoading={product.filtersLoading}
        >
          {product.colors.map((color) => (
            <SelectItem key={color.name}>
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

        {/* Тип одежды */}
        <Select
          label={t("clothing_type")}
          placeholder={t("select_type")}
          selectedKeys={localFilters.clothingTypeId ? [localFilters.clothingTypeId] : []}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as string;
            handleFilterChange('clothingTypeId', value || '');
          }}
          isLoading={product.filtersLoading}
        >
          {product.clothingTypes.map((type) => (
            <SelectItem key={type.id.toString()}>
              {type.name}
            </SelectItem>
          ))}
        </Select>

        <Divider />

        {/* Цена */}
        <div className="space-y-2">
          <label className="text-sm font-medium mb-2 block">
            {t("price")} ({selectedCurrency === 'KZT' ? '₸' : '$'})
          </label>
          <div className="flex gap-2">
            <Input
              placeholder={t("from")}
              type="number"
              value={localFilters.minPrice ? localFilters.minPrice.toString() : ''}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              min="0"
            />
            <Input
              placeholder={t("to")}
              type="number"
              value={localFilters.maxPrice ? localFilters.maxPrice.toString() : ''}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              min="0"
            />
          </div>
        </div>

        <Divider />

        {/* Кнопка сброса */}
        <div className="flex justify-center">
          <Button
            variant="bordered"
            onClick={clearFilters}
            disabled={product.loading || !product.isFilterApplied}
            style={{ backgroundColor: 'white', color: 'black', width: '100%' }}
          >
            {t("reset_filters")}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

const ProductFiltersComponent = observer(ProductFilters);
ProductFiltersComponent.displayName = 'ProductFilters';

export default ProductFiltersComponent;