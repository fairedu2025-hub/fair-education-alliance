import React, { useState } from 'react';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';
import { BanknotesIcon } from './icons/BanknotesIcon';

interface BankAccountCardProps {
  bank: string;
  number: string;
  holder: string;
}

const BankAccountCard: React.FC<BankAccountCardProps> = ({ bank, number, holder }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(number).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <BanknotesIcon className="w-8 h-8 text-slate-500" />
        <h3 className="text-2xl font-bold">{bank}</h3>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-slate-500 dark:text-slate-400">계좌번호</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-slate-700 dark:text-slate-300">{number}</span>
            <button
              onClick={handleCopy}
              className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="계좌번호 복사"
            >
              {copied ? <CheckIcon className="w-5 h-5 text-green-500" /> : <CopyIcon className="w-5 h-5 text-slate-500" />}
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="font-semibold text-slate-500 dark:text-slate-400">예금주</span>
          <span className="text-slate-700 dark:text-slate-300">{holder}</span>
        </div>
      </div>
    </div>
  );
};

export default BankAccountCard;
