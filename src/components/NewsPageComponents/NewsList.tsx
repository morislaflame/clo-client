import React from 'react';
import { Card, CardBody, Chip, Image } from '@heroui/react';
import type { News, Tag } from '@/types/types';

interface NewsListProps {
  news: News[];
  onNewsClick: (newsId: number) => void;
}

const NewsList: React.FC<NewsListProps> = ({ news, onNewsClick }) => {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {news.map((newsItem) => (
        <Card 
          key={newsItem.id} 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          isPressable
          onPress={() => onNewsClick(newsItem.id)}
        >
          <CardBody className="p-0">
            {newsItem.mediaFiles && newsItem.mediaFiles.length > 0 ? (
              <Image
                src={newsItem.mediaFiles[0].url}
                alt={newsItem.title}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">Нет изображения</span>
              </div>
            )}

            <div className="p-4">
              {/* Заголовок и статус */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-lg font-semibold line-clamp-2 flex-1">
                  {newsItem.title}
                </h3>
                <Chip 
                  color={getStatusColor(newsItem.status)}
                  size="sm"
                  variant="flat"
                >
                  {getStatusLabel(newsItem.status)}
                </Chip>
              </div>

              {/* Описание */}
              {newsItem.description && (
                <p className="text-default-600 text-sm mb-3 line-clamp-3">
                  {newsItem.description}
                </p>
              )}

              {/* Метаинформация */}
              <div className="space-y-2 text-xs text-default-500">
                {newsItem.newsType && (
                  <div className="flex items-center gap-1">
                    <span>Тип:</span>
                    <Chip size="sm" variant="bordered">
                      {newsItem.newsType.name}
                    </Chip>
                  </div>
                )}

                <div>
                  <span>Дата:</span> {formatDate(newsItem.createdAt)}
                </div>

                {/* Теги */}
                {newsItem.tags && newsItem.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    <span>Теги:</span>
                    {newsItem.tags.slice(0, 3).map((tag: Tag) => (
                      <Chip key={tag.id} size="sm" variant="flat" color="primary">
                        {tag.name}
                      </Chip>
                    ))}
                    {newsItem.tags.length > 3 && (
                      <span className="text-default-400">+{newsItem.tags.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default NewsList;
