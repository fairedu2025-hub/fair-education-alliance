
import React from 'react';
import StatCard from '../components/StatCard';
import DonatePlanCard from '../components/DonatePlanCard';
import AmountCard from '../components/AmountCard';
import BankAccountCard from '../components/BankAccountCard';
import ProgressBar from '../components/ProgressBar';
import FAQ from '../components/FAQ';

import { UserIcon } from '../components/icons/UserIcon';
import { BookOpenIcon } from '../components/icons/BookOpenIcon';
import { RibbonIcon } from '../components/icons/RibbonIcon';
import { HeartIcon } from '../components/icons/HeartIcon';
import { GiftIcon } from '../components/icons/GiftIcon';
import { BuildingIcon } from '../components/icons/BuildingIcon';
import { PieChartIcon } from '../components/icons/PieChartIcon';
import { DownloadIcon } from '../components/icons/DownloadIcon';

const DonationPage: React.FC = () => {

  const usageData = [
    { label: '교육 프로그램', amount: 18203000, percent: 45 },
    { label: '행사 및 세미나', amount: 10125000, percent: 25 },
    { label: '홍보 및 캠페인', amount: 6075000, percent: 15 },
    { label: '운영비', amount: 4050000, percent: 10 },
    { label: '시설 및 장비', amount: 2025000, percent: 5 },
  ];

  const bankAccounts = [
      { bank: '국민은행', number: '123456-78-901234', holder: '공정교육바른인천연합' },
      { bank: '우리은행', number: '1005-987-654321', holder: '공정교육바른인천연합' },
  ];

  return (
    <div className="bg-slate-50 dark:bg-gray-950 text-slate-800 dark:text-slate-200">
      <div>
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-orange-50 via-orange-50 to-slate-50 dark:from-orange-900/20 dark:via-orange-900/20 dark:to-gray-950 pt-20 pb-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">후원하기</h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-slate-600 dark:text-slate-300">
              공정교육바른인천연합과 함께 더 나은 시민사회를 만들어가세요. <br className="hidden sm:block" />
              여러분의 소중한 후원이 건전한 시민의식 확산에 큰 힘이 됩니다.
            </p>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard icon={UserIcon} value="1,247" label="후원자" />
              <StatCard icon={BookOpenIcon} value="67" label="교육 프로그램" />
              <StatCard icon={RibbonIcon} value="3,892" label="수혜자" />
            </div>
          </div>
        </section>

        {/* Sections Wrapper */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
          
          {/* Donation Method Section */}
          <section>
            <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-white">후원 방법</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <DonatePlanCard
                    icon={HeartIcon}
                    title="정기 후원"
                    subtitle="매월 일정 금액으로 지속적인 후원"
                    benefits={['월간 활동 보고서 제공', '연말 세액공제 혜택', '후원자 감사 이벤트 초대']}
                    recommended
                />
                <DonatePlanCard
                    icon={GiftIcon}
                    title="일시 후원"
                    subtitle="원하는 시점에 일회성 금액으로 후원"
                    benefits={['세액공제 영수증 발급', '후원 증서 제공', '감사 인사 발송']}
                />
                <DonatePlanCard
                    icon={BuildingIcon}
                    title="기업 후원"
                    subtitle="기업 사회공헌활동 및 파트너십"
                    benefits={['기업 로고 홍보', 'CSR 활동 공동기획', '공동 프로그램 기획']}
                />
            </div>
          </section>

          {/* Amount Usage Section */}
          <section>
            <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-white">후원 금액별 활용</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AmountCard amount="10,000원" description="한 달간 교육 자료 제작비" />
              <AmountCard amount="30,000원" description="시민교육 강사료 지원" />
              <AmountCard amount="50,000원" description="소규모 세미나 개최비" />
              <AmountCard amount="100,000원" description="대규모 토론회 운영비" />
              <AmountCard amount="300,000원" description="분기별 정기 프로그램 운영" />
              <AmountCard amount="500,000원" description="연간 시민교육 사업 후원" />
            </div>
          </section>

          {/* Bank Account Section */}
          <section>
             <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-white">후원 계좌 안내</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {bankAccounts.map(acc => <BankAccountCard key={acc.bank} {...acc} />)}
             </div>
             <div className="mt-10 bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800/50 p-6 rounded-2xl flex items-start gap-5">
                <GiftIcon className="w-8 h-8 text-orange-500 dark:text-orange-400 flex-shrink-0 mt-1" />
                <div>
                    <h3 className="font-bold text-lg text-orange-800 dark:text-orange-200 mb-1">세액공제 안내</h3>
                    <p className="text-orange-700 dark:text-orange-300">
                        공정교육바른인천연합은 기획재정부 지정 기부금 대상 단체입니다. 후원금의 <strong className="font-semibold">15~30%</strong>를 세액공제 받을 수 있습니다. 후원 시 연락처를 남겨주시면 연말정산용 기부금 영수증을 발송해드립니다.
                    </p>
                </div>
             </div>
          </section>

          {/* Donation Status Section */}
          <section>
            <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-white">후원금 사용 현황 (2024년 예시)</h2>
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="flex items-center gap-4 mb-8">
                            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">총 후원금: <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">40,505,000원</span></h3>
                            <span className="text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-full">예시 데이터</span>
                        </div>
                        <div className="space-y-5">
                          {usageData.map(item => <ProgressBar key={item.label} {...item} />)}
                        </div>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <PieChartIcon className="w-48 h-48 text-orange-500" />
                        <p className="mt-4 max-w-xs text-slate-600 dark:text-slate-400">투명한 회계 관리를 통해 후원금을 효율적으로 활용하고 있습니다.</p>
                    </div>
                </div>
            </div>
          </section>

          {/* Related Materials Section */}
          <section>
            <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-white">관련 자료</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm text-center">
                    <DownloadIcon className="w-12 h-12 mx-auto text-orange-500 mb-4"/>
                    <h3 className="text-xl font-bold mb-2">2024년 사업 보고서</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">올해 주요 활동 성과와 후원금 사용 내역을 확인하세요</p>
                    <button className="w-full sm:w-auto font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-6 py-3 rounded-lg transition-colors">다운로드</button>
                </div>
                <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm text-center">
                    <DownloadIcon className="w-12 h-12 mx-auto text-orange-500 mb-4"/>
                    <h3 className="text-xl font-bold mb-2">후원자 소식지</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">정기 후원자를 위한 월간 활동 소식지입니다</p>
                    <button className="w-full sm:w-auto font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-6 py-3 rounded-lg transition-colors">다운로드</button>
                </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section>
            <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-white">후원 관련 FAQ</h2>
            <FAQ />
          </section>
        </div>

        {/* CTA Section */}
        <section className="bg-orange-600 dark:bg-orange-800/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <h2 className="text-3xl font-bold text-white">지금 바로 후원하세요</h2>
            <p className="mt-4 text-lg text-orange-100 dark:text-orange-200 max-w-2xl mx-auto">
              여러분의 후원이 건전한 시민사회 구축에 소중한 밑거름이 됩니다. 작은 정성도 큰 변화를 만들어낼 수 있습니다.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#/donation/subscribe" className="w-full sm:w-auto text-center bg-white text-orange-600 font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition-transform hover:scale-105 duration-200">
                정기 후원하기
              </a>
              <a href="#/donation/one-time" className="w-full sm:w-auto text-center bg-orange-500 dark:bg-orange-700 text-white font-bold px-8 py-4 rounded-lg hover:bg-orange-400 dark:hover:bg-orange-600 transition-colors">
                일시 후원하기
              </a>
              <a href="#/contact" className="w-full sm:w-auto text-center border-2 border-orange-300 text-white font-bold px-8 py-4 rounded-lg hover:bg-white/10 transition-colors">
                문의하기
              </a>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default DonationPage;
