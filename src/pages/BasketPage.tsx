import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import {
  Card,
  CardBody,
  Button,
  Spinner,
  Divider,
  Chip,
  Image,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { Context, type IStoreContext } from "@/store/StoreProvider";
import { TrashIcon } from "@/components/ui/Icons";
import { MAIN_ROUTE, CHECKOUT_ROUTE } from "@/utils/consts";

const BasketPage = observer(() => {
  const { basket, user, product } = useContext(Context) as IStoreContext;
  const navigate = useNavigate();
  const { isOpen: isClearModalOpen, onOpen: onClearModalOpen, onClose: onClearModalClose } = useDisclosure();

  useEffect(() => {
    if (!user.isAuth) {
      navigate(MAIN_ROUTE);
      return;
    }

    // Загружаем корзину при открытии страницы
    basket.loadBasket().catch(console.error);
  }, [user.isAuth, navigate, basket]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleRemoveItem = async (basketItemId: number) => {
    // Находим элемент корзины по ID
    const item = basket.items.find(item => item.id === basketItemId);
    if (item) {
      await basket.removeProductFromBasket(
        item.productId,
        item.selectedColorId,
        item.selectedSizeId
      );
    }
    // Счетчик обновится автоматически через MobX реактивность
  };

  const handleClearBasket = async () => {
    const result = await basket.clearBasket();
    if (result.success) {
      onClearModalClose();
    }
  };

  const handleCheckout = () => {
    navigate(CHECKOUT_ROUTE);
  };

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

  if (!user.isAuth) {
    return null; // Редирект уже произошел в useEffect
  }

  if (basket.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (basket.isEmpty) {
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

          {/* Пустая корзина */}
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="p-4 max-w-md">
              <CardBody className="text-center space-y-4">
                <h2 className="text-2xl font-bold">Корзина пуста</h2>
                <p className="text-default-500">
                  Добавьте товары в корзину, чтобы продолжить покупки
                </p>
                <Button
                  color="primary"
                  onClick={() => navigate(MAIN_ROUTE)}
                  className="w-full"
                >
                  Перейти к покупкам
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-4">
        {/* Заголовок и кнопка назад */}
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="light"
            onClick={handleBackClick}
            className="text-default-500"
          >
            ← Назад
          </Button>
          <h1 className="text-2xl font-bold">Корзина</h1>
          <div className="w-20" /> {/* Для выравнивания */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Список товаров */}
          <div className="lg:col-span-2 space-y-4">
            {basket.items.map((item) => (
              <Card key={item.id} className="w-full">
                <CardBody className="p-4">
                  <div className="flex gap-4">
                    {/* Изображение товара */}
                    <div className="flex-shrink-0">
                      {item.product.mediaFiles && item.product.mediaFiles.length > 0 ? (
                        <Image
                          src={item.product.mediaFiles[0].url}
                          alt={item.product.name}
                          className="w-fit h-40 object-cover rounded-lg"
                        //   classNames={{
                        //     wrapper: "w-20 h-20",
                        //   }}
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 text-xs">Нет фото</span>
                        </div>
                      )}
                    </div>

                    {/* Информация о товаре */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold truncate">
                            {item.product.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Chip 
                              color={getStatusColor(item.product.status)}
                              size="sm"
                              variant="flat"
                            >
                              {getStatusLabel(item.product.status)}
                            </Chip>
                            <Chip 
                              color="default" 
                              size="sm" 
                              variant="bordered"
                            >
                              {getGenderLabel(item.product.gender)}
                            </Chip>
                          </div>
                        </div>

                        {/* Кнопка удаления */}
                        <Button
                          isIconOnly
                          variant="light"
                          color="danger"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={basket.removing}
                          aria-label="Удалить из корзины"
                        >
                          {basket.removing ? (
                            <Spinner size="md" />
                          ) : (
                            <TrashIcon className="w-6 h-6" />
                          )}
                        </Button>
                      </div>

                      {/* Цена */}
                      <div className="mt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">
                            {product.currency === 'KZT' 
                              ? `${item.product.priceKZT.toLocaleString()} ₸` 
                              : `$${item.product.priceUSD.toLocaleString()}`
                            }
                          </span>
                          <span className="text-small text-default-400"> | </span>
                          <span className="text-sm text-default-400">
                            {product.currency === 'KZT' 
                              ? `$${item.product.priceUSD}` 
                              : `${item.product.priceKZT.toLocaleString()} ₸`
                            }
                          </span>
                        </div>
                      </div>

                      {/* Характеристики */}
                      <div className="mt-2 text-sm text-default-500 flex flex-col gap-1">
                        
                        {/* Выбранные характеристики */}
                        {item.selectedSize && (
                          <span className="font-medium text-foreground">
                            Размер: {item.selectedSize.name}
                          </span>
                        )}
                        {item.selectedColor && (
                          <span className="font-medium text-foreground flex items-center gap-1">
                            Цвет: 
                            {item.selectedColor.hexCode && (
                              <div 
                                className="w-3 h-3 rounded-full border border-gray-300"
                                style={{ backgroundColor: item.selectedColor.hexCode }}
                              />
                            )}
                            {item.selectedColor.name}
                          </span>
                        )}
                        
                        {/* Доступные характеристики (если не выбраны) */}
                        {!item.selectedSize && item.product.sizes && item.product.sizes.length > 0 && (
                          <span>
                            Размеры: {item.product.sizes.map(s => s.name).join(', ')}
                          </span>
                        )}
                        {!item.selectedColor && item.product.colors && item.product.colors.length > 0 && (
                          <span>
                            Цвета: {item.product.colors.map(c => c.name).join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          {/* Итоговая информация */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardBody className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">Итого</h3>
                
                <Divider />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Товаров:</span>
                    <span className="font-medium">{basket.totalCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Сумма:</span>
                    <span className="font-bold text-lg">
                      {product.currency === 'KZT' 
                        ? `${basket.totalKZT.toLocaleString()} ₸` 
                        : `$${basket.totalUSD.toLocaleString()}`
                      }
                    </span>
                  </div>
                  <div className="text-sm text-default-400">
                    {product.currency === 'KZT' 
                      ? `$${basket.totalUSD.toLocaleString()}` 
                      : `${basket.totalKZT.toLocaleString()} ₸`
                    }
                  </div>
                </div>

                <Divider />

                <div className="space-y-3">
                  <Button
                    color="primary"
                    size="lg"
                    className="w-full"
                    onClick={handleCheckout}
                  >
                    Оформить заказ
                  </Button>
                  
                  <Button
                    color="danger"
                    variant="bordered"
                    size="lg"
                    className="w-full"
                    onClick={onClearModalOpen}
                  >
                    Очистить корзину
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>

      {/* Модальное окно подтверждения очистки корзины */}
      <Modal isOpen={isClearModalOpen} onClose={onClearModalClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Очистить корзину
              </ModalHeader>
              <ModalBody>
                <p>
                  Вы уверены, что хотите удалить все товары из корзины? 
                  Это действие нельзя отменить.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button 
                  color="default" 
                  variant="light" 
                  onPress={onClose}
                  disabled={basket.loading}
                >
                  Отмена
                </Button>
                <Button 
                  color="danger" 
                  onPress={handleClearBasket}
                  disabled={basket.loading}
                >
                  {basket.loading ? (
                    <>
                      <Spinner size="sm" />
                      Удаление...
                    </>
                  ) : (
                    'Удалить все'
                  )}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
});

export default BasketPage;
