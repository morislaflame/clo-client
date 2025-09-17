import React from 'react';
import { Card, CardHeader, Chip, Image } from '@heroui/react';
import type { MediaFile, News, Tag } from '@/types/types';

interface NewsListProps {
  news: News[];
  onNewsClick: (newsId: number) => void;
}

const NewsList: React.FC<NewsListProps> = ({ news, onNewsClick }) => {
  // Функция для получения первого видео из медиафайлов
  const getFirstVideo = (mediaFiles: MediaFile[]) => {
    return mediaFiles.find(file => file.mimeType.includes('video'));
  };

  // Функция для получения первого изображения из медиафайлов
  const getFirstImage = (mediaFiles: MediaFile[]) => {
    return mediaFiles.find(file => file.mimeType.includes('image'));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {news.map((newsItem) => {
        const firstVideo = newsItem.mediaFiles ? getFirstVideo(newsItem.mediaFiles) : null;
        const firstImage = newsItem.mediaFiles ? getFirstImage(newsItem.mediaFiles) : null;

        return (
          <Card 
            key={newsItem.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow col-span-12 sm:col-span-4 h-[60vh]"
            isPressable
            onPress={() => onNewsClick(newsItem.id)}
          >
            {newsItem.mediaFiles && newsItem.mediaFiles.length > 0 ? (
              <div className="relative w-full h-full">
                {firstVideo ? (
                  <video
                    src={firstVideo.url}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Если видео не загрузилось, показываем изображение
                      const target = e.target as HTMLVideoElement;
                      target.style.display = 'none';
                      const fallbackImage = target.nextElementSibling as HTMLImageElement;
                      if (fallbackImage) {
                        fallbackImage.style.display = 'block';
                      }
                    }}
                  />
                ) : null}
                
                {/* Fallback изображение */}
                <Image
                  src={firstImage?.url || newsItem.mediaFiles[0]?.url}
                  alt={newsItem.title}
                  className={`z-0 h-full w-full object-cover ${firstVideo ? 'hidden' : 'block'}`}
                />
              </div>
            ) : (
              <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">Нет медиафайлов</span>
              </div>
            )}

              {/* Заголовок и статус */}
              <div className="flex items-start justify-between gap-2 mb-2 p-4">
              </div>
              <CardHeader className="absolute z-10 bottom-1 flex-col items-start! p-4 text-left">
                <p className="text-tiny text-white/60 uppercase font-bold text-[16px]">{newsItem.title}</p>
                <h4 className="text-white font-bold text-[36px] ">{newsItem.description}</h4>
              </CardHeader>

              {/* Метаинформация */}
              <div className="space-y-2 text-xs text-default-500 absolute bottom-2 -right-2">
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
          </Card>
        );
      })}
    </div>
  );
};

export default NewsList;