import { useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Context } from "@/store/StoreProvider";
import type { IStoreContext } from "@/store/StoreProvider";
import {
  NewsDetailHeader,
  NewsDetailMedia,
  NewsDetailContent,
  NewsDetailLinks,
  NewsDetailError
} from "@/components/NewsDetailPageComponents";
import PageWrapper from "@/components/PageWrapper";
import LoadingPage from "@/components/LoadingPage";
import { useTranslate } from "@/utils/useTranslate";

const NewsDetailPage = observer(() => {
  const { news } = useContext(Context) as IStoreContext;
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslate();
  
  useEffect(() => {
    if (id) {
      news.fetchNewsById(Number(id));
    }
  }, [id, news]);

  const handleBackClick = () => {
    navigate(-1);
  };


  if (news.loading) {
    return <LoadingPage message={t("loading_news_detail")} />;
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
    <PageWrapper className="min-h-screen">
      <div className="w-full p-4">
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
    </PageWrapper>
  );
});

export default NewsDetailPage;
