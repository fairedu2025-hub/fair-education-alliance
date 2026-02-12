
import React from 'react';

// Icons
import { UserIcon } from '../components/icons/UserIcon';
import { CrownIcon } from '../components/icons/CrownIcon';
import { UserPlusIcon } from '../components/icons/UserPlusIcon';
import { DocumentDuplicateIcon } from '../components/icons/DocumentDuplicateIcon';
import { EnvelopeIcon } from '../components/icons/EnvelopeIcon';
import { PhoneIcon } from '../components/icons/PhoneIcon';
import { ChatBubbleOvalLeftEllipsisIcon } from '../components/icons/ChatBubbleOvalLeftEllipsisIcon';

// Components
import StatCard from '../components/StatCard';
import TierCard, { Tier } from '../components/TierCard';
import ProgressStat from '../components/ProgressStat';
import FaqTabs from '../components/Tabs';
import SupportCard from '../components/SupportCard';
import type { Page } from '../types';

interface MemberPageProps {
  onNavigate: (page: Page) => void;
  totalMembers: number;
  fullMembers: number;
  generalMembers: number;
  totalPosts: number;
}

const progressItems = [
    { title: '2024년 교육 프로그램 참여', percent: 74, value: '892 / 1,200명' },
    { title: '정기총회 참석률', percent: 45, value: '567 / 1,256명' },
    { title: '자원봉사 활동 참여', percent: 12, value: '345 / 2,847명' },
];

interface EventItem {
  category: string;
  status: '모집중' | '준비중';
  title: string;
  date: string;
  target: string;
}

const recentEvents: EventItem[] = [
    { category: '교육', status: '모집중', title: '정회원 전용 시민교육 아카데미', date: '2024년 11월 15일', target: '정회원' },
    { category: '문화', status: '준비중', title: '회원 감사 이벤트 - 인천 문화탐방', date: '2024년 12월 7일', target: '전체회원' },
    { category: '총회', status: '모집중', title: '2024 하반기 회원 간담회', date: '2024년 11월 30일', target: '정회원' },
];

const faqData = {
    '일반 회원': [
      { q: '회원가입 조건이 있나요?', a: '만 18세 이상 대한민국 국민이면 누구나 가입할 수 있습니다. 인천지역 거주자가 아니어도 단체의 가치에 동의하시면 가입 가능합니다.' },
      { q: '회원탈퇴는 어떻게 하나요?', a: '홈페이지 문의하기를 통해 탈퇴 의사를 알려주시거나, 직접 전화로 연락주시면 처리해드립니다. 정회원의 경우 정기총회에서 탈퇴 의사를 표명할 수도 있습니다.' },
    ],
    '정회원': [
      { q: '정회원 승급 조건은 무엇인가요?', a: '일반회원으로 6개월 이상 활동하고, 기존 정회원 2인의 추천을 받으면 이사회 심사를 거쳐 정회원으로 승급할 수 있습니다.' },
    ],
    '혜택 안내': [
      { q: '온라인 자료실은 어디서 이용할 수 있나요?', a: '로그인 후 상단 메뉴의 [자료실] 링크를 통해 접속하실 수 있습니다. 회원 등급에 따라 접근 가능한 자료가 다를 수 있습니다.' },
    ],
};

const statusStyles: Record<EventItem['status'], string> = {
    '모집중': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    '준비중': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
};

const RecentEventCard: React.FC<{ event: EventItem }> = ({ event }) => (
    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-800 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-slate-200">{event.category}</span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded ${statusStyles[event.status]}`}>{event.status}</span>
        </div>
        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-4 flex-grow">{event.title}</h3>
        <div className="text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-gray-700 pt-4">
            <p><strong>일시:</strong> {event.date}</p>
            <p><strong>대상:</strong> {event.target}</p>
        </div>
    </div>
);


