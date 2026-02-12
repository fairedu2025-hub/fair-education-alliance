
import React from 'react';
import type { NewsArticle } from '../types';
import { CalendarIcon } from './icons/CalendarIcon';
import { EyeIcon } from './icons/EyeIcon';
import type { Page } from '../types';

interface NewsCardProps {
  article: NewsArticle;
  onNavigate: (page: Page, id?: number) => void;
}

const tagStyles: Record<string, string> = {
  red: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  green: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
  gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
};

const NewsCard: React.FC<NewsCardProps> = ({ article, onNavigate }) => {
  const { tags, title, description, date, views } = article;

  return (
    <a
      href="#"
      onClick={(e) => { e.preventDefault(); onNavigate('news-detail', article.id); }}
      className="block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-lg dark:hover:bg-gray-700/50 transition-all duration-300 p-6 flex flex-col group focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:ring-orange-500"
    >
      <div className="flex-grow">
        <div className="flex flex-wrap items-center gap-2 mb-4">
            {tags.map((tag, index) => (
                 <span key={index} className={`inline-block px-3 py-1 text-xs font-semibold rounded-md ${tagStyles[tag.style] || tagStyles.default}`}>
                    {tag.text}
                </span>
            ))}
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">{description}</p>
      </div>
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center">
          <CalendarIcon className="w-4 h-4 mr-2" />
          <span>{date}</span>
        </div>
        <div className="flex items-center">
          <EyeIcon className="w-4 h-4 mr-2" />
          <span>{views.toLocaleString()}</span>
        </div>
      </div>
    </a>
  );
};

export default NewsCard;
