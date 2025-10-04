import React from 'react';
import { Select, SelectItem } from '@heroui/react';

interface NewsFiltersProps {
  selectedNewsType: string;
  selectedStatus: string;
  onNewsTypeChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

const NewsFilters: React.FC<NewsFiltersProps> = ({
  selectedNewsType,
  selectedStatus,
  onNewsTypeChange,
  onStatusChange
}) => {
  return (
    <div className="mb-6 flex gap-4 items-center">
      <Select
        label="Тип новости"
        placeholder="Все типы"
        selectedKeys={selectedNewsType ? [selectedNewsType] : []}
        onSelectionChange={(keys) => {
          const selected = Array.from(keys)[0] as string;
          onNewsTypeChange(selected || "");
        }}
        className="max-w-xs"
      >
        <SelectItem key="" textValue="Все типы">Все типы</SelectItem>
      </Select>

      <Select
        label="Статус"
        placeholder="Выберите статус"
        selectedKeys={[selectedStatus]}
        onSelectionChange={(keys) => {
          const selected = Array.from(keys)[0] as string;
          onStatusChange(selected);
        }}
        className="max-w-xs"
      >
        <SelectItem key="PUBLISHED" textValue="Опубликованные">Опубликованные</SelectItem>
        <SelectItem key="DRAFT" textValue="Черновики">Черновики</SelectItem>
        <SelectItem key="ARCHIVED" textValue="Архив">Архив</SelectItem>
      </Select>
    </div>
  );
};

export default NewsFilters;
