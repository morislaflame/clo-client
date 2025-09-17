import React from 'react';
import type { News } from '@/types/types';

interface NewsDetailLinksProps {
  news: News;
}

const NewsDetailLinks: React.FC<NewsDetailLinksProps> = ({ news }) => {
  if (!news.links || news.links.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-3">Ссылки</h2>
      <div className="space-y-2">
        {news.links.map((link: string, index: number) => (
          <div key={index}>
            <a 
              href={link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {link}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsDetailLinks;
