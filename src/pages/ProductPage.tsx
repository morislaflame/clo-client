import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import {
  Card,
  CardBody,
  Button,
} from "@heroui/react";
import { Context, type IStoreContext } from "@/store/StoreProvider";
import {
  ProductHeader,
  ProductMedia,
  ProductInfo,
  ProductSelectors,
  ProductActions
} from "@/components/ProductPageComponents";
import { useTranslate } from "@/utils/useTranslate";
import PageWrapper from "@/components/PageWrapper";
import LoadingPage from "@/components/LoadingPage";

const ProductPage = observer(() => {
  const { product, basket } = useContext(Context) as IStoreContext;
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedColorId, setSelectedColorId] = useState<string>("");
  const [selectedSizeId, setSelectedSizeId] = useState<string>("");
  // Состояния для валидации
  const [colorError, setColorError] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const { t } = useTranslate();

  useEffect(() => {
    if (id) {
      product.loadProduct(Number(id));
    }
  }, [id, product]);


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
    if (!id || !currentProduct) return;

    // Валидация выбора цвета и размера
    if (!validateSelection()) {
      return;
    }

    const result = await basket.addProductToBasket(
      currentProduct,
      selectedColorId ? Number(selectedColorId) : undefined,
      selectedSizeId ? Number(selectedSizeId) : undefined
    );
    
    if (result.success) {
      // Обновляем счетчик в навбаре
      basket.loadBasketCount().catch(console.error);
      // Можно добавить уведомление об успешном добавлении
    } else {
      // Можно добавить уведомление об ошибке
      console.error("Failed to add to basket:", 'error' in result ? result.error : 'Unknown error');
    }
  };

  

  const handleBuyNow = async () => {
    if (!id || !currentProduct) return;

    // Валидация выбора цвета и размера
    if (!validateSelection()) {
      return;
    }

    // Сначала добавляем в корзину
    const result = await basket.addProductToBasket(
      currentProduct,
      selectedColorId ? Number(selectedColorId) : undefined,
      selectedSizeId ? Number(selectedSizeId) : undefined
    );
    
    if (result.success) {
      // Перенаправляем на страницу корзины
      navigate('/basket');
    } else {
      console.error("Failed to add to basket:", 'error' in result ? result.error : 'Unknown error');
    }
  };

  if (product.loading) {
    return <LoadingPage message={t("loading_product")} />;
  }

  if (product.error || !product.currentProduct) {
    return (
      <PageWrapper className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <CardBody className="text-center">
            <p className="text-danger mb-4">
              {product.error || t("product_not_found")}
            </p>
            <div className="flex gap-2 justify-center">
              <Button
                color="primary"
                variant="flat"
                onClick={() => navigate("/")}
              >
                {t("to_main")}
              </Button>
              <Button
                color="default"
                variant="bordered"
                onClick={handleBackClick}
              >
                {t("back")}
              </Button>
            </div>
          </CardBody>
        </Card>
      </PageWrapper>
    );
  }

  const currentProduct = product.currentProduct;
  const isProductAvailable = currentProduct.status === 'AVAILABLE';

  return (
    <PageWrapper className="min-h-screen">
      <div className="container mx-auto p-4">
      {/* <div className="w-full h-full absolute top-0 left-0">
  <DotGrid
    dotSize={1}
    gap={15}
    baseColor="rgb(123, 123, 123)"
    activeColor="#5227FF"
    proximity={120}
    shockRadius={20}
    shockStrength={5}
    resistance={500}
    returnDuration={1.5}
  />
</div> */}
        <ProductHeader onBackClick={handleBackClick} />

        {/* Основной контент */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ProductMedia 
            mediaFiles={currentProduct.mediaFiles}
            productName={currentProduct.name}
          />

          {/* Правая часть - информация о товаре */}
          <div className="order-2 lg:order-2">
            <Card className="w-full h-fit bg-transparent border-none shadow-none">
              <CardBody className="p-0 space-y-4">
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
                  checkingBasket={false}
                  basketAdding={basket.adding}
                  onBuyNow={handleBuyNow}
                  onAddToBasket={handleAddToBasket}
                />
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
});

export default ProductPage;