import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import {
  Card,
  CardBody,
  Button,
  Spinner,
} from "@heroui/react";
import { Context, type IStoreContext } from "@/store/StoreProvider";
import {
  ProductHeader,
  ProductMedia,
  ProductInfo,
  ProductSelectors,
  ProductActions
} from "@/components/ProductPageComponents";

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
  const isProductAvailable = currentProduct.status === 'AVAILABLE';

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-4">
        <ProductHeader onBackClick={handleBackClick} />

        {/* Основной контент */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ProductMedia 
            mediaFiles={currentProduct.mediaFiles}
            productName={currentProduct.name}
          />

          {/* Правая часть - информация о товаре */}
          <div className="order-2 lg:order-2">
            <Card className="w-full h-fit">
              <CardBody className="p-4 space-y-4">
                <ProductInfo 
                  product={currentProduct}
                  currency={product.currency}
                />

                <ProductSelectors
                  product={currentProduct}
                  selectedColorId={selectedColorId}
                  setSelectedColorId={setSelectedColorId}
                  selectedSizeId={selectedSizeId}
                  setSelectedSizeId={setSelectedSizeId}
                  colorError={colorError}
                  setColorError={setColorError}
                  sizeError={sizeError}
                  setSizeError={setSizeError}
                />

                <ProductActions
                  isProductAvailable={isProductAvailable}
                  checkingBasket={checkingBasket}
                  isInBasket={isInBasket}
                  basketAdding={basket.adding}
                  onBuyNow={handleBuyNow}
                  onAddToBasket={handleAddToBasket}
                />
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ProductPage;