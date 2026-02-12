
import React, { useState } from 'react';
import { XMarkIcon } from './icons/XMarkIcon';
import { LightBulbIcon } from './icons/LightBulbIcon';

interface ProposalModalProps {
  onClose: () => void;
  onCreateProposal: (proposal: { title: string; description: string }) => void;
}

const ProposalModal: React.FC<ProposalModalProps> = ({ onClose, onCreateProposal }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      onCreateProposal({ title, description });
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg p-6 sm:p-8 relative transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="닫기"
        >
          <XMarkIcon className="w-6 h-6 text-gray-500" />
        </button>
        
        <div className="flex items-center gap-3 mb-6">
          <LightBulbIcon className="w-8 h-8 text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">새로운 행사 제안</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="proposal-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              제안 제목
            </label>
            <input
              id="proposal-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base p-3"
              required
            />
          </div>
          <div>
            <label htmlFor="proposal-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              제안 설명
            </label>
            <textarea
              id="proposal-description"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base p-3"
              required
            />
          </div>
          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !description.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600"
            >
              제안하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProposalModal;
