import React, { useState } from 'react';
import type { Event, Page, User } from '../types';
import { CalendarIcon } from '../components/icons/CalendarIcon';
import { ClockIcon } from '../components/icons/ClockIcon';
import { LocationPinIcon } from '../components/icons/LocationPinIcon';
import { UsersIcon } from '../components/icons/UsersIcon';
import { UserIcon } from '../components/icons/UserIcon';
import { PhoneIcon } from '../components/icons/PhoneIcon';
import { EnvelopeIcon } from '../components/icons/EnvelopeIcon';
import { ChevronLeftIcon } from '../components/icons/ChevronLeftIcon';
import { CalendarDaysIcon } from '../components/icons/CalendarDaysIcon';

const statusBadgeStyle: Record<Event['status'], string> = {
  recruiting: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  closed: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  finished: 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

const categoryBadgeStyle: Record<Event['categories'][number], string> = {
  '교육': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  '토론': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  '문화': 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  '자원봉사': 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
};

const statusText: Record<Event['status'], string> = {
    recruiting: '모집중',
    closed: '마감',
    finished: '종료'
};

const MetadataItem: React.FC<{ icon: React.ElementType; label: string; value: string }> = ({ icon: Icon, label, value }) => (
    <div className="flex items-start">
        <Icon className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3 mt-1 flex-shrink-0" />
        <div>
            <p className="font-semibold text-sm text-gray-500 dark:text-gray-400">{label}</p>
            <p className="text-gray-800 dark:text-gray-200">{value}</p>
        </div>
    </div>
);

const FormInputField: React.FC<{ id: string, label: string, type: string, placeholder: string, icon: React.ReactNode, value?: string, onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void }> =
    ({ id, label, type, placeholder, icon, value, onChange }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                {icon}
            </div>
            <input
                type={type}
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                className="block w-full rounded-md border-gray-300 dark:border-gray-600 py-2.5 pl-10 pr-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white dark:bg-gray-700/50"
                placeholder={placeholder}
                required
            />
        </div>
    </div>
);

interface EventDetailPageProps {
    event: Event;
    onNavigate: (page: Page) => void;
    loggedInUser: User | null;
    onApplyForEvent: (eventId: number, applicant: { name: string; phone: string; email: string }) => Promise<boolean>;
}

const EventDetailPage: React.FC<EventDetailPageProps> = ({ event, onNavigate, loggedInUser, onApplyForEvent }) => {
    const percentage = Math.min(Math.round((event.participants / event.capacity) * 100), 100);
    const progressBarColor = event.status === 'closed' ? 'bg-red-500' : event.status === 'finished' ? 'bg-gray-400' : 'bg-orange-500';
    const [name, setName] = useState(loggedInUser?.name || '');
    const [contact, setContact] = useState('');
    const [email, setEmail] = useState(loggedInUser?.email || '');

    const formatPhoneNumber = (value: string) => {
        const digits = value.replace(/\D/g, '').slice(0, 11);
        if (digits.startsWith('02')) {
            if (digits.length <= 2) return digits;
            if (digits.length <= 5) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
            if (digits.length <= 9) return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`;
            return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6)}`;
        }
        if (digits.length <= 3) return digits;
        if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
        return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!loggedInUser) {
            alert('로그인이 필요합니다.');
            onNavigate('login');
            return;
        }
        const applied = await onApplyForEvent(event.id, {
            name: name.trim(),
            phone: contact.trim(),
            email: email.trim(),
        });
        if (!applied) return;
        alert('신청이 완료되었습니다! 확인 후 연락드리겠습니다.');
        onNavigate('events');
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-950/80 py-12">
            <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <button onClick={() => onNavigate('events')} className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors">
                        <ChevronLeftIcon className="w-5 h-5" />
                        <span>행사 목록으로 돌아가기</span>
                    </button>
                </div>
                
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Left Column: Event Details */}
                    <div className="lg:col-span-2 bg-white dark:bg-gray-800/50 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            {event.categories.map(cat => (
                                <span key={cat} className={`text-sm font-semibold px-3 py-1.5 rounded-md ${categoryBadgeStyle[cat]}`}>{cat}</span>
                            ))}
                            <span className={`text-sm font-semibold px-3 py-1.5 rounded-md ${statusBadgeStyle[event.status]}`}>{statusText[event.status]}</span>
                            {event.isOnline && <span className="text-sm font-semibold px-3 py-1.5 rounded-md bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">온라인</span>}
                        </div>
                        
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{event.title}</h1>
                        <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 leading-relaxed">{event.description}</p>
                        
                        <div className="grid sm:grid-cols-2 gap-6 py-6 border-t border-b dark:border-gray-700">
                            <MetadataItem icon={CalendarIcon} label="행사 날짜" value={event.date} />
                            <MetadataItem icon={ClockIcon} label="행사 시간" value={event.time} />
                            <MetadataItem icon={LocationPinIcon} label="장소" value={event.location} />
                            <MetadataItem icon={UsersIcon} label="참가비" value={event.price || "무료"} />
                             {event.recruitmentStartDate && event.recruitmentEndDate && (
                                <div className="sm:col-span-2">
                                    <MetadataItem icon={CalendarDaysIcon} label="모집 기간" value={`${event.recruitmentStartDate} ~ ${event.recruitmentEndDate}`} />
                                </div>
                            )}
                        </div>
                        
                        <div className="mt-8">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">신청 현황</h3>
                            <div className="flex justify-between items-center text-gray-600 dark:text-gray-300 mb-2">
                                <span>신청인원</span>
                                <span className="font-semibold">{event.participants} / {event.capacity}명</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                                <div className={`${progressBarColor} h-4 rounded-full flex items-center justify-center text-xs font-bold text-white`} style={{ width: `${percentage}%` }}>
                                    {percentage > 10 ? `${percentage}%` : ''}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Application Form */}
                    <div className="lg:sticky top-28 h-fit">
                        <div className="bg-white dark:bg-gray-800/50 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">참가 신청하기</h2>
                            {event.status === 'recruiting' ? (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <FormInputField id="name" label="이름 *" type="text" placeholder="홍길동" icon={<UserIcon className="h-5 w-5 text-gray-400"/>} value={name} onChange={(e) => setName(e.target.value)} />
                                    <FormInputField id="contact" label="연락처 *" type="tel" placeholder="010-1234-5678" icon={<PhoneIcon className="h-5 w-5 text-gray-400"/>} value={contact} onChange={(e) => setContact(formatPhoneNumber(e.target.value))} />
                                    <FormInputField id="email" label="이메일 *" type="email" placeholder="email@example.com" icon={<EnvelopeIcon className="h-5 w-5 text-gray-400"/>} value={email} onChange={(e) => setEmail(e.target.value)} />
                                    
                                    <div className="pt-2">
                                        <div className="flex items-start">
                                            <div className="flex h-5 items-center">
                                            <input id="terms" name="terms" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" required />
                                            </div>
                                            <div className="ml-3 text-sm">
                                            <label htmlFor="terms" className="text-gray-700 dark:text-gray-300">
                                                개인정보 수집 및 이용에 동의합니다.
                                                <span className="block text-gray-500">(필수)</span>
                                            </label>
                                            </div>
                                        </div>
                                    </div>

                                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 text-lg">
                                        신청 완료
                                    </button>
                                </form>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                                        {statusText[event.status]}된 행사입니다.
                                    </p>
                                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                                        다음에 더 좋은 행사로 찾아뵙겠습니다.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetailPage;
