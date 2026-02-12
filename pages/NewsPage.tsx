
import React from 'react';

import { SearchIcon } from '../components/icons/SearchIcon';
import { ListIcon } from '../components/icons/ListIcon';
import { MegaphoneIcon } from '../components/icons/MegaphoneIcon';
import { NewspaperIcon } from '../components/icons/NewspaperIcon';
import { BookOpenIcon } from '../components/icons/BookOpenIcon';
import { CalendarDaysIcon } from '../components/icons/CalendarDaysIcon';
import { ArrowRightIcon } from '../components/icons/ArrowRightIcon';
import { LinkIcon } from '../components/icons/LinkIcon';
import { CalendarIcon } from '../components/icons/CalendarIcon';
import { EyeIcon } from '../components/icons/EyeIcon';
import type { NewsArticle, Page, User } from '../types';

const FilterButton: React.FC<{ icon: React.ElementType, label: string, active?: boolean }> = ({ icon: Icon, label, active }) => (
    <button className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 ${
        active 
        ? 'bg-orange-600 text-white' 
        : 'bg-gray-200/80 dark:bg-gray-700/50 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600/60'
    }`}>
        <Icon className="w-5 h-5" />
        <span>{label}</span>
    </button>
);

const tagStyles: { [key: string]: string } = {
  red: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  green: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
  gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
};

const NewsListItem: React.FC<{ post: NewsArticle, onNavigate: (page: Page, id?: number) => void; }> = ({ post, onNavigate }) => {
    const { tags, title, description, date, views } = post;
    return (
        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('news-detail', post.id); }} className="block p-6 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md hover:border-orange-300 dark:hover:border-orange-700 dark:hover:bg-gray-700/50 transition-all duration-300 group">
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                    <div className="flex items-center flex-wrap gap-2 mb-3">
                        {tags.map(tag => (
                        <span key={tag.text} className={`inline-block px-2.5 py-1 text-xs font-semibold rounded ${tagStyles[tag.style]}`}>
                            {tag.text}
                        </span>
                        ))}
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                        {title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
                        {description}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-x-4">
                        <div className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-1.5" />
                        <span>{date}</span>
                        </div>
                        <div className="flex items-center">
                        <EyeIcon className="w-4 h-4 mr-1.5" />
                        <span>{views}</span>
                        </div>
                    </div>
                </div>
                <div className="ml-4 text-gray-300 dark:text-gray-500 group-hover:text-orange-600 dark:group-hover:text-orange-400 group-hover:translate-x-1 transition-transform duration-300 pt-1">
                    <ArrowRightIcon className="w-6 h-6" />
                </div>
            </div>
        </a>
    );
};


interface NewsPageProps {
    onNavigate: (page: Page, id?: number) => void;
    newsArticles: NewsArticle[];
    loggedInUser?: User | null;
}

const NewsPage: React.FC<NewsPageProps> = ({ onNavigate, newsArticles, loggedInUser }) => {
    const importantNotices = newsArticles.filter(a => a.isImportant);
    const latestNews = newsArticles.filter(a => !a.isImportant);

    return (
        <div className="bg-gray-50 dark:bg-gray-950">
            <header className="bg-orange-600 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold">소식 & 공지사항</h1>
                    <p className="mt-4 text-lg md:text-xl text-orange-100 max-w-3xl mx-auto">
                        공정교육바른인천연합의 최신 소식과 중요 공지사항을 확인하세요
                    </p>
                </div>
            </header>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-12">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-grow">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                <SearchIcon className="h-5 w-5 text-gray-400"/>
                            </div>
                            <input
                                type="search"
                                placeholder="제목이나 내용으로 검색하세요..."
                                className="w-full py-3 pl-11 pr-4 text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                            />
                        </div>
                        <div className="flex items-center gap-2 overflow-x-auto pb-2">
                             <FilterButton icon={ListIcon} label="전체" active/>
                             <FilterButton icon={MegaphoneIcon} label="공지사항"/>
                             <FilterButton icon={CalendarDaysIcon} label="행사소식"/>
                             <FilterButton icon={NewspaperIcon} label="언론보도"/>
                             <FilterButton icon={BookOpenIcon} label="교육프로그램"/>
                        </div>
                        {loggedInUser?.level === '관리자' && (
                            <div className="md:ml-auto">
                                <button
                                    type="button"
                                    onClick={() => onNavigate('new-news-post')}
                                    className="bg-orange-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-orange-700 transition-colors duration-200 whitespace-nowrap"
                                >
                                    글 작성
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <section>
                    <div className="flex items-center gap-2 mb-6">
                        <LinkIcon className="w-6 h-6 text-red-500 transform -rotate-45" />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">중요 공지</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                        {importantNotices.map(post => <NewsListItem key={post.id} post={post} onNavigate={onNavigate}/>)}
                    </div>
                </section>
                
                <section className="mt-16">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-6">최신 소식 ({latestNews.length}건)</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {latestNews.map(post => <NewsListItem key={post.id} post={post} onNavigate={onNavigate}/>)}
                    </div>
                </section>
            </main>

             <section className="bg-orange-600">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-white">
                <h2 className="text-3xl font-bold">소식을 놓치지 마세요</h2>
                <p className="mt-4 text-lg text-orange-100 max-w-2xl mx-auto">
                  공정교육바른인천연합의 최신 소식을 가장 빠르게 받아보세요
                </p>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <button onClick={() => onNavigate('signup')} className="bg-white text-orange-600 font-semibold px-8 py-3 rounded-md hover:bg-gray-100 transition-colors duration-200 w-full sm:w-auto">
                    회원가입하기
                  </button>
                  <button className="border border-white/50 bg-white/10 text-white font-semibold px-8 py-3 rounded-md hover:bg-white/20 transition-colors duration-200 w-full sm:w-auto">
                    문의하기
                  </button>
                </div>
              </div>
            </section>
        </div>
    );
};

export default NewsPage;
