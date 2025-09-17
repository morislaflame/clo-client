import React from 'react';
import { Card, Chip } from '@heroui/react';
import type { MediaFile, News, Tag } from '@/types/types';

interface NewsGridCardProps {
  news: News;
  onNewsClick: (newsId: number) => void;
}

const NewsGridCard: React.FC<NewsGridCardProps> = ({ news, onNewsClick }) => {
  // Функция для получения первого изображения из медиафайлов
  const getFirstImage = (mediaFiles: MediaFile[]) => {
    return mediaFiles.find(file => file.mimeType.includes('image'));
  };

  const firstImage = news.mediaFiles ? getFirstImage(news.mediaFiles) : null;

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow h-48"
      isPressable
      onPress={() => onNewsClick(news.id)}
    >
        <div className="relative w-full h-full">
          {/* Изображение на весь компонент */}
          {news.mediaFiles && news.mediaFiles.length > 0 ? (
            <img
              src={firstImage?.url || news.mediaFiles[0]?.url}
              alt={news.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400 text-xs">Нет изображения</span>
            </div>
          )}

          {/* Контент поверх изображения */}
          <div className="absolute bottom-0 left-0 right-0 p-3 flex flex-col z-10 h-full justify-end items-start"
          style={{
            background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))',
          }}
          >
          {/* Заголовок */}
          <div className="w-full text-left gap-2">
            <h3 className="text-md font-bold line-clamp-2 text-left">
              {news.title}
            </h3>
            <p className="text-md text-default-500">
              {news.description}
            </p>
          </div>

          {/* Теги */}
          {news.tags && news.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {news.tags.slice(0, 2).map((tag: Tag) => (
                <Chip key={tag.id} size="sm" variant="flat" color="primary" className="text-xs">
                  {tag.name}
                </Chip>
              ))}
              {news.tags.length > 2 && (
                <span className="text-xs text-gray-400">+{news.tags.length - 2}</span>
              )}
            </div>
          )}
          </div>
        </div>
    </Card>
  );
};

export default NewsGridCard;
