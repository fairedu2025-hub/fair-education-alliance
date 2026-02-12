
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ChartBarIcon } from '../components/icons/ChartBarIcon';
import { UsersIcon } from '../components/icons/UsersIcon';
import { DocumentDuplicateIcon } from '../components/icons/DocumentDuplicateIcon';
import { PencilSquareIcon } from '../components/icons/PencilSquareIcon';
import { TrashIcon } from '../components/icons/TrashIcon';
import { BookOpenIcon } from '../components/icons/BookOpenIcon';
import { ChatBubbleIcon } from '../components/icons/ChatBubbleIcon';
import { XMarkIcon } from '../components/icons/XMarkIcon';
import { MegaphoneIcon } from '../components/icons/MegaphoneIcon';
import { CalendarDaysIcon } from '../components/icons/CalendarDaysIcon';
import { IdentificationIcon } from '../components/icons/IdentificationIcon';
import { PhotoIcon } from '../components/icons/PhotoIcon';
import { PlusIcon } from '../components/icons/PlusIcon';
import { UserIcon } from '../components/icons/UserIcon';
import { TicketIcon } from '../components/icons/TicketIcon';
import { DownloadIcon } from '../components/icons/DownloadIcon';
import { PinIcon } from '../components/icons/PinIcon';
import { SearchIcon } from '../components/icons/SearchIcon';
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';
import { EnvelopeIcon } from '../components/icons/EnvelopeIcon';


import type { User, IntroductionData, HistoryItem, Executive, Poll, PollOption, BoardPost, Event, EventApplication } from '../types';

const fileToCompressedDataUrl = (file: File, maxWidth = 640, quality = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                const ratio = img.width > maxWidth ? maxWidth / img.width : 1;
                const canvas = document.createElement('canvas');
                canvas.width = Math.max(1, Math.round(img.width * ratio));
                canvas.height = Math.max(1, Math.round(img.height * ratio));
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('CANVAS_CONTEXT_UNAVAILABLE'));
                    return;
                }
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.onerror = () => reject(new Error('IMAGE_DECODE_FAILED'));
            img.src = reader.result as string;
        };
        reader.onerror = () => reject(new Error('FILE_READ_FAILED'));
        reader.readAsDataURL(file);
    });
};

