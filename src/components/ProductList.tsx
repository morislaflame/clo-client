import { useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";
import {
  Card,
  CardBody,
  CardFooter,
  Image,
  Button,
  Pagination,
  Spinner,
} from "@heroui/react";
import { Context, type IStoreContext } from "@/store/StoreProvider";
import type { Product } from "@/types/types";

const ProductCard = observer(({ product }: { product: Product }) => {
  const { product: productStore } = useContext(Context) as IStoreContext;
  
  const currency = productStore.filters.currency || 'KZT';
  const price = currency === 'KZT' ? product.priceKZT : product.priceUSD;
  const currencySymbol = currency === 'KZT' ? '₸' : '$';
  
  // Получаем первое изображение
  const mainImage = product.mediaFiles?.find(file => file.mimeType.includes('image'));
  
  // Получаем доступные размеры
  const availableSizes = product.sizes?.map(size => size.name).join(', ') || '';
  
  // Получаем доступные цвета
  const availableColors = product.colors?.map(color => color.name).join(', ') || '';

  return (
    <Card className="w-full h-full">
      {/* <CardHeader className="p-3">
        <div className="flex justify-between items-start w-full">
          <Chip 
            color={statusColors[product.status]} 
            size="sm" 
            variant="flat"
          >
            {statusLabels[product.status]}
          </Chip>
          <Chip 
            color="default" 
            size="sm" 
            variant="bordered"
          >
            {genderLabels[product.gender]}
          </Chip>
        </div>
      </CardHeader> */}

      <div className="relative w-full h-48 overflow-hidden flex items-center justify-center bg-white">
        {mainImage ? (
          <Image
            src={mainImage.url}
            alt={product.name}
            className="object-cover w-full h-full"
            classNames={{
              wrapper: "w-full h-full",
            }}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-100">
            <span className="text-gray-400">Нет изображения</span>
          </div>
        )}
      </div>

      <CardBody className="px-3 py-3">
        <div className="space-y-2">
          <h4 className="font-bold text-large line-clamp-2">
            {product.name}
          </h4>
          
          
          <div className="flex flex-col gap-1">
            
            {availableSizes && (
              <div className="text-tiny text-default-400">
                <span className="font-medium font-bold text-default-500">Размеры:</span> {availableSizes}
              </div>
            )}
            
            {availableColors && (
              <div className="text-tiny text-default-400">
                <span className="font-medium font-bold text-default-500">Цвета:</span> {availableColors}
              </div>
            )}
          </div>
        </div>
      </CardBody>

      <CardFooter className="pt-0 px-3 pb-3">
        <div className="flex justify-between items-center w-full">
          <div className="flex gap-2 items-center">
            <span className="text-base font-bold">
              {price.toLocaleString()} {currencySymbol}
            </span>
            <span className="text-small text-default-400 flex items-center justify-center h-full font-bold"> | </span>
            {currency === 'KZT' && product.priceUSD > 0 && (
              <span className="text-small text-default-400">
                ${product.priceUSD}
              </span>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
});

const ProductList = observer(() => {
  const { product } = useContext(Context) as IStoreContext;

  // Загружаем товары при монтировании
  useEffect(() => {
    product.loadProducts();
  }, [product]);

  const handlePageChange = (page: number) => {
    product.goToPage(page);
  };

  if (product.loading && product.products.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (product.error) {
    return (
      <Card className="p-8">
        <CardBody className="text-center">
          <p className="text-danger">{product.error}</p>
          <Button
            color="primary"
            variant="flat"
            onClick={() => product.loadProducts()}
            className="mt-4"
          >
            Попробовать снова
          </Button>
        </CardBody>
      </Card>
    );
  }

  if (product.products.length === 0) {
    return (
      <Card className="p-8">
        <CardBody className="text-center">
          <p className="text-default-500">Товары не найдены</p>
          <p className="text-small text-default-400 mt-2">
            Попробуйте изменить фильтры поиска
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div>
      {/* Заголовок с количеством товаров */}
      <div className="flex justify-between items-center">
        {product.loading && (
          <Spinner size="sm" />
        )}
      </div>

      {/* Сетка товаров */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {product.products.map((productItem) => (
          <ProductCard key={productItem.id} product={productItem} />
        ))}
      </div>

      {/* Пагинация */}
      {product.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination
            total={product.totalPages}
            page={product.currentPage}
            onChange={handlePageChange}
            showControls
            showShadow
            classNames={{
              wrapper: "gap-0 overflow-visible",
              item: "w-8 h-8 text-small rounded-none bg-transparent",
              cursor: "bg-primary text-primary-foreground",
            }}
          />
        </div>
      )}
    </div>
  );
});

export default ProductList;