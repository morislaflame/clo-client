import { useState } from "react";
import { Card, CardBody, Image, Button } from "@heroui/react";
// import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/Icons";
import type { MediaFile } from "@/types/types";

interface MediaCarouselProps {
  mediaFiles: MediaFile[];
  productName: string;
}

const MediaCarousel = ({ mediaFiles, productName }: MediaCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Фильтруем только изображения и видео
  const mediaItems = mediaFiles.filter(file => 
    file.mimeType.includes('image') || file.mimeType.includes('video')
  );

  if (mediaItems.length === 0) {
    return (
      <Card className="w-full h-96">
        <CardBody className="flex items-center justify-center">
          <div className="text-center text-gray-400">
            <p>Нет изображений</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? mediaItems.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === mediaItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const currentMedia = mediaItems[currentIndex];
  const isVideo = currentMedia.mimeType.includes('video');

  return (
    <div className="w-full space-y-4">
      {/* Основное изображение/видео */}
      <Card className="w-full h-96">
        <CardBody className="p-0 relative overflow-hidden flex items-center justify-center bg-white">
          {isVideo ? (
            <video
              src={currentMedia.url}
              controls
              className="w-full h-full object-cover"
              poster={currentMedia.url} // Можно добавить постер для видео
            />
          ) : (
            <Image
              src={currentMedia.url}
              alt={`${productName} - изображение ${currentIndex + 1}`}
              className="w-full h-full object-cover"
              classNames={{
                wrapper: "w-full h-full",
              }}
            />
          )}
          
          {/* Навигационные кнопки */}
          {mediaItems.length > 1 && (
            <>
              <Button
                isIconOnly
                variant="light"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
                onClick={goToPrevious}
              >
                {/* <ChevronLeftIcon className="w-6 h-6" /> */}
              </Button>
              <Button
                isIconOnly
                variant="light"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
                onClick={goToNext}
              >
                {/* <ChevronRightIcon className="w-6 h-6" /> */}
              </Button>
            </>
          )}
        </CardBody>
      </Card>

      {/* Миниатюры */}
      {mediaItems.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {mediaItems.map((media, index) => (
            <div
              key={media.id}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                index === currentIndex 
                  ? 'border-primary' 
                  : 'border-transparent hover:border-gray-300'
              }`}
              onClick={() => goToSlide(index)}
            >
              {media.mimeType.includes('video') ? (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <div className="w-6 h-6 bg-black/50 rounded-full flex items-center justify-center">
                    <div className="w-0 h-0 border-l-[6px] border-l-white border-y-[4px] border-y-transparent ml-1"></div>
                  </div>
                </div>
              ) : (
                <Image
                  src={media.url}
                  alt={`${productName} - миниатюра ${index + 1}`}
                  className="w-full h-full object-cover"
                  classNames={{
                    wrapper: "w-full h-full",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Индикатор текущего слайда */}
      {mediaItems.length > 1 && (
        <div className="flex justify-center gap-1">
          {mediaItems.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-primary' : 'bg-gray-300'
              }`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaCarousel;

