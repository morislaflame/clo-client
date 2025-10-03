import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import {
  Card,
  CardBody,
  Spinner,
} from "@heroui/react";
import { Context, type IStoreContext } from "@/store/StoreProvider";
import type { Product } from "@/types/types";
import { motion } from "motion/react";
import { useTranslate } from "@/utils/useTranslate";

const ProductCard = observer(({ item }: { item: Product }) => {
  const { product } = useContext(Context) as IStoreContext;
  const navigate = useNavigate();
  const { t } = useTranslate();
  
  // Получаем первое изображение
  const mainImage = item.mediaFiles?.find(file => file.mimeType.includes('image'));
  
  const handleCardClick = () => {
    navigate(`/product/${item.id}`);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="w-full h-full cursor-pointer hover:shadow-lg transition-shadow bg-transparent"
        isPressable
        onPress={handleCardClick}
      >
        <div className="relative w-full h-78 overflow-hidden flex items-center justify-center bg-white rounded-lg"
        >
          {mainImage ? (
            <img
              src={mainImage.url}
              alt={item.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-100">
              <span className="text-gray-400">{t("no_image")}</span>
            </div>
          )}
        </div>

        <CardBody className="pb-2">
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
    </motion.div>
  );
});

const CollectionProductsList = observer(({ products }: { products: Product[] }) => {
  const { product } = useContext(Context) as IStoreContext;
  const { t } = useTranslate();

  if (product.loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <Card className="p-8">
        <CardBody className="text-center">
          <p className="text-default-500">{t("products_in_collection_not_found")}</p>
          <p className="text-small text-default-400 mt-2">
            {t("no_products_in_collection")}
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div>
      {/* Сетка товаров */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {products.map((productItem) => (
          <ProductCard key={productItem.id} item={productItem} />
        ))}
      </div>
    </div>
  );
});

export default CollectionProductsList;
