import { useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Spinner, Divider } from "@heroui/react";
import { Context } from "@/store/StoreProvider";
import type { IStoreContext } from "@/store/StoreProvider";
import {
  NewsDetailHeader,
  NewsDetailMeta,
  NewsDetailMedia,
  NewsDetailContent,
  NewsDetailLinks,
  NewsDetailError
} from "@/components/NewsDetailPageComponents";

const NewsDetailPage = observer(() => {
  const { news } = useContext(Context) as IStoreContext;
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      news.fetchNewsById(Number(id));
    }
  }, [id, news]);

  const handleBackClick = () => {
    navigate(-1);
  };


  if (news.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (news.error || !news.currentNews) {
    return (
      <NewsDetailError
        error={news.error}
        onGoToNews={() => navigate("/news")}
        onGoBack={handleBackClick}
      />
    );
  }

  const currentNews = news.currentNews;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-4">
        <NewsDetailHeader onBackClick={handleBackClick} />

        {/* Основной контент */}
        <div className="max-w-4xl mx-auto">
          <div className=" rounded-lg shadow-sm border p-6">
            <NewsDetailMeta news={currentNews} />

            <Divider className="mb-6" />

            <NewsDetailMedia 
              mediaFiles={currentNews.mediaFiles || []} 
              newsTitle={currentNews.title}
            />

            <NewsDetailContent news={currentNews} />

            <NewsDetailLinks news={currentNews} />

            <Divider className="mb-4" />

            {/* Дополнительная информация */}
            <div className="text-sm text-default-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">ID новости:</span> {currentNews.id}
                </div>
                <div>
                  <span className="font-medium">Последнее обновление:</span> {new Date(currentNews.updatedAt).toLocaleDateString('ru-RU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default NewsDetailPage;
