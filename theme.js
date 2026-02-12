(function() {
  try {
    // 로컬 스토리지에 저장된 테마 확인, 없으면 시스템 설정(다크모드 선호도) 확인
    var theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    // HTML 요소에 data-theme 속성 적용 (CSS와 Tailwind 연동용)
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    console.error('Theme initialization failed:', e);
  }
})();