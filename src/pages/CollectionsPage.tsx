import { useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Context, type IStoreContext } from "@/store/StoreProvider";
import { CollectionsList } from "@/components/CollectionsPageComponents";
import { useTranslate } from "@/utils/useTranslate";
import PageWrapper from "@/components/PageWrapper";

const CollectionsPage = observer(() => {
  const { collection } = useContext(Context) as IStoreContext;
  const { t } = useTranslate();
  useEffect(() => {
    collection.loadCollections();
  }, [collection]);

  return (
    <PageWrapper className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {t("collections")}
          </h1>
          <p className="text-default-600">
            {t("collections_description")}
          </p>
        </div>

        <CollectionsList />
      </div>
    </PageWrapper>
  );
});

export default CollectionsPage;
