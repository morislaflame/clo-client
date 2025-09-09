import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import {
  Card,
  CardBody,
  Button,
  Spinner,
  Divider,
  Chip,
  Select,
  SelectItem,
} from "@heroui/react";
import { Context, type IStoreContext } from "@/store/StoreProvider";
import MediaCarousel from "@/components/MediaCarousel";

const ProductPage = observer(() => {
  const { product, basket, user } = useContext(Context) as IStoreContext;
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isInBasket, setIsInBasket] = useState(false);
  const [checkingBasket, setCheckingBasket] = useState(false);
  const [selectedColorId, setSelectedColorId] = useState<string>("");
  const [selectedSizeId, setSelectedSizeId] = useState<string>("");
  // Состояния для валидации
  const [colorError, setColorError] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  useEffect(() => {
    if (id) {
      product.loadProduct(Number(id));
    }
  }, [id, product]);

  // Проверяем, находится ли товар в корзине
  useEffect(() => {
    const checkBasketStatus = async () => {
      if (id && user.isAuth) {
        setCheckingBasket(true);
        try {
          const inBasket = await basket.checkProductInBasket(
            Number(id),
            selectedColorId ? Number(selectedColorId) : undefined,
            selectedSizeId ? Number(selectedSizeId) : undefined
          );
          setIsInBasket(inBasket);
        } catch (error) {
          console.error("Error checking basket status:", error);
        } finally {
          setCheckingBasket(false);
        }
      } else {
        setIsInBasket(false);
      }
    };

    checkBasketStatus();
  }, [id, user.isAuth, basket, selectedColorId, selectedSizeId]);

  const handleBackClick = () => {
    navigate(-1);
  };

  // Функция валидации выбора цвета и размера
  const validateSelection = () => {
    const hasColors = currentProduct?.colors && currentProduct.colors.length > 0;
    const hasSizes = currentProduct?.sizes && currentProduct.sizes.length > 0;
    
    let isValid = true;
    
    if (hasColors && !selectedColorId) {
      setColorError(true);
      isValid = false;
    } else {
      setColorError(false);
    }
    
    if (hasSizes && !selectedSizeId) {
      setSizeError(true);
      isValid = false;
    } else {
      setSizeError(false);
    }
    
    return isValid;
  };

  const handleAddToBasket = async () => {
    if (!user.isAuth) {
      navigate('/login');
      return;
    }

    if (!id) return;

    // Валидация выбора цвета и размера
    if (!validateSelection()) {
      return;
    }

    const result = await basket.addProductToBasket(
      Number(id),
      selectedColorId ? Number(selectedColorId) : undefined,
      selectedSizeId ? Number(selectedSizeId) : undefined
    );
    
    if (result.success) {
      setIsInBasket(true);
      // Обновляем счетчик в навбаре
      basket.loadBasketCount().catch(console.error);
      // Можно добавить уведомление об успешном добавлении
    } else {
      // Можно добавить уведомление об ошибке
      console.error("Failed to add to basket:", result.error);
    }
  };

  const handleRemoveFromBasket = async () => {
    if (!id) return;

    const result = await basket.removeProductFromBasket(
      Number(id),
      selectedColorId ? Number(selectedColorId) : undefined,
      selectedSizeId ? Number(selectedSizeId) : undefined
    );
    
    if (result.success) {
      setIsInBasket(false);
      // Обновляем счетчик в навбаре
      basket.loadBasketCount().catch(console.error);
      // Можно добавить уведомление об успешном удалении
    } else {
      // Можно добавить уведомление об ошибке
      console.error("Failed to remove from basket:", result.error);
    }
  };

  const handleBuyNow = async () => {
    if (!user.isAuth) {
      navigate('/login');
      return;
    }

    if (!id) return;

    // Валидация выбора цвета и размера
    if (!validateSelection()) {
      return;
    }

    // Сначала добавляем в корзину
    const result = await basket.addProductToBasket(
      Number(id),
      selectedColorId ? Number(selectedColorId) : undefined,
      selectedSizeId ? Number(selectedSizeId) : undefined
    );
    
    if (result.success) {
      // Перенаправляем на страницу корзины
      navigate('/basket');
    } else {
      console.error("Failed to add to basket:", result.error);
    }
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

  const isProductAvailable = currentProduct.status === 'AVAILABLE';

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

                {/* Выбор цвета и размера */}
                {(currentProduct.colors && currentProduct.colors.length > 0) || 
                 (currentProduct.sizes && currentProduct.sizes.length > 0) ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Выберите характеристики</h3>
                    
                    {/* Выбор цвета */}
                    {currentProduct.colors && currentProduct.colors.length > 0 && (
                      <div className="space-y-2">
                        <Select
                          placeholder="Выберите цвет"
                          selectedKeys={selectedColorId ? [selectedColorId] : []}
                          onSelectionChange={(keys) => {
                            const selected = Array.from(keys)[0] as string;
                            setSelectedColorId(selected || "");
                            // Сбрасываем ошибку при выборе
                            if (selected) {
                              setColorError(false);
                            }
                          }}
                          className="max-w-xs"
                          color={colorError ? "danger" : "default"}
                          // variant="bordered"
                          errorMessage={colorError ? "Пожалуйста, выберите цвет" : ""}
                          renderValue={(items) => {
                            return items.map((item) => {
                              const color = currentProduct.colors?.find(c => c.id.toString() === item.key);
                              return (
                                <div key={item.key} className="flex items-center gap-2">
                                  {color?.hexCode && (
                                    <div 
                                      className="w-4 h-4 rounded-full border border-gray-300"
                                      style={{ backgroundColor: color.hexCode }}
                                    />
                                  )}
                                  {color?.name}
                                </div>
                              );
                            });
                          }}
                        >
                          {currentProduct.colors.map((color) => (
                            <SelectItem key={color.id.toString()}>
                              <div className="flex items-center gap-2">
                                {color.hexCode && (
                                  <div 
                                    className="w-4 h-4 rounded-full border border-gray-300"
                                    style={{ backgroundColor: color.hexCode }}
                                  />
                                )}
                                {color.name}
                              </div>
                            </SelectItem>
                          ))}
                        </Select>
                      </div>
                    )}

                    {/* Выбор размера */}
                    {currentProduct.sizes && currentProduct.sizes.length > 0 && (
                      <div className="space-y-2">
                        <Select
                          placeholder="Выберите размер"
                          selectedKeys={selectedSizeId ? [selectedSizeId] : []}
                          onSelectionChange={(keys) => {
                            const selected = Array.from(keys)[0] as string;
                            setSelectedSizeId(selected || "");
                            // Сбрасываем ошибку при выборе
                            if (selected) {
                              setSizeError(false);
                            }
                          }}
                          className="max-w-xs"
                          color={sizeError ? "danger" : "default"}
                          // variant="bordered"
                          errorMessage={sizeError ? "Пожалуйста, выберите размер" : ""}
                        >
                          {currentProduct.sizes.map((size) => (
                            <SelectItem key={size.id.toString()}>
                              {size.name}
                            </SelectItem>
                          ))}
                        </Select>
                      </div>
                    )}
                    <Divider />
                  </div>
                  
                ) : null}

                

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
                    disabled={!isProductAvailable}
                    onClick={handleBuyNow}
                  >
                    Купить
                  </Button>
                  
                  {isProductAvailable && (
                    <>
                      {checkingBasket ? (
                        <Button
                          color="default"
                          variant="bordered"
                          size="lg"
                          className="w-full"
                          disabled
                        >
                          <Spinner size="sm" />
                          Проверка...
                        </Button>
                      ) : isInBasket ? (
                        <Button
                          color="danger"
                          variant="bordered"
                          size="lg"
                          className="w-full"
                          onClick={handleRemoveFromBasket}
                          disabled={basket.removing}
                        >
                          {basket.removing ? (
                            <>
                              <Spinner size="sm" />
                              Удаление...
                            </>
                          ) : (
                            'Удалить из корзины'
                          )}
                        </Button>
                      ) : (
                        <Button
                          color="default"
                          variant="bordered"
                          size="lg"
                          className="w-full"
                          onClick={handleAddToBasket}
                          disabled={basket.adding}
                        >
                          {basket.adding ? (
                            <>
                              <Spinner size="sm" />
                              Добавление...
                            </>
                          ) : (
                            'Добавить в корзину'
                          )}
                        </Button>
                      )}
                    </>
                  )}
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