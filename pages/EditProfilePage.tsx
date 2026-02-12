
import React, { useState, useEffect, useRef } from 'react';
import type { User, Page } from '../types';
import { UserIcon } from '../components/icons/UserIcon';
import { EnvelopeIcon } from '../components/icons/EnvelopeIcon';
import { PhoneIcon } from '../components/icons/PhoneIcon';
import { ChevronLeftIcon } from '../components/icons/ChevronLeftIcon';
import { LockClosedIcon } from '../components/icons/LockClosedIcon';
import { LocationPinIcon } from '../components/icons/LocationPinIcon';
import { XMarkIcon } from '../components/icons/XMarkIcon';

declare global {
    interface Window {
        daum?: {
            Postcode: new (options: {
                oncomplete: (data: {
                    roadAddress: string;
                    jibunAddress: string;
                    bname: string;
                    buildingName: string;
                    apartment: string;
                }) => void;
            }) => {
                embed: (element: HTMLElement) => void;
            };
        };
    }
}

const DAUM_POSTCODE_SCRIPT_ID = 'daum-postcode-script';
const DAUM_POSTCODE_SCRIPT_SRC = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';

interface EditProfilePageProps {
    user: User | null;
    onUpdate: (user: User) => void;
    onWithdraw: () => void;
    onNavigate: (page: Page) => void;
}

