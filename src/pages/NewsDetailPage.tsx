import { useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Spinner } from "@heroui/react";
import { Context } from "@/store/StoreProvider";
import type { IStoreContext } from "@/store/StoreProvider";
import {
  NewsDetailHeader,
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

            <NewsDetailMedia 
              mediaFiles={currentNews.mediaFiles || []} 
              newsTitle={currentNews.title}
            />

            <NewsDetailContent news={currentNews} />

            <NewsDetailLinks news={currentNews} />

        </div>
      </div>
    </div>
  );
});

export default NewsDetailPage;
