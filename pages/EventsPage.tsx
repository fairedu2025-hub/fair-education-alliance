
import React, { useState, useMemo } from 'react';
import EventCard from '../components/EventCard';
import { SearchIcon } from '../components/icons/SearchIcon';
import { PlusIcon } from '../components/icons/PlusIcon';
import { CalendarDaysIcon } from '../components/icons/CalendarDaysIcon';
import { UsersIcon } from '../components/icons/UsersIcon';
import { LocationPinIcon } from '../components/icons/LocationPinIcon';
import { EnvelopeIcon } from '../components/icons/EnvelopeIcon';
import EventCalendar from '../components/EventCalendar';
import { ListIcon } from '../components/icons/ListIcon';
import type { Event, EventCategory, EventStatus, Page, User, EventProposal } from '../types';
import EventModal from '../components/EventModal';
import { ThumbsUpIcon } from '../components/icons/ThumbsUpIcon';
import { LightBulbIcon } from '../components/icons/LightBulbIcon';
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';
import ProposalModal from '../components/ProposalModal';

interface EventsPageProps {
  onNavigate: (page: Page, id?: number) => void;
  events: Event[];
  totalParticipants: number;
  loggedInUser: User | null;
  onUpdateEvent: (event: Event) => void;
  onDeleteEvent: (eventId: number) => void;
  eventProposals: EventProposal[];
  onVoteOnProposal: (proposalId: number) => void;
  onCreateProposal: (proposal: { title: string; description: string }) => void;
}

