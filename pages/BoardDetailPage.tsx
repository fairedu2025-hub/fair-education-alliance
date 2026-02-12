import React from 'react';
import type { BoardPost, Page, User } from '../types';
import { CalendarIcon } from '../components/icons/CalendarIcon';
import { EyeIcon } from '../components/icons/EyeIcon';
import { ChevronLeftIcon } from '../components/icons/ChevronLeftIcon';
import { UserIcon } from '../components/icons/UserIcon';
import { ChatBubbleIcon } from '../components/icons/ChatBubbleIcon';

const tagStyles: { [key in BoardPost['tagType']]: string } = {
  notice: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  free: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  qna: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  suggestion: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  review: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
};

interface BoardDetailPageProps {
    post: BoardPost;
    allPosts: BoardPost[];
    onNavigate: (page: Page, id?: number) => void;
    loggedInUser: User | null;
    onDeleteBoardPost: (postId: number) => void;
}

const BoardDetailPage: React.FC<BoardDetailPageProps> = ({ post, allPosts, onNavigate, loggedInUser, onDeleteBoardPost }) => {
    
    const currentIndex = allPosts.findIndex(p => p.id === post.id);
    const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
    const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
    const canDelete = !!loggedInUser && (loggedInUser.level === '관리자' || loggedInUser.name === post.author);

    return (
        <div className="bg-white dark:bg-gray-900">
            <header className="bg-gray-50 dark:bg-gray-950/50 pt-16 pb-12">
                <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <button onClick={() => onNavigate('board')} className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors mb-6">
                        <ChevronLeftIcon className="w-5 h-5" />
                        <span>게시판으로 돌아가기</span>
                    </button>
                    {canDelete && (
                        <div className="mb-6 flex justify-end">
                            <button
                                type="button"
                                onClick={() => onDeleteBoardPost(post.id)}
                                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                            >
                                글 삭제
                            </button>
                        </div>
                    )}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-md ${tagStyles[post.tagType]}`}>
                            {post.tag}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight">{post.title}</h1>
                    <div className="mt-6 flex items-center text-sm text-gray-500 dark:text-gray-400 gap-x-6">
                        <div className="flex items-center">
                            <UserIcon className="w-4 h-4 mr-2" />
                            <span>{post.author}</span>
                        </div>
                        <div className="flex items-center">
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            <span>{post.date}</span>
                        </div>
                        <div className="flex items-center">
                            <EyeIcon className="w-4 h-4 mr-2" />
                            <span>조회수 {post.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center">
                            <ChatBubbleIcon className="w-4 h-4 mr-2" />
                            <span>댓글 {post.comments.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <article className="max-w-none">
                    {post.images && post.images.length > 0 && (
                        <div className="mb-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {post.images.map((image, index) => (
                                    <div key={index} className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                                        <img 
                                            src={image} 
                                            alt={`첨부 이미지 ${index + 1}`} 
                                            className="w-full h-auto object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-6 whitespace-pre-wrap">
                        {post.content}
                    </div>
                </article>

                <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">댓글 ({post.comments})</h3>
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-8 rounded-lg text-center text-gray-500 dark:text-gray-400">
                        <p>댓글 기능은 현재 준비 중입니다.</p>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    {prevPost ? (
                        <button onClick={() => onNavigate('board-detail', prevPost.id)} className="text-left group p-4 -m-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <p className="text-sm text-gray-500 dark:text-gray-400">이전 글</p>
                            <p className="mt-1 font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate max-w-xs sm:max-w-sm">{prevPost.title}</p>
                        </button>
                    ) : <div />}
                    
                    {nextPost ? (
                        <button onClick={() => onNavigate('board-detail', nextPost.id)} className="text-right group p-4 -m-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <p className="text-sm text-gray-500 dark:text-gray-400">다음 글</p>
                            <p className="mt-1 font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate max-w-xs sm:max-w-sm">{nextPost.title}</p>
                        </button>
                    ) : <div />}
                </div>
            </main>
        </div>
    );
};

export default BoardDetailPage;
