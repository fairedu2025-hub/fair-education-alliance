
import React from 'react';
import type { Page } from '../types';

interface CallToActionProps {
  onNavigate: (page: Page) => void;
}

const CallToAction: React.FC<CallToActionProps> = ({ onNavigate }) => {
  return (
    <section className="bg-orange-600">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-white">
        <h2 className="text-3xl font-bold">함께 만들어가는 변화</h2>
        <p className="mt-4 text-lg text-orange-100 max-w-2xl mx-auto">
          올바른 시민의식과 사회 참여로 더 나은 인천을 만들어가요
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button onClick={() => onNavigate('events')} className="bg-white text-orange-600 font-semibold px-8 py-3 rounded-md hover:bg-gray-100 transition-colors duration-200 w-full sm:w-auto">
            행사 참여하기
          </button>
          <button onClick={() => onNavigate('donation')} className="border border-white/50 bg-white/10 text-white font-semibold px-8 py-3 rounded-md hover:bg-white/20 transition-colors duration-200 w-full sm:w-auto">
            후원하기
          </button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
