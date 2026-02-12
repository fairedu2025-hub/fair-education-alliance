// 테일윈드 CDN 설정: data-theme 속성을 기반으로 다크모드 감지
window.tailwind.config = {
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      // 필요한 경우 여기에 커스텀 컬러나 애니메이션 설정을 확장할 수 있습니다.
    }
  }
};