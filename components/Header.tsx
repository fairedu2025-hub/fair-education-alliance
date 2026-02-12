
import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { User, Page } from '../types';
import { SunIcon } from './icons/SunIcon';
import { UserIcon } from './icons/UserIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import { AdminIcon } from './icons/AdminIcon';

const MoonIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
);

const ThemeToggleButton: React.FC = () => {
    const [theme, setTheme] = useState(() => {
        if (typeof window === 'undefined') return 'light';
        return document.documentElement.getAttribute('data-theme') || 'light';
    });

    const applyTheme = useCallback((newTheme: string) => {
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    }, []);

    const storeUserPreference = useCallback((newTheme: string) => {
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    }, [applyTheme]);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        storeUserPreference(newTheme);
    };

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleChange = (e: MediaQueryListEvent) => {
            if (!localStorage.getItem('theme')) {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        };
        
        mediaQuery.addEventListener('change', handleChange);
        
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme && currentTheme !== theme) {
            setTheme(currentTheme);
        }
        
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [applyTheme, theme]);

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 dark:focus:ring-offset-gray-900"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            aria-pressed={theme === 'dark'}
        >
            {theme === 'light' ? (
                <SunIcon className="h-6 w-6" />
            ) : (
                <MoonIcon className="h-6 w-6" />
            )}
        </button>
    );
};