const StatCard: React.FC<{ icon: React.ElementType, title: string, value: string | number, change?: string, changeType?: 'increase' | 'decrease' }> = ({ icon: Icon, title, value, change, changeType }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-500 dark:text-blue-300 mr-4">
                <Icon className="h-6 w-6" />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            </div>
        </div>
        {change && (
            <p className={`text-sm mt-2 ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                {change} 지난 달 대비
            </p>
        )}
    </div>
);

interface AdminPageProps {
    loggedInUser: User | null;
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    stats: {
        totalMembers: number;
        totalPosts: number;
        totalComments: number;
    }
    heroImageUrls: string[];
    setHeroImageUrls: (urls: string[]) => void;
    logoUrl: string;
    setLogoUrl: (url: string) => void;
    introductionData: IntroductionData;
    setIntroductionData: React.Dispatch<React.SetStateAction<IntroductionData>>;
    polls: Poll[];
    onCreatePoll: (poll: Omit<Poll, 'id' | 'totalVotes' | 'hasVoted' | 'hasVotingRights' | 'votedUserIds'>) => void;
    onDeletePoll: (pollId: number) => void;
    boardPosts: BoardPost[];
    onDeleteBoardPost: (postId: number) => void;
    onToggleBoardNotice: (postId: number) => void;
    events: Event[];
    eventApplications: EventApplication[];
    onApproveUpgrade: (userId: string) => void;
    onUpdateUser: (user: User) => Promise<void>;
    onDeleteUser: (userId: string) => Promise<void>;
    onBulkCreateUsers: (items: Array<{ user: User; password: string }>) => Promise<{
      success: number;
      failed: number;
      errors: string[];
    }>;
    onSaveIntroductionData: (data: IntroductionData) => Promise<boolean>;
}

const AdminPage: React.FC<AdminPageProps> = (props) => {
    const [activeSection, setActiveSection] = useState('dashboard');
    const { users, setUsers, stats, heroImageUrls, setHeroImageUrls, logoUrl, setLogoUrl, introductionData, setIntroductionData, loggedInUser, polls, onCreatePoll, onDeletePoll, boardPosts, onDeleteBoardPost, onToggleBoardNotice, events, eventApplications, onApproveUpgrade, onUpdateUser, onDeleteUser, onSaveIntroductionData } = props;

    const renderSection = () => {
        switch (activeSection) {
            case 'dashboard': return <DashboardSection stats={stats} />;
            case 'users': return <UserManagementSection users={users} setUsers={setUsers} loggedInUser={loggedInUser} onApproveUpgrade={onApproveUpgrade} onUpdateUser={onUpdateUser} onDeleteUser={onDeleteUser} onBulkCreateUsers={props.onBulkCreateUsers} />;
            case 'hero': return <HeroManagementSection heroImageUrls={heroImageUrls} setHeroImageUrls={setHeroImageUrls} logoUrl={logoUrl} setLogoUrl={setLogoUrl} />;
            case 'introduction': return <IntroductionManagementSection introductionData={introductionData} setIntroductionData={setIntroductionData} onSaveIntroductionData={onSaveIntroductionData} />;
            case 'news': return <NewsManagementSection />;
            case 'board': return <BoardManagementSection boardPosts={boardPosts} onDeleteBoardPost={onDeleteBoardPost} onToggleBoardNotice={onToggleBoardNotice} />;
            case 'events': return <EventsManagementSection events={events} eventApplications={eventApplications} />;
            case 'online-voting': return <OnlineVotingManagementSection polls={polls} onCreatePoll={onCreatePoll} onDeletePoll={onDeletePoll} users={users} />;
            case 'settings': return <ContentSectionPlaceholder title="사이트 설정" />;
            default: return <DashboardSection stats={stats} />;
        }
    };
    
    const NavItem: React.FC<{ sectionName: string, icon: React.ElementType, label: string }> = ({ sectionName, icon: Icon, label }) => (
        <button
            onClick={() => setActiveSection(sectionName)}
            className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeSection === sectionName
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
        >
            <Icon className="h-5 w-5 mr-3" />
            <span>{label}</span>
        </button>
    );

    return (
        <div className="bg-gray-100 dark:bg-gray-900/50 min-h-screen">
            <div className="flex">
                <aside className="w-64 bg-white dark:bg-gray-800 p-4 space-y-2 hidden lg:block h-screen sticky top-20 shadow-md">
                    <NavItem sectionName="dashboard" icon={ChartBarIcon} label="대시보드" />
                    <NavItem sectionName="users" icon={UsersIcon} label="사용자 관리" />
                    <div className="pt-2">
                        <p className="px-4 text-xs font-semibold text-gray-400 uppercase">콘텐츠 관리</p>
                        <div className="mt-1 space-y-1">
                            <NavItem sectionName="hero" icon={PhotoIcon} label="메인화면 관리" />
                            <NavItem sectionName="introduction" icon={IdentificationIcon} label="소개 관리" />
                            <NavItem sectionName="news" icon={MegaphoneIcon} label="소식/공지 관리" />
                            <NavItem sectionName="board" icon={DocumentDuplicateIcon} label="게시판 관리" />
                            <NavItem sectionName="events" icon={CalendarDaysIcon} label="활동(행사) 관리" />
                            <NavItem sectionName="online-voting" icon={TicketIcon} label="온라인 투표 관리" />
                        </div>
                    </div>
                </aside>

                <main className="flex-1 p-6 lg:p-10">
                    {renderSection()}
                </main>
            </div>
        </div>
    );
};

const DashboardSection: React.FC<{ stats: AdminPageProps['stats'] }> = ({ stats }) => (
    <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">관리자 대시보드</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard icon={UsersIcon} title="총 회원 수" value={`${stats.totalMembers}명`} change="+12명" changeType="increase" />
            <StatCard icon={BookOpenIcon} title="총 게시글 수" value={`${stats.totalPosts}개`} change="+56개" changeType="increase" />
            <StatCard icon={ChatBubbleIcon} title="총 댓글 수" value={`${stats.totalComments}개`} change="-15개" changeType="decrease" />
        </div>
    </div>
);

const parseCsvLine = (line: string) => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i += 1) {
        const char = line[i];
        if (char === '"') {
            const nextChar = line[i + 1];
            if (inQuotes && nextChar === '"') {
                current += '"';
                i += 1;
            } else {
                inQuotes = !inQuotes;
            }
            continue;
        }
        if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
            continue;
        }
        current += char;
    }

    result.push(current.trim());
    return result;
};

const normalizeCsvHeaderKey = (header: string) => {
    const key = header.trim().toLowerCase();
    if (key === '아이디' || key === 'id' || key === 'userid' || key === 'username') return 'id';
    if (key === '비밀번호' || key === 'password' || key === 'pass' || key === 'pw') return 'password';
    if (key === '이름' || key === 'name') return 'name';
    if (key === '전화번호' || key === 'phone' || key === 'tel' || key === 'mobile') return 'phone';
    if (key === '주소' || key === 'address') return 'address';
    if (key === '이메일' || key === 'email') return 'email';
    return key;
};

const UserManagementSection: React.FC<{ users: User[], setUsers: React.Dispatch<React.SetStateAction<User[]>>, loggedInUser: User | null, onApproveUpgrade: (userId: string) => void, onUpdateUser: (user: User) => Promise<void>, onDeleteUser: (userId: string) => Promise<void>, onBulkCreateUsers: (items: Array<{ user: User; password: string }>) => Promise<{ success: number; failed: number; errors: string[] }> }> = ({ users, setUsers, loggedInUser, onApproveUpgrade, onUpdateUser, onDeleteUser, onBulkCreateUsers }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [editedUser, setEditedUser] = useState<User | null>(null);
    const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
    const [isSendingMessage, setIsSendingMessage] = useState(false);
    const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);
    const [smsMessage, setSmsMessage] = useState('');
    const [smsRecipients, setSmsRecipients] = useState<Array<{ id: string; name: string; phone: string }>>([]);
    const csvInputRef = useRef<HTMLInputElement>(null);

    const handleOpenModal = (user: User) => { setSelectedUser(user); setEditedUser({ ...user }); setIsModalOpen(true); };
    const handleCloseModal = () => { setIsModalOpen(false); setSelectedUser(null); setEditedUser(null); };
    const handleOpenDeleteConfirm = (user: User) => { setSelectedUser(user); setIsDeleteConfirmOpen(true); };
    const handleCloseDeleteConfirm = () => { setIsDeleteConfirmOpen(false); setSelectedUser(null); };
    const handleUserUpdate = async () => {
        if (!editedUser) return;
        try {
            await onUpdateUser(editedUser);
            handleCloseModal();
            alert('사용자 정보가 저장되었습니다.');
        } catch (error) {
            alert(error instanceof Error ? error.message : '사용자 정보 저장 중 오류가 발생했습니다.');
        }
    };
    const handleUserDelete = async () => {
        if (!selectedUser) return;
        await onDeleteUser(selectedUser.id);
        handleCloseDeleteConfirm();
    };
    const handleResetPassword = (userId: string) => { alert(`${userId} 님의 비밀번호가 초기화되었습니다. (기능 시뮬레이션)`); };

    const canManageAdmins = loggedInUser?.level === '관리자';
    const isAllSelected = users.length > 0 && users.every((user) => selectedUserIds.has(user.id));

    const toggleUserSelection = (userId: string) => {
        setSelectedUserIds((prev) => {
            const next = new Set(prev);
            if (next.has(userId)) {
                next.delete(userId);
            } else {
                next.add(userId);
            }
            return next;
        });
    };

    const toggleAllSelection = () => {
        setSelectedUserIds((prev) => {
            if (users.length > 0 && users.every((user) => prev.has(user.id))) {
                return new Set();
            }
            return new Set(users.map((user) => user.id));
        });
    };

    const handleSendMessage = () => {
        if (isSendingMessage) return;

        if (loggedInUser?.level !== '관리자') {
            alert('관리자만 문자 발송이 가능합니다.');
            return;
        }

        if (selectedUserIds.size === 0) {
            alert('문자를 보낼 사용자를 먼저 선택해주세요.');
            return;
        }

        const recipients = users
            .filter((user) => selectedUserIds.has(user.id))
            .map((user) => ({ id: user.id, name: user.name, phone: user.phone || '' }))
            .filter((user) => !!user.phone);

        if (recipients.length === 0) {
            alert('선택한 사용자 중 문자 발송 가능한 전화번호가 없습니다.');
            return;
        }

        setSmsRecipients(recipients);
        setSmsMessage('');
        setIsSmsModalOpen(true);
    };

    const handleCloseSmsModal = () => {
        if (isSendingMessage) return;
        setIsSmsModalOpen(false);
        setSmsMessage('');
        setSmsRecipients([]);
    };

    const handleConfirmSendMessage = async () => {
        if (isSendingMessage) return;

        const message = smsMessage.trim();
        if (!message) {
            alert('문자 내용을 입력해주세요.');
            return;
        }

        let idToken = '';
        try {
            const rawSession = sessionStorage.getItem('firebaseSession');
            if (rawSession) {
                const parsedSession = JSON.parse(rawSession);
                idToken = typeof parsedSession?.idToken === 'string' ? parsedSession.idToken : '';
            }
        } catch (error) {
            idToken = '';
        }

        try {
            setIsSendingMessage(true);
            const response = await fetch('/api/admin/send-sms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
                },
                body: JSON.stringify({
                    recipients: smsRecipients,
                    message,
                }),
            });

            const result = await response.json().catch(() => ({}));
            if (!response.ok || !result?.ok) {
                alert(result?.message || '문자 발송에 실패했습니다.');
                return;
            }

            const successCount = typeof result?.successCount === 'number' ? result.successCount : recipients.length;
            const failedCount = typeof result?.failedCount === 'number' ? result.failedCount : 0;
            if (failedCount > 0) {
                alert(`문자 전송 완료: 성공 ${successCount}건, 실패 ${failedCount}건`);
            } else {
                alert(`문자 전송 완료: ${successCount}건`);
            }
            handleCloseSmsModal();
        } catch (error) {
            alert('문자 발송 중 네트워크 오류가 발생했습니다.');
        } finally {
            setIsSendingMessage(false);
        }
    };

    const handleDownloadCsvTemplate = () => {
        const templateRows = [
            '아이디,비밀번호,이름,전화번호,주소,이메일',
            'chusa77,7777,김정호,010-7777-7777,"인천 남동구 백범로 310번길21 4층",chusa77@myapp.com',
            ',,홍길동,010-1234-5678,"인천 미추홀구 예시로 10",',
        ];
        const csvContent = `\uFEFF${templateRows.join('\n')}`;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'bulk_signup_template.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleClickCsvUpload = () => {
        csvInputRef.current?.click();
    };

    const handleCsvFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const text = await file.text();
            const lines = text
                .replace(/^\uFEFF/, '')
                .split(/\r?\n/)
                .map((line) => line.trim())
                .filter((line) => line.length > 0);

            if (lines.length < 2) {
                alert('CSV 파일에 데이터가 없습니다.');
                return;
            }

            const headers = parseCsvLine(lines[0]).map(normalizeCsvHeaderKey);
            const items: Array<{ user: User; password: string }> = [];
            const parseErrors: string[] = [];

            for (let i = 1; i < lines.length; i += 1) {
                const row = parseCsvLine(lines[i]);
                const rowData: Record<string, string> = {};
                headers.forEach((header, idx) => {
                    rowData[header] = (row[idx] || '').trim();
                });

                const rawPhone = (rowData.phone || '').replace(/\D/g, '');
                const generatedId = rawPhone;
                const id = (rowData.id || generatedId || '').replace(/[^a-zA-Z0-9]/g, '');
                const generatedPassword = rawPhone.startsWith('010')
                    ? rawPhone.slice(3)
                    : rawPhone;
                const password = (rowData.password || generatedPassword || '').trim();
                const name = (rowData.name || id).trim();

                if (!id) {
                    parseErrors.push(`${i + 1}행: 아이디를 생성할 수 없습니다. (아이디 또는 전화번호 필요)`);
                    continue;
                }
                if (!password) {
                    parseErrors.push(`${i + 1}행: 비밀번호를 생성할 수 없습니다. (비밀번호 또는 전화번호 4자리 필요)`);
                    continue;
                }
                if (!name) {
                    parseErrors.push(`${i + 1}행: 이름이 필요합니다.`);
                    continue;
                }

                items.push({
                    user: {
                        id,
                        name,
                        level: '일반회원',
                        phone: rowData.phone || '',
                        address: rowData.address || '',
                        email: rowData.email || '',
                    },
                    password,
                });
            }

            if (items.length === 0) {
                alert(parseErrors.length > 0 ? parseErrors.join('\n') : '등록 가능한 데이터가 없습니다.');
                return;
            }

            const result = await onBulkCreateUsers(items);
            const messages = [
                `일괄 가입 완료: 성공 ${result.success}건, 실패 ${result.failed}건`,
            ];
            if (parseErrors.length > 0) {
                messages.push(`CSV 파싱 실패 ${parseErrors.length}건`);
            }
            const errorPreview = [...parseErrors, ...result.errors].slice(0, 5);
            if (errorPreview.length > 0) {
                messages.push(`오류 예시:\n${errorPreview.join('\n')}`);
            }
            alert(messages.join('\n\n'));
        } catch (error) {
            alert('CSV 파일 처리 중 오류가 발생했습니다.');
        } finally {
            e.target.value = '';
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">사용자 관리</h1>
            <div className="mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                    <button
                        type="button"
                        onClick={handleSendMessage}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                        <EnvelopeIcon className="w-4 h-4" />
                        문자 보내기
                    </button>
                    <button
                        type="button"
                        onClick={handleClickCsvUpload}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                        CSV 일괄 가입
                    </button>
                    <button
                        type="button"
                        onClick={handleDownloadCsvTemplate}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                        CSV 양식 다운로드
                    </button>
                    <input
                        ref={csvInputRef}
                        type="file"
                        accept=".csv,text/csv"
                        className="hidden"
                        onChange={handleCsvFileChange}
                    />
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3 w-12">
                                <input
                                    type="checkbox"
                                    aria-label="전체 선택"
                                    checked={isAllSelected}
                                    onChange={toggleAllSelection}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                            </th>
                            <th scope="col" className="px-6 py-3">이름</th>
                            <th scope="col" className="px-6 py-3">아이디</th>
                            <th scope="col" className="px-6 py-3">전화번호</th>
                            <th scope="col" className="px-6 py-3">주소</th>
                            <th scope="col" className="px-6 py-3">등급</th>
                            <th scope="col" className="px-6 py-3 text-right">관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4">
                                    <input
                                        type="checkbox"
                                        aria-label={`${user.id} 선택`}
                                        checked={selectedUserIds.has(user.id)}
                                        onChange={() => toggleUserSelection(user.id)}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    <div className="flex items-center gap-2">
                                        {user.name}
                                        {user.isUpgradeRequested && (
                                            <span className="inline-block px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-black rounded border border-orange-200 animate-pulse">승급요청</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">{user.id}</td>
                                <td className="px-6 py-4">{user.phone || '-'}</td>
                                <td className="px-6 py-4">
                                    {user.address
                                        ? `${user.address}${user.addressDetail ? ` ${user.addressDetail}` : ''}`
                                        : '-'}
                                </td>
                                <td className="px-6 py-4">{user.level}</td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    {user.isUpgradeRequested && (
                                        <button 
                                            onClick={() => onApproveUpgrade(user.id)}
                                            className="p-2 text-green-600 hover:text-green-800 transition-colors"
                                            title="정회원 승인"
                                        >
                                            <CheckCircleIcon className="w-6 h-6" />
                                        </button>
                                    )}
                                    <button onClick={() => handleOpenModal(user)} className="p-2 text-blue-500 hover:text-blue-700" aria-label={`${user.name} 정보 수정`}><PencilSquareIcon className="w-5 h-5"/></button>
                                    <button onClick={() => handleOpenDeleteConfirm(user)} className="p-2 text-red-500 hover:text-red-700" aria-label={`${user.name} 탈퇴 처리`}><TrashIcon className="w-5 h-5"/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && editedUser && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6 space-y-4">
                        <div className="flex justify-between items-center"><h2 className="text-xl font-bold text-gray-900 dark:text-white">사용자 정보 수정</h2><button onClick={handleCloseModal} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><XMarkIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" /></button></div>
                        <div className="space-y-4">
                             <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">이름</label><p className="mt-1 text-gray-900 dark:text-white">{editedUser.name}</p></div>
                             <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">아이디</label><p className="mt-1 text-gray-900 dark:text-white">{editedUser.id}</p></div>
                             <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">이메일</label><p className="mt-1 text-gray-900 dark:text-white">{editedUser.email}</p></div>
                             <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">전화번호</label><p className="mt-1 text-gray-900 dark:text-white">{editedUser.phone}</p></div>
                             <div>
                                <label htmlFor="user-level" className="block text-sm font-medium text-gray-700 dark:text-gray-300">등급</label>
                                <select 
                                    id="user-level" 
                                    value={editedUser.level} 
                                    onChange={(e) => setEditedUser({...editedUser, level: e.target.value as User['level']})} 
                                    disabled={!canManageAdmins && editedUser.level === '관리자'}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 dark:disabled:bg-gray-700/50 disabled:cursor-not-allowed">
                                    <option>일반회원</option>
                                    <option>정회원</option>
                                    {(canManageAdmins || editedUser.level === '관리자') && <option>관리자</option>}
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t dark:border-gray-700"><button onClick={() => handleResetPassword(editedUser.id)} type="button" className="text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">비밀번호 초기화</button><div className="space-x-3"><button onClick={handleCloseModal} type="button" className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600">취소</button><button onClick={handleUserUpdate} type="button" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700">저장</button></div></div>
                    </div>
                </div>
            )}
            {isDeleteConfirmOpen && selectedUser && (
                 <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
                     <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6"><h2 className="text-lg font-bold text-gray-900 dark:text-white">사용자 탈퇴 확인</h2><p className="mt-2 text-sm text-gray-600 dark:text-gray-300">정말로 <span className="font-bold">{selectedUser.name}</span>({selectedUser.id})님을 탈퇴 처리하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p><div className="mt-6 flex justify-end space-x-3"><button onClick={handleCloseDeleteConfirm} type="button" className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600">취소</button><button onClick={handleUserDelete} type="button" className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700">확인</button></div></div>
                </div>
            )}
            {isSmsModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">문자 보내기</h2>
                            <button onClick={handleCloseSmsModal} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" disabled={isSendingMessage}>
                                <XMarkIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">선택한 {smsRecipients.length}명에게 보낼 내용을 입력해주세요.</p>
                        <textarea
                            value={smsMessage}
                            onChange={(e) => setSmsMessage(e.target.value)}
                            rows={5}
                            placeholder="문자 내용을 입력하세요."
                            className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            disabled={isSendingMessage}
                        />
                        <div className="flex justify-end space-x-3 pt-2">
                            <button
                                onClick={handleCloseSmsModal}
                                type="button"
                                disabled={isSendingMessage}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleConfirmSendMessage}
                                type="button"
                                disabled={isSendingMessage}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSendingMessage ? '전송 중...' : '전송'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

interface HeroManagementSectionProps {
    heroImageUrls: string[];
    setHeroImageUrls: (urls: string[]) => void;
    logoUrl: string;
    setLogoUrl: (url: string) => void;
}

const HeroManagementSection: React.FC<HeroManagementSectionProps> = ({ heroImageUrls, setHeroImageUrls, logoUrl, setLogoUrl }) => {
    const [localHeroImageUrls, setLocalHeroImageUrls] = useState(heroImageUrls);
    const [localLogoUrl, setLocalLogoUrl] = useState(logoUrl);

    useEffect(() => {
        setLocalHeroImageUrls(heroImageUrls);
    }, [heroImageUrls]);

    useEffect(() => {
        setLocalLogoUrl(logoUrl);
    }, [logoUrl]);

    const hasChanges = useMemo(() => 
        JSON.stringify(localHeroImageUrls) !== JSON.stringify(heroImageUrls) || localLogoUrl !== logoUrl,
        [localHeroImageUrls, heroImageUrls, localLogoUrl, logoUrl]
    );
    
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    const newUrls = [...localHeroImageUrls];
                    newUrls[index] = event.target.result as string;
                    setLocalHeroImageUrls(newUrls);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = (index: number) => {
        document.getElementById(`file-input-${index}`)?.click();
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setLocalLogoUrl(event.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerLogoFileInput = () => {
        document.getElementById('logo-file-input')?.click();
    };

    const handleSave = () => {
        setHeroImageUrls(localHeroImageUrls);
        setLogoUrl(localLogoUrl);
        alert('변경 사항이 저장되었습니다.');
    };
    
    const handleReset = () => {
        setLocalHeroImageUrls(heroImageUrls);
        setLocalLogoUrl(logoUrl);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">메인화면 관리</h1>
                <div className="flex items-center gap-3">
                    <button onClick={handleReset} disabled={!hasChanges} className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold px-4 py-2 rounded-md text-sm border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        초기화
                    </button>
                    <button onClick={handleSave} disabled={!hasChanges} className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        적용 및 저장
                    </button>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-300">메인 배경화면</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    홈페이지 최상단에 표시되는 3개의 배경 이미지를 변경할 수 있습니다. 이미지는 3초 간격으로 자동으로 슬라이드됩니다.
                </p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {localHeroImageUrls.map((url, index) => (
                        <div key={index} className="space-y-2">
                            <h4 className="font-semibold text-gray-700 dark:text-gray-300">배경 이미지 {index + 1}</h4>
                            <div className="group relative aspect-video bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600">
                                <img src={url} alt={`배경 ${index + 1}`} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <button
                                        onClick={() => triggerFileInput(index)}
                                        className="bg-white/90 text-gray-900 font-semibold px-4 py-2 rounded-md text-sm hover:bg-white"
                                    >
                                        이미지 변경
                                    </button>
                                    <input
                                        type="file"
                                        id={`file-input-${index}`}
                                        hidden
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, index)}
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">권장 사이즈: 1920x1080</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mt-8">
                <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-300">사이트 로고 관리</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    사이트 헤더에 표시되는 로고를 변경합니다.
                </p>
                <div className="mt-6 flex items-center gap-6">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">현재 로고</p>
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-600">
                            <img src={localLogoUrl} alt="현재 로고" className="h-12 w-12 object-contain" />
                        </div>
                    </div>
                    <div>
                        <button
                            onClick={triggerLogoFileInput}
                            className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
                        >
                            로고 업로드
                        </button>
                        <input
                            type="file"
                            id="logo-file-input"
                            hidden
                            accept="image/svg+xml, image/png, image/jpeg"
                            onChange={handleLogoUpload}
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">SVG, PNG, JPG 파일 형식 지원. 권장 사이즈: 128x128px</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ContentSectionPlaceholder: React.FC<{title: string}> = ({ title }) => (
    <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{title}</h1>
        <div className="bg-white dark:bg-gray-800 p-12 rounded-lg shadow text-center text-gray-500 dark:text-gray-400">
            <p>이곳에 {title} 기능이 구현될 예정입니다.</p>
        </div>
    </div>
);

const InputField: React.FC<{ label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string }> = ({ label, value, onChange, type = 'text' }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
        />
    </div>
);

const SectionCard: React.FC<{ title: string, children: React.ReactNode, actionButton?: React.ReactNode }> = ({ title, children, actionButton }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{title}</h3>
            {actionButton}
        </div>
        {children}
    </div>
);

const HistoryModal: React.FC<{ item: HistoryItem | null, onSave: (item: HistoryItem) => void, onClose: () => void }> = ({ item, onSave, onClose }) => {
    const [year, setYear] = useState(item?.year || '');
    const [event, setEvent] = useState(item?.event || '');

    useEffect(() => {
        if (item) {
            setYear(item.year);
            setEvent(item.event);
        } else {
            setYear('');
            setEvent('');
        }
    }, [item]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ year, event });
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{item ? '연혁 수정' : '연혁 추가'}</h3>
                    <button onClick={onClose}><XMarkIcon className="w-6 h-6 text-gray-500" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField label="연도" value={year} onChange={(e) => setYear(e.target.value)} />
                    <InputField label="내용" value={event} onChange={(e) => setEvent(e.target.value)} />
                    <div className="flex justify-end gap-2 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">취소</button>
                        <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">저장</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ExecutiveModal: React.FC<{ item: Executive | null, onSave: (item: Executive) => void, onClose: () => void }> = ({ item, onSave, onClose }) => {
    const [name, setName] = useState(item?.name || '');
    const [role, setRole] = useState(item?.role || '');
    const [bio, setBio] = useState(item?.bio || '');
    const [photoUrl, setPhotoUrl] = useState(item?.photoUrl || '');

    useEffect(() => {
        if (item) {
            setName(item.name);
            setRole(item.role);
            setBio(item.bio);
            setPhotoUrl(item.photoUrl || '');
        } else {
            setName('');
            setRole('');
            setBio('');
            setPhotoUrl('');
        }
    }, [item]);

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            fileToCompressedDataUrl(file, 480, 0.78)
                .then((compressed) => setPhotoUrl(compressed))
                .catch(() => alert('이미지 처리에 실패했습니다.'));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name, role, bio, photoUrl });
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{item ? '임원 수정' : '임원 추가'}</h3>
                    <button onClick={onClose}><XMarkIcon className="w-6 h-6 text-gray-500" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex justify-center mb-4">
                        <div className="relative w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 group">
                            {photoUrl ? (
                                <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <UserIcon className="w-full h-full text-gray-400 p-4" />
                            )}
                            <label htmlFor="executive-photo-upload" className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-xs font-medium">
                                사진 변경
                            </label>
                            <input type="file" id="executive-photo-upload" accept="image/*" hidden onChange={handlePhotoUpload} />
                        </div>
                    </div>
                    <InputField label="이름" value={name} onChange={(e) => setName(e.target.value)} />
                    <InputField label="직책" value={role} onChange={(e) => setRole(e.target.value)} />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">소개</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={3}
                            className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        />
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">취소</button>
                        <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">저장</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

interface IntroductionManagementProps {
    introductionData: IntroductionData;
    setIntroductionData: React.Dispatch<React.SetStateAction<IntroductionData>>;
    onSaveIntroductionData: (data: IntroductionData) => Promise<boolean>;
}

const IntroductionManagementSection: React.FC<IntroductionManagementProps> = ({ introductionData, setIntroductionData, onSaveIntroductionData }) => {
    const [localData, setLocalData] = useState(introductionData);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [isExecutiveModalOpen, setIsExecutiveModalOpen] = useState(false);
    const [editingHistory, setEditingHistory] = useState<HistoryItem | null>(null);
    const [editingExecutive, setEditingExecutive] = useState<Executive | null>(null);

    const hasChanges = useMemo(() => JSON.stringify(localData) !== JSON.stringify(introductionData), [localData, introductionData]);

    const handleSave = async () => {
        const isSynced = await onSaveIntroductionData(localData);
        if (isSynced) {
            setIntroductionData(localData);
            alert('소개 페이지 정보가 저장되었습니다.');
            return;
        }
        alert('소개 페이지 정보 Firebase 저장에 실패했습니다.');
    };

    const handleReset = () => setLocalData(introductionData);
    
    // President handlers
    const handlePresidentDataChange = (field: keyof IntroductionData['president'], value: string) => {
        setLocalData(prev => ({
            ...prev,
            president: {
                ...prev.president,
                [field]: value
            }
        }));
    };

    const handlePresidentPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            fileToCompressedDataUrl(file, 640, 0.8)
                .then((compressed) => handlePresidentDataChange('photoUrl', compressed))
                .catch(() => alert('이미지 처리에 실패했습니다.'));
        }
    };
    
    // History Handlers
    const handleHistoryDelete = (index: number) => {
        if(window.confirm('정말로 이 항목을 삭제하시겠습니까?')) {
            setLocalData(prev => ({ ...prev, history: prev.history.filter((_, i) => i !== index) }));
        }
    }
    const openHistoryModal = (item: HistoryItem | null = null) => { setEditingHistory(item || { year: '', event: '' }); setIsHistoryModalOpen(true); };
    const closeHistoryModal = () => { setEditingHistory(null); setIsHistoryModalOpen(false); };
    const handleHistorySave = (item: HistoryItem) => {
        if (editingHistory && localData.history.includes(editingHistory)) {
             setLocalData(prev => ({...prev, history: prev.history.map(h => h === editingHistory ? item : h)}));
        } else {
             setLocalData(prev => ({...prev, history: [...prev.history, item]}));
        }
        closeHistoryModal();
    };

    // Executive Handlers
    const handleExecutiveDelete = (index: number) => {
         if(window.confirm('정말로 이 항목을 삭제하시겠습니까?')) {
            setLocalData(prev => ({ ...prev, executives: prev.executives.filter((_, i) => i !== index) }));
         }
    };
    const openExecutiveModal = (item: Executive | null = null) => { setEditingExecutive(item || { name: '', role: '', bio: '', photoUrl: undefined }); setIsExecutiveModalOpen(true); };
    const closeExecutiveModal = () => { setEditingExecutive(null); setIsExecutiveModalOpen(false); };
    const handleExecutiveSave = (item: Executive) => {
        const isEditing = editingExecutive && localData.executives.find(e => e.name === editingExecutive.name && e.role === editingExecutive.role);
        if (isEditing) {
            setLocalData(prev => ({ ...prev, executives: prev.executives.map(e => (e.name === editingExecutive!.name && e.role === editingExecutive!.role) ? item : e) }));
        } else {
            setLocalData(prev => ({ ...prev, executives: [...prev.executives, item] }));
        }
        closeExecutiveModal();
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">소개 관리</h1>
                <div className="flex items-center gap-3">
                    <button onClick={handleReset} disabled={!hasChanges} className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold px-4 py-2 rounded-md text-sm border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">초기화</button>
                    <button onClick={handleSave} disabled={!hasChanges} className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">적용 및 저장</button>
                </div>
            </div>
            
            <SectionCard title="상임대표 인사말 관리">
                <div className="grid md:grid-cols-3 gap-6 items-start">
                    <div className="md:col-span-1 space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">상임대표 사진</label>
                        <div className="w-40 h-40 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mx-auto border-2 border-dashed border-gray-300 dark:border-gray-600">
                            {localData.president.photoUrl ? (
                                <img src={localData.president.photoUrl} alt={localData.president.name} className="w-full h-full object-cover" />
                            ) : (
                                <UserIcon className="w-full h-full text-gray-400 dark:text-gray-500 p-8" />
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => document.getElementById('president-photo-upload')?.click()}
                            className="w-full mt-2 bg-white dark:bg-gray-700 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                            사진 변경
                        </button>
                        <input type="file" id="president-photo-upload" accept="image/*" hidden onChange={handlePresidentPhotoUpload} />
                    </div>
                    <div className="md:col-span-2 space-y-4">
                        <InputField 
                            label="상임대표 이름"
                            value={localData.president.name}
                            onChange={(e) => handlePresidentDataChange('name', e.target.value)}
                        />
                        <div>
                            <label htmlFor="president-greeting" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">인사말</label>
                            <textarea
                                id="president-greeting"
                                rows={10}
                                value={localData.president.greeting}
                                onChange={(e) => handlePresidentDataChange('greeting', e.target.value)}
                                className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>
                </div>
            </SectionCard>

            <SectionCard title="연혁 관리" actionButton={<button onClick={() => openHistoryModal()} className="flex items-center gap-2 bg-blue-500 text-white font-semibold px-4 py-2 rounded-md text-sm hover:bg-blue-600 transition-colors"><PlusIcon className="w-4 h-4" /><span>항목 추가</span></button>}>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-left text-gray-500 dark:text-gray-400"><tr><th className="p-2">연도</th><th className="p-2">내용</th><th className="p-2 text-right">관리</th></tr></thead>
                        <tbody>
                            {localData.history.map((item, index) => (
                                <tr key={index} className="border-t dark:border-gray-700">
                                    <td className="p-2 font-semibold w-24">{item.year}</td>
                                    <td className="p-2">{item.event}</td>
                                    <td className="p-2 text-right space-x-2"><button onClick={() => openHistoryModal(item)} className="p-2 text-blue-500 hover:text-blue-700"><PencilSquareIcon className="w-5 h-5"/></button><button onClick={() => handleHistoryDelete(index)} className="p-2 text-red-500 hover:text-red-700"><TrashIcon className="w-5 h-5"/></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </SectionCard>

            <SectionCard title="임원진 관리" actionButton={<button onClick={() => openExecutiveModal()} className="flex items-center gap-2 bg-blue-500 text-white font-semibold px-4 py-2 rounded-md text-sm hover:bg-blue-600 transition-colors"><PlusIcon className="w-4 h-4" /><span>임원 추가</span></button>}>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-left text-gray-500 dark:text-gray-400"><tr><th className="p-2 w-16">사진</th><th className="p-2">이름</th><th className="p-2">직책</th><th className="p-2">소개</th><th className="p-2 text-right">관리</th></tr></thead>
                        <tbody>
                            {localData.executives.map((item, index) => (
                                <tr key={index} className="border-t dark:border-gray-700">
                                    <td className="p-2">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                            {item.photoUrl ? (
                                                <img src={item.photoUrl} alt={item.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <UserIcon className="w-full h-full text-gray-400 dark:text-gray-500 p-2" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-2 font-semibold w-28">{item.name}</td>
                                    <td className="p-2 w-32">{item.role}</td>
                                    <td className="p-2">{item.bio}</td>
                                    <td className="p-2 text-right space-x-2"><button onClick={() => openExecutiveModal(item)} className="p-2 text-blue-500 hover:text-blue-700"><PencilSquareIcon className="w-5 h-5"/></button><button onClick={() => handleExecutiveDelete(index)} className="p-2 text-red-500 hover:text-red-700"><TrashIcon className="w-5 h-5"/></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </SectionCard>

            {isHistoryModalOpen && <HistoryModal item={editingHistory} onSave={handleHistorySave} onClose={closeHistoryModal} />}
            {isExecutiveModalOpen && <ExecutiveModal item={editingExecutive} onSave={handleExecutiveSave} onClose={closeExecutiveModal} />}
        </div>
    );
};

const NewsManagementSection: React.FC = () => <ContentSectionPlaceholder title="소식/공지 관리" />;

const BoardManagementSection: React.FC<{ boardPosts: BoardPost[], onDeleteBoardPost: (id: number) => void, onToggleBoardNotice: (id: number) => void }> = ({ boardPosts, onDeleteBoardPost, onToggleBoardNotice }) => {
    const [filterTag, setFilterTag] = useState('전체');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPosts = boardPosts.filter(post => {
        const matchesTag = filterTag === '전체' || post.tag === filterTag;
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || post.author.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTag && matchesSearch;
    });

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">게시판 관리</h1>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-4">
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                        {['전체', '공지사항', '자유게시판', '질문&답변', '건의사항', '행사후기'].map(tag => (
                            <button
                                key={tag}
                                onClick={() => setFilterTag(tag)}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                                    filterTag === tag 
                                    ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' 
                                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full md:w-64">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <SearchIcon className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 py-2 pl-10 pr-3 text-sm focus:border-orange-500 focus:ring-orange-500 dark:text-white"
                            placeholder="제목 또는 작성자 검색"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">분류</th>
                                <th scope="col" className="px-6 py-3 w-1/3">제목</th>
                                <th scope="col" className="px-6 py-3">작성자</th>
                                <th scope="col" className="px-6 py-3">작성일</th>
                                <th scope="col" className="px-6 py-3">조회수</th>
                                <th scope="col" className="px-6 py-3 text-right">관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPosts.map(post => (
                                <tr key={post.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                            post.tag === '공지사항' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                        }`}>
                                            {post.tag}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white truncate max-w-xs">
                                        {post.title}
                                    </td>
                                    <td className="px-6 py-4">{post.author}</td>
                                    <td className="px-6 py-4">{post.date}</td>
                                    <td className="px-6 py-4">{post.views}</td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button 
                                            onClick={() => onToggleBoardNotice(post.id)}
                                            className={`p-2 rounded-md transition-colors ${post.isNotice ? 'text-orange-600 bg-orange-50 hover:bg-orange-100' : 'text-gray-400 hover:text-orange-600 hover:bg-gray-100'}`}
                                            title={post.isNotice ? "공지 내리기" : "공지로 등록"}
                                        >
                                            <PinIcon className="w-5 h-5" />
                                        </button>
                                        <button 
                                            onClick={() => onDeleteBoardPost(post.id)}
                                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                                            title="삭제"
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredPosts.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                        게시글이 없습니다.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const EventsManagementSection: React.FC<{ events: Event[]; eventApplications: EventApplication[] }> = ({ events, eventApplications }) => {
    const [selectedEventForApplicants, setSelectedEventForApplicants] = useState<Event | null>(null);
    const selectedApplications = selectedEventForApplicants
        ? eventApplications.filter((application) => application.eventId === selectedEventForApplicants.id)
        : [];

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">활동(행사) 관리</h1>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">행사 목록</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-4 py-3">행사명</th>
                                <th scope="col" className="px-4 py-3">일정</th>
                                <th scope="col" className="px-4 py-3 text-right">신청</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event) => {
                                const count = event.participants;
                                return (
                                    <tr
                                        key={event.id}
                                        onClick={() => setSelectedEventForApplicants(event)}
                                        className="border-b dark:border-gray-700 cursor-pointer bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                    >
                                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{event.title}</td>
                                        <td className="px-4 py-3">{event.date}</td>
                                        <td className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-200">{count}명</td>
                                    </tr>
                                );
                            })}
                            {events.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">등록된 행사가 없습니다.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedEventForApplicants && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">신청자 목록 - {selectedEventForApplicants.title}</h2>
                            <button onClick={() => setSelectedEventForApplicants(null)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                <XMarkIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-4 py-3">이름</th>
                                    <th scope="col" className="px-4 py-3">전화번호</th>
                                    <th scope="col" className="px-4 py-3">이메일</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedApplications.map((application) => (
                                    <tr key={application.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{application.name}</td>
                                        <td className="px-4 py-3">{application.phone || '-'}</td>
                                        <td className="px-4 py-3">{application.email || '-'}</td>
                                    </tr>
                                ))}
                                {selectedApplications.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">신청자가 없습니다.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                        <div className="mt-4 flex justify-end">
                            <button onClick={() => setSelectedEventForApplicants(null)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600">
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const OnlineVotingManagementSection: React.FC<{ polls: Poll[], onCreatePoll: (poll: Omit<Poll, 'id' | 'totalVotes' | 'hasVoted' | 'hasVotingRights' | 'votedUserIds'>) => void, onDeletePoll: (pollId: number) => void, users: User[] }> = ({ polls, onCreatePoll, onDeletePoll, users }) => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedPollForParticipants, setSelectedPollForParticipants] = useState<Poll | null>(null);

    const CreatePollModal: React.FC<{ onClose: () => void; onCreate: (poll: Omit<Poll, 'id' | 'totalVotes' | 'hasVoted' | 'hasVotingRights' | 'votedUserIds'>) => void }> = ({ onClose, onCreate }) => {
        const [title, setTitle] = useState('');
        const [description, setDescription] = useState('');
        const [votingStart, setVotingStart] = useState('');
        const [votingEnd, setVotingEnd] = useState('');
        const [options, setOptions] = useState<string[]>(['', '']);

        const handleAddOption = () => setOptions([...options, '']);
        const handleRemoveOption = (index: number) => { if (options.length > 2) setOptions(options.filter((_, i) => i !== index)); };
        const handleOptionChange = (index: number, value: string) => { const newOptions = [...options]; newOptions[index] = value; setOptions(newOptions); };

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            if (!title || !description || !votingStart || !votingEnd || options.some(opt => !opt.trim())) {
                alert('모든 항목을 입력해주세요.');
                return;
            }
            const newPollOptions: PollOption[] = options.map((text, index) => ({ id: `opt${Date.now()}-${index}`, text, votes: 0 }));
            onCreate({ title, description, startDate: votingStart.replace('T', ' '), endDate: votingEnd.replace('T', ' '), options: newPollOptions });
            onClose();
        };

        return (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"><XMarkIcon className="w-6 h-6" /></button>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">새 투표 만들기</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">투표 제목</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3 focus:ring-2 focus:ring-orange-500 outline-none text-gray-900 dark:text-white" placeholder="투표 제목을 입력하세요"/></div>
                        <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">설명</label><textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3 focus:ring-2 focus:ring-orange-500 outline-none text-gray-900 dark:text-white" placeholder="투표에 대한 설명을 입력하세요"/></div>
                        <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">투표 기간</label><div className="flex flex-col sm:flex-row items-center gap-4"><div className="w-full relative"><input type="datetime-local" value={votingStart} onChange={e => setVotingStart(e.target.value)} className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3 pr-10 focus:ring-2 focus:ring-orange-500 outline-none cursor-pointer text-gray-900 dark:text-white [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"/><div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 dark:text-gray-400"><CalendarDaysIcon className="w-5 h-5" /></div></div><span className="text-gray-500 dark:text-gray-400 font-bold">~</span><div className="w-full relative"><input type="datetime-local" value={votingEnd} onChange={e => setVotingEnd(e.target.value)} className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3 pr-10 focus:ring-2 focus:ring-orange-500 outline-none cursor-pointer text-gray-900 dark:text-white [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"/><div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 dark:text-gray-400"><CalendarDaysIcon className="w-5 h-5" /></div></div></div></div>
                        <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">투표 항목</label><div className="space-y-3">{options.map((opt, index) => (<div key={index} className="flex gap-2 items-center"><span className="text-gray-400 text-sm w-6 text-center">{index + 1}.</span><input type="text" value={opt} onChange={e => handleOptionChange(index, e.target.value)} className="flex-grow rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3 focus:ring-2 focus:ring-orange-500 outline-none text-gray-900 dark:text-white" placeholder={`항목 ${index + 1}`}/>{options.length > 2 && (<button type="button" onClick={() => handleRemoveOption(index)} className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"><TrashIcon className="w-5 h-5" /></button>)}</div>))}</div><button type="button" onClick={handleAddOption} className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"><PlusIcon className="w-4 h-4" /> 항목 추가</button></div>
                        <div className="pt-4 flex justify-end gap-3"><button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors">취소</button><button type="submit" className="px-5 py-2.5 rounded-lg font-semibold text-white bg-orange-600 hover:bg-orange-700 shadow-md hover:shadow-lg transition-all">생성하기</button></div>
                    </form>
                </div>
            </div>
        );
    };

    const ParticipantListModal: React.FC<{ poll: Poll; users: User[]; onClose: () => void }> = ({ poll, users, onClose }) => {
        const participants = users.filter(user => poll.votedUserIds.includes(user.id));

        // 이름 가운데 글자 마스킹 처리 (예: 홍길동 -> 홍*동, 이영 -> 이*)
        const formatNameMasked = (name: string) => {
            if (name.length <= 1) return name;
            if (name.length === 2) return name[0] + '*';
            // 3글자 이상인 경우, 첫 글자와 마지막 글자를 제외하고 가운데를 *로 처리
            return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
        };

        // 전화번호 가운데 4자리 마스킹 처리 (예: 010-1234-5678 -> 010-****-5678)
        const formatPhoneMasked = (phone?: string) => {
            if (!phone) return '-';
            const parts = phone.split('-');
            if (parts.length === 3) {
                return `${parts[0]}-****-${parts[2]}`;
            }
            return phone;
        };

        const handleDownloadExcel = () => {
            if (participants.length === 0) {
                alert("다운로드할 참여자 데이터가 없습니다.");
                return;
            }

            const headers = ['이름', '아이디', '전화번호', '등급', '투표여부'];
            // Export raw data (no masking) for admin use
            const rows = participants.map(user => [
                user.name,
                user.id,
                user.phone || '',
                user.level,
                '투표 완료'
            ]);

            const csvContent = [
                headers.join(','),
                ...rows.map(row => row.join(','))
            ].join('\n');

            // Add BOM for Excel UTF-8 compatibility
            const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `${poll.title}_참여자명단.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };

        return (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-center p-5 border-b dark:border-gray-700 shrink-0">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate pr-4">
                            '{poll.title}' 참여자 명단
                        </h2>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={handleDownloadExcel}
                                className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm font-semibold transition-colors shadow-sm"
                                title="참여자 명단 엑셀 다운로드"
                            >
                                <DownloadIcon className="w-4 h-4" />
                                엑셀 다운로드
                            </button>
                            <button onClick={onClose} className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                    
                    {/* 투표 현황 섹션 추가 */}
                    <div className="p-5 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900/20 shrink-0">
                        <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-3">투표 현황</h3>
                        <div className="space-y-3 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                            {poll.options.map(option => {
                                const percentage = poll.totalVotes > 0 ? Math.round((option.votes / poll.totalVotes) * 100) : 0;
                                return (
                                    <div key={option.id}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-700 dark:text-gray-300">{option.text}</span>
                                            <span className="font-bold text-gray-900 dark:text-white">{option.votes}표 ({percentage}%)</span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="p-5 overflow-y-auto flex-grow">
                        {participants.length > 0 ? (
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">이름</th>
                                        <th scope="col" className="px-6 py-3">아이디</th>
                                        <th scope="col" className="px-6 py-3">전화번호</th>
                                        <th scope="col" className="px-6 py-3">등급</th>
                                        <th scope="col" className="px-6 py-3 text-center">투표 여부</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {participants.map(user => (
                                        <tr key={user.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {formatNameMasked(user.name)}
                                            </td>
                                            <td className="px-6 py-4">{user.id}</td>
                                            <td className="px-6 py-4">{formatPhoneMasked(user.phone)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                                    user.level === '관리자' ? 'bg-red-100 text-red-800' : 
                                                    user.level === '정회원' ? 'bg-green-100 text-green-800' : 
                                                    'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {user.level}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                                    투표 완료
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                                아직 참여자가 없습니다.
                            </div>
                        )}
                    </div>
                    <div className="p-5 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-right shrink-0">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">총 참여자: {participants.length}명</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">온라인 투표 관리</h1>
                <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
                >
                    <PlusIcon className="w-4 h-4" />
                    <span>새 투표 생성</span>
                </button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">ID</th>
                            <th scope="col" className="px-6 py-3">제목</th>
                            <th scope="col" className="px-6 py-3">상태</th>
                            <th scope="col" className="px-6 py-3">투표 기간</th>
                            <th scope="col" className="px-6 py-3">참여 인원</th>
                            <th scope="col" className="px-6 py-3 text-right">관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {polls.map(poll => {
                            const now = new Date();
                            const startDate = new Date(poll.startDate.replace(' ', 'T'));
                            const endDate = new Date(poll.endDate.replace(' ', 'T'));
                            const isClosed = now > endDate;
                            const isUpcoming = now < startDate;
                            
                            let statusLabel = '진행중';
                            let statusClass = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
                            
                            if (isClosed) {
                                statusLabel = '마감됨';
                                statusClass = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
                            } else if (isUpcoming) {
                                statusLabel = '예정됨';
                                statusClass = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
                            }

                            return (
                                <tr key={poll.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4 font-medium">{poll.id}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                        <button 
                                            onClick={() => setSelectedPollForParticipants(poll)}
                                            className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline text-left"
                                            title="참여자 명단 보기"
                                        >
                                            {poll.title}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}`}>
                                            {statusLabel}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {poll.startDate} ~ <br/>{poll.endDate}
                                    </td>
                                    <td className="px-6 py-4">{poll.totalVotes}명</td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => {
                                                if(window.confirm(`'${poll.title}' 투표를 삭제하시겠습니까?`)) {
                                                    onDeletePoll(poll.id);
                                                }
                                            }}
                                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                                            aria-label="투표 삭제"
                                        >
                                            <TrashIcon className="w-5 h-5"/>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        {polls.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                    등록된 투표가 없습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isCreateModalOpen && (
                <CreatePollModal onClose={() => setIsCreateModalOpen(false)} onCreate={onCreatePoll} />
            )}

            {selectedPollForParticipants && (
                <ParticipantListModal 
                    poll={selectedPollForParticipants} 
                    users={users} 
                    onClose={() => setSelectedPollForParticipants(null)} 
                />
            )}
        </div>
    );
}

export default AdminPage;
