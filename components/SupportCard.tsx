import React from 'react';

interface SupportCardProps {
    icon: React.ElementType;
    title: string;
    description?: string;
    content?: React.ReactNode;
    cta?: {
        label: string;
        href: string;
    }
}

const SupportCard: React.FC<SupportCardProps> = ({ icon: Icon, title, description, content, cta }) => {
    return (
        <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-800 text-center flex flex-col items-center transition-all duration-300 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 h-full">
            <div className="bg-slate-100 dark:bg-gray-700/50 text-blue-600 dark:text-blue-400 rounded-full p-4 mb-4">
                <Icon className="w-8 h-8"/>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
            {description && <p className="text-slate-600 dark:text-slate-400 mb-6 flex-grow">{description}</p>}
            {content && <div className="mb-6 flex-grow flex flex-col justify-center">{content}</div>}
            {cta && (
                <a href={cta.href} className="mt-auto w-full max-w-xs text-center border border-slate-300 dark:border-gray-600 text-slate-700 dark:text-slate-200 font-semibold py-2.5 px-4 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors">
                    {cta.label}
                </a>
            )}
        </div>
    );
};

export default SupportCard;