const FilterChip: React.FC<{ label: string; active: boolean; onClick: () => void; }> = ({ label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-200 ${
            active 
            ? 'bg-orange-600 text-white shadow' 
            : 'bg-gray-100 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
    >
        {label}
    </button>
);

const StatCard: React.FC<{ icon?: React.ElementType; value: string | number; label: string; customIcon?: boolean }> = ({ icon: Icon, value, label, customIcon }) => (
    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-5">
        {Icon && <Icon className="w-8 h-8 text-gray-500 dark:text-gray-400" />}
        {customIcon && <div className="w-8 h-8 bg-purple-500 rounded-lg"></div>}
        <div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</p>
        </div>
    </div>
);

const EventsPage: React.FC<EventsPageProps> = ({ onNavigate, events: eventsData, totalParticipants, loggedInUser, onUpdateEvent, onDeleteEvent, eventProposals, onVoteOnProposal, onCreateProposal }) => {
    const [view, setView] = useState<'list' | 'calendar'>('list');
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<EventCategory | '전체'>('전체');
    const [statusFilter, setStatusFilter] = useState<'전체' | '모집중' | '마감' | '종료'>('전체');
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);

    const handleEventSelect = (event: Event) => {
        setSelectedEvent(event);
    };

    const handleCloseModal = () => {
        setSelectedEvent(null);
    };

    const categories: (EventCategory | '전체')[] = ['전체', '교육', '토론', '문화', '자원봉사'];
    const statuses: ('전체' | '모집중' | '마감' | '종료')[] = ['전체', '모집중', '마감', '종료'];
    const statusMap: Record<string, EventStatus> = { '모집중': 'recruiting', '마감': 'closed', '종료': 'finished' };

    const filteredEvents = useMemo(() => {
        return eventsData.filter(event => {
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch = searchLower === '' ||
                event.title.toLowerCase().includes(searchLower) ||
                event.description.toLowerCase().includes(searchLower) ||
                event.location.toLowerCase().includes(searchLower);

            const matchesCategory = categoryFilter === '전체' || event.categories.includes(categoryFilter);
            
            const mappedStatus = statusMap[statusFilter as string];
            const matchesStatus = statusFilter === '전체' || event.status === mappedStatus;

            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [searchQuery, categoryFilter, statusFilter, eventsData]);

    const recruitingEvents = filteredEvents.filter(e => e.status === 'recruiting');
    const closedEvents = filteredEvents.filter(e => e.status === 'closed');
    const finishedEvents = filteredEvents.filter(e => e.status === 'finished');

    const ListView = () => (
        <div className="space-y-12">
            {/* Search & Filter Section */}
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 space-y-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">▽ 행사 검색 & 필터</h2>
                <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <SearchIcon className="h-5 w-5 text-gray-400"/>
                    </div>
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="행사명, 설명, 장소로 검색..."
                        className="w-full py-3 pl-12 pr-4 text-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    />
                </div>
                <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">카테고리</p>
                    <div className="flex flex-wrap gap-2">
                        {categories.map(cat => <FilterChip key={cat} label={cat} active={categoryFilter === cat} onClick={() => setCategoryFilter(cat)} />)}
                    </div>
                </div>
                 <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">모집 상태</p>
                    <div className="flex flex-wrap gap-2">
                        {statuses.map(stat => <FilterChip key={stat} label={stat === '전체' ? '전체' : stat} active={statusFilter === stat} onClick={() => setStatusFilter(stat)} />)}
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={CalendarDaysIcon} value={filteredEvents.length} label="검색 결과" />
                <StatCard icon={UsersIcon} value={recruitingEvents.length} label="모집 중" />
                <StatCard icon={LocationPinIcon} value={totalParticipants} label="총 참가자" />
                <StatCard value="1" label="온라인 행사" customIcon />
            </div>
            
            <p className="text-gray-600 dark:text-gray-400">총 {filteredEvents.length}개의 행사가 있습니다</p>
            
            {recruitingEvents.length > 0 && (
                <section>
                    <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">모집 중인 행사 ({recruitingEvents.length}개)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recruitingEvents.map(event => <EventCard key={event.id} event={event} onNavigate={onNavigate} onShowDetails={handleEventSelect} />)}
                    </div>
                </section>
            )}
            {closedEvents.length > 0 && (
                <section>
                    <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">마감된 행사 ({closedEvents.length}개)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {closedEvents.map(event => <EventCard key={event.id} event={event} onNavigate={onNavigate} />)}
                    </div>
                </section>
            )}
            {finishedEvents.length > 0 && (
                <section>
                    <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">완료된 행사 ({finishedEvents.length}개)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {finishedEvents.map(event => <EventCard key={event.id} event={event} onNavigate={onNavigate} />)}
                    </div>
                </section>
            )}

            <section>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">커뮤니티 행사 제안</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">회원들이 제안하고 투표한 행사 아이디어입니다.</p>
                    </div>
                    <button 
                        onClick={() => {
                            if (!loggedInUser) {
                                alert('로그인이 필요합니다.');
                                onNavigate('login');
                            } else {
                                setIsProposalModalOpen(true)
                            }
                        }}
                        className="flex-shrink-0 flex items-center gap-2 bg-emerald-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
                    >
                        <LightBulbIcon className="w-5 h-5" />
                        <span>새로운 행사 제안하기</span>
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {eventProposals.sort((a,b) => b.votes - a.votes).map(proposal => (
                        <div key={proposal.id} className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{proposal.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">제안자: {proposal.proposerName}</p>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-5 flex-grow">{proposal.description}</p>
                            <div className="flex justify-between items-center mt-auto">
                                <div className="flex items-center gap-2">
                                    <ThumbsUpIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                    <span className="font-bold text-lg text-gray-800 dark:text-white">{proposal.votes}</span>
                                </div>
                                {(() => {
                                    const hasVoted = loggedInUser && proposal.votedUserIds.includes(loggedInUser.id);
                                    return (
                                        <button 
                                            onClick={() => onVoteOnProposal(proposal.id)}
                                            disabled={!loggedInUser}
                                            className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-colors ${
                                                hasVoted 
                                                ? 'bg-orange-600 text-white'
                                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                                        >
                                            {hasVoted ? <CheckCircleIcon className="w-5 h-5" /> : <ThumbsUpIcon className="w-5 h-5" />}
                                            <span>{hasVoted ? '투표완료' : '투표하기'}</span>
                                        </button>
                                    );
                                })()}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );

    return (
        <div className="bg-gray-50 dark:bg-gray-950/80">
            {/* Hero Section - Matched with BoardPage background and center alignment */}
            <section className="bg-orange-600">
                <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-white">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold">활동 & 행사</h1>
                        <p className="mt-4 text-lg md:text-xl text-orange-100 leading-relaxed max-w-3xl mx-auto">
                            공정교육바른인천연합과 함께하는 다양한 활동과 행사에 참여하세요.<br/>
                            교육, 토론, 문화, 자원봉사 등 의미 있는 활동들이 기다리고 있습니다.
                        </p>
                    </div>
                    {loggedInUser && (
                        <div className="flex flex-wrap justify-center items-center gap-4 mt-8">
                             {loggedInUser.level === '관리자' && (
                                 <button onClick={() => onNavigate('new-event')} className="flex items-center justify-center gap-2 bg-white text-orange-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors shadow-md">
                                    <PlusIcon className="w-5 h-5" />
                                    <span>행사 등록하기</span>
                                </button>
                             )}
                            <button onClick={() => setView(v => v === 'list' ? 'calendar' : 'list')} className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/50 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-sm">
                                {view === 'list' ? <CalendarDaysIcon className="w-5 h-5" /> : <ListIcon className="w-5 h-5" />}
                                <span>{view === 'list' ? '달력 보기' : '목록 보기'}</span>
                            </button>
                        </div>
                    )}
                </div>
            </section>

            <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {view === 'list' ? <ListView /> : <EventCalendar events={eventsData} onNavigate={onNavigate} loggedInUser={loggedInUser} onUpdateEvent={onUpdateEvent} onDeleteEvent={onDeleteEvent} />}
                {selectedEvent && <EventModal event={selectedEvent} onClose={handleCloseModal} onNavigate={onNavigate} loggedInUser={loggedInUser} onUpdateEvent={onUpdateEvent} onDeleteEvent={onDeleteEvent} />}
                {isProposalModalOpen && <ProposalModal onClose={() => setIsProposalModalOpen(false)} onCreateProposal={(proposal) => { onCreateProposal(proposal); setIsProposalModalOpen(false); }} />}
            </div>

            {/* CTA Section - Changed background to bg-orange-600 and updated styles to match BoardPage */}
             <section className="bg-orange-600">
                <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-white">
                    <h2 className="text-3xl font-bold">행사 주최를 원하시나요?</h2>
                    <p className="mt-4 text-lg text-orange-100 max-w-2xl mx-auto leading-relaxed">
                        공정교육바른인천연합과 함께 의미 있는 시민 활동을 기획해보세요.<br className="hidden md:block" />
                        교육, 토론, 문화, 자원봉사 등 다양한 분야의 행사를 지원합니다.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <button onClick={() => onNavigate('new-event')} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-orange-600 font-semibold px-8 py-3 rounded-md hover:bg-gray-100 transition-colors duration-200">
                            <PlusIcon className="w-5 h-5" />
                            <span>행사 제안하기</span>
                        </button>
                        <a href="#/contact" className="w-full sm:w-auto flex items-center justify-center gap-2 border border-white/50 bg-white/10 text-white font-semibold px-8 py-3 rounded-md hover:bg-white/20 transition-colors duration-200">
                            <EnvelopeIcon className="w-5 h-5" />
                            <span>문의하기</span>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default EventsPage;
