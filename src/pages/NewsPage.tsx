import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Spinner } from "@heroui/react";
import { Context } from "@/store/StoreProvider";
import type { IStoreContext } from "@/store/StoreProvider";
import {
  NewsHeader,
  NewsList,
  NewsPagination,
  NewsEmpty
} from "@/components/NewsPageComponents";

const NewsPage = observer(() => {
  const { news, newsType } = useContext(Context) as IStoreContext;
  const navigate = useNavigate();
  

  useEffect(() => {
    // Загружаем новости и типы новостей при открытии страницы
    news.fetchNews({ status: 'PUBLISHED', newsTypeId: undefined });
    newsType.fetchNewsTypesWithCounts();
  }, [news, newsType]);

  const handleNewsClick = (newsId: number) => {
    navigate(`/news/${newsId}`);
  };

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



  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-4 relative">
        <NewsHeader onBackClick={handleBackClick} />
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
    </div>
  );
});

export default NewsPage;
