import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useDisclosure } from "@heroui/react";
import { Context, type IStoreContext } from "@/store/StoreProvider";
import {
  BasketHeader,
  BasketEmpty,
  BasketList,
  BasketSummary,
  BasketClearModal
} from "@/components/BasketPageComponents";
import { MAIN_ROUTE, CHECKOUT_ROUTE } from "@/utils/consts";
import PageWrapper from "@/components/PageWrapper";
import LoadingPage from "@/components/LoadingPage";
import { useTranslate } from "@/utils/useTranslate";

const BasketPage = observer(() => {
  const { basket, product } = useContext(Context) as IStoreContext;
  const navigate = useNavigate();
  const { isOpen: isClearModalOpen, onOpen: onClearModalOpen, onClose: onClearModalClose } = useDisclosure();
  const { t } = useTranslate();
  useEffect(() => {
    // Загружаем корзину при открытии страницы (для авторизованных с сервера, для гостей из localStorage)
    basket.loadBasket().catch(console.error);
  }, [basket]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleRemoveItem = async (productId: number, selectedColorId?: number, selectedSizeId?: number) => {
    await basket.removeProductFromBasket(productId, selectedColorId, selectedSizeId);
    // Счетчик обновится автоматически через MobX реактивность
  };

  const handleUpdateQuantity = async (productId: number, quantity: number, selectedColorId?: number, selectedSizeId?: number) => {
    await basket.updateItemQuantity(productId, quantity, selectedColorId, selectedSizeId);
  };

  const handleAddMore = async (productId: number, selectedColorId?: number, selectedSizeId?: number) => {
    // Находим товар в корзине, чтобы получить полную информацию о product
    const item = basket.items.find(
      item => item.productId === productId && 
      item.selectedColorId === selectedColorId && 
      item.selectedSizeId === selectedSizeId
    );
    
    if (item) {
      await basket.addProductToBasket(item.product, selectedColorId, selectedSizeId);
    }
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

  if (basket.loading) {
    return <LoadingPage message={t("loading_basket")} />;
  }

  if (basket.isEmpty) {
    return (
      <BasketEmpty
        onBackClick={handleBackClick}
        onGoShopping={() => navigate(MAIN_ROUTE)}
      />
    );
  }

  return (
    <PageWrapper className="min-h-screen">
      <div className="container mx-auto p-4">
        <BasketHeader onBackClick={handleBackClick} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <BasketList
            items={basket.items}
            currency={product.currency}
            onRemoveItem={handleRemoveItem}
            onUpdateQuantity={handleUpdateQuantity}
            onAddMore={handleAddMore}
            isRemoving={basket.removing}
            isUpdating={basket.updating}
            isAdding={basket.adding}
          />

          <BasketSummary
            totalCount={basket.totalCount}
            totalKZT={basket.totalKZT}
            totalUSD={basket.totalUSD}
            currency={product.currency}
            onCheckout={handleCheckout}
            onClearBasket={onClearModalOpen}
          />
        </div>
      </div>

      <BasketClearModal
        isOpen={isClearModalOpen}
        onClose={onClearModalClose}
        onConfirm={handleClearBasket}
        isLoading={basket.loading}
      />
    </PageWrapper>
  );
});

export default BasketPage;
