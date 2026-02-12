import React, { useState, useEffect } from 'react';

interface ScrollDownIndicatorProps {
  className?: string;
}

const ScrollDownIndicator: React.FC<ScrollDownIndicatorProps> = ({ className = 'bottom-2.5' }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleScroll = () => {
    // Hide if scrolled more than a small amount from the top
    const isAtTop = window.scrollY < 50; // Show only within the first 50px of scroll
    setIsVisible(isAtTop);
  };

  useEffect(() => {
    handleScroll(); // Check on mount
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const scrollToNextSection = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollBy({
        top: window.innerHeight * 0.9,
        behavior: 'smooth'
    });
  };

  return (
    <a
      href="#"
      onClick={scrollToNextSection}
      className={`fixed left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 group cursor-pointer transition-all duration-300 ${className} ${
        isVisible ? 'opacity-70 hover:opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
      aria-label="아래로 스크롤하여 더 보기"
    >
      <div className="w-10 h-16 rounded-full border-2 border-black bg-white/10 backdrop-blur-sm flex justify-center items-start pt-3">
        <div className="w-2 h-5 rounded-full bg-black animate-scroll-wheel"></div>
      </div>
      <span
        className="text-sm font-semibold text-white/80 tracking-widest uppercase group-hover:text-white transition-colors"
        style={{ textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' }}
      >
        Scroll
      </span>
    </a>
  );
};

export default ScrollDownIndicator;
