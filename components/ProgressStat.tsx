import React from 'react';

interface ProgressStatProps {
  title: string;
  percent: number;
  value: string;
}

const ProgressStat: React.FC<ProgressStatProps> = ({ title, percent, value }) => {
  return (
    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-800 transition-all duration-300 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600">
      <p className="font-semibold text-slate-500 dark:text-slate-400 mb-4 text-sm">{title}</p>
      <div className="flex items-center gap-4 mb-2">
        <span className="font-bold text-2xl text-blue-600 dark:text-blue-400 w-16 text-left">{percent}%</span>
        <div className="flex-grow bg-slate-200 dark:bg-gray-700 rounded-full h-4">
          <div className="bg-blue-500 h-4 rounded-full" style={{ width: `${percent}%` }}></div>
        </div>
      </div>
      <p className="text-right text-sm text-slate-500 dark:text-slate-400 font-medium">{value}</p>
    </div>
  );
};

export default ProgressStat;
