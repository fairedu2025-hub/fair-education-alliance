
import React, { useState, useEffect } from 'react';
import { PauseIcon } from './icons/PauseIcon';
import type { Page } from '../types';
import type { IntroductionData } from '../types';
import ScrollDownIndicator from './ScrollDownIndicator';

const StatItem: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div className="text-center">
    <p className="text-4xl lg:text-5xl font-bold">{value}</p>
    <p className="text-sm lg:text-base mt-1">{label}</p>
  </div>
);

interface HeroProps {
  heroImageUrls: string[];
  totalMembers: number;
  fullMembers: number;
  onNavigate: (page: Page) => void;
  introductionData: IntroductionData;
}

const Hero: React.FC<HeroProps> = ({ heroImageUrls, totalMembers, fullMembers, onNavigate, introductionData }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const slidesCount = heroImageUrls.length;

  useEffect(() => {
    if (slidesCount <= 1) return;

    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slidesCount);
    }, 3000);
    return () => clearInterval(timer);
  }, [slidesCount]);


  return (
    <section className="relative h-[70vh] md:h-[80vh] bg-black text-white">
      {heroImageUrls.map((url, index) => (
        <div
          key={index}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
          style={{ 
            backgroundImage: `url('${url}')`,
            opacity: activeSlide === index ? 1 : 0,
            zIndex: activeSlide === index ? 10 : 0,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-black/50 z-10"></div>
      <div className="relative h-full container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-center z-20">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
          시민교육을 통한 <br /> <span className="text-orange-400">올바른 사회</span> 만들기
        </h1>
        <p className="mt-6 max-w-2xl text-lg md:text-xl text-gray-200">
          공정교육바른인천연합은 시민들의 올바른 교육과 사회 참여를 통해 보다 공정하고 살기 좋은 인천을 만들어 나가고 있습니다.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <button onClick={() => onNavigate('events')} className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-3 rounded-md transition-transform duration-200 hover:scale-105">
            행사 참여하기
          </button>
          <button onClick={() => onNavigate('board')} className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold px-8 py-3 rounded-md border border-white/50 transition-transform duration-200 hover:scale-105">
            게시판 둘러보기
          </button>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-black/20 backdrop-blur-sm">
          <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 items-center">
            <StatItem value={`총 ${totalMembers.toLocaleString()}명`} label="등록 회원" />
            <StatItem value={`${introductionData.achievements.educationPrograms}회`} label="교육 프로그램" />
            <StatItem value={`${fullMembers.toLocaleString()}명`} label="정회원" />
            <StatItem value={introductionData.achievements.yearsOfActivity} label="단체 활동" />
          </div>
        </div>
      </div>
      
      <ScrollDownIndicator />

      <div className="absolute bottom-24 right-8 hidden md:block z-20">
        <button className="w-10 h-10 flex items-center justify-center bg-white/20 rounded-md text-white">
          <PauseIcon className="w-5 h-5"/>
        </button>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {Array.from({ length: slidesCount }).map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveSlide(index)}
            className={`w-3 h-3 rounded-full ${activeSlide === index ? 'bg-white' : 'bg-white/50'} transition-all duration-300`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </section>
  );
};

export default Hero;
