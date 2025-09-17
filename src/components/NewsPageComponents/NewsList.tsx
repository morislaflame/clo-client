import React from 'react';
import type { News } from '@/types/types';
import FeaturedNewsCard from './FeaturedNewsCard';
import NewsGridCard from './NewsGridCard';

interface NewsListProps {
  news: News[];
  onNewsClick: (newsId: number) => void;
}

const NewsList: React.FC<NewsListProps> = ({ news, onNewsClick }) => {
  if (news.length === 0) {
    return null;
  }

  const [featuredNews, ...otherNews] = news;

  return (
    <div className="space-y-6">
      {/* Главная новость */}
      <FeaturedNewsCard 
        news={featuredNews} 
        onNewsClick={onNewsClick} 
      />

      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-default-500">Новости</h2>
      </div>
      
      {/* Остальные новости в виде сетки */}
      {otherNews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {otherNews.map((newsItem) => (
            <NewsGridCard 
              key={newsItem.id} 
              news={newsItem} 
              onNewsClick={onNewsClick} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsList;