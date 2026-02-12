
import React from 'react';
import { TargetIcon } from '../components/icons/TargetIcon';
import { HeartIcon } from '../components/icons/HeartIcon';
import { BookOpenIcon } from '../components/icons/BookOpenIcon';
import { UsersIcon } from '../components/icons/UsersIcon';
import { CalendarDaysIcon } from '../components/icons/CalendarDaysIcon';
import { AcademicCapIcon } from '../components/icons/AcademicCapIcon';
import { UserIcon } from '../components/icons/UserIcon';
import type { IntroductionData, Page } from '../types';
import ScrollDownIndicator from '../components/ScrollDownIndicator';

const coreValues = [
    {
        icon: TargetIcon,
        title: "우리의 미션",
        description: "올바른 시민의식과 공정한 사회 구현을 위한 체계적인 시민 교육 제공."
    },
    {
        icon: HeartIcon,
        title: "우리의 비전",
        description: "투명하고 공정한 인천, 시민이 주인이 되는 민주적인 지역사회를\n만들어갑니다."
    },
    {
        icon: BookOpenIcon,
        title: "우리의 가치",
        description: "교육을 통한 변화, 참여를 통한 성장, 연대를 통한 발전을 추구합니다."
    }
];

interface IntroductionPageProps {
  onNavigate: (page: Page) => void;
  introductionData: IntroductionData;
  totalMembers: number;
}


