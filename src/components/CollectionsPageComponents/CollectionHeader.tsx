import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Button } from "@heroui/react";
import { Context, type IStoreContext } from "@/store/StoreProvider";
import { ArrowLeft } from "lucide-react";
import { useTranslate } from "@/utils/useTranslate";

const CollectionHeader = observer(() => {
  const { collection } = useContext(Context) as IStoreContext;
  const navigate = useNavigate();
  const { t } = useTranslate();

  const handleBackClick = () => {
    navigate(-1);
  };

  if (!collection.currentCollection) return null;

  const currentCollection = collection.currentCollection;
  const mainImage = currentCollection.mediaFiles?.find(file => file.mimeType.includes('image'));

  return (
    <div className="relative w-full">
      {/* Кнопка назад */}
      <div className="absolute top-4 left-4 z-10">
        <Button
          isIconOnly
          color="default"
          variant="flat"
          size="lg"
          onPress={handleBackClick}
          className=" backdrop-blur-sm"
        >
          <ArrowLeft size={20} />
        </Button>
      </div>

      {/* Заглавное изображение */}
      <div className="relative w-full h-96 overflow-hidden">
        {mainImage ? (
          <img
            src={mainImage.url}
            alt={currentCollection.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-100">
            <span className="text-gray-400 text-xl">{t("no_image")}</span>
          </div>
        )}
        
        {/* Градиентный оверлей */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Информация о коллекции */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-4xl font-bold mb-2">
            {currentCollection.name}
          </h1>
          {currentCollection.description && (
            <p className="text-lg text-default-200 mb-4">
              {currentCollection.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
});

export default CollectionHeader;
