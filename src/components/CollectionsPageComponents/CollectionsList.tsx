import { useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";
import {
  Card,
  CardBody,
  Pagination,
  Spinner,
  Button,
} from "@heroui/react";
import { Context, type IStoreContext } from "@/store/StoreProvider";
import CollectionCard from "./CollectionCard";
import { useTranslate } from "@/utils/useTranslate";

const CollectionsList = observer(() => {
  const { collection } = useContext(Context) as IStoreContext;
  const { t } = useTranslate();

  // Загружаем коллекции при монтировании
  useEffect(() => {
    collection.loadCollections();
  }, [collection]);

  const handlePageChange = (page: number) => {
    collection.goToPage(page);
  };

  if (collection.loading && collection.collections.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (collection.error) {
    return (
      <Card className="p-8">
        <CardBody className="text-center">
          <p className="text-danger">{collection.error}</p>
          <Button
            color="primary"
            variant="flat"
            onClick={() => collection.loadCollections()}
            className="mt-4"
          >
            {t("try_again")}
          </Button>
        </CardBody>
      </Card>
    );
  }

  if (collection.collections.length === 0) {
    return (
      <Card className="p-8">
        <CardBody className="text-center">
          <p className="text-default-500">{t("collections_not_found")}</p>
          <p className="text-small text-default-400 mt-2">
            {t("try_again")}
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div>
      {/* Сетка коллекций */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {collection.collections.map((collectionItem) => (
          <CollectionCard key={collectionItem.id} collection={collectionItem} />
        ))}
      </div>

      {/* Пагинация */}
      {collection.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination
            total={collection.totalPages}
            page={collection.currentPage}
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

export default CollectionsList;
