
import React, { useState, useMemo } from 'react';
import type { Event, Page, User } from '../types';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import EventModal from './EventModal';

const holidays: { date: string; name: string }[] = [
    // 2024
    { date: '2024-01-01', name: '새해' },
    { date: '2024-02-09', name: '설날 연휴' },
    { date: '2024-02-10', name: '설날' },
    { date: '2024-02-11', name: '설날 연휴' },
    { date: '2024-02-12', name: '대체공휴일' },
    { date: '2024-03-01', name: '3·1절' },
    { date: '2024-04-10', name: '국회의원선거' },
    { date: '2024-05-01', name: '근로자의 날' },
    { date: '2024-05-05', name: '어린이날' },
    { date: '2024-05-06', name: '대체공휴일' },
    { date: '2024-05-15', name: '부처님오신날' },
    { date: '2024-06-06', name: '현충일' },
    { date: '2024-08-15', name: '광복절' },
    { date: '2024-09-16', name: '추석 연휴' },
    { date: '2024-09-17', name: '추석' },
    { date: '2024-09-18', name: '추석 연휴' },
    { date: '2024-10-03', name: '개천절' },
    { date: '2024-10-09', name: '한글날' },
    { date: '2024-12-25', name: '크리스마스' },
    // 2025
    { date: '2025-01-01', name: '새해' },
    { date: '2025-01-28', name: '설날 연휴' },
    { date: '2025-01-29', name: '설날' },
    { date: '2025-01-30', name: '설날 연휴' },
    { date: '2025-03-01', name: '3·1절' },
    { date: '2025-05-05', name: '어린이날' },
    { date: '2025-05-06', name: '부처님오신날' },
    { date: '2025-06-06', name: '현충일' },
    { date: '2025-08-15', name: '광복절' },
    { date: '2025-10-03', name: '개천절' },
    { date: '2025-10-05', name: '추석 연휴' },
    { date: '2025-10-06', name: '추석' },
    { date: '2025-10-07', name: '추석 연휴' },
    { date: '2025-10-08', name: '대체공휴일' },
    { date: '2025-10-09', name: '한글날' },
    { date: '2025-12-25', name: '크리스마스' },
];

interface EventCalendarProps {
  events: Event[];
  onNavigate: (page: Page, id?: number) => void;
  loggedInUser: User | null;
  onUpdateEvent: (event: Event) => void;
  onDeleteEvent: (eventId: number) => void;
}

const EventCalendar: React.FC<EventCalendarProps> = ({ events, onNavigate, loggedInUser, onUpdateEvent, onDeleteEvent }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState(currentDate.getFullYear());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
  const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const handleMonthSelect = (month: number) => {
    setCurrentDate(new Date(pickerYear, month, 1));
    setIsPickerOpen(false);
  };
  
  const handleYearChangeInPicker = (increment: number) => {
    setPickerYear(prev => prev + increment);
  }
  
  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
  };

  const calendarGrid = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const prevMonthDays = new Date(year, month, 0).getDate();

    const grid = [];
    const today = new Date();
    today.setHours(0,0,0,0);

    // Previous month's days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
        const date = new Date(year, month - 1, prevMonthDays - i);
        grid.push({ date, isCurrentMonth: false });
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        grid.push({ date, isCurrentMonth: true, isToday: date.getTime() === today.getTime() });
    }

    // Next month's days
    const remainingCells = 42 - grid.length; // 6 weeks * 7 days
    for (let i = 1; i <= remainingCells; i++) {
        const date = new Date(year, month + 1, i);
        grid.push({ date, isCurrentMonth: false });
    }
    
    return grid;

  }, [currentDate]);

  return (
    <div className="bg-white dark:bg-gray-800/50 p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <button onClick={goToPreviousMonth} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="이전 달">
            <ChevronLeftIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
          <button onClick={() => setIsPickerOpen(prev => !prev)} className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
          </button>
          <button onClick={goToNextMonth} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="다음 달">
            <ChevronRightIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {isPickerOpen && (
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-10 border dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
                <button onClick={() => handleYearChangeInPicker(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="이전 연도"><ChevronLeftIcon className="w-5 h-5" /></button>
                <span className="font-bold text-lg">{pickerYear}</span>
                <button onClick={() => handleYearChangeInPicker(1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="다음 연도"><ChevronRightIcon className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-4 gap-2">
                {months.map((month, index) => (
                    <button key={month} onClick={() => handleMonthSelect(index)} className={`p-2 rounded-md text-sm ${
                        pickerYear === currentDate.getFullYear() && index === currentDate.getMonth() 
                        ? 'bg-orange-600 text-white font-bold' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}>
                        {month}
                    </button>
                ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-7 text-center font-semibold text-xs text-gray-500 dark:text-gray-400 pb-2">
        {daysOfWeek.map((day, index) => (
          <div key={day} className={`py-2 ${index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : ''}`}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        {calendarGrid.map(({ date, isCurrentMonth, isToday }, index) => {
            const day = date.getDate();
            const dayOfWeek = date.getDay();
            const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const eventsForDay = events.filter(event => event.date === dateString);
            const holidayForDay = holidays.find(h => h.date === dateString);

            return (
              <div key={index} className={`relative p-2 h-28 md:h-36 overflow-hidden ${isCurrentMonth ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800/50'}`}>
                <time dateTime={dateString} className={`flex items-center justify-center h-7 w-7 text-sm font-bold rounded-full ${isToday ? 'bg-orange-600 text-white' : ''} ${!isCurrentMonth ? 'text-gray-400 dark:text-gray-500' : (dayOfWeek === 0 || holidayForDay) ? 'text-red-500' : dayOfWeek === 6 ? 'text-blue-500' : 'text-gray-700 dark:text-gray-200'}`}>
                    {day}
                </time>
                <div className="mt-1 space-y-1 overflow-y-auto" style={{maxHeight: `calc(100% - 2rem)`}}>
                    {holidayForDay && isCurrentMonth && (
                        <div className="text-xs text-red-500 font-semibold truncate" title={holidayForDay.name}>
                            {holidayForDay.name}
                        </div>
                    )}
                  {eventsForDay.map(event => (
                    <button onClick={() => handleEventClick(event)} key={event.id} className="w-full flex items-center gap-1.5 text-xs bg-orange-50 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 p-1 rounded-md truncate hover:bg-orange-100 dark:hover:bg-orange-900/60 text-left">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0"></div>
                      <span className="truncate">{event.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
        })}
      </div>
      {selectedEvent && <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} onNavigate={onNavigate} loggedInUser={loggedInUser} onUpdateEvent={onUpdateEvent} onDeleteEvent={onDeleteEvent} />}
    </div>
  );
};

export default EventCalendar;
