import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardBody } from '@heroui/react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { MediaFile } from '@/types/types';

interface ProductMediaProps {
  mediaFiles?: MediaFile[];
  productName: string;
}

const ProductMedia: React.FC<ProductMediaProps> = ({ 
  mediaFiles, 
  productName 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Фильтруем только изображения и видео
  const mediaItems = mediaFiles?.filter(file => 
    file.mimeType.includes('image') || file.mimeType.includes('video')
  ) || [];
  const totalItems = mediaItems.length;

  // Функции навигации
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? totalItems - 1 : prevIndex - 1
    );
  }, [totalItems]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === totalItems - 1 ? 0 : prevIndex + 1
    );
  }, [totalItems]);

  // Обработчики кликов по зонам
  const handleLeftClick = () => {
    goToPrevious();
  };

  const handleRightClick = () => {
    goToNext();
  };

  // Автопрокрутка
  useEffect(() => {
    if (totalItems <= 1) return;
    
    const interval = setInterval(() => {
      goToNext();
    }, 5000); // Смена каждые 5 секунд

    return () => clearInterval(interval);
  }, [currentIndex, totalItems, goToNext]);

  if (mediaItems.length === 0) {
    return (
      <div className="order-1 lg:order-1">
        <Card className="w-full h-[70vh]">
          <CardBody className="flex items-center justify-center">
            <div className="text-center text-gray-400">
              <p>Нет изображений</p>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="order-1 lg:order-1">
      <style>{`
        @keyframes carouselFill {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
      <Card className="w-full bg-transparent border-none shadow-none rounded-lg">
        <CardBody className="p-0">
          <div className="relative w-full sm:h-[70vh] md:h-[70vh] lg:h-[70vh] overflow-hidden">
            {/* Контейнер для медиафайлов */}
            <div className="relative w-full h-full overflow-hidden">
              <motion.div
                className="flex w-full h-full"
                animate={{ x: `-${currentIndex * 100}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {mediaItems.map((mediaFile) => (
                  <div
                    key={mediaFile.id}
                    className="w-full h-full flex-shrink-0"
                  >
                    {mediaFile.mimeType.startsWith('image/') ? (
                      <img
                        src={mediaFile.url}
                        alt={`${productName} - изображение`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={mediaFile.url}
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                        controls
                      />
                    )}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Навигационные зоны */}
            {totalItems > 1 && (
              <>
                {/* Левая зона */}
                <div 
                  className="absolute left-0 top-0 w-1/2 h-full cursor-pointer z-10"
                  // style={{background: 'linear-gradient(to bottom, transparent, transparent, black)'}}
                  onClick={handleLeftClick}
                >
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-2 opacity-0 hover:opacity-100 transition-opacity duration-200">
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Правая зона */}
                <div 
                  className="absolute right-0 top-0 w-1/2 h-full cursor-pointer z-10"
                  // style={{background: 'linear-gradient(to bottom, transparent, transparent, black)'}}
                  onClick={handleRightClick}
                >
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-2 opacity-0 hover:opacity-100 transition-opacity duration-200">
                    <ChevronRight className="w-6 h-6 text-white" />
                  </div>
                </div>
              </>
            )}

            {/* Индикаторы прогресса */}
            {totalItems > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1 z-100">
                {mediaItems.map((_, index) => {
                  const isPast = index < currentIndex;
                  const isCurrent = index === currentIndex;

                  let border = '';
                  let boxShadow: string | undefined;
                  if (isPast) {
                    border = '1px solid #FFF';
                  } else if (isCurrent) {
                    border = '1px solid #FFF';
                  } else {
                    border = '1px solid #878787';
                  }

                  const fillStyle: React.CSSProperties = isPast
                    ? { width: '100%' }
                    : isCurrent
                    ? {
                        width: '100%',
                        animation: `carouselFill 5000ms linear forwards`,
                      }
                    : { width: '0%' };

                  return (
                    <div
                      key={index}
                      className="relative flex-1 h-1 rounded overflow-hidden bg-default-100 cursor-pointer"
                      style={{ border, boxShadow, minWidth: '60px' }}
                      onClick={() => {
                        setCurrentIndex(index);
                      }}
                    >
                      <div
                        className="absolute left-0 top-0 h-full bg-default-500"
                        style={{
                          ...fillStyle,
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ProductMedia;
