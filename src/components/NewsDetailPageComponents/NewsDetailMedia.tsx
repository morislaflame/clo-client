import React, { useState } from 'react';
import { Card, CardBody, Image } from '@heroui/react';
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

  if (!mediaFiles || mediaFiles.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="relative w-full">
        <Carousel index={index} onIndexChange={setIndex} className="w-full">
          <CarouselContent>
            {mediaFiles.map((media, mediaIndex) => (
              <CarouselItem key={media.id}>
                <Card className="w-full h-96">
                  <CardBody className="p-0 relative overflow-hidden flex items-center justify-center">
                    {media.mimeType.includes('video') ? (
                      <video
                        src={media.url}
                        controls
                        className="w-full h-full object-cover"
                        poster={media.url}
                      />
                    ) : (
                      <Image
                        src={media.url}
                        alt={`${newsTitle} - изображение ${mediaIndex + 1}`}
                        className="w-full h-full object-cover"
                        classNames={{
                          wrapper: "w-full h-full",
                        }}
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
                className='absolute -bottom-20 left-auto top-auto w-full justify-end gap-2'
                classNameButton='bg-zinc-800 *:stroke-zinc-50 dark:bg-zinc-200 dark:*:stroke-zinc-800'
                alwaysShow
              />
              <CarouselIndicator
                className='absolute -bottom-12 left-0 right-0'
                classNameButton='bg-zinc-800 dark:bg-zinc-200'
              />
            </>
          )}
        </Carousel>
        
        {/* Кастомные индикаторы в виде мини-фоток */}
        {mediaFiles.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {mediaFiles.map((media, mediaIndex) => (
              <button
                key={media.id}
                onClick={() => setIndex(mediaIndex)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  index === mediaIndex 
                    ? 'border-primary' 
                    : 'border-transparent hover:border-default-300'
                }`}
              >
                {media.mimeType.includes('video') ? (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-xs">🎥</span>
                  </div>
                ) : (
                  <Image
                    src={media.url}
                    alt={`${newsTitle} - миниатюра ${mediaIndex + 1}`}
                    className="w-full h-full object-cover"
                    classNames={{
                      wrapper: "w-full h-full",
                    }}
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
