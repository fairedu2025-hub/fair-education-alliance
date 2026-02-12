
import React, { useState } from 'react';
import type { User, Page } from '../types';
import { CrownIcon } from '../components/icons/CrownIcon';
import { CheckIcon } from '../components/icons/CheckIcon';
import { ChevronLeftIcon } from '../components/icons/ChevronLeftIcon';
import { ShieldCheckIcon } from '../components/icons/ShieldCheckIcon';
import { BanknotesIcon } from '../components/icons/BanknotesIcon';

interface UpgradeMemberPageProps {
    user: User | null;
    onUpgrade: () => void;
    onNavigate: (page: Page) => void;
}

const UpgradeMemberPage: React.FC<UpgradeMemberPageProps> = ({ user, onUpgrade, onNavigate }) => {
    const [agreed, setAgreed] = useState(false);

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">로그인이 필요합니다</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">정회원 승급은 일반회원 가입 후 신청 가능합니다.</p>
                <button
                    onClick={() => onNavigate('login')}
                    className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold"
                >
                    로그인하러 가기
                </button>
            </div>
        );
    }

    if (user.level === '정회원' || user.level === '관리자') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
                <CrownIcon className="w-20 h-20 text-orange-500 mb-6" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">이미 정회원 등급입니다</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">모든 정회원 혜택을 이용하실 수 있습니다.</p>
                <button
                    onClick={() => onNavigate('member')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                    회원 안내 페이지로 돌아가기
                </button>
            </div>
        );
    }
    
    if (user.isUpgradeRequested) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
                <ShieldCheckIcon className="w-20 h-20 text-blue-500 mb-6" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">승급 심사 중입니다</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                    정회원 승급 신청이 접수되었습니다. <br/>
                    관리자가 회비 납부 확인 후 영업일 기준 1~2일 내로 승인해 드립니다.
                </p>
                <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-2xl border border-amber-200 dark:border-amber-900/50 mb-8 max-w-md">
                     <p className="text-amber-800 dark:text-amber-300 font-bold mb-3">미납 시 아래 계좌로 1,000원을 입금해 주세요.</p>
                     <div className="text-sm space-y-1 text-amber-900 dark:text-amber-200">
                        <p>국민은행 123456-78-901234</p>
                        <p>예금주: 공정교육바른인천연합</p>
                     </div>
                </div>
                <button
                    onClick={() => onNavigate('member')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                    회원 안내 페이지로 돌아가기
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-3xl">
                <button 
                    onClick={() => onNavigate('member')}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-semibold mb-8"
                >
                    <ChevronLeftIcon className="w-5 h-5" />
                    <span>돌아가기</span>
                </button>

                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-8 text-center text-white">
                        <CrownIcon className="w-16 h-16 mx-auto mb-4" />
                        <h1 className="text-3xl font-bold">정회원 승급 신청</h1>
                        <p className="text-orange-100 mt-2">공정교육바른인천연합의 진정한 주권자가 되어주세요.</p>
                    </div>

                    <div className="p-8 sm:p-10 space-y-10">
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 p-1 rounded">01</span>
                                정회원 전용 혜택
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {[
                                    '정기총회 참여 및 의결권 행사',
                                    '임원 선출권 및 피선출권 부여',
                                    '단체 주요 정책 수립 및 제안권',
                                    '정회원 전용 교육 및 행사 참여',
                                    '주요 활동 내역 우선 보고',
                                    '공식 후원 및 감사 증서 발급'
                                ].map((benefit, i) => (
                                    <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-700">
                                        <CheckIcon className="w-5 h-5 text-green-500 mt-0.5" />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-2xl border border-amber-200 dark:border-amber-900/50">
                            <h2 className="text-xl font-bold text-amber-900 dark:text-amber-200 mb-4 flex items-center gap-2">
                                <BanknotesIcon className="w-6 h-6 text-amber-600" />
                                정회원 회비 납부 안내
                            </h2>
                            <div className="space-y-4">
                                <p className="text-amber-800 dark:text-amber-300 font-bold text-lg">
                                    정회원 비용 <span className="text-orange-600 dark:text-orange-400 underline decoration-2 underline-offset-4">1,000원 납부 확인 후</span> 승급이 최종 승인됩니다.
                                </p>
                                <div className="bg-white/60 dark:bg-black/20 p-4 rounded-xl space-y-2 text-sm text-amber-900 dark:text-amber-200 border border-amber-100 dark:border-amber-900/30">
                                    <div className="flex justify-between">
                                        <span className="font-semibold">입금 계좌</span>
                                        <span className="font-mono">국민은행 123456-78-901234</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-semibold">예금주</span>
                                        <span>공정교육바른인천연합</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-semibold">입금 금액</span>
                                        <span className="font-bold text-orange-600">1,000원</span>
                                    </div>
                                </div>
                                <p className="text-xs text-amber-700/80 dark:text-amber-400/80 italic">
                                    * 입금 시 반드시 가입하신 성함으로 입금해 주시기 바랍니다.
                                </p>
                            </div>
                        </section>

                        <section className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/50">
                            <h2 className="text-xl font-bold text-blue-900 dark:text-blue-200 mb-4 flex items-center gap-2">
                                <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
                                정회원의 약속
                            </h2>
                            <ul className="space-y-3 text-sm text-blue-800 dark:text-blue-300 font-medium">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500">•</span>
                                    <span>단체의 정관 및 제규정을 준수합니다.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500">•</span>
                                    <span>단체의 목적 달성을 위한 활동에 적극 참여합니다.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500">•</span>
                                    <span>회원 간의 화합과 신뢰를 중시합니다.</span>
                                </li>
                            </ul>
                        </section>

                        <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                            <label className="flex items-center gap-3 cursor-pointer group mb-10">
                                <input 
                                    type="checkbox" 
                                    checked={agreed} 
                                    onChange={(e) => setAgreed(e.target.checked)}
                                    className="w-6 h-6 rounded border-2 border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer" 
                                />
                                <span className="text-gray-700 dark:text-gray-200 font-bold text-lg group-hover:text-orange-600 transition-colors text-pretty">
                                    안내된 회비 납부 조건 및 약속 사항을 확인하였으며, 정회원 승급을 신청합니다.
                                </span>
                            </label>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => onNavigate('member')}
                                    className="flex-1 py-4 px-6 rounded-xl font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all text-center"
                                >
                                    다음에 할게요
                                </button>
                                <button
                                    onClick={onUpgrade}
                                    disabled={!agreed}
                                    className={`flex-1 py-4 px-6 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${
                                        agreed 
                                        ? 'bg-orange-600 hover:bg-orange-700 shadow-orange-600/20' 
                                        : 'bg-gray-300 cursor-not-allowed'
                                    }`}
                                >
                                    <CrownIcon className="w-5 h-5" />
                                    정회원 승급 신청하기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    문의사항: 032-123-4567 | info@fair-edu-incheon.org
                </p>
            </div>
        </div>
    );
};

export default UpgradeMemberPage;