const InputField: React.FC<{
    label: string;
    id: string;
    type: string;
    value: string;
    placeholder?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    icon?: React.ElementType;
    disabled?: boolean;
    readOnly?: boolean;
    required?: boolean;
    children?: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
}> = ({ label, id, type, value, placeholder, onChange, icon: Icon, disabled = false, readOnly = false, required = false, children, onClick }) => (
    <div className="w-full max-w-md mx-auto space-y-1">
        {label && (
            <label htmlFor={id} className={`block text-sm font-bold ${disabled ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                {label} {required && <span className="text-red-500">*</span>}
            </label>
        )}
        <div className="relative">
            {Icon && (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon className={`h-5 w-5 ${disabled ? 'text-gray-400' : 'text-blue-500'}`} />
                </div>
            )}
            <input
                type={type}
                id={id}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                onClick={onClick}
                disabled={disabled}
                readOnly={readOnly}
                required={required}
                className={`block w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:bg-gray-800 dark:text-white ${
                    disabled || readOnly
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 border-gray-300 dark:border-gray-600' 
                    : 'bg-white border-blue-400 dark:border-blue-500/50'
                } ${onClick && !disabled ? 'cursor-pointer' : ''}`}
            />
            {children}
        </div>
    </div>
);

const EditProfilePage: React.FC<EditProfilePageProps> = ({ user, onUpdate, onWithdraw, onNavigate }) => {
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [address, setAddress] = useState(user?.address || '');
    const [addressDetail, setAddressDetail] = useState(user?.addressDetail || '');
    const [isSaving, setIsSaving] = useState(false);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const addressSearchContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!user) {
            onNavigate('login');
        }
    }, [user, onNavigate]);

    const loadAddressSearchScript = () => {
        return new Promise<void>((resolve, reject) => {
            if (window.daum?.Postcode) {
                resolve();
                return;
            }

            const existingScript = document.getElementById(DAUM_POSTCODE_SCRIPT_ID) as HTMLScriptElement | null;
            if (existingScript) {
                existingScript.addEventListener('load', () => resolve(), { once: true });
                existingScript.addEventListener('error', () => reject(new Error('주소 검색 스크립트 로드에 실패했습니다.')), { once: true });
                return;
            }

            const script = document.createElement('script');
            script.id = DAUM_POSTCODE_SCRIPT_ID;
            script.src = DAUM_POSTCODE_SCRIPT_SRC;
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('주소 검색 스크립트 로드에 실패했습니다.'));
            document.body.appendChild(script);
        });
    };

    const handleOpenAddressModal = async () => {
        try {
            await loadAddressSearchScript();
            setIsAddressModalOpen(true);
        } catch (error) {
            alert('주소 검색 기능을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
        }
    };

    useEffect(() => {
        if (!isAddressModalOpen || !addressSearchContainerRef.current || !window.daum?.Postcode) return;

        addressSearchContainerRef.current.innerHTML = '';
        const postcode = new window.daum.Postcode({
            oncomplete: (data) => {
                const baseAddress = data.roadAddress || data.jibunAddress || '';
                const extraParts: string[] = [];

                if (data.bname && /[동로가]$/.test(data.bname)) {
                    extraParts.push(data.bname);
                }
                if (data.buildingName && data.apartment === 'Y') {
                    extraParts.push(data.buildingName);
                }

                const fullAddress = extraParts.length > 0 ? `${baseAddress} (${extraParts.join(', ')})` : baseAddress;
                setAddress(fullAddress);
                setIsAddressModalOpen(false);

                requestAnimationFrame(() => {
                    document.getElementById('user-address-detail')?.focus();
                });
            }
        });

        postcode.embed(addressSearchContainerRef.current);
    }, [isAddressModalOpen]);

    if (!user) return null;

    const handleGoBack = () => {
        if (window.history.length > 1) {
            window.history.back();
            return;
        }
        onNavigate('mypage');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        onUpdate({
            ...user,
            name,
            email,
            phone,
            address,
            addressDetail
        });
        setIsSaving(false);
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-2xl">
                <div className="mb-8">
                    <button 
                        onClick={handleGoBack}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors"
                    >
                        <ChevronLeftIcon className="w-5 h-5" />
                        <span>마이페이지로 돌아가기</span>
                    </button>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div className="p-8 sm:p-10">
                        <div className="flex items-center justify-center gap-6 mb-10">
                            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                                <UserIcon className="w-8 h-8 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">내 정보 수정</h1>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">회원님의 정보를 최신으로 유지해주세요.</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <InputField
                                label="아이디"
                                id="user-id"
                                type="text"
                                value={user.id}
                                icon={LockClosedIcon}
                                disabled
                            />

                            <InputField
                                label="회원 등급"
                                id="user-level"
                                type="text"
                                value={user.level}
                                icon={UserIcon}
                                disabled
                            />

                            <div className="max-w-md mx-auto pt-4 border-t border-gray-100 dark:border-gray-700"></div>

                            <InputField
                                label="이름"
                                id="user-name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                icon={UserIcon}
                                required
                            />

                            <div className="space-y-3">
                                <InputField
                                    label="주소"
                                    id="user-address"
                                    type="text"
                                    value={address}
                                    placeholder="주소를 입력해주세요"
                                    icon={LocationPinIcon}
                                    readOnly
                                    onClick={handleOpenAddressModal}
                                    required
                                />
                                <InputField
                                    label=""
                                    id="user-address-detail"
                                    type="text"
                                    value={addressDetail}
                                    placeholder="나머지 주소를 입력해주세요"
                                    onChange={(e) => setAddressDetail(e.target.value)}
                                    required
                                />
                            </div>

                            <InputField
                                label="이메일 주소"
                                id="user-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                icon={EnvelopeIcon}
                                required
                            />

                            <InputField
                                label="전화번호"
                                id="user-phone"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                icon={PhoneIcon}
                                required
                            />

                            <div className="max-w-md mx-auto pt-8 flex flex-col sm:flex-row gap-4">
                                <button
                                    type="button"
                                    onClick={() => onNavigate('mypage')}
                                    className="flex-1 py-4 px-6 rounded-xl font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all text-center"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-1 py-4 px-6 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isSaving ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            저장 중...
                                        </>
                                    ) : '변경 사항 저장'}
                                </button>
                            </div>
                            <div className="max-w-md mx-auto pt-2">
                                <button
                                    type="button"
                                    onClick={onWithdraw}
                                    className="w-full py-3 px-6 rounded-xl font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-all text-center"
                                >
                                    회원탈퇴
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="p-6 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700">
                        <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed text-center">
                            민감한 정보는 단체 규정에 따라 안전하게 보호됩니다.
                        </p>
                    </div>
                </div>
            </div>
            {isAddressModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-bold text-gray-900">도로명 주소 검색</h2>
                            <button
                                type="button"
                                onClick={() => setIsAddressModalOpen(false)}
                                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                                aria-label="주소 검색 닫기"
                            >
                                <XMarkIcon className="h-5 w-5 text-gray-600" />
                            </button>
                        </div>
                        <div className="p-4">
                            <div ref={addressSearchContainerRef} className="w-full h-[420px]" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditProfilePage;
