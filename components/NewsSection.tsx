
import React from 'react';
import NewsCard from './NewsCard';
import type { NewsArticle } from '../types';
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import type { Page } from '../types';

interface NewsSectionProps {
  articles: NewsArticle[];
  onNavigate: (page: Page, id?: number) => void;
}

const NewsSection: React.FC<NewsSectionProps> = ({ articles, onNavigate }) => {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">최신 소식</h2>
        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('news'); }} className="flex items-center text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
          <span>더 보기</span>
          <ArrowRightIcon className="w-4 h-4 ml-2" />
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <NewsCard key={article.id} article={article} onNavigate={onNavigate} />
        ))}
      </div>
    </section>
  );
};

export default NewsSection;
