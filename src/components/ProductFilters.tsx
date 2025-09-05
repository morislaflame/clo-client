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
  Chip,
  Divider,
  ButtonGroup,
} from "@heroui/react";
import { Context, type IStoreContext } from "@/store/StoreProvider";
import type { ProductFilters } from "@/http/productAPI";
import { ChevronDownIcon } from "@/components/ui/Icons";

function ProductFilters() {
  const { product } = useContext(Context) as IStoreContext;
  
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
    currency: product.filters.currency || 'KZT',
  });

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
      currency: product.filters.currency || 'KZT',
    });
  }, [product.filters]);

  const handleFilterChange = (key: string, value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value === '' ? undefined : value
    }));
  };

  const applyFilters = () => {
    // Конвертируем строки в числа для числовых полей
    const processedFilters = {
      ...localFilters,
      clothingTypeId: localFilters.clothingTypeId ? Number(localFilters.clothingTypeId) : undefined,
      minPrice: localFilters.minPrice ? Number(localFilters.minPrice) : undefined,
      maxPrice: localFilters.maxPrice ? Number(localFilters.maxPrice) : undefined,
    };

    product.setFilters(processedFilters as Partial<ProductFilters>);
    product.applyFilters();
    
    // Закрываем фильтры на мобильных после применения
    setIsExpanded(false);
  };

  const clearFilters = () => {
    product.clearFilters();
    setLocalFilters({
      gender: '',
      size: '',
      color: '',
      clothingTypeId: '',
      minPrice: '',
      maxPrice: '',
      currency: 'KZT',
    });
  };

  const currencyOptions = [
    { value: 'KZT', label: 'Тенге (₸)' },
    { value: 'USD', label: 'Доллар ($)' },
  ];

  const genderOptions = [
    { value: 'MAN', label: 'Мужское' },
    { value: 'WOMAN', label: 'Женское' },
  ];

  return (
    <Card className="w-full">
      <CardHeader className="">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold">Фильтры</h3>
            {product.isFilterApplied && (
              <Chip color="primary" size="sm" variant="flat">
                Применены
              </Chip>
            )}
          </div>
          
          {/* Валюта и кнопка разворачивания на мобильных */}
          <div className="flex items-center gap-2 lg:hidden">
            <ButtonGroup size="sm">
              {currencyOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={localFilters.currency === option.value ? "solid" : "bordered"}
                  color="default"
                  onClick={() => handleFilterChange('currency', option.value)}
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
          <label className="text-sm font-medium mb-2 block">Валюта</label>
          <ButtonGroup className="w-full">
            {currencyOptions.map((option) => (
              <Button
                key={option.value}
                variant={localFilters.currency === option.value ? "solid" : "bordered"}
                color="default"
                onClick={() => handleFilterChange('currency', option.value)}
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
          label="Пол"
          placeholder="Выберите пол"
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
          label="Размер"
          placeholder="Выберите размер"
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
          label="Цвет"
          placeholder="Выберите цвет"
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
          label="Тип одежды"
          placeholder="Выберите тип"
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
            Цена ({localFilters.currency === 'KZT' ? '₸' : '$'})
          </label>
          <div className="flex gap-2">
            <Input
              placeholder="От"
              type="number"
              value={localFilters.minPrice ? localFilters.minPrice.toString() : ''}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              min="0"
            />
            <Input
              placeholder="До"
              type="number"
              value={localFilters.maxPrice ? localFilters.maxPrice.toString() : ''}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              min="0"
            />
          </div>
        </div>

        <Divider />

        {/* Кнопки действий */}
        <div className="flex gap-2">
          <Button
            onClick={applyFilters}
            isLoading={product.loading}
            className="flex-1 bg-white text-black font-bold"
          >
            Применить
          </Button>
          <Button
            variant="bordered"
            onClick={clearFilters}
            disabled={product.loading}
          >
            Очистить
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

const ProductFiltersComponent = observer(ProductFilters);
ProductFiltersComponent.displayName = 'ProductFilters';

export default ProductFiltersComponent;