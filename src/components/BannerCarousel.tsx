import { useContext, useEffect, useState, useCallback } from "react";
import { observer } from "mobx-react-lite";
import { Card, CardBody } from "@heroui/react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Context, type IStoreContext } from "@/store/StoreProvider";
import LoadingIndicator from "./ui/LoadingIndicator";

const BannerCarousel = observer(() => {
  const { product } = useContext(Context) as IStoreContext;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    product.loadMainBanner();
  }, [product]);

  // Получаем данные
  const mainBanner = product.mainBanner;
  const mediaFiles = mainBanner?.mediaFiles || [];
  const totalItems = mediaFiles.length;

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

  // Если баннер загружается, показываем блок загрузки
  if (product.loading || !mainBanner) {
    return (
      <div className="w-full mb-4">
        <Card className="w-full bg-transparent border-none shadow-none rounded-none">
          <CardBody className="p-0">
            <div className="relative w-full h-[70vh] md:h-80 lg:h-[60vh] overflow-hidden">
              <div className="w-full h-full bg-transparent flex items-center justify-center">
                <LoadingIndicator />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  // Если нет медиафайлов, не показываем баннер
  if (mediaFiles.length === 0) {
    return null;
  }

  return (
    <div className="w-full mb-4">
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
      <Card className="w-full bg-transparent border-none shadow-none rounded-none">
        <CardBody className="p-0">
          <div className="relative w-full h-[70vh] md:h-80 lg:h-[60vh] overflow-hidden">
            {/* Контейнер для медиафайлов */}
            <div className="relative w-full h-full overflow-hidden">
              <motion.div
                className="flex w-full h-full"
                animate={{ x: `-${currentIndex * 100}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {mediaFiles.map((mediaFile) => (
                  <div
                    key={mediaFile.id}
                    className="w-full h-full flex-shrink-0"
                  >
                    {mediaFile.mimeType.startsWith('image/') ? (
                      <img
                        src={mediaFile.url}
                        alt={mainBanner.title || 'Баннер'}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <video
                        src={mediaFile.url}
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
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
                  style={{background: 'linear-gradient(to bottom, transparent, transparent, black)'}}
                  onClick={handleLeftClick}
                >
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-2 opacity-0 hover:opacity-100 transition-opacity duration-200">
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Правая зона */}
                <div 
                  className="absolute right-0 top-0 w-1/2 h-full cursor-pointer z-10"
                  style={{background: 'linear-gradient(to bottom, transparent, transparent, black)'}}
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
                {mediaFiles.map((_, index) => {
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
                        //   background: '#878787',
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
});

export default BannerCarousel;
