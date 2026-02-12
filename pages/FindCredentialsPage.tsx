import React, { useState } from 'react';
import { UserIcon } from '../components/icons/UserIcon';
import { PhoneIcon } from '../components/icons/PhoneIcon';
import type { Page } from '../types';

interface FindCredentialsPageProps {
    onNavigate: (page: Page) => void;
}

const FindCredentialsPage: React.FC<FindCredentialsPageProps> = ({ onNavigate }) => {
    const [activeTab, setActiveTab] = useState<'findId' | 'findPassword'>('findId');
    const [idResult, setIdResult] = useState<string | null>(null);
    const [passwordResult, setPasswordResult] = useState<string | null>(null);

    const handleFindId = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock API call
        setIdResult("찾으시는 아이디는 'user123' 입니다.");
        setPasswordResult(null);
    };

    const handleFindPassword = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock API call
        setPasswordResult("입력하신 전화번호로 비밀번호 재설정 링크가 발송되었습니다.");
        setIdResult(null);
    };
    
    const switchTab = (tab: 'findId' | 'findPassword') => {
        setActiveTab(tab);
        setIdResult(null);
        setPasswordResult(null);
    };

    const TabButton: React.FC<{ tab: 'findId' | 'findPassword', label: string }> = ({ tab, label }) => (
        <button
            onClick={() => switchTab(tab)}
            className={`w-1/2 py-4 px-1 text-center font-semibold border-b-2 transition-colors ${
                activeTab === tab 
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' 
                : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
            role="tab"
            aria-selected={activeTab === tab}
        >
            {label}
        </button>
    );

    const InputField: React.FC<{ id: string, label: string, type: string, icon: React.ReactNode }> = ({ id, label, type, icon }) => (
        <div>
            <label htmlFor={id} className="sr-only">{label}</label>
            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    {icon}
                </div>
                <input
                    id={id}
                    name={id}
                    type={type}
                    required
                    className="relative block w-full appearance-none rounded-md border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-3 pl-10 text-gray-900 dark:text-white placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    placeholder={label}
                />
            </div>
        </div>
    );

    return (
        <div className="bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-900 p-8 sm:p-10 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
                <div>
                    <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                        아이디/비밀번호 찾기
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        회원가입 시 등록한 정보로 찾을 수 있습니다.
                    </p>
                </div>

                <div className="flex border-b border-gray-200 dark:border-gray-700" role="tablist">
                    <TabButton tab="findId" label="아이디 찾기" />
                    <TabButton tab="findPassword" label="비밀번호 찾기" />
                </div>

                <div role="tabpanel" hidden={activeTab !== 'findId'}>
                    <form className="space-y-6" onSubmit={handleFindId}>
                        <InputField id="find-id-name" label="이름" type="text" icon={<UserIcon className="h-5 w-5 text-gray-400" />} />
                        <InputField id="find-id-phone" label="전화번호" type="tel" icon={<PhoneIcon className="h-5 w-5 text-gray-400" />} />
                        <div>
                            <button
                                type="submit"
                                className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-3 px-4 text-base font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                            >
                                아이디 찾기
                            </button>
                        </div>
                        {idResult && (
                            <div className="mt-4 text-center p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md text-blue-800 dark:text-blue-200">
                                {idResult}
                            </div>
                        )}
                    </form>
                </div>
                
                <div role="tabpanel" hidden={activeTab !== 'findPassword'}>
                    <form className="space-y-6" onSubmit={handleFindPassword}>
                        <InputField id="find-pw-id" label="아이디" type="text" icon={<UserIcon className="h-5 w-5 text-gray-400" />} />
                        <InputField id="find-pw-name" label="이름" type="text" icon={<UserIcon className="h-5 w-5 text-gray-400" />} />
                        <InputField id="find-pw-phone" label="전화번호" type="tel" icon={<PhoneIcon className="h-5 w-5 text-gray-400" />} />
                        <div>
                            <button
                                type="submit"
                                className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-3 px-4 text-base font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                            >
                                비밀번호 재설정 링크 발송
                            </button>
                        </div>
                        {passwordResult && (
                            <div className="mt-4 text-center p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md text-green-800 dark:text-green-200">
                                {passwordResult}
                            </div>
                        )}
                    </form>
                </div>

                <div className="text-sm text-center">
                    <button onClick={() => onNavigate('login')} className="font-medium text-blue-600 hover:text-blue-500">
                        로그인 페이지로 돌아가기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FindCredentialsPage;
