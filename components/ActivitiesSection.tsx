
import React from 'react';
import { UsersIcon } from './icons/UsersIcon';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { CalendarDaysIcon } from './icons/CalendarDaysIcon';
import { BadgeIcon } from './icons/BadgeIcon';
import type { Page } from '../types';

interface Activity {
  icon: React.ElementType;
  title: string;
  description: string;
  page: Page;
}

const activities: Activity[] = [
  {
    icon: UsersIcon,
    title: '시민 참여',
    description: '다양한 시민 참여 활동을 통해 지역 사회 발전에 기여합니다.',
    page: 'events',
  },
  {
    icon: BookOpenIcon,
    title: '교육 프로그램',
    description: '체계적이고 전문적인 시민교육 커리큘럼을\n제공합니다.',
    page: 'events',
  },
  {
    icon: CalendarDaysIcon,
    title: '정기 행사',
    description: '매월 다양한 주제의 세미나와 토론회를 개최합니다.',
    page: 'events',
  },
  {
    icon: BadgeIcon,
    title: '전문 역량',
    description: '8년간의 노하우와 전문성을 바탕으로 양질의 교육을 제공합니다.',
    page: 'introduction',
  },
];

interface ActivityCardProps {
  activity: Activity;
  onNavigate: (page: Page) => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onNavigate }) => {
  const Icon = activity.icon;
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-8 flex flex-col items-center text-center">
      <div className="bg-orange-100 text-orange-600 p-4 rounded-lg mb-6 inline-flex">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">{activity.title}</h3>
      <p className="text-gray-600 dark:text-gray-300 flex-grow mb-6 whitespace-pre-line">{activity.description}</p>
      <button onClick={() => onNavigate(activity.page)} className="w-full mt-auto py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
        자세히 보기
      </button>
    </div>
  );
};

interface ActivitiesSectionProps {
  onNavigate: (page: Page) => void;
}

const ActivitiesSection: React.FC<ActivitiesSectionProps> = ({ onNavigate }) => {
  return (
    <section className="bg-gray-50 dark:bg-gray-900/50 py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">우리의 활동</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">공정교육바른인천연합은 다양한 방법으로 시민들과 함께합니다</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {activities.map((activity, index) => (
            <ActivityCard key={index} activity={activity} onNavigate={onNavigate} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ActivitiesSection;
