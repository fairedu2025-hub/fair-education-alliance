
import React, { useState } from 'react';
import type { User, BoardPost, Page, Event } from '../types';
import { UserIcon } from '../components/icons/UserIcon';
import { EnvelopeIcon } from '../components/icons/EnvelopeIcon';
import { PhoneIcon } from '../components/icons/PhoneIcon';
import { DocumentDuplicateIcon } from '../components/icons/DocumentDuplicateIcon';
import { CalendarDaysIcon } from '../components/icons/CalendarDaysIcon';
import { ChevronRightIcon } from '../components/icons/ChevronRightIcon';

interface MyPageProps {
    loggedInUser: User | null;
    myPosts: BoardPost[];
    joinedEvents?: Event[]; 
    onNavigate: (page: Page, id?: number) => void;
}

const MyPage: React.FC<MyPageProps> = ({ loggedInUser, myPosts, joinedEvents = [], onNavigate }) => {
    const [activeTab, setActiveTab] = useState<'posts' | 'events'>('posts');

    if (!loggedInUser) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">로그인이 필요합니다</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">마이페이지를 이용하시려면 먼저 로그인해주세요.</p>
                <button
                    onClick={() => onNavigate('login')}
                    className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold"
                >
                    로그인 페이지로 이동
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
            <div className="bg-orange-600 text-white">
                <div className="container mx-auto px-4 py-16">
                    <h1 className="text-3xl md:text-4xl font-bold text-center">마이페이지</h1>
                    <p className="text-center text-orange-100 mt-4">내 정보와 활동 내역을 확인하세요.</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-5xl -mt-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: Profile Card */}
                    <div className="md:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                            <div className="p-6 text-center border-b border-gray-100 dark:border-gray-700">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-red-500 mx-auto mb-4 flex items-center justify-center shadow-md">
                                    <span className="text-3xl text-white font-bold">{loggedInUser.name[0]}</span>
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{loggedInUser.name}</h2>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">@{loggedInUser.id}</p>
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                                    loggedInUser.level === '관리자' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                                    loggedInUser.level === '정회원' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                }`}>
                                    {loggedInUser.level}
                                </span>
                            </div>
                            
                            <div className="p-6 space-y-4">
                                <div className="flex items-center text-gray-600 dark:text-gray-300">
                                    <EnvelopeIcon className="w-5 h-5 mr-3 text-gray-400" />
                                    <span className="text-sm">{loggedInUser.email || '이메일 없음'}</span>
                                </div>
                                <div className="flex items-center text-gray-600 dark:text-gray-300">
                                    <PhoneIcon className="w-5 h-5 mr-3 text-gray-400" />
                                    <span className="text-sm">{loggedInUser.phone || '전화번호 없음'}</span>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700">
                                <button 
                                    onClick={() => onNavigate('edit-profile')}
                                    className="w-full py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                                >
                                    내 정보 수정
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Activity Tabs */}
                    <div className="md:col-span-2">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 min-h-[500px] flex flex-col">
                            <div className="flex border-b border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={() => setActiveTab('posts')}
                                    className={`flex-1 py-4 text-center font-semibold transition-colors relative ${
                                        activeTab === 'posts' 
                                        ? 'text-orange-600 dark:text-orange-400' 
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                    }`}
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        <DocumentDuplicateIcon className="w-5 h-5" />
                                        내가 쓴 글
                                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs py-0.5 px-2 rounded-full">
                                            {myPosts.length}
                                        </span>
                                    </span>
                                    {activeTab === 'posts' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600"></div>}
                                </button>
                                <button
                                    onClick={() => setActiveTab('events')}
                                    className={`flex-1 py-4 text-center font-semibold transition-colors relative ${
                                        activeTab === 'events' 
                                        ? 'text-orange-600 dark:text-orange-400' 
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                    }`}
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        <CalendarDaysIcon className="w-5 h-5" />
                                        참여 행사
                                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs py-0.5 px-2 rounded-full">
                                            {joinedEvents.length}
                                        </span>
                                    </span>
                                    {activeTab === 'events' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600"></div>}
                                </button>
                            </div>

                            <div className="p-6 flex-grow">
                                {activeTab === 'posts' && (
                                    <div className="space-y-4">
                                        {myPosts.length > 0 ? (
                                            myPosts.map(post => (
                                                <button
                                                    key={post.id}
                                                    onClick={() => onNavigate('board-detail', post.id)}
                                                    className="w-full text-left p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 hover:border-orange-200 hover:bg-orange-50 dark:hover:bg-gray-700 transition-all group"
                                                >
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="text-xs font-semibold text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300 px-2 py-0.5 rounded">
                                                            {post.tag}
                                                        </span>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">{post.date}</span>
                                                    </div>
                                                    <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-1 group-hover:text-orange-700 dark:group-hover:text-orange-400 transition-colors truncate">
                                                        {post.title}
                                                    </h3>
                                                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-3">
                                                        <span>조회 {post.views}</span>
                                                        <span>댓글 {post.comments}</span>
                                                    </div>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                                <DocumentDuplicateIcon className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                                                <p>작성한 게시글이 없습니다.</p>
                                                <button onClick={() => onNavigate('new-board-post')} className="mt-4 text-orange-600 hover:underline text-sm font-semibold">첫 글 작성하기</button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'events' && (
                                    <div className="space-y-4">
                                        {joinedEvents.length > 0 ? (
                                            joinedEvents.map(event => (
                                                <div key={event.id} className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-700/30 flex justify-between items-center">
                                                    <div>
                                                        <h3 className="font-bold text-gray-800 dark:text-gray-200">{event.title}</h3>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{event.date} | {event.location}</p>
                                                    </div>
                                                    <button 
                                                        onClick={() => onNavigate('event-detail', event.id)}
                                                        className="p-2 text-gray-400 hover:text-orange-600 transition-colors"
                                                    >
                                                        <ChevronRightIcon className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                                <CalendarDaysIcon className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                                                <p>참여 신청한 행사가 없습니다.</p>
                                                <button onClick={() => onNavigate('events')} className="mt-4 text-orange-600 hover:underline text-sm font-semibold">행사 둘러보기</button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyPage;
