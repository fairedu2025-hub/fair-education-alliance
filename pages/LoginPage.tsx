import React, { useState } from 'react';
import { UserIcon } from '../components/icons/UserIcon';
import { LockClosedIcon } from '../components/icons/LockClosedIcon';
import type { Page } from '../types';

interface LoginPageProps {
    onNavigate: (page: Page) => void;
    onLoginSuccess: (credentials: { userId: string; pass: string; }) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onLoginSuccess }) => {
    
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLoginSuccess({ userId, pass: password });
    };

    return (
        <div className="h-full bg-white dark:bg-gray-900 lg:grid lg:grid-cols-2">
            {/* Left side - Image and Welcome message */}
            <div className="hidden lg:block relative">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2832&auto=format&fit=crop')" }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
                <div className="relative h-full flex flex-col justify-between p-12 text-white">
                    <div>
                        <h1 className="text-2xl font-bold">공정교육바른인천연합</h1>
                    </div>
                    <div className="mb-12">
                        <h1 className="text-4xl font-bold leading-tight">함께 만들어가는 변화</h1>
                        <p className="mt-4 text-lg text-gray-300 max-w-md">
                            여러분의 참여가 더 나은 인천, 더 공정한 사회를 만듭니다. 지금 로그인하고 활동에 참여하세요.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right side - Login Form */}
            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                    <div>
                        <h1 className="mx-auto text-2xl font-bold text-gray-900 dark:text-white text-center">공정교육바른인천연합</h1>
                        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            로그인
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                            환영합니다! 회원 정보를 입력해주세요.
                        </p>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="user-id" className="sr-only">아이디</label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <UserIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="user-id"
                                        name="userid"
                                        type="text"
                                        required
                                        value={userId}
                                        onChange={(e) => setUserId(e.target.value)}
                                        className="relative block w-full appearance-none rounded-md border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-3 pl-10 text-gray-900 dark:text-white placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                                        placeholder="아이디"
                                    />
                                </div>
                            </div>
                            <div className="pt-4">
                                <label htmlFor="password-login" className="sr-only">비밀번호</label>
                                 <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <LockClosedIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="password-login"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="relative block w-full appearance-none rounded-md border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-3 pl-10 text-gray-900 dark:text-white placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                                        placeholder="비밀번호"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                                    아이디 저장
                                </label>
                            </div>

                            <div className="text-sm">
                                <button type="button" onClick={() => onNavigate('find-credentials')} className="font-medium text-blue-600 hover:text-blue-500">
                                    아이디/비밀번호 찾기
                                </button>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-3 px-4 text-base font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                            >
                                로그인
                            </button>
                        </div>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                        아직 회원이 아니신가요?{' '}
                        <button onClick={() => onNavigate('signup')} className="font-medium text-blue-600 hover:text-blue-500">
                            회원가입
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
