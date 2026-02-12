import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCu_FlxY1wTwRA-CM-wqUp0gWOJhAgotEw',
  authDomain: 'fair-education-backend-eb45a.firebaseapp.com',
  projectId: 'fair-education-backend-eb45a',
  storageBucket: 'fair-education-backend-eb45a.firebasestorage.app',
  messagingSenderId: '850742727858',
  appId: '1:850742727858:web:689591b1d3cb0ff43ee5ab',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

/**
 * 공정교육바른인천연합 - 통합 글로벌 스크립트
 * 1. 테마 초기화 (다크/라이트 모드 설정 및 깜빡임 방지)
 * 2. Tailwind CSS 엔진 환경 설정
 */

// [1] 테마 초기화: 브라우저 렌더링 전 즉시 실행하여 테마 깜빡임 현상을 방지합니다.
(function () {
  try {
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light';
    const theme = savedTheme || systemTheme;

    // HTML 태그에 data-theme 속성을 주입하여 CSS/Tailwind에 즉시 반영
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    console.error('Theme initialization failed:', e);
  }
})();

// [2] Tailwind CSS 설정
// CDN 방식의 Tailwind 엔진이 로드될 때 이 설정을 참조합니다.
window.tailwind = {
  config: {
    darkMode: ['selector', '[data-theme="dark"]'],
    theme: {
      extend: {
        // 커스텀 테마 확장이 필요할 경우 여기에 추가
      },
    },
  },
};
