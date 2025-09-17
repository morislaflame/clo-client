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
          <h2 className="text-xl font-semibold mb-3">Описание</h2>
          <p className="text-default-600 leading-relaxed">
            {news.description}
          </p>
        </div>
      )}

      {/* Основной контент */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Содержание</h2>
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
