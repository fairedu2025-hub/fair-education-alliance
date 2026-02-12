
import React from 'react';

interface StatCardProps {
  icon: React.ElementType;
  value: string;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, value, label }) => {
  return (
    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-800 flex items-center gap-5">
      <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300 rounded-lg p-3">
        <Icon className="w-8 h-8" />
      </div>
      <div>
        <p className="text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{label}</p>
      </div>
    </div>
  );
};

export default StatCard;
