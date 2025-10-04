import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Spinner, useDisclosure} from '@heroui/react';
import { Context, type IStoreContext } from '@/store/StoreProvider';
import {
  OrdersHeader,
  OrderCard,
  OrderDetailsModal,
  EmptyOrdersState
} from '@/components/OrdersPageComponents';
import { MAIN_ROUTE } from '@/utils/consts';
import type { Order } from '@/http/orderAPI';
import PageWrapper from '@/components/PageWrapper';

const OrdersPage = observer(() => {
  const { user, product, order } = useContext(Context) as IStoreContext;
  const navigate = useNavigate();
  
  // Модальные окна
  const { isOpen: isDetailsModalOpen, onOpen: onDetailsModalOpen, onClose: onDetailsModalClose } = useDisclosure();
  
  // Состояние
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!user.isAuth) {
      navigate(MAIN_ROUTE);
      return;
    }

    // Загружаем заказы при открытии страницы
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.isAuth, navigate]);

  const loadOrders = async () => {
    try {
      await order.loadUserOrders({
        page: 1,
        limit: itemsPerPage,
        status: ''
      });
    } catch (error) {
      console.error('Ошибка загрузки заказов:', error);
    }
  };

  const handleViewDetails = (orderId: number) => {
    const foundOrder = order.orders.find(o => o.id === orderId);
    if (foundOrder) {
      setSelectedOrder(foundOrder);
      onDetailsModalOpen();
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    if (window.confirm('Вы уверены, что хотите отменить этот заказ?')) {
      const result = await order.cancelUserOrder(orderId);
      if (result.success) {
        // Перезагружаем заказы после отмены
        await loadOrders();
      } else {
        console.error('Ошибка отмены заказа:', result.error);
      }
    }
  };


  const handleGoShopping = () => {
    navigate(MAIN_ROUTE);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  if (!user.isAuth) {
    return null; // Редирект уже произошел в useEffect
  }

  if (order.loading && order.orders.length === 0) {
    return (
      <PageWrapper className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="min-h-screen">
      <div className="container mx-auto p-4">
        <OrdersHeader onBackClick={handleBackClick} />

        {order.hasOrders ? (
          <>

            <div className="space-y-4">
              {order.orders.map((orderItem) => (
                <OrderCard
                  key={orderItem.id}
                  order={orderItem}
                  onViewDetails={handleViewDetails}
                  onCancelOrder={handleCancelOrder}
                  canCancel={orderItem.status === 'CREATED'}
                  currency={product.currency}
                />
              ))}
            </div>

            {/* Пагинация */}
            {/* {order.totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <Pagination
                  total={order.totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  showControls
                  showShadow
                  color="default"
                />
              </div>
            )} */}
          </>
        ) : (
          <EmptyOrdersState onGoShopping={handleGoShopping} />
        )}

        {/* Модальное окно с деталями заказа */}
        <OrderDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={onDetailsModalClose}
          order={selectedOrder}
          currency={product.currency}
        />
      </div>
    </PageWrapper>
  );
});

export default OrdersPage;
