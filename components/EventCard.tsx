
import React from 'react';
import { CalendarIcon } from './icons/CalendarIcon';
import { ClockIcon } from './icons/ClockIcon';
import { LocationPinIcon } from './icons/LocationPinIcon';
import { UsersIcon } from './icons/UsersIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import type { Event, EventCategory, EventStatus, Page } from '../types';

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

const EventCard: React.FC<{ event: Event; onNavigate: (page: Page, id?: number) => void; onShowDetails?: (event: Event) => void; }> = ({ event, onNavigate, onShowDetails }) => {
  const percentage = Math.min(Math.round((event.participants / event.capacity) * 100), 100);
  
  const progressBarColor = event.status === 'closed' 
    ? 'bg-red-500' 
    : event.status === 'finished' 
    ? 'bg-gray-400' 
    : 'bg-orange-500';

  const isClickable = event.status === 'recruiting' && onShowDetails;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onShowDetails(event);
    }
  };

  return (
    <div 
      className={`bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col group ${isClickable ? 'cursor-pointer' : ''}`}
      onClick={isClickable ? () => onShowDetails(event) : undefined}
      onKeyDown={handleKeyDown}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-label={isClickable ? `${event.title} 자세히 보기` : undefined}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-wrap items-center gap-2">
            {event.categories.map(cat => (
                <span key={cat} className={`text-xs font-semibold px-2.5 py-1 rounded ${categoryBadgeStyle[cat]}`}>{cat}</span>
            ))}
            <span className={`text-xs font-semibold px-2.5 py-1 rounded ${statusBadgeStyle[event.status]}`}>{statusText[event.status]}</span>
            {event.isOnline && <span className="text-xs font-semibold px-2.5 py-1 rounded bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">온라인</span>}
        </div>
        {event.price && <span className="text-sm font-bold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-md">{event.price}</span>}
        {!event.price && event.status !== 'recruiting' && <span className="text-sm font-bold text-gray-700 dark:text-gray-200">무료</span>}
      </div>
      
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex-grow">{event.title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-5 line-clamp-3">{event.description}</p>
      
      <div className="space-y-3 mb-5">
        <MetadataItem icon={CalendarIcon}>{event.date}</MetadataItem>
        <MetadataItem icon={ClockIcon}>{event.time}</MetadataItem>
        <MetadataItem icon={LocationPinIcon}>{event.location}</MetadataItem>
      </div>

      <div className="mt-auto">
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
        
        {event.status === 'recruiting' ? (
            <div className="mt-5 w-full bg-orange-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-colors group-hover:bg-orange-700">
                <span>자세히 보기 & 신청</span>
                <ArrowRightIcon className="w-4 h-4 ml-2" />
            </div>
        ) : (
            <div className="mt-5 w-full bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 font-bold py-3 px-4 rounded-lg flex items-center justify-center cursor-not-allowed">
                <span>{statusText[event.status]}</span>
            </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
