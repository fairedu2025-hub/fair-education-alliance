
import React, { useState } from 'react';
import type { Event, EventCategory, EventStatus, Page } from '../types';
import { CalendarDaysIcon } from '../components/icons/CalendarDaysIcon';
import { PlusIcon } from '../components/icons/PlusIcon';

interface NewEventPageProps {
  onNavigate: (page: Page) => void;
  onCreateEvent: (event: Omit<Event, 'id' | 'participants'>) => void;
}

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-base font-bold text-gray-700 dark:text-gray-300 mb-2">{label}</label>
        <input id={id} {...props} className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base p-3" />
    </div>
);

const TextareaField: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-base font-bold text-gray-700 dark:text-gray-300 mb-2">{label}</label>
        <textarea id={id} {...props} rows={8} className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base p-3"></textarea>
    </div>
);

const SelectField: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; children: React.ReactNode }> = ({ label, id, children, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-base font-bold text-gray-700 dark:text-gray-300 mb-2">{label}</label>
        <select id={id} {...props} className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base p-3">
            {children}
        </select>
    </div>
);


const NewEventPage: React.FC<NewEventPageProps> = ({ onNavigate, onCreateEvent }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [categories, setCategories] = useState<EventCategory[]>([]);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [recruitmentStartDate, setRecruitmentStartDate] = useState('');
    const [recruitmentEndDate, setRecruitmentEndDate] = useState('');
    const [location, setLocation] = useState('');
    const [isOnlineChecked, setIsOnlineChecked] = useState(false);
    const [isOfflineChecked, setIsOfflineChecked] = useState(false);
    const [isRegularMeeting, setIsRegularMeeting] = useState(false);
    const [capacity, setCapacity] = useState(0);
    const [price, setPrice] = useState('');
    const [status, setStatus] = useState<EventStatus>('recruiting');
    
    const allCategories: EventCategory[] = ['교육', '토론', '문화', '자원봉사'];

    const handleCategoryChange = (category: EventCategory) => {
        setCategories(prev => 
            prev.includes(category) 
            ? prev.filter(c => c !== category)
            : [...prev, category]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description || categories.length === 0 || !date || !time || !location || capacity <= 0 || !recruitmentStartDate || !recruitmentEndDate) {
            alert('모든 필수 항목을 입력해주세요.');
            return;
        }

        if (!isOnlineChecked && !isOfflineChecked) {
            alert('온라인 또는 오프라인 중 하나 이상을 선택해야 합니다.');
            return;
        }

        if (recruitmentStartDate > recruitmentEndDate) {
            alert('모집 시작일은 마감일보다 이전이어야 합니다.');
            return;
        }

        if (recruitmentEndDate > date) {
            alert('모집 마감일은 행사 날짜보다 이전이어야 합니다.');
            return;
        }

        onCreateEvent({
            title,
            description,
            categories,
            date,
            time,
            location,
            isOnline: isOnlineChecked,
            isRegularMeeting,
            capacity,
            price: price || undefined,
            status,
            recruitmentStartDate,
            recruitmentEndDate,
        });
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-950/80 py-12">
            <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800/50 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="text-center mb-10">
                        <CalendarDaysIcon className="w-12 h-12 mx-auto text-blue-500" />
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">새 행사 등록하기</h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">새로운 활동을 등록하여 회원들의 참여를 유도하세요.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <section className="space-y-6">
                            <h2 className="text-2xl font-semibold border-b pb-3 mb-6 text-gray-800 dark:text-gray-200">기본 정보</h2>
                            <InputField id="title" label="행사명 *" type="text" value={title} onChange={e => setTitle(e.target.value)} required />
                            <TextareaField id="description" label="행사 내용 *" value={description} onChange={e => setDescription(e.target.value)} required />
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-2xl font-semibold border-b pb-3 mb-6 text-gray-800 dark:text-gray-200">세부 정보</h2>
                            <div>
                                <label className="block text-base font-bold text-gray-700 dark:text-gray-300 mb-2">카테고리 *</label>
                                <div className="flex flex-wrap gap-4">
                                    {allCategories.map(cat => (
                                        <div key={cat} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id={`cat-${cat}`}
                                                checked={categories.includes(cat)}
                                                onChange={() => handleCategoryChange(cat)}
                                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <label htmlFor={`cat-${cat}`} className="ml-2 text-base text-gray-700 dark:text-gray-300">{cat}</label>
                                        </div>
                                    ))}
                                    <div className="flex items-center">
                                        <input id="isRegularMeeting" type="checkbox" checked={isRegularMeeting} onChange={e => setIsRegularMeeting(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                        <label htmlFor="isRegularMeeting" className="ml-2 text-base text-gray-700 dark:text-gray-300">정기회의</label>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField id="date" label="행사 날짜 *" type="date" value={date} onChange={e => setDate(e.target.value)} required />
                                <InputField id="time" label="행사 시간 *" type="time" value={time} onChange={e => setTime(e.target.value)} required />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField id="recruitmentStartDate" label="모집 시작일 *" type="date" value={recruitmentStartDate} onChange={e => setRecruitmentStartDate(e.target.value)} required />
                                <InputField id="recruitmentEndDate" label="모집 마감일 *" type="date" value={recruitmentEndDate} onChange={e => setRecruitmentEndDate(e.target.value)} required />
                            </div>
                            <InputField id="location" label="장소 *" type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="예: 인천시민회관 또는 온라인 (Zoom)" required />
                             <div>
                                <label className="block text-base font-bold text-gray-700 dark:text-gray-300 mb-2">행사 옵션 *</label>
                                <div className="flex flex-wrap gap-x-6 gap-y-2">
                                    <div className="flex items-center">
                                        <input id="isOnline" type="checkbox" checked={isOnlineChecked} onChange={e => setIsOnlineChecked(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                        <label htmlFor="isOnline" className="ml-2 text-base text-gray-700 dark:text-gray-300">온라인</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input id="isOffline" type="checkbox" checked={isOfflineChecked} onChange={e => setIsOfflineChecked(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                        <label htmlFor="isOffline" className="ml-2 text-base text-gray-700 dark:text-gray-300">오프라인</label>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-6">
                           <h2 className="text-2xl font-semibold border-b pb-3 mb-6 text-gray-800 dark:text-gray-200">참가 정보</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               <InputField id="capacity" label="모집 인원 *" type="number" value={capacity > 0 ? capacity : ''} onChange={e => setCapacity(parseInt(e.target.value) || 0)} min="1" required />
                               <InputField id="price" label="참가비 (선택 사항)" type="text" value={price} onChange={e => setPrice(e.target.value)} placeholder="예: 10,000원 또는 무료" />
                            </div>
                            <SelectField id="status" label="모집 상태 *" value={status} onChange={e => setStatus(e.target.value as EventStatus)} required>
                                <option value="recruiting">모집중</option>
                                <option value="closed">마감</option>
                                <option value="finished">종료</option>
                            </SelectField>
                        </section>
                        
                        <div className="pt-8 flex justify-end gap-4">
                            <button type="button" onClick={() => onNavigate('events')} className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                취소
                            </button>
                            <button type="submit" className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                                <PlusIcon className="w-5 h-5" />
                                행사 등록
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewEventPage;
