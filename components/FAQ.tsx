import React, { useState } from 'react';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

const faqData = {
  '일반 후원': [
    {
      q: '후원금은 어떻게 사용되나요?',
      a: '시민교육 프로그램, 토론회 및 세미나 개최, 교육 자료 제작, 연구활동 지원 등에 투명하게 사용됩니다. 매년 사업보고서를 통해 사용 내역을 공개합니다.',
    },
    {
      q: '정기 후원을 중단하고 싶어요',
      a: '홈페이지 문의하기를 통해 연락 주시거나 전화로 연락주시면 즉시 처리해드립니다.',
    },
  ],
  '세액공제': [
    {
      q: '기부금 영수증은 어떻게 발급받나요?',
      a: '후원 시 등록해주신 정보로 국세청 연말정산 간소화 서비스에 자동 등록됩니다. 별도 발급이 필요하신 경우, 문의하기를 통해 요청해주세요.',
    },
  ],
  '기업 후원': [
    {
      q: '기업 후원 시 어떤 혜택이 있나요?',
      a: '기업명 홍보, 공동 CSR 캠페인 기획, 임직원 참여 프로그램 제공 등 다양한 파트너십 혜택을 드립니다. 자세한 내용은 문의 바랍니다.',
    },
  ],
};

type FaqCategory = keyof typeof faqData;

const AccordionItem: React.FC<{ q: string; a: string; isOpen: boolean; onClick: () => void; }> = ({ q, a, isOpen, onClick }) => (
    <div className="border-b border-slate-200 dark:border-gray-800">
        <h2>
            <button
                type="button"
                className="flex items-center justify-between w-full p-5 font-medium text-left text-slate-700 dark:text-slate-300"
                onClick={onClick}
                aria-expanded={isOpen}
            >
                <span>{q}</span>
                <ChevronDownIcon className={`w-6 h-6 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}/>
            </button>
        </h2>
        <div className={`p-5 border-t-0 border-slate-200 dark:border-gray-800 ${isOpen ? 'block' : 'hidden'}`}>
            <p className="text-slate-600 dark:text-slate-400">{a}</p>
        </div>
    </div>
);


const FAQ: React.FC = () => {
    const [activeTab, setActiveTab] = useState<FaqCategory>('일반 후원');
    const [openAccordion, setOpenAccordion] = useState<number | null>(0);

    const handleAccordionClick = (index: number) => {
        setOpenAccordion(openAccordion === index ? null : index);
    };

    return (
        <div>
            <div className="mb-4 border-b border-slate-200 dark:border-gray-800 flex justify-center">
                <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-slate-500 dark:text-slate-400">
                    {Object.keys(faqData).map((tab) => (
                        <li key={tab} className="mr-2">
                            <button
                                onClick={() => { setActiveTab(tab as FaqCategory); setOpenAccordion(0); }}
                                className={`inline-block p-4 border-b-2 rounded-t-lg transition-colors ${
                                    activeTab === tab 
                                    ? 'border-blue-500 text-blue-600 dark:border-blue-500 dark:text-blue-400' 
                                    : 'border-transparent hover:text-slate-600 hover:border-slate-300 dark:hover:text-slate-300'
                                }`}
                            >
                                {tab}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm overflow-hidden">
                {faqData[activeTab].map((item, index) => (
                    <AccordionItem 
                        key={index}
                        q={item.q}
                        a={item.a}
                        isOpen={openAccordion === index}
                        onClick={() => handleAccordionClick(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default FAQ;
