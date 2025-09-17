import React from 'react';
import { Card, CardHeader } from '@heroui/react';
import type { MediaFile, News } from '@/types/types';

interface FeaturedNewsCardProps {
  news: News;
  onNewsClick: (newsId: number) => void;
}

const FeaturedNewsCard: React.FC<FeaturedNewsCardProps> = ({ news, onNewsClick }) => {
  // Функция для получения первого видео из медиафайлов
  const getFirstVideo = (mediaFiles: MediaFile[]) => {
    return mediaFiles.find(file => file.mimeType.includes('video'));
  };

  // Функция для получения первого изображения из медиафайлов
  const getFirstImage = (mediaFiles: MediaFile[]) => {
    return mediaFiles.find(file => file.mimeType.includes('image'));
  };

  const firstVideo = news.mediaFiles ? getFirstVideo(news.mediaFiles) : null;
  const firstImage = news.mediaFiles ? getFirstImage(news.mediaFiles) : null;

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow w-full h-[70vh] mb-6"
      isPressable
      onPress={() => onNewsClick(news.id)}
    >
      {news.mediaFiles && news.mediaFiles.length > 0 ? (
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
          <img
            src={firstImage?.url || news.mediaFiles[0]?.url}
            alt={news.title}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400">Нет медиафайлов</span>
        </div>
      )}

        {/* Заголовок и статус */}
              <CardHeader className="absolute z-10 bottom-0 flex-col p-4 text-left h-full justify-end items-start h-full"
              style={{
                background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8))',
              }}
              >
                <p className="text-tiny text-white/60 uppercase font-bold text-[16px]">{news.title}</p>
                <h4 className="text-white font-bold text-[36px] ">{news.description}</h4>
              </CardHeader>

    </Card>
  );
};

export default FeaturedNewsCard;
