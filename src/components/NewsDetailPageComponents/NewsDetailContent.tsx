import React from 'react';
import type { News } from '@/types/types';

interface NewsDetailContentProps {
  news: News;
}

const NewsDetailContent: React.FC<NewsDetailContentProps> = ({ news }) => {
  return (
    <>
      {/* Описание */}
      {news.description && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">
            {news.description}
          </h2>
        </div>
      )}

      {/* Основной контент */}
      <div className="mb-6">
        <div className="prose max-w-none">
          <div 
            className="text-default-600 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />
        </div>
      </div>
    </>
  );
};

export default NewsDetailContent;
