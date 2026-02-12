
import React from 'react';
import type { Event, Page, EventStatus, EventCategory, User } from '../types';
import { XMarkIcon } from './icons/XMarkIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { ClockIcon } from './icons/ClockIcon';
import { LocationPinIcon } from './icons/LocationPinIcon';
import { UsersIcon } from './icons/UsersIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import { CalendarDaysIcon } from './icons/CalendarDaysIcon';

const statusBadgeStyle: Record<EventStatus, string> = {
  recruiting: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  closed: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  finished: 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

const categoryBadgeStyle: Record<EventCategory, string> = {
  '교육': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  '토론': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  '문화': 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  '자원봉사': 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
};

const statusText: Record<EventStatus, string> = {
    recruiting: '모집중',
    closed: '마감',
    finished: '종료'
};

const MetadataItem: React.FC<{ icon: React.ElementType; children: React.ReactNode }> = ({ icon: Icon, children }) => (
  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
    <Icon className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
    <span>{children}</span>
  </div>
);

interface EventModalProps {
  event: Event;
  onClose: () => void;
  onNavigate: (page: Page, id?: number) => void;
  loggedInUser: User | null;
  onUpdateEvent: (event: Event) => void;
  onDeleteEvent: (eventId: number) => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, onClose, onNavigate, loggedInUser, onUpdateEvent, onDeleteEvent }) => {
    const percentage = Math.min(Math.round((event.participants / event.capacity) * 100), 100);
    const progressBarColor = event.status === 'closed' ? 'bg-red-500' : event.status === 'finished' ? 'bg-gray-400' : 'bg-orange-500';

    const handleNavigate = () => {
        onClose();
        onNavigate('event-detail', event.id);
    };

    const handleMarkAsClosed = () => {
        onUpdateEvent({ ...event, status: 'closed' });
        onClose();
    };

    const handleDelete = () => {
        onDeleteEvent(event.id);
        onClose();
    };

    const isAdmin = loggedInUser?.level === '관리자';

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" 
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg p-6 sm:p-8 relative transform transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" aria-label="닫기">
                    <XMarkIcon className="w-6 h-6 text-gray-500" />
                </button>
                
                <div className="flex flex-wrap items-center gap-2 mb-4">
                    {event.categories.map(cat => (
                        <span key={cat} className={`text-xs font-semibold px-2.5 py-1 rounded ${categoryBadgeStyle[cat]}`}>{cat}</span>
                    ))}
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded ${statusBadgeStyle[event.status]}`}>{statusText[event.status]}</span>
                    {event.isOnline && <span className="text-xs font-semibold px-2.5 py-1 rounded bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">온라인</span>}
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 pr-8">{event.title}</h2>
                <p className="text-gray-600 dark:text-gray-400 text-base mb-6">{event.description}</p>
                
                <div className="space-y-3 py-5 border-t border-b dark:border-gray-700">
                    <MetadataItem icon={CalendarIcon}>행사일: {event.date}</MetadataItem>
                    <MetadataItem icon={ClockIcon}>시간: {event.time}</MetadataItem>
                    <MetadataItem icon={LocationPinIcon}>장소: {event.location}</MetadataItem>
                    {event.recruitmentStartDate && event.recruitmentEndDate && (
                        <MetadataItem icon={CalendarDaysIcon}>
                            모집 기간: {event.recruitmentStartDate} ~ {event.recruitmentEndDate}
                        </MetadataItem>
                    )}
                </div>
                
                <div className="mt-6">
                    <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300 mb-2">
                        <div className="flex items-center">
                            <UsersIcon className="w-4 h-4 mr-1.5 text-gray-400 dark:text-gray-500" />
                            <span>신청인원</span>
                        </div>
                        <span className="font-semibold">{event.participants} / {event.capacity}명</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div className={`${progressBarColor} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
                    </div>
                </div>
                
                {event.status === 'recruiting' && (
                     <button onClick={handleNavigate} className="mt-8 w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-colors">
                        <span>상세보기 및 신청</span>
                        <ArrowRightIcon className="w-4 h-4 ml-2" />
                    </button>
                )}

                {isAdmin && event.status === 'recruiting' && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-end gap-3">
                        <button 
                            onClick={handleMarkAsClosed}
                            className="w-full sm:w-auto px-4 py-2 text-sm font-semibold text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors"
                        >
                            마감하기
                        </button>
                        <button 
                            onClick={handleDelete}
                            className="w-full sm:w-auto px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            행사 삭제
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventModal;
