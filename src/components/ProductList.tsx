import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import {
  Card,
  CardBody,
  Button,
  Pagination,
} from "@heroui/react";
import { Context, type IStoreContext } from "@/store/StoreProvider";
import type { Product } from "@/types/types";
import { ProgressiveBlur } from "./ui/progressive-blur";
import { motion } from "motion/react";
import ProductSkeleton from "./ui/ProductSkeleton";
import { useTranslate } from "@/utils/useTranslate";

const ProductCard = observer(({ item }: { item: Product }) => {
  const { product} = useContext(Context) as IStoreContext;
  const navigate = useNavigate();
  const [isHover, setIsHover] = useState(false);
  const { t } = useTranslate();
  // Получаем первое изображение
  const mainImage = item.mediaFiles?.find(file => file.mimeType.includes('image'));
  

  const handleCardClick = () => {
    navigate(`/product/${item.id}`);
  };

  return (
    <Card 
      className="w-full h-full cursor-pointer hover:shadow-lg transition-shadow bg-transparent"
      isPressable
      onPress={handleCardClick}
    >
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

      <div className="relative w-full h-78 overflow-hidden flex items-center justify-center bg-white rounded-lg"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}>
        {mainImage ? (
          <>
            <img
            src={mainImage.url}
            alt={item.name}
            className="w-full h-full object-cover rounded-lg"
          />
          <ProgressiveBlur
        className='pointer-events-none absolute bottom-0 left-0 h-[75%] w-full '
        blurIntensity={0.5}
        animate={isHover ? 'visible' : 'hidden'}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      />
      <motion.div
        className='absolute bottom-0 left-0'
        animate={isHover ? 'visible' : 'hidden'}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <div className='flex flex-col items-start gap-0 px-5 py-4'>
          <p className='text-base font-medium text-black'>{item.sizes.map(size => size.name).join(', ')}</p>
          <span className='text-base text-black'>{item.description}</span>
        </div>
      </motion.div>
      </>
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-100">
            <span className="text-gray-400">{t("no_image")}</span>
          </div>
        )}
      </div>

      <CardBody className="pb-2 ">
          <h4 className="font-bold text-large line-clamp-2">
            {item.name}
          </h4>
          <div className="flex justify-between items-center w-full">
          <div className="flex gap-2 items-center">
            <span className="text-base font-bold">
                {product.currency === 'KZT' 
                    ? `${item.priceKZT.toLocaleString()} ₸` 
                    : `${item.priceUSD.toLocaleString()} $`
                  }
            </span>
            <span className="text-small text-default-400 font-bold"> | </span>
                <span className="text-small text-default-400">
                  {product.currency === 'KZT' 
                    ? `$${item.priceUSD}` 
                    : `${item.priceKZT.toLocaleString()} ₸`
                  }
                  </span>
          </div>
        </div>
      </CardBody>

    </Card>
  );
});

const ProductList = observer(() => {
  const { product } = useContext(Context) as IStoreContext;
  const { t } = useTranslate();
  // Загружаем товары при монтировании
  useEffect(() => {
    product.loadProducts();
  }, [product]);

  const handlePageChange = (page: number) => {
    product.goToPage(page);
  };

  if (product.loading) {
    return (
      <div>
        {/* Сетка скелетонов */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
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
            {t("try_again")}
          </Button>
        </CardBody>
      </Card>
    );
  }

  if (product.products.length === 0) {
    return (
      <Card className="p-8">
        <CardBody className="text-center">
          <p className="text-default-500">{t("products_not_found")}</p>
          <p className="text-small text-default-400 mt-2">
            {t("try_to_change_filters")}
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div>

      {/* Сетка товаров */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {product.products.map((productItem) => (
          <ProductCard key={productItem.id} item={productItem} />
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