interface HeaderProps {
  onNavigate: (page: Page) => void;
  page: Page;
  loggedInUser: User | null;
  onLogout: () => void;
  logoUrl: string;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, page, loggedInUser, onLogout, logoUrl }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('홈');
  const [logoError, setLogoError] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navItems = ['홈', '소개', '소식/공지', '게시판', '활동(행사)', '온라인 투표', '후원', '회원'];
  const profileMenuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    switch(page) {
      case 'home': setActiveItem('홈'); break;
      case 'introduction': setActiveItem('소개'); break;
      case 'news': setActiveItem('소식/공지'); break;
      case 'board': setActiveItem('게시판'); break;
      case 'events':
      case 'new-event':
        setActiveItem('활동(행사)'); break;
      case 'online-voting': setActiveItem('온라인 투표'); break;
      case 'donation': setActiveItem('후원'); break;
      case 'signup': setActiveItem('회원'); break;
      case 'member': setActiveItem('회원'); break;
      case 'mypage': setActiveItem('None'); break; // MyPage doesn't highlight a main nav item
      case 'login':
      case 'find-credentials':
      case 'admin':
        setActiveItem('None'); break;
      default: setActiveItem('홈');
    }
  }, [page]);

  useEffect(() => {
    setLogoError(false);
  }, [logoUrl]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
            setIsProfileMenuOpen(false);
        }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
}, []);

  const handleNavClick = (item: string) => {
    setActiveItem(item);
    if (item === '홈') onNavigate('home');
    else if (item === '소개') onNavigate('introduction');
    else if (item === '소식/공지') onNavigate('news');
    else if (item === '게시판') onNavigate('board');
    else if (item === '활동(행사)') onNavigate('events');
    else if (item === '온라인 투표') onNavigate('online-voting');
    else if (item === '후원') onNavigate('donation');
    else if (item === '회원') onNavigate('member');
  };

  const handleMobileNavClick = (item: string) => {
    handleNavClick(item);
    setIsMenuOpen(false);
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg dark:shadow-xl border-b border-gray-200/50 dark:border-gray-700/50'
          : 'bg-white dark:bg-gray-900 shadow-sm dark:shadow-md border-b border-gray-200 dark:border-gray-800'
      }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-[50px]">
        <div className="relative flex items-center justify-between h-20">
          {/* Left side: Brand Name */}
          <div className="flex-shrink-0">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); handleNavClick('홈'); }}
              className="flex items-center gap-3"
              aria-label="홈"
            >
              {logoError ? (
                <div className="flex items-center justify-center h-8 w-8 rounded-md bg-gray-200 dark:bg-gray-700 text-sm font-bold text-gray-500 dark:text-gray-400">
                  FEA
                </div>
              ) : (
                <img
                  src={logoUrl}
                  alt="공정교육바른인천연합 로고"
                  className="h-8 w-8 object-contain"
                  onError={() => setLogoError(true)}
                  loading="eager"
                  decoding="async"
                />
              )}
              <span className="text-xl font-bold text-gray-800 dark:text-gray-200 whitespace-nowrap">
                공정교육바른인천연합
              </span>
            </a>
          </div>

          {/* Center: Desktop Nav */}
          <nav className="hidden xl:flex items-center space-x-1 absolute left-1/2 -translate-x-1/2">
            {navItems.map(item => {
              const isActive = activeItem === item;
              const clickHandler = (e: React.MouseEvent) => { e.preventDefault(); handleNavClick(item); };

              return (
                <a
                  key={item}
                  href="#"
                  onClick={clickHandler}
                  className="inline-block whitespace-nowrap px-3 py-2 rounded-lg text-lg transition-all duration-200 ease-in-out transform active:scale-95 hover:bg-orange-500 hover:text-white font-semibold text-gray-600 dark:text-gray-300"
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item}
                </a>
              );
            })}
          </nav>
          
          {/* Right side: Actions */}
          <div className="flex items-center">
            <div className="hidden lg:flex items-center space-x-4">
              <ThemeToggleButton />
               {loggedInUser ? (
                <div className="relative" ref={profileMenuRef}>
                    <button
                        id="user-menu-button"
                        onClick={() => setIsProfileMenuOpen(prev => !prev)}
                        className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
                        aria-haspopup="true" aria-expanded={isProfileMenuOpen}
                    >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-red-500 flex-shrink-0"></div>
                        <div className="text-left hidden xl:block">
                            <div className="font-bold text-gray-800 dark:text-gray-200">{loggedInUser.name}</div>
                            <div className="mt-1">
                                <span className={`${loggedInUser.level === '관리자' ? 'bg-red-600' : 'bg-orange-600'} text-white px-3 py-1.5 rounded-md text-sm font-semibold`}>{loggedInUser.level}</span>
                            </div>
                        </div>
                    </button>
                    {isProfileMenuOpen && (
                      <div
                          className="absolute right-0 mt-2 w-[250px] origin-top-right bg-gray-100 dark:bg-gray-800 rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50 p-4"
                          role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button"
                      >
                          <div className="pb-3">
                              <p className="text-xl font-bold text-gray-900 dark:text-white">{loggedInUser.name}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{loggedInUser.id}</p>
                              <span className={`inline-block px-3 py-1 text-sm font-semibold text-white rounded-md ${loggedInUser.level === '관리자' ? 'bg-red-500' : 'bg-orange-600'}`}>
                                  {loggedInUser.level}
                              </span>
                          </div>
                          
                          <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
                               <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('mypage'); setIsProfileMenuOpen(false); }} className="flex items-center w-full p-2 text-base text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700" role="menuitem">
                                  <UserIcon className="w-5 h-5 mr-3 text-gray-500" />
                                  <span>마이페이지</span>
                              </a>
                              {/* Settings link removed from here */}
                              {loggedInUser.level === '관리자' && (
                                  <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('admin'); setIsProfileMenuOpen(false); }} className="flex items-center w-full p-2 text-base text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700" role="menuitem">
                                      <AdminIcon className="w-5 h-5 mr-3 text-gray-500" />
                                      <span>관리자 모드</span>
                                  </a>
                              )}
                               <button
                                  onClick={() => { onLogout(); setIsProfileMenuOpen(false); }}
                                  className="flex items-center w-full text-left p-2 text-base text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                                  role="menuitem"
                              >
                                  <LogoutIcon className="w-5 h-5 mr-3" />
                                  <span>로그아웃</span>
                              </button>
                          </div>
                      </div>
                    )}
                </div>
              ) : (
                <>
                  <button onClick={() => onNavigate('login')} className="text-gray-600 hover:text-orange-600 dark:text-gray-300 dark:hover:text-orange-400 font-semibold transition-colors">
                      로그인
                  </button>
                  <button onClick={() => onNavigate('signup')} className="bg-orange-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-orange-700 transition-colors">
                      회원가입
                  </button>
                </>
              )}
            </div>
            
            <div className="xl:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="xl:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <nav className="flex flex-col items-center py-4 space-y-2 px-4">
            {navItems.map(item => (
                <a 
                    key={item} 
                    href="#"
                    className="block w-full text-center py-2 px-4 rounded-md text-base transition-colors duration-200 hover:bg-orange-500 hover:text-white font-semibold text-gray-600 dark:text-gray-300"
                    onClick={(e) => { e.preventDefault(); handleMobileNavClick(item); }}
                >
                    {item}
                </a>
            ))}
             <div className="flex flex-col items-center space-y-4 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 w-full px-4">
                <ThemeToggleButton />
                {loggedInUser ? (
                    <div className='w-full max-w-xs space-y-4'>
                        <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 w-full justify-center">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-red-500"></div>
                            <div className='text-left'>
                                <div className="font-bold text-gray-800 dark:text-gray-200">{loggedInUser.name}</div>
                                <div className={`text-sm font-semibold ${loggedInUser.level === '관리자' ? 'text-red-600 dark:text-red-400' : 'text-orange-600 dark:text-orange-400'}`}>{loggedInUser.level}</div>
                            </div>
                        </div>
                        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('mypage'); setIsMenuOpen(false); }} className="block w-full text-center text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 font-semibold transition-colors py-2">마이페이지</a>
                        {/* Mobile Settings button removed from here if it existed */}
                        <button onClick={() => { onLogout(); setIsMenuOpen(false); }} className="w-full text-center bg-orange-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-orange-700 transition-colors">
                            로그아웃
                        </button>
                    </div>
                ) : (
                  <>
                    <button onClick={() => { onNavigate('login'); setIsMenuOpen(false); }} className="text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 font-semibold transition-colors py-2">
                        로그인
                    </button>
                    <button onClick={() => { onNavigate('signup'); setIsMenuOpen(false); }} className="w-full max-w-xs text-center bg-orange-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-orange-700 transition-colors">
                        회원가입
                    </button>
                  </>
                )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
