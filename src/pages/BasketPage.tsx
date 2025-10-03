import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Spinner, useDisclosure } from "@heroui/react";
import { Context, type IStoreContext } from "@/store/StoreProvider";
import {
  BasketHeader,
  BasketEmpty,
  BasketList,
  BasketSummary,
  BasketClearModal
} from "@/components/BasketPageComponents";
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

  const handleUpdateQuantity = async (basketItemId: number, quantity: number) => {
    await basket.updateItemQuantity(basketItemId, quantity);
  };

  const handleAddMore = async (productId: number, selectedColorId?: number, selectedSizeId?: number) => {
    await basket.addProductToBasket(productId, selectedColorId, selectedSizeId);
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
      <BasketEmpty
        onBackClick={handleBackClick}
        onGoShopping={() => navigate(MAIN_ROUTE)}
      />
    );
  }

  return (
    <div className="min-h-screen">
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
    </div>
  );
});

export default BasketPage;
