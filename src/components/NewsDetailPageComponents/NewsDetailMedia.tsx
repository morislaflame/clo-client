import React, { useState, useRef, useEffect } from 'react';
import { Card, CardBody } from '@heroui/react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNavigation,
  CarouselIndicator
} from '@/components/ui/carousel';
import type { MediaFile } from '@/types/types';

interface NewsDetailMediaProps {
  mediaFiles: MediaFile[];
  newsTitle: string;
}

const NewsDetailMedia: React.FC<NewsDetailMediaProps> = ({ 
  mediaFiles, 
  newsTitle 
}) => {
  const [index, setIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<Record<string, string>>({});

  // Функция для создания превью видео
  const createVideoPreview = (videoUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        // Устанавливаем время на 1 секунду или 10% от длительности
        const time = Math.min(1, video.duration * 0.1);
        video.currentTime = time;
      };

      video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const previewUrl = canvas.toDataURL('image/jpeg', 0.8);
          resolve(previewUrl);
        } else {
          resolve(''); // Fallback если не удалось создать превью
        }
      };

      video.onerror = () => {
        resolve(''); // Fallback если видео не загрузилось
      };

      video.src = videoUrl;
    });
  };

  // Загружаем превью для всех видео при монтировании компонента
  useEffect(() => {
    const loadVideoPreviews = async () => {
      const videoFiles = mediaFiles.filter(media => media.mimeType.includes('video'));
      const previews: Record<string, string> = {};
      
      for (const video of videoFiles) {
        try {
          const preview = await createVideoPreview(video.url);
          if (preview) {
            previews[video.id] = preview;
          }
        } catch {
          console.warn('Не удалось создать превью для видео:', video.url);
        }
      }
      
      setVideoPreviews(previews);
    };

    if (mediaFiles.length > 0) {
      loadVideoPreviews();
    }
  }, [mediaFiles]);

  // Обработка смены слайда
  const handleIndexChange = (newIndex: number) => {
    // Останавливаем все видео
    videoRefs.current.forEach(video => {
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });
    
    setIndex(newIndex);
    
    // Запускаем видео на новом слайде, если это видео
    const currentMedia = mediaFiles[newIndex];
    if (currentMedia && currentMedia.mimeType.includes('video')) {
      const video = videoRefs.current[newIndex];
      if (video) {
        video.play().catch(console.warn);
      }
    }
  };

  if (!mediaFiles || mediaFiles.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="relative w-full">
        <Carousel index={index} onIndexChange={handleIndexChange} className="w-full">
          <CarouselContent>
            {mediaFiles.map((media, mediaIndex) => (
              <CarouselItem key={media.id}>
                <Card className="w-full h-96">
                  <CardBody className="p-0 relative overflow-hidden flex items-center justify-center">
                    {media.mimeType.includes('video') ? (
                      <video
                        ref={(el) => {
                          videoRefs.current[mediaIndex] = el;
                        }}
                        src={media.url}
                        controls
                        autoPlay={index === mediaIndex}
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                        poster={media.url}
                        onError={() => {
                          console.warn('Ошибка загрузки видео:', media.url);
                        }}
                      />
                    ) : (
                      <img
                        src={media.url}
                        alt={`${newsTitle} - изображение ${mediaIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </CardBody>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          {mediaFiles.length > 1 && (
            <>
              <CarouselNavigation
                className='absolute -bottom-20 left-auto top-auto w-full justify-end gap-2 sm:hidden'
                classNameButton='bg-zinc-800 *:stroke-zinc-50 dark:bg-zinc-200 dark:*:stroke-zinc-800'
                alwaysShow
              />
              <CarouselIndicator
                className='absolute -bottom-12 left-0 right-0 sm:hidden'
                classNameButton='bg-zinc-800 dark:bg-zinc-200'
              />
            </>
          )}
        </Carousel>
        
        {/* Кастомные индикаторы в виде мини-фоток */}
        {mediaFiles.length > 1 && (
          <div className="flex w-full justify-center space-x-3 px-4 mt-4">
            {mediaFiles.map((media, mediaIndex) => (
              <button
                key={media.id}
                type="button"
                aria-label={`Перейти к слайду ${mediaIndex + 1}`}
                onClick={() => handleIndexChange(mediaIndex)}
                className={`h-16 w-fit rounded-large overflow-hidden border-2 transition-all duration-200 justify-center items-center flex${
                  index === mediaIndex 
                    ? 'border-gray-200 hover:border-cyan-200' 
                    : ' border-default ring-2 ring-default/20'
                }`}
                style={{
                  width: '50px',
                }}
              >
                {media.mimeType.includes('video') ? (
                  <div className="relative w-full h-full">
                    {/* Превью видео или fallback */}
                    {videoPreviews[media.id] ? (
                      <img
                        src={videoPreviews[media.id]}
                        alt={`${newsTitle} - превью видео ${mediaIndex + 1}`}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-full">
                        <span className="text-xs">🎥</span>
                      </div>
                    )}
                    {/* Иконка воспроизведения */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-full">
                      <div className="w-6 h-6 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                        <svg 
                          className="w-3 h-3 text-black ml-0.5" 
                          fill="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                ) : (
                  <img
                    src={media.url}
                    alt={`${newsTitle} - миниатюра ${mediaIndex + 1}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsDetailMedia;
