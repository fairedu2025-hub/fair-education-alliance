
import React from 'react';
import type { NewsArticle, Page, User } from '../types';
import { CalendarIcon } from '../components/icons/CalendarIcon';
import { EyeIcon } from '../components/icons/EyeIcon';
import { ChevronLeftIcon } from '../components/icons/ChevronLeftIcon';

const tagStyles: { [key: string]: string } = {
  red: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  green: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
  gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
};

interface NewsDetailPageProps {
    article: NewsArticle;
    allArticles: NewsArticle[];
    onNavigate: (page: Page, id?: number) => void;
    loggedInUser?: User | null;
    onDeleteNewsPost: (newsId: number) => void;
}

const NewsDetailPage: React.FC<NewsDetailPageProps> = ({ article, allArticles, onNavigate, loggedInUser, onDeleteNewsPost }) => {
    
    const currentIndex = allArticles.findIndex(a => a.id === article.id);
    const prevArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
    const nextArticle = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;

    return (
        <div className="bg-white dark:bg-gray-900">
            <header className="bg-gray-50 dark:bg-gray-950/50 pt-16 pb-12">
                <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <button onClick={() => onNavigate('news')} className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors mb-6">
                        <ChevronLeftIcon className="w-5 h-5" />
                        <span>목록으로 돌아가기</span>
                    </button>
                    {loggedInUser?.level === '관리자' && (
                        <div className="mb-6 flex justify-end">
                            <button
                                type="button"
                                onClick={() => onDeleteNewsPost(article.id)}
                                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                            >
                                글 삭제
                            </button>
                        </div>
                    )}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        {article.tags.map(tag => (
                            <span key={tag.text} className={`inline-block px-3 py-1 text-sm font-semibold rounded-md ${tagStyles[tag.style]}`}>
                                {tag.text}
                            </span>
                        ))}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight">{article.title}</h1>
                    <div className="mt-6 flex items-center text-sm text-gray-500 dark:text-gray-400 gap-x-6">
                        <div className="flex items-center">
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            <span>{article.date}</span>
                        </div>
                        <div className="flex items-center">
                            <EyeIcon className="w-4 h-4 mr-2" />
                            <span>조회수 {article.views.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <article className="max-w-none">
                    {article.images && article.images.length > 0 && (
                        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {article.images.map((imageSrc, index) => (
                                <img
                                    key={`${article.id}-image-${index}`}
                                    src={imageSrc}
                                    alt={`첨부 이미지 ${index + 1}`}
                                    className="w-full rounded-lg border border-gray-200 dark:border-gray-700"
                                />
                            ))}
                        </div>
                    )}
                    <div className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-6">
                        {article.content.split('\n').map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                </article>

                <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    {prevArticle ? (
                        <button onClick={() => onNavigate('news-detail', prevArticle.id)} className="text-left group p-4 -m-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <p className="text-sm text-gray-500 dark:text-gray-400">이전 글</p>
                            <p className="mt-1 font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate max-w-xs sm:max-w-sm">{prevArticle.title}</p>
                        </button>
                    ) : <div />}
                    
                    {nextArticle ? (
                        <button onClick={() => onNavigate('news-detail', nextArticle.id)} className="text-right group p-4 -m-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <p className="text-sm text-gray-500 dark:text-gray-400">다음 글</p>
                            <p className="mt-1 font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate max-w-xs sm:max-w-sm">{nextArticle.title}</p>
                        </button>
                    ) : <div />}
                </div>
            </main>
        </div>
    );
};

export default NewsDetailPage;
