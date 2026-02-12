
import React, { useState, useMemo } from 'react';
import { UserIcon } from '../components/icons/UserIcon';
import { CalendarIcon } from '../components/icons/CalendarIcon';
import { EyeIcon } from '../components/icons/EyeIcon';
import { ChatBubbleIcon } from '../components/icons/ChatBubbleIcon';
import { ChevronRightIcon } from '../components/icons/ChevronRightIcon';
import { FilterIcon } from '../components/icons/FilterIcon';
import { PencilIcon } from '../components/icons/PencilIcon';
import { SearchIcon } from '../components/icons/SearchIcon';
import { PinIcon } from '../components/icons/PinIcon';
import { TrashIcon } from '../components/icons/TrashIcon';
import type { BoardPost, Page, User } from '../types';

const tagStyles: { [key in BoardPost['tagType']]: string } = {
  notice: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  free: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  qna: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  suggestion: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  review: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
};

const PostMetadata: React.FC<{ icon: React.ElementType; value: string | number }> = ({ icon: Icon, value }) => (
  <div className="flex items-center text-gray-500 dark:text-gray-400">
    <Icon className="w-3.5 h-3.5 mr-1.5" />
    <span className="text-xs">{value}</span>
  </div>
);

const BoardPostItem: React.FC<{ post: BoardPost; isNotice?: boolean; onNavigate: (page: Page, id?: number) => void; loggedInUser: User | null; onDeleteBoardPost: (postId: number) => void; }> = ({ post, isNotice, onNavigate, loggedInUser, onDeleteBoardPost }) => {
  const canDelete = !!loggedInUser && (loggedInUser.level === '관리자' || loggedInUser.name === post.author);

  return (
    <div className="relative">
      {canDelete && (
        <button
          type="button"
          onClick={() => onDeleteBoardPost(post.id)}
          className="absolute top-3 right-3 z-10 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
          title="삭제"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      )}
      <a 
        href="#" 
        onClick={(e) => { e.preventDefault(); onNavigate('board-detail', post.id); }} 
        className={`flex flex-col p-6 bg-white dark:bg-gray-800 border transition-all duration-300 group rounded-2xl shadow-sm hover:shadow-md hover:border-orange-300 dark:hover:border-orange-700 ${isNotice ? 'border-orange-200 dark:border-orange-900/50 ring-1 ring-orange-100 dark:ring-orange-900/20' : 'border-gray-200 dark:border-gray-700'}`}
      >
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-x-2">
                {isNotice && <PinIcon className="w-4 h-4 text-orange-500 flex-shrink-0" aria-label="고정된 공지" />}
                <span className={`inline-block px-2.5 py-1 text-[11px] font-bold rounded-md ${tagStyles[post.tagType]}`}>
                {post.tag}
                </span>
            </div>
            <div className="text-gray-300 dark:text-gray-600 group-hover:text-orange-500 transition-colors">
                <ChevronRightIcon className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-1">
            {post.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 line-clamp-2 min-h-[40px]">
            {post.description}
          </p>
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between mt-auto">
            <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                    <UserIcon className="w-4 h-4 text-gray-400" />
                </div>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{post.author}</span>
            </div>
            <div className="flex items-center gap-x-3">
                <PostMetadata icon={CalendarIcon} value={post.date.split(' ').slice(1).join(' ')} />
                <div className="flex items-center gap-x-2">
                    <PostMetadata icon={EyeIcon} value={post.views} />
                    <PostMetadata icon={ChatBubbleIcon} value={post.comments} />
                </div>
            </div>
        </div>
      </a>
    </div>
  );
};

const CategoryButton: React.FC<{ label: string; active?: boolean; onClick: () => void; }> = ({ label, active, onClick }) => (
    <button onClick={onClick} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
        active 
        ? 'bg-orange-600 text-white shadow' 
        : 'bg-gray-100 dark:bg-gray-800/50 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
    }`}>
        {label}
    </button>
);


interface BoardPageProps {
  onNavigate: (page: Page, id?: number) => void;
  boardPosts: BoardPost[];
  loggedInUser: User | null;
  onDeleteBoardPost: (postId: number) => void;
}

const BoardPage: React.FC<BoardPageProps> = ({ onNavigate, boardPosts, loggedInUser, onDeleteBoardPost }) => {
  const [activeFilter, setActiveFilter] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const categories = ['전체', '공지사항', '자유게시판', '질문&답변', '건의사항', '행사후기'];

  const noticePosts = boardPosts.filter(p => p.isNotice);
  const generalPosts = boardPosts.filter(p => !p.isNotice);
  const allPostsCount = boardPosts.length;

  const categoryMap: { [key: string]: BoardPost['tagType'] | null } = {
    '공지사항': 'notice',
    '자유게시판': 'free',
    '질문&답변': 'qna',
    '건의사항': 'suggestion',
    '행사후기': 'review',
  };

  const filteredPosts = useMemo(() => {
    let posts = generalPosts;

    const categoryType = categoryMap[activeFilter];
    if (categoryType) {
        posts = posts.filter(post => post.tagType === categoryType);
    }

    if (searchQuery.trim() !== '') {
        const lowercasedQuery = searchQuery.toLowerCase();
        posts = posts.filter(post => 
            post.title.toLowerCase().includes(lowercasedQuery) ||
            post.description.toLowerCase().includes(lowercasedQuery) ||
            post.author.toLowerCase().includes(lowercasedQuery)
        );
    }

    return posts;
  }, [activeFilter, searchQuery, generalPosts]);


  return (
    <div className="bg-gray-100 dark:bg-gray-950/80 min-h-screen">
       <header className="bg-orange-600">
            <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20 text-center text-white">
                <h1 className="text-4xl md:text-5xl font-bold">게시판</h1>
                <p className="mt-4 text-lg md:text-xl text-orange-100 max-w-3xl mx-auto font-medium">
                    회원들과 소통하고 다양한 의견을 나누어보세요
                </p>
            </div>
        </header>

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 -mt-10">
        <div className="space-y-8">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center text-gray-700 dark:text-gray-300 font-bold">
                        <FilterIcon className="w-5 h-5 mr-2 text-orange-500" />
                        <span>전체 {allPostsCount}개 게시글</span>
                    </div>
                    {loggedInUser && (
                        <button onClick={() => onNavigate('new-board-post')} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-orange-600 text-white font-bold px-6 py-2.5 rounded-lg hover:bg-orange-700 transition-all shadow-md active:scale-95">
                            <PencilIcon className="w-4 h-4" />
                            <span>글쓰기</span>
                        </button>
                    )}
                </div>

                <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <SearchIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="search"
                        placeholder="제목, 내용, 작성자로 검색하세요..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full py-3.5 pl-12 pr-4 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    />
                </div>
                
                <div className="flex items-center flex-wrap gap-2 border-t border-gray-100 dark:border-gray-800 pt-6">
                    {categories.map(cat => (
                        <CategoryButton 
                            key={cat} 
                            label={cat} 
                            active={activeFilter === cat}
                            onClick={() => setActiveFilter(cat)}
                        />
                    ))}
                </div>
            </div>

            <div className="space-y-12">
                {noticePosts.length > 0 && (
                    <section>
                        <div className="flex items-center gap-2 mb-6 pl-2">
                           <PinIcon className="w-6 h-6 text-orange-500" />
                           <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">중요 공지사항</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {noticePosts.map(post => <BoardPostItem key={post.id} post={post} isNotice onNavigate={onNavigate} loggedInUser={loggedInUser} onDeleteBoardPost={onDeleteBoardPost} />)}
                        </div>
                    </section>
                )}
                
                <section>
                    <div className="flex items-center justify-between mb-6 pl-2">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">일반 게시글 ({filteredPosts.length}건)</h2>
                    </div>
                    {filteredPosts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredPosts.map(post => <BoardPostItem key={post.id} post={post} onNavigate={onNavigate} loggedInUser={loggedInUser} onDeleteBoardPost={onDeleteBoardPost} />)}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400">
                            <p className="text-lg font-medium">검색 결과가 없습니다.</p>
                            <p className="text-sm mt-1">다른 검색어를 입력하거나 필터를 변경해보세요.</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
      </div>

      <section className="bg-orange-600 mt-12">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 text-center text-white">
          <h2 className="text-3xl font-bold">함께 소통해요</h2>
          <p className="mt-4 text-lg text-orange-100 max-w-2xl mx-auto font-medium">
            회원들과 활발한 소통으로 더 나은 공동체를 만들어가세요
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button onClick={() => onNavigate('signup')} className="bg-white text-orange-600 font-bold px-8 py-3 rounded-md hover:bg-gray-100 transition-all duration-200 w-full sm:w-auto text-base shadow-lg active:scale-95">
              회원가입하기
            </button>
            <button onClick={() => loggedInUser ? onNavigate('new-board-post') : onNavigate('login')} className="border border-white/50 bg-white/10 text-white font-bold px-8 py-3 rounded-md hover:bg-white/20 transition-all duration-200 w-full sm:w-auto text-base shadow-lg active:scale-95">
              첫 게시글 작성하기
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BoardPage;
