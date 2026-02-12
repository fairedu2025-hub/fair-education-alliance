
import React, { useState, useRef, useEffect } from 'react';
import type { Page, User, Poll, PollOption } from '../types';
import { CheckIcon } from '../components/icons/CheckIcon';
import { UserIcon } from '../components/icons/UserIcon';
import { CalendarDaysIcon } from '../components/icons/CalendarDaysIcon';
import { PlusIcon } from '../components/icons/PlusIcon';
import { XMarkIcon } from '../components/icons/XMarkIcon';
import { TrashIcon } from '../components/icons/TrashIcon';
import { TicketIcon } from '../components/icons/TicketIcon';
import { LockClosedIcon } from '../components/icons/LockClosedIcon';
import { CrownIcon } from '../components/icons/CrownIcon';
import { ClockIcon } from '../components/icons/ClockIcon';
import { PencilSquareIcon } from '../components/icons/PencilSquareIcon';

interface OnlineVotingPageProps {
  onNavigate: (page: Page) => void;
  loggedInUser: User | null;
  polls: Poll[];
  onVote: (pollId: number, optionId: string) => void;
  onReceiveRights: (pollId: number) => void;
  onCreatePoll: (poll: Omit<Poll, 'id' | 'totalVotes' | 'hasVoted' | 'hasVotingRights' | 'votedUserIds'>) => void;
  onUpdatePoll: (poll: Poll) => void;
}