const IntroductionPage: React.FC<IntroductionPageProps> = ({ onNavigate, introductionData, totalMembers }) => {
    const { achievements: achievementsData, history: historyData, executives, president } = introductionData;
    
    const achievements = [
        {
            icon: UsersIcon,
            value: `${totalMembers.toLocaleString()}명`,
            title: "총 회원 수",
            description: "함께하는 시민들"
        },
        {
            icon: BookOpenIcon,
            value: `${achievementsData.educationPrograms}회`,
            title: "교육 프로그램",
            description: "연간 전문 강좌 진행"
        },
        {
            icon: CalendarDaysIcon,
            value: achievementsData.yearsOfActivity,
            title: "활동 경력",
            description: "지속적인 시민교육"
        },
        {
            icon: AcademicCapIcon,
            value: `${achievementsData.graduates.toLocaleString()}명`,
            title: "수료생",
            description: "누적 교육 수료생"
        }
    ];

    return (
        <div>
            <section className="relative bg-orange-600 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold">공정교육바른인천연합을 소개합니다</h1>
                    <p className="mt-4 text-lg md:text-xl text-orange-100 max-w-3xl mx-auto">
                        시민교육을 통해 더 나은 사회를 만들어가는 비영리 시민단체입니다
                    </p>
                </div>
                <ScrollDownIndicator className="!absolute -bottom-[70px]" />
            </section>
            
            <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-5 gap-12 items-center">
                        <div className="md:col-span-2 flex justify-center">
                             <div className="w-full max-w-[600px] aspect-[3/4] rounded-[5px] bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden shadow-lg">
                                {president.photoUrl ? (
                                    <img src={president.photoUrl} alt={president.name} className="h-full w-full object-cover" />
                                ) : (
                                    <UserIcon className="h-40 w-40 text-gray-400 dark:text-gray-500" />
                                )}
                            </div>
                        </div>
                        <div className="md:col-span-3 text-center md:text-left">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">상임대표 인사말</h2>
                            <div className="mt-2 w-20 h-1 bg-orange-600 mx-auto md:mx-0"></div>
                            <div className="mt-6 text-gray-600 dark:text-gray-300 leading-relaxed space-y-4 text-xl">
                                {president.greeting.split('\n').map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))}
                            </div>
                            <p className="mt-8 text-lg font-semibold text-gray-800 dark:text-gray-100">
                                공정교육바른인천연합 상임대표
                                <span className="ml-2 text-2xl font-bold">{president.name}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-950/50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        {coreValues.map(({ icon: Icon, title, description }) => (
                            <div key={title} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm text-center border border-gray-200 dark:border-gray-700">
                                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-300 mb-6">
                                    <Icon className="h-8 w-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">{title}</h3>
                                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">{description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 md:py-24 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900">우리의 성과</h2>
                    <p className="mt-4 text-lg text-gray-600">활동을 통해 이끌어낸 소중한 성과들입니다</p>
                    <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
                        {achievements.map(({ icon: Icon, value, title, description }) => (
                            <div key={title} className="bg-white p-6 rounded-lg border border-gray-200">
                                <Icon className="h-10 w-10 text-orange-500 mx-auto mb-4" />
                                <p className="text-3xl font-bold text-orange-600">{value}</p>
                                <p className="mt-1 font-semibold text-gray-800">{title}</p>
                                <p className="text-sm text-gray-500">{description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 md:py-24 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900">연혁</h2>
                        <p className="mt-4 text-lg text-gray-600">공정교육바른인천연합의 발자취를 통해 확인해보세요</p>
                    </div>

                    {/* Horizontal Timeline for Desktop */}
                    <div className="hidden sm:block">
                        <div className="relative">
                            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-200 -translate-y-1/2"></div>
                            <div className="relative flex justify-between">
                                {historyData.map((item, index) => (
                                    <div key={item.year + index} className="relative flex flex-col items-center" style={{ minHeight: '250px' }}>
                                        <div className={`w-44 lg:w-48 text-center ${index % 2 === 0 ? 'absolute bottom-1/2 mb-8' : 'absolute top-1/2 mt-8'}`}>
                                            <div className="p-4 bg-white rounded-xl shadow-lg border border-gray-100 transform transition-transform duration-300 hover:scale-105">
                                                <h3 className="font-bold text-orange-600 text-lg">{item.year}</h3>
                                                <p className="text-sm text-gray-700 mt-1">{item.event}</p>
                                            </div>
                                        </div>
                                        <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-orange-600 z-10 border-4 border-white"></div>
                                        <div className={`absolute left-1/2 -translate-x-1/2 w-[2px] h-8 bg-gray-200 ${index % 2 === 0 ? 'top-1/2' : 'bottom-1/2'}`}></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Vertical Timeline for Mobile */}
                    <div className="sm:hidden relative max-w-sm mx-auto">
                        <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-200" aria-hidden="true"></div>
                        <div className="space-y-10">
                            {historyData.map((item, index) => (
                                <div key={item.year + index} className="relative pl-12">
                                    <div className="absolute left-4 top-1 -translate-x-1/2 w-4 h-4 rounded-full bg-orange-600 z-10 border-2 border-white"></div>
                                    <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
                                        <p className="font-bold text-lg text-orange-600">{item.year}</p>
                                        <p className="text-gray-800 text-base mt-1">{item.event}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 md:py-24 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900">임원진</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">공정교육바른인천연합을 이끌어가는 임원진을 소개합니다</p>
                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {executives.map(({ name, role, bio, photoUrl }) => (
                            <div key={name} className="bg-white p-8 rounded-lg border border-gray-200">
                                <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gray-200 text-gray-500 mb-6 overflow-hidden">
                                    {photoUrl ? (
                                        <img src={photoUrl} alt={name} className="h-full w-full object-cover" />
                                    ) : (
                                        <UserIcon className="h-10 w-10" />
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">{name}</h3>
                                <p className="text-orange-600 font-semibold mb-3">{role}</p>
                                <p className="text-gray-600 text-sm">{bio}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            <section className="bg-orange-600">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-white">
                <h2 className="text-3xl font-bold">함께하고 싶으신가요?</h2>
                <p className="mt-4 text-lg text-orange-100 max-w-2xl mx-auto">
                  공정교육바른인천연합과 함께 더 나은 인천을 만들어가요
                </p>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <button onClick={() => onNavigate('signup')} className="bg-white text-orange-600 font-semibold px-8 py-3 rounded-md hover:bg-gray-100 transition-colors duration-200 w-full sm:w-auto">
                    회원가입하기
                  </button>
                  <button onClick={() => onNavigate('donation')} className="border border-white/50 bg-white/10 text-white font-semibold px-8 py-3 rounded-md hover:bg-white/20 transition-colors duration-200 w-full sm:w-auto">
                    후원하기
                  </button>
                </div>
              </div>
            </section>
        </div>
    );
};

export default IntroductionPage;
