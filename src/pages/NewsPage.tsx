import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Context } from "@/store/StoreProvider";
import type { IStoreContext } from "@/store/StoreProvider";
import {
  NewsList,
  NewsPagination,
  NewsEmpty
} from "@/components/NewsPageComponents";
import PageWrapper from "@/components/PageWrapper";
import LoadingPage from "@/components/LoadingPage";
import { useTranslate } from "@/utils/useTranslate";

const NewsPage = observer(() => {
  const { news, newsType } = useContext(Context) as IStoreContext;
  const navigate = useNavigate();
  const { t } = useTranslate();
  
  useEffect(() => {
    // Загружаем новости и типы новостей при открытии страницы
    news.fetchNews({ status: 'PUBLISHED', newsTypeId: undefined });
    newsType.fetchNewsTypesWithCounts();
  }, [news, newsType]);

  const handleNewsClick = (newsId: number) => {
    navigate(`/news/${newsId}`);
  };



  if (news.loading) {
    return <LoadingPage message={t("loading_news")} />;
  }



  return (
    <PageWrapper className="min-h-screen">
      <div className="w-full p-4 relative">
        {/* <NewsHeader onBackClick={handleBackClick} /> */}
{/* 
        <NewsFilters
          selectedNewsType={selectedNewsType}
          selectedStatus={selectedStatus}
          onNewsTypeChange={setSelectedNewsType}
          onStatusChange={setSelectedStatus}
        /> */}

        {news.news.length === 0 ? (
          <NewsEmpty />
        ) : (
          <NewsList
            news={news.news}
            onNewsClick={handleNewsClick}
          />
        )}

        <NewsPagination
          totalPages={news.totalPages}
          currentPage={news.currentPage}
          onPageChange={(page) => {
            news.fetchNews({ 
              status: 'PUBLISHED', 
              newsTypeId: undefined,
              page 
            });
          }}
        />
      </div>
    </PageWrapper>
  );
});

export default NewsPage;