const CreatePollModal: React.FC<{ onClose: () => void; onCreate: (poll: Omit<Poll, 'id' | 'totalVotes' | 'hasVoted' | 'hasVotingRights' | 'votedUserIds'>) => void }> = ({ onClose, onCreate }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [votingStart, setVotingStart] = useState('');
    const [votingEnd, setVotingEnd] = useState('');
    const [options, setOptions] = useState<string[]>(['', '']);

    const handleAddOption = () => {
        setOptions([...options, '']);
    };

    const handleRemoveOption = (index: number) => {
        if (options.length > 2) {
            setOptions(options.filter((_, i) => i !== index));
        }
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description || !votingStart || !votingEnd || options.some(opt => !opt.trim())) {
            alert('모든 항목을 입력해주세요.');
            return;
        }

        const newPollOptions: PollOption[] = options.map((text, index) => ({
            id: `opt${Date.now()}-${index}`,
            text,
            votes: 0
        }));

        onCreate({
            title,
            description,
            startDate: votingStart.replace('T', ' '),
            endDate: votingEnd.replace('T', ' '),
            options: newPollOptions
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                    <XMarkIcon className="w-6 h-6" />
                </button>
                
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">새 투표 만들기</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">투표 제목</label>
                        <input 
                            type="text" 
                            value={title} 
                            onChange={e => setTitle(e.target.value)}
                            className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                            placeholder="투표 제목을 입력하세요"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">설명</label>
                        <textarea 
                            value={description} 
                            onChange={e => setDescription(e.target.value)}
                            rows={3}
                            className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                            placeholder="투표에 대한 설명을 입력하세요"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">투표 기간</label>
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="w-full relative">
                                <input 
                                    type="datetime-local" 
                                    value={votingStart} 
                                    onChange={e => setVotingStart(e.target.value)}
                                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3 pr-10 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all cursor-pointer text-gray-900 dark:text-white [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 dark:text-gray-400">
                                    <CalendarDaysIcon className="w-5 h-5" />
                                </div>
                            </div>
                            <span className="text-gray-500 dark:text-gray-400 font-bold">~</span>
                            <div className="w-full relative">
                                <input 
                                    type="datetime-local" 
                                    value={votingEnd} 
                                    onChange={e => setVotingEnd(e.target.value)}
                                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3 pr-10 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all cursor-pointer text-gray-900 dark:text-white [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 dark:text-gray-400">
                                    <CalendarDaysIcon className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">투표 항목</label>
                        <div className="space-y-3">
                            {options.map((opt, index) => (
                                <div key={index} className="flex gap-2 items-center"><span className="text-gray-400 text-sm w-6 text-center">{index + 1}.</span><input type="text" value={opt} onChange={e => handleOptionChange(index, e.target.value)} className="flex-grow rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white" placeholder={`항목 ${index + 1}`}/>{options.length > 2 && (<button type="button" onClick={() => handleRemoveOption(index)} className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"><TrashIcon className="w-5 h-5" /></button>)}</div>
                            ))}
                        </div>
                        <button type="button" onClick={handleAddOption} className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                            <PlusIcon className="w-4 h-4" /> 항목 추가
                        </button>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors">
                            취소
                        </button>
                        <button type="submit" className="px-5 py-2.5 rounded-lg font-semibold text-white bg-orange-600 hover:bg-orange-700 shadow-md hover:shadow-lg transition-all">
                            생성하기
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const EditPollModal: React.FC<{ poll: Poll; onClose: () => void; onUpdate: (poll: Poll) => void }> = ({ poll, onClose, onUpdate }) => {
    const [title, setTitle] = useState(poll.title);
    const [description, setDescription] = useState(poll.description);
    const [votingStart, setVotingStart] = useState(poll.startDate.replace(' ', 'T'));
    const [votingEnd, setVotingEnd] = useState(poll.endDate.replace(' ', 'T'));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description || !votingStart || !votingEnd) {
            alert('모든 항목을 입력해주세요.');
            return;
        }

        onUpdate({
            ...poll,
            title,
            description,
            startDate: votingStart.replace('T', ' '),
            endDate: votingEnd.replace('T', ' '),
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                    <XMarkIcon className="w-6 h-6" />
                </button>
                
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">투표 정보 수정</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">투표 제목</label>
                        <input 
                            type="text" 
                            value={title} 
                            onChange={e => setTitle(e.target.value)}
                            className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">설명</label>
                        <textarea 
                            value={description} 
                            onChange={e => setDescription(e.target.value)}
                            rows={3}
                            className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">투표 기간</label>
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="w-full relative">
                                <input 
                                    type="datetime-local" 
                                    value={votingStart} 
                                    onChange={e => setVotingStart(e.target.value)}
                                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3 pr-10 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all cursor-pointer text-gray-900 dark:text-white [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 dark:text-gray-400">
                                    <CalendarDaysIcon className="w-5 h-5" />
                                </div>
                            </div>
                            <span className="text-gray-500 dark:text-gray-400 font-bold">~</span>
                            <div className="w-full relative">
                                <input 
                                    type="datetime-local" 
                                    value={votingEnd} 
                                    onChange={e => setVotingEnd(e.target.value)}
                                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3 pr-10 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all cursor-pointer text-gray-900 dark:text-white [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 dark:text-gray-400">
                                    <CalendarDaysIcon className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors">
                            취소
                        </button>
                        <button type="submit" className="px-5 py-2.5 rounded-lg font-semibold text-white bg-orange-600 hover:bg-orange-700 shadow-md hover:shadow-lg transition-all">
                            수정 완료
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

interface PollCardProps {
    poll: Poll;
    onVote: (pollId: number, optionId: string) => void;
    onReceiveRights: (pollId: number) => void;
    onUpdatePoll: (poll: Poll) => void;
    loggedInUser: User | null;
}

const PollCard: React.FC<PollCardProps> = ({ poll, onVote, onReceiveRights, onUpdatePoll, loggedInUser }) => {
    const [now, setNow] = useState(new Date());
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 60000);
        return () => clearInterval(interval);
    }, []);

    const startDate = new Date(poll.startDate.replace(' ', 'T'));
    const endDate = new Date(poll.endDate.replace(' ', 'T'));
    
    const isClosed = now > endDate;
    const isUpcoming = now < startDate;
    
    const maxVotes = Math.max(...poll.options.map(o => o.votes));

    const isEligibleToVote = loggedInUser?.level === '정회원' || loggedInUser?.level === '관리자';
    const isAdmin = loggedInUser?.level === '관리자';

    const userHasVoted = loggedInUser ? poll.votedUserIds.includes(loggedInUser.id) : false;
    const displayVoted = poll.hasVoted || userHasVoted;

    const handleVoteClick = (optionId: string) => {
        if (!loggedInUser) {
            alert('로그인이 필요합니다.');
            return;
        }

        if (userHasVoted) {
            alert('이미 투표에 참여하셨습니다.');
            return;
        }

        if (!isEligibleToVote) {
            alert('정회원만 투표에 참여할 수 있습니다.');
            return;
        }

        if (!poll.hasVotingRights) {
            alert('먼저 투표권을 받아주세요.');
            return;
        }

        onVote(poll.id, optionId);
    };

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border transition-all hover:shadow-xl ${isClosed ? 'border-gray-300 dark:border-gray-600 opacity-90' : 'border-gray-200 dark:border-gray-700'}`}>
            <div className="p-6 h-full flex flex-col">
                {/* Header Section */}
                <div className="mb-4">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                            {isClosed ? (
                                <span className="inline-block px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold rounded-full">투표 마감</span>
                            ) : isUpcoming ? (
                                <span className="inline-block px-3 py-1 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 text-xs font-bold rounded-full">투표 예정</span>
                            ) : displayVoted ? (
                                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">투표 완료</span>
                            ) : (
                                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">진행중</span>
                            )}
                        </div>
                        {isAdmin && (
                            <button 
                                onClick={() => setIsEditModalOpen(true)}
                                className="bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-300 p-1.5 rounded-lg transition-colors shadow-sm"
                                title="투표 정보 수정"
                            >
                                <PencilSquareIcon className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2">{poll.title}</h2>
                </div>
                
                <div className="mb-4 flex-grow">
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
                        {poll.description}
                    </p>
                </div>

                <div className="space-y-4 mb-6">
                    <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                        <div className="flex items-center gap-1.5">
                            <ClockIcon className="w-3.5 h-3.5" />
                            <span>기간: {poll.startDate.split(' ')[0]} ~ {poll.endDate.split(' ')[0]}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <UserIcon className="w-3.5 h-3.5" />
                            <span>참여: {poll.totalVotes.toLocaleString()}명</span>
                        </div>
                    </div>

                    {!isClosed && isEligibleToVote && !poll.hasVotingRights && (
                        <button 
                            onClick={() => onReceiveRights(poll.id)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold rounded-lg transition-colors shadow-sm bg-blue-600 text-white hover:bg-blue-700"
                        >
                            <TicketIcon className="w-4 h-4" />
                            투표권 받기
                        </button>
                    )}
                </div>

                {/* Options List */}
                <div className="space-y-2.5">
                    {poll.options.map(option => {
                        const percentage = poll.totalVotes > 0 ? Math.round((option.votes / poll.totalVotes) * 100) : 0;
                        const isWinner = isClosed && poll.totalVotes > 0 && option.votes === maxVotes;
                        
                        if (displayVoted || isClosed) {
                            return (
                                <div 
                                    key={option.id} 
                                    className={`relative p-3 rounded-lg border overflow-hidden transition-all ${
                                        isWinner 
                                        ? 'border-red-500 bg-red-50 dark:bg-red-900/10' 
                                        : 'border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50'
                                    }`}
                                >
                                    <div className={`absolute top-0 left-0 bottom-0 transition-all duration-1000 ease-out ${isWinner ? 'bg-red-100 dark:bg-red-800/40' : 'bg-orange-100/50 dark:bg-orange-900/20'}`} style={{ width: `${percentage}%` }}></div>
                                    <div className="relative flex justify-between items-center z-10 text-xs font-semibold">
                                        <span className="truncate pr-2">{option.text}</span>
                                        <span className="whitespace-nowrap">{percentage}%</span>
                                    </div>
                                </div>
                            );
                        } else {
                            const isVoteDisabled = !poll.hasVotingRights || isUpcoming || !isEligibleToVote;
                            return (
                                <button 
                                    key={option.id}
                                    onClick={() => handleVoteClick(option.id)}
                                    disabled={isVoteDisabled}
                                    className={`w-full p-3 text-left rounded-lg border transition-all text-xs font-bold ${
                                        !isVoteDisabled
                                        ? 'border-gray-200 dark:border-gray-700 hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/10 text-gray-800 dark:text-gray-200' 
                                        : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    {option.text}
                                </button>
                            );
                        }
                    })}
                </div>
            </div>
            {isEditModalOpen && (
                <EditPollModal 
                    poll={poll} 
                    onClose={() => setIsEditModalOpen(false)} 
                    onUpdate={onUpdatePoll} 
                />
            )}
        </div>
    );
};

const OnlineVotingPage: React.FC<OnlineVotingPageProps> = ({ onNavigate, loggedInUser, polls, onVote, onReceiveRights, onCreatePoll, onUpdatePoll }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
            <div className="bg-orange-600 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">온라인 투표</h1>
                    <p className="text-orange-100 text-lg max-w-2xl mx-auto">
                        공정하고 투명한 의사결정을 위해 회원님의 소중한 한 표를 행사해주세요.<br/>
                        여러분의 참여가 단체의 미래를 결정합니다.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-6xl">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">진행 중인 투표</h2>
                    {loggedInUser?.level === '관리자' && (
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 bg-white dark:bg-gray-800 text-orange-600 dark:text-orange-400 font-bold py-2.5 px-5 rounded-lg border border-orange-200 dark:border-gray-700 shadow-sm hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            <PlusIcon className="w-5 h-5" />
                            새 투표 만들기
                        </button>
                    )}
                </div>

                {polls.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 items-start">
                        {polls.map(poll => (
                            <PollCard 
                                key={poll.id} 
                                poll={poll} 
                                onVote={onVote} 
                                onReceiveRights={onReceiveRights} 
                                loggedInUser={loggedInUser}
                                onUpdatePoll={onUpdatePoll}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="bg-gray-100 dark:bg-gray-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CalendarDaysIcon className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">진행 중인 투표가 없습니다</h3>
                        <p className="text-gray-500 dark:text-gray-400">새로운 투표가 시작되면 알려드리겠습니다.</p>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <CreatePollModal onClose={() => setIsModalOpen(false)} onCreate={onCreatePoll} />
            )}
        </div>
    );
};

export default OnlineVotingPage;
