import React from 'react';
import { CheckIcon } from './icons/CheckIcon';

interface DonatePlanCardProps {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  benefits: string[];
  recommended?: boolean;
}

const DonatePlanCard: React.FC<DonatePlanCardProps> = ({ icon: Icon, title, subtitle, benefits, recommended = false }) => {
  return (
    <div className={`relative bg-white dark:bg-gray-900 p-8 rounded-2xl border ${recommended ? 'border-blue-500 shadow-lg' : 'border-slate-200 dark:border-gray-800 shadow-sm'} transition-shadow hover:shadow-md`}>
      {recommended && (
        <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-sm font-bold px-4 py-1 rounded-full">
          추천
        </div>
      )}
      <div className="flex items-center gap-4 mb-4">
        <Icon className={`w-8 h-8 ${recommended ? 'text-blue-500' : 'text-slate-500'}`} />
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h3>
      </div>
      <p className="text-slate-600 dark:text-slate-400 mb-6">{subtitle}</p>
      <ul className="space-y-3">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-start">
            <CheckIcon className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-slate-600 dark:text-slate-400">{benefit}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DonatePlanCard;
