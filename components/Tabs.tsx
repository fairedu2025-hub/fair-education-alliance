import React, { useState, KeyboardEvent } from 'react';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface FaqItem {
  q: string;
  a: string;
}

interface FaqTabsProps {
  data: Record<string, FaqItem[]>;
}

const AccordionItem: React.FC<{ item: FaqItem; isOpen: boolean; onClick: () => void; }> = ({ item, isOpen, onClick }) => (
    <div className="border-b border-slate-200 dark:border-gray-800 last:border-b-0">
        <h3>
            <button
                type="button"
                className="flex items-center justify-between w-full p-5 font-medium text-left text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-300"
                onClick={onClick}
                aria-expanded={isOpen}
            >
                <span className="flex items-start text-left">
                  <span className="font-bold text-blue-600 mr-2">Q.</span>
                  {item.q}
                </span>
                <ChevronDownIcon className={`w-5 h-5 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}/>
            </button>
        </h3>
        {isOpen && (
             <div className="px-5 pb-5">
                <div className="flex items-start text-slate-600 dark:text-slate-400">
                    <span className="font-bold text-slate-500 mr-2">A.</span>
                    <p className="flex-1">{item.a}</p>
                </div>
            </div>
        )}
    </div>
);

const FaqTabs: React.FC<FaqTabsProps> = ({ data }) => {
    const tabs = Object.keys(data);
    const [activeTab, setActiveTab] = useState(tabs[0]);
    const [openAccordion, setOpenAccordion] = useState<number | null>(0);

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
        setOpenAccordion(0); // Reset accordion on tab change
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
        let newIndex = index;
        if (e.key === 'ArrowRight') {
            newIndex = (index + 1) % tabs.length;
        } else if (e.key === 'ArrowLeft') {
            newIndex = (index - 1 + tabs.length) % tabs.length;
        } else {
            return;
        }
        handleTabClick(tabs[newIndex]);
        (e.currentTarget.parentElement?.children[newIndex] as HTMLElement)?.focus();
    };

    const handleAccordionClick = (index: number) => {
        setOpenAccordion(openAccordion === index ? null : index);
    };

    return (
        <div>
            <div className="mb-4 border-b border-slate-200 dark:border-gray-800 flex justify-center">
                <div role="tablist" aria-label="FAQ Categories" className="flex flex-wrap -mb-px text-sm font-medium text-center text-slate-500 dark:text-slate-400">
                    {tabs.map((tab, index) => (
                        <button
                            key={tab}
                            id={`faq-tab-${index}`}
                            role="tab"
                            aria-selected={activeTab === tab}
                            aria-controls={`faq-panel-${index}`}
                            onClick={() => handleTabClick(tab)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            tabIndex={activeTab === tab ? 0 : -1}
                            className={`inline-block p-4 border-b-2 rounded-t-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                                activeTab === tab 
                                ? 'border-blue-500 text-blue-600 dark:border-blue-500 dark:text-blue-400' 
                                : 'border-transparent hover:text-slate-600 hover:border-slate-300 dark:hover:text-slate-300'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>
            <div>
                {tabs.map((tab, index) => (
                    <div
                        key={tab}
                        id={`faq-panel-${index}`}
                        role="tabpanel"
                        tabIndex={0}
                        aria-labelledby={`faq-tab-${index}`}
                        hidden={activeTab !== tab}
                        className="bg-white dark:bg-gray-800/50 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm overflow-hidden focus:outline-none"
                    >
                        {data[tab].map((item, accIndex) => (
                            <AccordionItem 
                                key={accIndex}
                                item={item}
                                isOpen={openAccordion === accIndex}
                                onClick={() => handleAccordionClick(accIndex)}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FaqTabs;
