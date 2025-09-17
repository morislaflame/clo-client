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
                onClick={() => setIndex(mediaIndex)}
                className={`h-16 w-fit rounded-large overflow-hidden border-2 transition-all duration-200 justify-center items-center flex ${
                  index === mediaIndex 
                    ? 'border-gray-200 hover:border-cyan-200' 
                    : ' border-default ring-2 ring-default/20'
                }`}
              >
                {media.mimeType.includes('video') ? (
                  <div className="w-full h-full flex items-center justify-center relative">
                    <Image
                      src={media.url}
                      alt={`${newsTitle} - миниатюра ${mediaIndex + 1}`}
                      className="w-full h-full"
                      classNames={{
                        wrapper: "w-full h-full",
                      }}
                      radius='full'

                    />
                    {/* <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-6 h-6 bg-white/80 rounded-full flex items-center justify-center">
                        <div className="w-0 h-0 border-l-[6px] border-l-black border-y-[4px] border-y-transparent ml-1"></div>
                      </div>
                    </div> */}
                  </div>
                ) : (
                  <Image
                    src={media.url}
                    alt={`${newsTitle} - миниатюра ${mediaIndex + 1}`}
                    className="w-full h-full object-cover"
                    classNames={{
                      wrapper: "w-full h-full",
                    }}
                    radius='md'
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
