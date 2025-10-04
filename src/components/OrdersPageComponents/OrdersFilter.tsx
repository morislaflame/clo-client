import React from 'react';
import { Select, SelectItem, Button } from '@heroui/react';
import { FunnelIcon } from 'lucide-react';
// import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface OrdersFilterProps {
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  onClearFilters: () => void;
}

const OrdersFilter: React.FC<OrdersFilterProps> = ({
  statusFilter,
  onStatusFilterChange,
  onClearFilters
}) => {
  const statusOptions = [
    { key: '', label: 'Все статусы' },
    { key: 'CREATED', label: 'Создан' },
    { key: 'PAID', label: 'Оплачен' },
    { key: 'SHIPPED', label: 'В пути' },
    { key: 'DELIVERED', label: 'Доставлен' },
    { key: 'CANCELLED', label: 'Отменен' }
  ];

  const hasActiveFilters = statusFilter !== '';

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <FunnelIcon className="w-5 h-5 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Фильтры:</span>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <Select
          label="Статус заказа"
          placeholder="Выберите статус"
          selectedKeys={statusFilter ? [statusFilter] : []}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as string;
            onStatusFilterChange(selected || '');
          }}
          className="w-full sm:w-48"
          size="sm"
        >
          {statusOptions.map((option) => (
            <SelectItem key={option.key} textValue={option.label}>
              {option.label}
            </SelectItem>
          ))}
        </Select>

        {hasActiveFilters && (
          <Button
            size="sm"
            variant="light"
            color="danger"
            onPress={onClearFilters}
          >
            Очистить
          </Button>
        )}
      </div>
    </div>
  );
};

export default OrdersFilter;
