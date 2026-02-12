import React from 'react';

interface ProgressBarProps {
  label: string;
  amount: number;
  percent: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ label, amount, percent }) => {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1">
        <span className="font-semibold text-slate-800 dark:text-slate-200">{label}</span>
        <span className="text-sm text-slate-600 dark:text-slate-400">
          {amount.toLocaleString()}원 ({percent}%)
        </span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
        <div className="bg-blue-500 h-3 rounded-full" style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
};

export default ProgressBar;
