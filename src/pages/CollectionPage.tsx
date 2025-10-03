import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Spinner, Card, CardBody, Button } from "@heroui/react";
import { Context, type IStoreContext } from "@/store/StoreProvider";
import { CollectionHeader, CollectionProductsList } from "@/components/CollectionsPageComponents";
import { useTranslate } from "@/utils/useTranslate";

const CollectionPage = observer(() => {
  const { collection } = useContext(Context) as IStoreContext;
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslate();

  useEffect(() => {
    const loadCollection = async () => {
      if (id) {
        try {
          setIsLoading(true);
          await collection.loadCollection(Number(id));
        } catch (error) {
          console.error("Error loading collection:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadCollection();
  }, [id, collection]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (collection.error || !collection.currentCollection) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <CardBody className="text-center">
            <p className="text-danger mb-4">
              {collection.error || t("collection_not_found")}
            </p>
            <Button
              color="default"
              variant="flat"
              onClick={() => window.history.back()}
            >
              {t("back")}
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Заголовок коллекции с изображением */}
      <CollectionHeader />

      {/* Список продуктов */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">
            {t("drop")}
          </h2>
          <p className="text-default-600">
            "{collection.currentCollection.name}"
          </p>
        </div>

        <CollectionProductsList products={collection.currentCollection?.products || []} />
      </div>
    </div>
  );
});

export default CollectionPage;