const MemberPage: React.FC<MemberPageProps> = ({ onNavigate, totalMembers, fullMembers, generalMembers, totalPosts }) => {
  
  const tiers: Tier[] = [
    {
        name: '비회원',
        badge: 'GUEST',
        description: "사이트 방문자로 제한적인 서비스를 이용할 수 있습니다.",
        benefits: ['홈페이지 기본 정보 열람', '공개 행사 참여 신청', '소식/공지사항 확인', '기본 자료 다운로드'],
        limits: ['게시판 작성 불가', '회원 전용 행사 참여 불가', '월간 소식지 수신 불가'],
        cta: { label: '회원가입하기', onClick: () => onNavigate('signup') },
    },
    {
        name: '일반회원',
        badge: 'MEMBER',
        description: "기본 회원 서비스를 이용하실 수 있습니다.",
        benefits: ['게시판 글쓰기 및 댓글', '모든 교육 프로그램 참여', '회원 전용 행사 참여', '월간 소식지 이메일 수신', '온라인 자료실 접근'],
        limits: ['일부 고급 프로그램 제한', '임원 선출권 없음', '정책 의결권 없음'],
        cta: { label: '정회원 승급하기', onClick: () => onNavigate('upgrade-member') },
    },
    {
        name: '정회원',
        badge: 'FULL',
        description: "모든 회원 혜택과 의결권을 가진 정식 회원입니다.",
        benefits: ['모든 일반회원 혜택 포함', '정기총회 참석 및 의결권', '임원 선출권 및 피선출권', '정책토의 및 제안권', '우선 예약 혜택'],
        limits: ['연회비 납부 의무', '정기총회 참석 권장'],
        cta: { label: '혜택 자세히 보기', onClick: () => alert('정회원 혜택 안내 페이지로 이동 준비중입니다.') },
    },
    {
        name: '관리자',
        badge: 'ADMIN',
        description: "단체 운영진으로서 관리 권한을 가집니다.",
        benefits: ['모든 정회원 혜택 포함', '사이트 관리 권한', '행사 및 프로그램 기획', '회원 관리 권한', '재정 관리 참여'],
        limits: ['높은 책임감 요구', '정기 회의 참석 의무'],
        cta: { label: '임원진 보기', onClick: () => onNavigate('introduction') },
    }
  ];

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>, path: Page) => {
    e.preventDefault();
    onNavigate(path);
  };
  
  const stats = [
      { icon: UserIcon, value: totalMembers.toLocaleString(), label: '총 회원수' },
      { icon: CrownIcon, value: fullMembers.toLocaleString(), label: '정회원' },
      { icon: UserPlusIcon, value: generalMembers.toLocaleString(), label: '일반회원' },
      { icon: DocumentDuplicateIcon, value: totalPosts.toLocaleString(), label: '총 게시물' },
  ];

  return (
    <div className="bg-slate-50 dark:bg-gray-950">
      <div>
        <header className="bg-orange-600 py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold">회원 안내</h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-orange-100 font-medium leading-relaxed">
              공정교육바른인천연합의 회원이 되어 건전한 시민사회 구축에 함께 참여하세요. <br/>
              회원 등급별 다양한 혜택과 활동 기회를 제공합니다.
            </p>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
            <section>
                <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-white">회원 현황</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map(stat => <StatCard key={stat.label} {...stat} />)}
                </div>
            </section>

            <section>
                <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-white">회원 등급 안내</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {tiers.map(tier => <TierCard key={tier.name} tier={tier} />)}
                </div>
            </section>
            
            <section>
                <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-white">회원 활동 현황</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {progressItems.map(item => <ProgressStat key={item.title} {...item} />)}
                </div>
            </section>
            
            <section>
                <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-white">최근 회원 혜택 & 이벤트</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {recentEvents.map(event => <RecentEventCard key={event.title} event={event} />)}
                </div>
            </section>

            <section>
                <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-white">회원 관련 FAQ</h2>
                <FaqTabs data={faqData} />
            </section>
            
            <section>
                <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-white">회원 지원</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <SupportCard icon={EnvelopeIcon} title="이메일 문의" description="회원 관련 문의사항을 이메일로 보내주세요." cta={{label: '이메일 문의', href: 'mailto:info@example.com'}} />
                    <SupportCard icon={PhoneIcon} title="전화 상담" content={
                        <div className="flex-grow flex flex-col justify-center">
                            <p className="text-slate-600 dark:text-slate-400">평일 9시-18시 전화 상담 가능</p>
                            <p className="font-bold text-lg text-slate-800 dark:text-slate-100 mt-2">032-123-4567</p>
                        </div>
                    } />
                    <SupportCard icon={ChatBubbleOvalLeftEllipsisIcon} title="온라인 상담" description="실시간 채팅으로 빠른 답변 받기" cta={{label: '채팅 상담', href: '#'}} />
                </div>
            </section>
        </div>

        <section className="bg-orange-600">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <h2 className="text-3xl font-bold text-white">지금 바로 회원이 되세요</h2>
                <p className="mt-4 text-lg text-orange-100 max-w-2xl mx-auto">
                    공정교육바른인천연합과 함께 건전한 시민사회를 만들어갈 회원을 기다립니다. 다양한 혜택과 활동 기회를 경험해보세요.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a href="#" onClick={(e) => handleCtaClick(e, 'signup')} className="w-full sm:w-auto text-center bg-white text-orange-600 font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition-transform hover:scale-105 duration-200 text-lg">
                        일반회원 가입하기
                    </a>
                    <a href="#" onClick={(e) => handleCtaClick(e, 'upgrade-member')} className="w-full sm:w-auto text-center bg-orange-700 text-white font-bold px-8 py-4 rounded-lg hover:bg-orange-800 transition-colors text-lg">
                        정회원 신청하기
                    </a>
                    <a href="#" onClick={(e) => handleCtaClick(e, 'introduction')} className="w-full sm:w-auto text-center border-2 border-orange-200 text-white font-bold px-8 py-4 rounded-lg hover:bg-white/10 transition-colors text-lg">
                        단체 소개 보기
                    </a>
                </div>
            </div>
        </section>
      </div>
    </div>
  );
};

export default MemberPage;
