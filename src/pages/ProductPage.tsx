import { useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import {
  Card,
  CardBody,
  Button,
  Spinner,
  Divider,
  Chip,
} from "@heroui/react";
import { Context, type IStoreContext } from "@/store/StoreProvider";
import MediaCarousel from "@/components/MediaCarousel";
// import type { Product } from "@/types/types";

const ProductPage = observer(() => {
  const { product } = useContext(Context) as IStoreContext;
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      product.loadProduct(Number(id));
    }
  }, [id, product]);

  const handleBackClick = () => {
    navigate(-1);
  };

  if (product.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (product.error || !product.currentProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <CardBody className="text-center">
            <p className="text-danger mb-4">
              {product.error || "Товар не найден"}
            </p>
            <div className="flex gap-2 justify-center">
              <Button
                color="primary"
                variant="flat"
                onClick={() => navigate("/")}
              >
                На главную
              </Button>
              <Button
                color="default"
                variant="bordered"
                onClick={handleBackClick}
              >
                Назад
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  const currentProduct = product.currentProduct;

  // Получаем доступные размеры и цвета
  const availableSizes = currentProduct.sizes?.map(size => size.name).join(', ') || '';
  const availableColors = currentProduct.colors?.map(color => color.name).join(', ') || '';

  // Определяем статус товара
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'success';
      case 'SOLD': return 'danger';
      case 'DELETED': return 'default';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'В наличии';
      case 'SOLD': return 'Продано';
      case 'DELETED': return 'Удалено';
      default: return status;
    }
  };

  const getGenderLabel = (gender: string) => {
    switch (gender) {
      case 'MAN': return 'Мужское';
      case 'WOMAN': return 'Женское';
      default: return gender;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-4">
        {/* Кнопка назад */}
        <div className="mb-6">
          <Button
            variant="light"
            onClick={handleBackClick}
            className="text-default-500"
          >
            ← Назад
          </Button>
        </div>

        {/* Основной контент */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Левая часть - карусель с медиа */}
          <div className="order-1 lg:order-1">
            {currentProduct.mediaFiles && currentProduct.mediaFiles.length > 0 ? (
              <MediaCarousel 
                mediaFiles={currentProduct.mediaFiles} 
                productName={currentProduct.name}
              />
            ) : (
              <Card className="w-full h-96">
                <CardBody className="flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <p>Нет изображений</p>
                  </div>
                </CardBody>
              </Card>
            )}
          </div>

          {/* Правая часть - информация о товаре */}
          <div className="order-2 lg:order-2">
            <Card className="w-full h-fit">
              <CardBody className="p-4 space-y-4">
                {/* Заголовок и статус */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <h1 className="text-2xl font-bold text-foreground">
                      {currentProduct.name}
                    </h1>
                    <Chip 
                      color={getStatusColor(currentProduct.status)}
                      size="sm"
                      variant="flat"
                    >
                      {getStatusLabel(currentProduct.status)}
                    </Chip>
                  </div>
                  
                  <Chip 
                    color="default" 
                    size="sm" 
                    variant="bordered"
                  >
                    {getGenderLabel(currentProduct.gender)}
                  </Chip>
                </div>

                <Divider />

                {/* Цена */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="text-xl font-bold">
                      {product.currency === 'KZT' 
                        ? `${currentProduct.priceKZT.toLocaleString()} ₸` 
                        : `$${currentProduct.priceUSD.toLocaleString()}`
                      }
                    </div>
                    <span className="text-small text-default-400 font-bold"> | </span>
                    <div className="text-lg text-default-400">
                      {product.currency === 'KZT' 
                        ? `$${currentProduct.priceUSD}` 
                        : `${currentProduct.priceKZT.toLocaleString()} ₸`
                      }
                    </div>
                  </div>
                </div>

                <Divider />

                {/* Характеристики */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Характеристики</h3>
                  
                  {currentProduct.clothingType && (
                    <div className="flex justify-between">
                      <span className="text-default-500">Тип одежды:</span>
                      <span className="font-medium">{currentProduct.clothingType.name}</span>
                    </div>
                  )}
                  
                  {currentProduct.collection && (
                    <div className="flex justify-between">
                      <span className="text-default-500">Коллекция:</span>
                      <span className="font-medium">{currentProduct.collection.name}</span>
                    </div>
                  )}
                  
                  {availableSizes && (
                    <div className="flex justify-between">
                      <span className="text-default-500">Размеры:</span>
                      <span className="font-medium">{availableSizes}</span>
                    </div>
                  )}
                  
                  {availableColors && (
                    <div className="flex justify-between">
                      <span className="text-default-500">Цвета:</span>
                      <span className="font-medium">{availableColors}</span>
                    </div>
                  )}
                </div>

                {/* Описание */}
                {currentProduct.description && (
                  <>
                    <Divider />
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Описание</h3>
                      <p className="text-default-600 leading-relaxed">
                        {currentProduct.description}
                      </p>
                    </div>
                  </>
                )}

                {/* Состав */}
                {currentProduct.ingredients && (
                  <>
                    <Divider />
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Состав</h3>
                      <p className="text-default-600 leading-relaxed">
                        {currentProduct.ingredients}
                      </p>
                    </div>
                  </>
                )}

                <Divider />

                {/* Кнопки действий */}
                <div className="space-y-3">
                  <Button
                    color="primary"
                    size="lg"
                    className="w-full"
                    disabled={currentProduct.status !== 'AVAILABLE'}
                  >
                    Купить
                  </Button>
                  <Button
                    color="default"
                    variant="bordered"
                    size="lg"
                    className="w-full"
                    disabled={currentProduct.status !== 'AVAILABLE'}
                  >
                    Добавить в корзину
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ProductPage;

