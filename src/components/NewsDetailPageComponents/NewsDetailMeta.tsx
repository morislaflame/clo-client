import React from 'react';
import { Chip } from '@heroui/react';
import type { News, Tag } from '@/types/types';

interface NewsDetailMetaProps {
  news: News;
}

const NewsDetailMeta: React.FC<NewsDetailMetaProps> = ({ news }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'success';
      case 'DRAFT': return 'warning';
      case 'ARCHIVED': return 'default';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'Опубликовано';
      case 'DRAFT': return 'Черновик';
      case 'ARCHIVED': return 'Архив';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="mb-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <h1 className="text-3xl font-bold text-foreground flex-1">
          {news.title}
        </h1>
        <Chip 
          color={getStatusColor(news.status)}
          size="md"
          variant="flat"
        >
          {getStatusLabel(news.status)}
        </Chip>
      </div>

      {/* Метаинформация */}
      <div className="flex flex-wrap gap-4 text-sm text-default-500 mb-4">
        {news.newsType && (
          <div className="flex items-center gap-2">
            <span>Тип:</span>
            <Chip size="sm" variant="bordered">
              {news.newsType.name}
            </Chip>
          </div>
        )}

        <div>
          <span>Дата публикации:</span> {formatDate(news.createdAt)}
        </div>

        {news.publishedAt && (
          <div>
            <span>Опубликовано:</span> {formatDate(news.publishedAt)}
          </div>
        )}
      </div>

      {/* Теги */}
      {news.tags && news.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-default-500">Теги:</span>
          {news.tags.map((tag: Tag) => (
            <Chip key={tag.id} size="sm" variant="flat" color="primary">
              {tag.name}
            </Chip>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsDetailMeta;
