import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import {
  Card,
  CardBody,
} from "@heroui/react";
import type { Collection, MediaFile } from "@/http/collectionAPI";
import { motion } from "motion/react";
import { useTranslate } from "@/utils/useTranslate";

const CollectionCard = observer(({ collection }: { collection: Collection }) => {
  const navigate = useNavigate();
  const { t } = useTranslate();
  // Получаем первое изображение коллекции
  const mainImage = collection.mediaFiles?.find((file: MediaFile) => file.mimeType.includes('image'));
  
  const handleCardClick = () => {
    navigate(`/collection/${collection.id}`);
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
        <div className="relative w-full h-64 overflow-hidden flex items-center justify-center bg-white rounded-lg">
          {mainImage ? (
            <img
              src={mainImage.url}
              alt={collection.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-100">
              <span className="text-gray-400">{t("no_image")}</span>
            </div>
          )}
        </div>

        <CardBody className="pb-4">
          <h3 className="font-bold text-lg line-clamp-2 mb-2">
            {collection.name}
          </h3>
          {collection.description && (
            <p className="text-sm text-gray-600 line-clamp-3 mb-2">
              {collection.description}
            </p>
          )}
          <div className="text-sm text-gray-500">
            {collection.products?.length || 0} {t("products")}
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
});

export default CollectionCard;
