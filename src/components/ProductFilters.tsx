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

const ProductFilters = observer(() => {
  const { product } = useContext(Context) as IStoreContext;
  
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
      <CardHeader>
        <div className="flex justify-between items-center w-full">
          <h3 className="text-lg font-semibold">Фильтры</h3>
          {product.isFilterApplied && (
            <Chip color="primary" size="sm" variant="flat">
              Применены
            </Chip>
          )}
        </div>
      </CardHeader>
      
      <CardBody className="space-y-4">
        {/* Валюта */}
        <div>
          <label className="text-sm font-medium mb-2 block">Валюта</label>
          <ButtonGroup className="w-full">
            {currencyOptions.map((option) => (
              <Button
                key={option.value}
                variant={localFilters.currency === option.value ? "solid" : "bordered"}
                color={localFilters.currency === option.value ? "default" : "default"}
                onClick={() => handleFilterChange('currency', option.value)}
                className="flex-1"
              >
                {option.label}
              </Button>
            ))}
          </ButtonGroup>
        </div>

        <Divider />

        {/* Пол */}
        <Select
          label="Пол"
          placeholder="Выберите пол"
          value={localFilters.gender}
          onChange={(e) => handleFilterChange('gender', e.target.value)}
          isClearable
        >
          {genderOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </Select>

        {/* Размер */}
        <Select
          label="Размер"
          placeholder="Выберите размер"
          value={localFilters.size}
          onChange={(e) => handleFilterChange('size', e.target.value)}
          isLoading={product.filtersLoading}
          isClearable
        >
          {product.sizes.map((size) => (
            <SelectItem key={size.name} value={size.name}>
              {size.name}
            </SelectItem>
          ))}
        </Select>

        {/* Цвет */}
        <Select
          label="Цвет"
          placeholder="Выберите цвет"
          value={localFilters.color}
          onChange={(e) => handleFilterChange('color', e.target.value)}
          isLoading={product.filtersLoading}
          isClearable
        >
          {product.colors.map((color) => (
            <SelectItem key={color.name} value={color.name}>
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
          value={localFilters.clothingTypeId}
          onChange={(e) => handleFilterChange('clothingTypeId', e.target.value)}
          isLoading={product.filtersLoading}
          isClearable
        >
          {product.clothingTypes.map((type) => (
            <SelectItem key={type.id} value={type.id.toString()}>
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
              value={localFilters.minPrice.toString()}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              min="0"
            />
            <Input
              placeholder="До"
              type="number"
              value={localFilters.maxPrice.toString()}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              min="0"
            />
          </div>
        </div>

        <Divider />

        {/* Кнопки действий */}
        <div className="flex gap-2">
          <Button
            // onClick={applyFilters}
            isLoading={product.loading}
            className="flex-1 bg-white text-black"
          >
            Применить
          </Button>
          <Button
            variant="bordered"
            // onClick={clearFilters}
            disabled={product.loading}
          >
            Очистить
          </Button>
        </div>
      </CardBody>
    </Card>
  );
});

export default ProductFilters;