import React from 'react';

interface AmountCardProps {
  amount: string;
  description: string;
}

const AmountCard: React.FC<AmountCardProps> = ({ amount, description }) => {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm text-center transition-shadow hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700">
      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">{amount}</p>
      <p className="text-slate-600 dark:text-slate-400">{description}</p>
    </div>
  );
};

export default AmountCard;
