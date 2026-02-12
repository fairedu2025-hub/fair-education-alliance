
import React from 'react';
import Badge from './Badge';
import { CheckIcon } from './icons/CheckIcon';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';

export interface Tier {
  name: string;
  badge: 'GUEST' | 'MEMBER' | 'FULL' | 'ADMIN';
  description: string;
  benefits: string[];
  limits: string[];
  cta: { label: string; href?: string; onClick?: () => void; };
};

const TierCard: React.FC<{ tier: Tier }> = ({ tier }) => {
  const { name, badge, description, benefits, limits, cta } = tier;

  const handleClick = (e: React.MouseEvent) => {
    if (cta.onClick) {
        e.preventDefault();
        cta.onClick();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800/50 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-800 flex flex-col transition-all duration-300 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600">
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{name}</h3>
        <Badge label={badge} />
      </div>
      <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm flex-grow">{description}</p>
      
      <div className="mb-6">
        <h4 className="font-semibold text-sm mb-3 text-slate-800 dark:text-slate-200">혜택</h4>
        <ul className="space-y-2">
          {benefits.map((item, i) => (
            <li key={i} className="flex items-start text-sm">
              <CheckIcon className="w-4 h-4 text-green-500 mr-2.5 mt-0.5 flex-shrink-0" />
              <span className="text-slate-600 dark:text-slate-400">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-semibold text-sm mb-3 text-orange-600 dark:text-orange-400">{badge === 'FULL' || badge === 'ADMIN' ? '의무/제한' : '제한사항'}</h4>
        <ul className="space-y-2 mb-8">
          {limits.map((item, i) => (
            <li key={i} className="flex items-start text-sm">
              <ExclamationTriangleIcon className="w-4 h-4 text-orange-500 mr-2.5 mt-0.5 flex-shrink-0" />
              <span className="text-slate-600 dark:text-slate-400">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <a 
        href={cta.href || "#"} 
        onClick={handleClick}
        className="mt-auto w-full text-center bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
      >
        {cta.label}
      </a>
    </div>
  );
};

export default TierCard;
