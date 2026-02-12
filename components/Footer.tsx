
import React from 'react';
import { LocationPinIcon } from './icons/LocationPinIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { EnvelopeIcon } from './icons/EnvelopeIcon';
import { FacebookIcon } from './icons/FacebookIcon';
import { TwitterIcon } from './icons/TwitterIcon';
import { InstagramIcon } from './icons/InstagramIcon';
import { YoutubeIcon } from './icons/YoutubeIcon';
import type { Page } from '../types';

const SocialLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="p-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
    {children}
  </a>
);

interface FooterProps {
  onNavigate: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNavClick = (e: React.MouseEvent, page: Page) => {
    e.preventDefault();
    onNavigate(page);
  };

  return (
    <footer className="bg-gray-100 dark:bg-gray-950 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: About */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">공정교육바른인천연합</h3>
            <p className="text-sm leading-relaxed">
              시민교육과 사회 참여를 통해 보다 공정하고 투명한 인천을 만들어 나가는 비영리 시민단체입니다.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-start">
                <LocationPinIcon className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                <span>인천 남동구 백범로 310번길21 4층</span>
              </li>
              <li className="flex items-center">
                <PhoneIcon className="w-5 h-5 mr-3 flex-shrink-0" />
                <span>010-4223-1930</span>
              </li>
              <li className="flex items-center">
                <EnvelopeIcon className="w-5 h-5 mr-3 flex-shrink-0" />
                <span>info@fair-edu-incheon.org</span>
              </li>
            </ul>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4">빠른 링크</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" onClick={(e) => handleNavClick(e, 'introduction')} className="hover:text-orange-600 dark:hover:text-orange-400">단체 소개</a></li>
              <li><a href="#" onClick={(e) => handleNavClick(e, 'news')} className="hover:text-orange-600 dark:hover:text-orange-400">소식/공지</a></li>
              <li><a href="#" onClick={(e) => handleNavClick(e, 'board')} className="hover:text-orange-600 dark:hover:text-orange-400">게시판</a></li>
              <li><a href="#" onClick={(e) => handleNavClick(e, 'events')} className="hover:text-orange-600 dark:hover:text-orange-400">활동(행사)</a></li>
              <li><a href="#" onClick={(e) => handleNavClick(e, 'member')} className="hover:text-orange-600 dark:hover:text-orange-400">회원</a></li>
              <li><a href="#" onClick={(e) => handleNavClick(e, 'donation')} className="hover:text-orange-600 dark:hover:text-orange-400">후원</a></li>
            </ul>
          </div>

          {/* Column 3: Info & Social */}
          <div>
             <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4">정보</h3>
             <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-orange-600 dark:hover:text-orange-400">개인정보처리방침</a></li>
              <li><a href="#" className="hover:text-orange-600 dark:hover:text-orange-400">이용약관</a></li>
              <li><a href="#" className="hover:text-orange-600 dark:hover:text-orange-400">문의하기</a></li>
            </ul>
            <div className="mt-8">
              <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-4">소셜 미디어</h4>
              <div className="flex space-x-3">
                <SocialLink href="#"><FacebookIcon className="w-5 h-5" /></SocialLink>
                <SocialLink href="#"><TwitterIcon className="w-5 h-5" /></SocialLink>
                <SocialLink href="#"><InstagramIcon className="w-5 h-5" /></SocialLink>
                <SocialLink href="#"><YoutubeIcon className="w-5 h-5" /></SocialLink>
              </div>
            </div>
          </div>

        </div>
      </div>
      <div className="bg-gray-200 dark:bg-black/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; 2024 공정교육바른인천연합. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
