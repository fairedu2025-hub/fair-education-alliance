
import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import NewsSection from './components/NewsSection';
import ActivitiesSection from './components/ActivitiesSection';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';
import SignUpPage from './pages/SignUpPage';
import IntroductionPage from './pages/IntroductionPage';
import NewsPage from './pages/NewsPage';
import BoardPage from './pages/BoardPage';
import EventsPage from './pages/EventsPage';
import DonationPage from './pages/DonationPage';
import MemberPage from './pages/MemberPage';
import LoginPage from './pages/LoginPage';
import FindCredentialsPage from './pages/FindCredentialsPage';
import AdminPage from './pages/AdminPage';
import NewEventPage from './pages/NewEventPage';
import EventDetailPage from './pages/EventDetailPage';
import NewsDetailPage from './pages/NewsDetailPage';
import NewNewsPostPage from './pages/NewNewsPostPage';
import BoardDetailPage from './pages/BoardDetailPage';
import NewBoardPostPage from './pages/NewBoardPostPage';
import OnlineVotingPage from './pages/OnlineVotingPage';
import MyPage from './pages/MyPage';
import EditProfilePage from './pages/EditProfilePage';
import UpgradeMemberPage from './pages/UpgradeMemberPage';
import type { NewsArticle, BoardPost, Event, EventApplication, User, IntroductionData, Page, EventProposal, Poll } from './types';
import { checkFirebaseUserIdAvailability, clearUserDeletedMarkerInFirebase, createBoardPostInFirebase, createEventApplicationInFirebase, createEventInFirebase, createNewsInFirebase, createPollInFirebase, deleteBoardPostInFirebase, deleteEventInFirebase, deleteFirebaseAccount, deleteNewsInFirebase, deletePollInFirebase, deleteUserProfileFromFirebase, fetchBoardPostsFromFirebase, fetchEventApplicationsFromFirebase, fetchEventsFromFirebase, fetchNewsFromFirebase, fetchPollsFromFirebase, fetchSiteContentFromFirebase, fetchUserProfileFromFirebase, fetchUsersFromFirebase, isDeletedFromFirebaseAuth, isUserMarkedDeletedInFirebase, markUserDeletedByAdminInFirebase, signInWithFirebase, signUpWithFirebase, updateBoardPostInFirebase, updateEventInFirebase, updatePollInFirebase, updateUserLevelInFirebase, upsertSiteContentInFirebase } from './services/firebase';
import { 
  initialUsers, 
  initialNewsArticles, 
  initialBoardPosts, 
  initialEventProposals, 
  initialPolls, 
  initialIntroductionData, 
  initialHeroImageUrls, 
  DEFAULT_LOGO 
} from './initialData';

const USERS_STORAGE_KEY = 'users';
const USER_AUTH_PROOFS_KEY = 'userAuthProofs';
const FIREBASE_SESSION_KEY = 'firebaseSession';

const buildHistoryHash = (targetPage: Page, id?: number | null) => {
  return id != null ? `#${targetPage}:${id}` : `#${targetPage}`;
};

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('home');
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [selectedNewsId, setSelectedNewsId] = useState<number | null>(null);
  const [selectedBoardPostId, setSelectedBoardPostId] = useState<number | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  
  const [heroImageUrls, setHeroImageUrls] = useState<string[]>(() => {
    try {
        const stored = localStorage.getItem('heroImageUrls');
        return stored ? JSON.parse(stored).slice(0, 3) : initialHeroImageUrls;
    } catch (e) {
        return initialHeroImageUrls;
    }
  });
  
  const [logoUrl, setLogoUrl] = useState<string>(() => {
    try {
        const storedLogo = localStorage.getItem('logoUrl');
        // Migrate the legacy embedded default logo to the new static asset path.
        if (
          !storedLogo ||
          storedLogo.startsWith('data:image/svg+xml;base64,') ||
          storedLogo === '/Assets/logo.png'
        ) {
          return DEFAULT_LOGO;
        }
        return storedLogo;
    } catch (e) {
        return DEFAULT_LOGO;
    }
  });
  
  const [introductionData, setIntroductionData] = useState<IntroductionData>(initialIntroductionData);
  const [siteContentLoaded, setSiteContentLoaded] = useState(false);

  useEffect(() => {
    localStorage.setItem('heroImageUrls', JSON.stringify(heroImageUrls));
  }, [heroImageUrls]);

  useEffect(() => {
    localStorage.setItem('logoUrl', logoUrl);
  }, [logoUrl]);

  useEffect(() => {
    const loadSiteContent = async () => {
      const remoteSiteContent = await fetchSiteContentFromFirebase();
      if (remoteSiteContent) {
        if (remoteSiteContent.heroImageUrls.length > 0) {
          setHeroImageUrls(remoteSiteContent.heroImageUrls.slice(0, 3));
        }
        if (remoteSiteContent.logoUrl) {
          setLogoUrl(remoteSiteContent.logoUrl);
        }
        if (remoteSiteContent.introductionData && Object.keys(remoteSiteContent.introductionData).length > 0) {
          setIntroductionData(remoteSiteContent.introductionData);
        }
      }
      setSiteContentLoaded(true);
    };

    loadSiteContent();
  }, []);

  useEffect(() => {
    const syncSiteContent = async () => {
      if (!siteContentLoaded) return;
      if (loggedInUser?.level !== '관리자') return;

      const idToken = await getIdTokenByUserId(loggedInUser.id);
      if (!idToken) return;

      await upsertSiteContentInFirebase({
        heroImageUrls,
        logoUrl,
        introductionData,
      }, idToken);
    };

    syncSiteContent();
  }, [heroImageUrls, logoUrl, introductionData, siteContentLoaded, loggedInUser]);

  const [users, setUsers] = useState<User[]>(() => {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      if (!stored) return initialUsers;
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : initialUsers;
    } catch (e) {
      return initialUsers;
    }
  });
  const [userAuthProofs, setUserAuthProofs] = useState<Record<string, string>>(() => {
    try {
      const stored = localStorage.getItem(USER_AUTH_PROOFS_KEY);
      if (!stored) return {};
      const parsed = JSON.parse(stored);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (e) {
      return {};
    }
  });
  const [firebaseSession, setFirebaseSession] = useState<{ userId: string; idToken: string } | null>(() => {
    try {
      const stored = localStorage.getItem(FIREBASE_SESSION_KEY);
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      if (!parsed || typeof parsed !== 'object') return null;
      if (typeof parsed.userId !== 'string' || typeof parsed.idToken !== 'string') return null;
      return parsed;
    } catch (e) {
      return null;
    }
  });
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>(initialNewsArticles);
  const [boardPosts, setBoardPosts] = useState<BoardPost[]>(initialBoardPosts);
  const [events, setEvents] = useState<Event[]>([]);
  const [eventApplications, setEventApplications] = useState<EventApplication[]>([]);
  const [eventProposals, setEventProposals] = useState<EventProposal[]>(initialEventProposals);
  const [polls, setPolls] = useState<Poll[]>(initialPolls);

  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(USER_AUTH_PROOFS_KEY, JSON.stringify(userAuthProofs));
  }, [userAuthProofs]);

  useEffect(() => {
    if (firebaseSession) {
      localStorage.setItem(FIREBASE_SESSION_KEY, JSON.stringify(firebaseSession));
    } else {
      localStorage.removeItem(FIREBASE_SESSION_KEY);
    }
  }, [firebaseSession]);

  useEffect(() => {
    if (!firebaseSession?.userId || !firebaseSession.idToken) return;
    if (loggedInUser?.id === firebaseSession.userId) return;

    let isCancelled = false;

    const restoreLoggedInUser = async () => {
      const sessionUserId = firebaseSession.userId;
      const idToken = firebaseSession.idToken;

      // 관리자 탈퇴 마커가 남아있는 계정은 세션 복원 차단
      if (await isUserMarkedDeletedInFirebase(sessionUserId, idToken)) {
        if (isCancelled) return;
        setFirebaseSession(null);
        setLoggedInUser(null);
        return;
      }

      const remoteUser = await fetchUserProfileFromFirebase(sessionUserId, idToken);
      if (isCancelled) return;

      if (remoteUser) {
        setUsers((prev) => {
          const exists = prev.some((u) => u.id === remoteUser.id);
          return exists ? prev.map((u) => (u.id === remoteUser.id ? remoteUser : u)) : [...prev, remoteUser];
        });
        setLoggedInUser(remoteUser);
        return;
      }

      const cachedUser = users.find((u) => u.id === sessionUserId);
      if (cachedUser) {
        setLoggedInUser(cachedUser);
        return;
      }

      if (sessionUserId === 'admin') {
        setLoggedInUser({
          id: 'admin',
          name: '관리자',
          level: '관리자',
          email: 'admin@example.com',
          phone: '010-0000-0000',
        });
        return;
      }

      // 프로필 문서가 없는 경우에도 세션 사용자는 로그인 유지
      setLoggedInUser({
        id: sessionUserId,
        name: sessionUserId,
        level: '일반회원',
        email: '',
        phone: '',
      });
    };

    restoreLoggedInUser();

    return () => {
      isCancelled = true;
    };
  }, [firebaseSession, loggedInUser, users]);

  useEffect(() => {
    const loadBoardPosts = async () => {
      const remotePosts = await fetchBoardPostsFromFirebase();
      if (remotePosts) {
        setBoardPosts(remotePosts);
      }
    };

    loadBoardPosts();
  }, []);

  useEffect(() => {
    const loadNews = async () => {
      const remoteNews = await fetchNewsFromFirebase();
      if (remoteNews) {
        setNewsArticles(remoteNews);
      }
    };

    loadNews();
  }, []);

  useEffect(() => {
    const loadEvents = async () => {
      const remoteEvents = await fetchEventsFromFirebase();
      if (remoteEvents) {
        setEvents(remoteEvents);
      }
    };

    loadEvents();
  }, []);

  useEffect(() => {
    const loadPolls = async () => {
      const remotePolls = await fetchPollsFromFirebase();
      if (remotePolls) {
        setPolls(remotePolls);
      }
    };

    loadPolls();
  }, []);

  useEffect(() => {
    const loadEventApplications = async () => {
      if (!loggedInUser) {
        setEventApplications([]);
        return;
      }

      const idToken = await getIdTokenByUserId(loggedInUser.id);
      if (!idToken) return;

      const remoteApplications = await fetchEventApplicationsFromFirebase(idToken);
      if (remoteApplications) {
        setEventApplications(remoteApplications);
      }
    };

    loadEventApplications();
  }, [loggedInUser]);

  useEffect(() => {
    const syncDeletedAuthUsers = async () => {
      if (loggedInUser?.level === '관리자') return;

      const usersWithoutProof = users
        .filter(user => user.level !== '관리자')
        .filter(user => !userAuthProofs[user.id])
        .map(user => user.id);

      if (usersWithoutProof.length > 0) {
        const removableIds = new Set(usersWithoutProof);
        setUsers(prev => prev.filter(user => user.level === '관리자' || !removableIds.has(user.id)));
      }

      const targetUsers = users
        .filter(user => user.level !== '관리자')
        .filter(user => !!userAuthProofs[user.id]);
      if (targetUsers.length === 0) return;

      const deletedIds = new Set<string>();
      const invalidProofIds = new Set<string>();
      for (const user of targetUsers) {
        try {
          const savedPassword = userAuthProofs[user.id];

          if (savedPassword) {
            try {
              await signInWithFirebase(user.id, savedPassword);
              continue;
            } catch (error: any) {
              if (error?.code === 'EMAIL_NOT_FOUND') {
                deletedIds.add(user.id);
                continue;
              }
              if (error?.code === 'INVALID_PASSWORD' || error?.code === 'INVALID_LOGIN_CREDENTIALS') {
                invalidProofIds.add(user.id);
                continue;
              }
            }
          }

          const deleted = await isDeletedFromFirebaseAuth(user.id);
          if (deleted) deletedIds.add(user.id);
        } catch (error) {
          // 네트워크/권한 오류 시에는 삭제로 판단하지 않음
        }
      }

      if (invalidProofIds.size > 0) {
        setUserAuthProofs(prev => {
          const next = { ...prev };
          invalidProofIds.forEach(id => delete next[id]);
          return next;
        });

        // 검증 불가 상태가 된 계정은 화면 회원 수에서 제외
        setUsers(prev => prev.filter(user => user.level === '관리자' || !invalidProofIds.has(user.id)));
      }

      if (deletedIds.size === 0) return;

      setUsers(prev => prev.filter(user => user.level === '관리자' || !deletedIds.has(user.id)));
      setUserAuthProofs(prev => {
        const next = { ...prev };
        deletedIds.forEach(id => delete next[id]);
        return next;
      });
      setLoggedInUser(prev => {
        if (!prev || prev.level === '관리자') return prev;
        return deletedIds.has(prev.id) ? null : prev;
      });
    };

    syncDeletedAuthUsers();
  }, [userAuthProofs, users, loggedInUser]);

  useEffect(() => {
    const loadUsersForAdmin = async () => {
      if (loggedInUser?.level !== '관리자') return;
      const idToken = await getIdTokenByUserId(loggedInUser.id);
      if (!idToken) return;

      const remoteUsers = await fetchUsersFromFirebase(idToken);
      if (!remoteUsers || remoteUsers.length === 0) return;

      setUsers(remoteUsers);
    };

    loadUsersForAdmin();
  }, [loggedInUser]);

  const processedEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return events.map(event => {
        if (event.status === 'recruiting' && event.recruitmentEndDate) {
            const parts = event.recruitmentEndDate.split('-').map(p => parseInt(p, 10));
            const endDate = new Date(parts[0], parts[1] - 1, parts[2]);
            if (today > endDate) return { ...event, status: 'closed' as const };
        }
        return event;
    });
  }, [events]);

  useEffect(() => {
    if (!window.history.state?.page) {
      window.history.replaceState({ page: 'home', id: null }, '', buildHistoryHash('home'));
    }

    const handlePopState = (event: PopStateEvent) => {
      const state = event.state as { page?: Page; id?: number | null } | null;
      const targetPage: Page = state?.page ?? 'home';
      const targetId = state?.id ?? null;

      setPage(targetPage);
      setSelectedEventId(targetPage === 'event-detail' ? targetId : null);
      setSelectedNewsId(targetPage === 'news-detail' ? targetId : null);
      setSelectedBoardPostId(targetPage === 'board-detail' ? targetId : null);
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (targetPage: Page, id?: number) => {
    setPage(targetPage);
    setSelectedEventId(targetPage === 'event-detail' ? (id ?? null) : null);
    setSelectedNewsId(targetPage === 'news-detail' ? (id ?? null) : null);
    setSelectedBoardPostId(targetPage === 'board-detail' ? (id ?? null) : null);
    window.history.pushState({ page: targetPage, id: id ?? null }, '', buildHistoryHash(targetPage, id ?? null));
    window.scrollTo(0, 0);
  };

  const getIdTokenByUserId = async (userId?: string | null) => {
    if (!userId) return undefined;

    const proofPassword = userAuthProofs[userId];
    if (proofPassword) {
      try {
        const signInData = await signInWithFirebase(userId, proofPassword);
        const idToken = signInData?.idToken as string | undefined;
        if (idToken) {
          setFirebaseSession({ userId, idToken });
        }
        return idToken;
      } catch (error) {
        // 비밀번호 증적이 오래되었거나 변경된 경우: 기존 세션 토큰이 있으면 우선 사용
      }
    }

    if (firebaseSession?.userId === userId && firebaseSession.idToken) {
      return firebaseSession.idToken;
    }

    return undefined;
  };
  
  const handleLogin = async ({ userId, pass }: { userId: string, pass: string }) => {
    if (userId === 'admin' && pass === '1q2w3e4r!@') {
      const admin = { id: 'admin', name: '관리자', level: '관리자' as const, email: 'admin@example.com', phone: '010-0000-0000' };
      try {
        const signInData = await signInWithFirebase(userId, pass);
        const idToken = signInData?.idToken as string | undefined;
        if (idToken) {
          setFirebaseSession({ userId, idToken });
          setUserAuthProofs(prev => ({ ...prev, [userId]: pass }));
        }
      } catch (error) {
        setFirebaseSession(null);
      }
      setLoggedInUser(admin);
      navigate('home');
    } else {
      try {
        const signInData = await signInWithFirebase(userId, pass);
        const idToken = signInData?.idToken as string | undefined;
        if (idToken && await isUserMarkedDeletedInFirebase(userId, idToken)) {
          const isMarkerCleared = await clearUserDeletedMarkerInFirebase(userId, idToken);
          if (!(isMarkerCleared && !(await isUserMarkedDeletedInFirebase(userId, idToken)))) {
            setFirebaseSession(null);
            setUserAuthProofs(prev => {
              const next = { ...prev };
              delete next[userId];
              return next;
            });
            alert('관리자에 의해 탈퇴 처리된 계정입니다. 로그인할 수 없습니다.');
            return;
          }
        }

        setUserAuthProofs(prev => ({ ...prev, [userId]: pass }));
        if (idToken) {
          setFirebaseSession({ userId, idToken });
        }

        const remoteUser = await fetchUserProfileFromFirebase(userId, idToken);

        if (remoteUser) {
          setUsers(prev => {
            const exists = prev.some(u => u.id === remoteUser.id);
            if (exists) {
              return prev.map(u => (u.id === remoteUser.id ? remoteUser : u));
            }
            return [...prev, remoteUser];
          });
          setLoggedInUser(remoteUser);
        } else {
          const foundUser = users.find(u => u.id === userId);
          if (foundUser) {
            setLoggedInUser(foundUser);
          } else {
            const newLocalUser: User = {
              id: userId,
              name: userId,
              level: '일반회원',
              email: '',
              phone: '',
            };
            setUsers(prev => [...prev, newLocalUser]);
            setLoggedInUser(newLocalUser);
          }
        }
        navigate('home');
      } catch (error: any) {
        if (error?.code === 'EMAIL_NOT_FOUND') {
          setUsers(prev => prev.filter(u => u.level === '관리자' || u.id !== userId));
        }
        alert(error instanceof Error ? error.message : '아이디 또는 비밀번호가 올바르지 않습니다.');
      }
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setFirebaseSession(null);
    navigate('home');
  };

  const handleUpdateProfile = (updatedUser: User) => {
    setLoggedInUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    alert('회원 정보가 수정되었습니다.');
    navigate('mypage');
  };

  const handleWithdraw = async () => {
    if (!loggedInUser) return;
    if (loggedInUser.level === '관리자') {
      alert('관리자 계정은 탈퇴할 수 없습니다.');
      return;
    }

    const confirmed = window.confirm('정말로 회원 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.');
    if (!confirmed) return;

    try {
      const password = userAuthProofs[loggedInUser.id];
      if (password) {
        try {
          const signInData = await signInWithFirebase(loggedInUser.id, password);
          const idToken = signInData?.idToken as string | undefined;
          if (idToken) {
            await deleteUserProfileFromFirebase(loggedInUser.id, idToken);
            await clearUserDeletedMarkerInFirebase(loggedInUser.id, idToken);
          }
        } catch (error) {
          // 프로필/마커 삭제 실패 시에도 Auth 삭제는 시도
        }
      }
      await deleteFirebaseAccount(loggedInUser.id, password);
    } catch (error) {
      // Firebase 삭제 실패 시에도 로컬 세션/회원 상태는 정리
    }

    setUsers(prev => prev.filter(u => u.id !== loggedInUser.id));
    setUserAuthProofs(prev => {
      const next = { ...prev };
      delete next[loggedInUser.id];
      return next;
    });
    setFirebaseSession(null);
    setLoggedInUser(null);
    alert('회원 탈퇴가 완료되었습니다.');
    navigate('home');
  };

  const handleCheckSignUpId = async (id: string) => {
      if (users.some(u => u.id === id)) return false;
      return checkFirebaseUserIdAvailability(id);
  };

  const handleSignUp = async (newUser: User, password: string) => {
      await signUpWithFirebase(newUser, password);
      setUsers(prev => [...prev, newUser]);
      setUserAuthProofs(prev => ({ ...prev, [newUser.id]: password }));
      alert('회원가입이 완료되었습니다. 로그인해주세요.');
      navigate('login');
  };

  const handleRequestUpgrade = () => {
      const requestUpgrade = async () => {
        if (!loggedInUser) return;
        const updatedUser = { ...loggedInUser, isUpgradeRequested: true };

        const idToken = await getIdTokenByUserId(loggedInUser.id);
        const isSynced = await updateUserLevelInFirebase(updatedUser, idToken);
        if (!isSynced) {
          alert('승급요청 저장에 실패했습니다. 잠시 후 다시 시도해주세요.');
          return;
        }

        setLoggedInUser(updatedUser);
        setUsers(prev => prev.map(u => u.id === loggedInUser.id ? updatedUser : u));
        alert('정회원 승급 신청이 완료되었습니다! 1,000원 납부 확인 후 관리자가 승인해 드립니다.');
        navigate('member');
      };

      requestUpgrade();
  };

  const handleApproveUpgrade = (userId: string) => {
      const targetUser = users.find(u => u.id === userId);
      if (!targetUser) return;

      const updatedUser: User = { ...targetUser, level: '정회원', isUpgradeRequested: false };

      const syncUpgrade = async () => {
        const idToken = await getIdTokenByUserId(loggedInUser?.id);
        return updateUserLevelInFirebase(updatedUser, idToken);
      };

      syncUpgrade()
        .then((isSynced) => {
          setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
          if (loggedInUser?.id === userId) {
              setLoggedInUser(prev => prev ? { ...prev, level: '정회원' as const, isUpgradeRequested: false } : null);
          }
          if (isSynced) {
            alert('승급이 완료되었습니다.');
          } else {
            alert('승급은 완료되었지만 Firebase 동기화는 실패했습니다.');
          }
        });
  };

  const handleAdminUpdateUser = async (updatedUser: User) => {
      const idToken = await getIdTokenByUserId(loggedInUser?.id);
      const isSynced = await updateUserLevelInFirebase(updatedUser, idToken);
      setUsers(currentUsers => currentUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
      if (loggedInUser?.id === updatedUser.id) {
          setLoggedInUser(updatedUser);
      }
      if (!isSynced) {
          alert('회원 정보는 변경되었지만 Firebase 동기화는 실패했습니다.');
      }
  };

  const handleAdminDeleteUser = async (userId: string) => {
    if (!loggedInUser) return;
    if (userId === loggedInUser.id) {
      alert('현재 로그인한 관리자 본인은 삭제할 수 없습니다.');
      return;
    }

    const idToken = await getIdTokenByUserId(loggedInUser?.id);
    const authDeleteRes = await fetch('/api/admin/delete-auth-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
      },
      body: JSON.stringify({ targetUserId: userId }),
    });

    const authDeleteData = await authDeleteRes.json().catch(() => ({}));
    let isAuthDeleted = authDeleteRes.ok && !!authDeleteData?.ok;
    if (!isAuthDeleted) {
      // 폴백: 같은 브라우저에 대상 계정의 로그인 증적 비밀번호가 남아있으면 Auth 직접 탈퇴 시도
      const fallbackPassword = userAuthProofs[userId];
      if (fallbackPassword) {
        try {
          await deleteFirebaseAccount(userId, fallbackPassword);
          isAuthDeleted = true;
        } catch (error) {
          isAuthDeleted = false;
        }
      }
    }

    if (!isAuthDeleted) {
      alert(authDeleteData?.message || 'Firebase Auth 계정 삭제에 실패했습니다. 서비스 계정 설정을 확인해주세요.');
      return;
    }

    const marked = await markUserDeletedByAdminInFirebase(userId, loggedInUser.id, idToken);
    const isProfileDeleted = await deleteUserProfileFromFirebase(userId, idToken);
    setUsers(currentUsers => currentUsers.filter((u) => u.id !== userId));

    setUserAuthProofs(prev => {
      const next = { ...prev };
      delete next[userId];
      return next;
    });

    if (!marked || !isProfileDeleted) {
      alert('회원 삭제는 완료되었지만 Firebase 동기화는 일부 실패했습니다.');
    }
  };

  const handleBulkCreateUsers = async (items: Array<{ user: User; password: string }>) => {
    const errors: string[] = [];
    const createdUsers: User[] = [];
    const createdProofs: Record<string, string> = {};

    for (const item of items) {
      const normalizedId = item.user.id.replace(/@myapp\.com$/i, '').replace(/[^a-zA-Z0-9]/g, '');
      const normalizedPassword = item.password.trim();

      if (!normalizedId) {
        errors.push(`${item.user.name || '이름없음'}: 아이디가 비어 있습니다.`);
        continue;
      }
      if (!normalizedPassword) {
        errors.push(`${normalizedId}: 비밀번호가 비어 있습니다.`);
        continue;
      }
      if (users.some((u) => u.id === normalizedId) || createdUsers.some((u) => u.id === normalizedId)) {
        errors.push(`${normalizedId}: 이미 존재하는 아이디입니다.`);
        continue;
      }

      const nextUser: User = {
        ...item.user,
        id: normalizedId,
        level: '일반회원',
      };

      try {
        await signUpWithFirebase(nextUser, normalizedPassword);
        createdUsers.push(nextUser);
        createdProofs[normalizedId] = normalizedPassword;
      } catch (error) {
        errors.push(`${normalizedId}: ${error instanceof Error ? error.message : '회원가입 실패'}`);
      }
    }

    if (createdUsers.length > 0) {
      setUsers((prev) => [...prev, ...createdUsers]);
      setUserAuthProofs((prev) => ({ ...prev, ...createdProofs }));
    }

    return {
      success: createdUsers.length,
      failed: items.length - createdUsers.length,
      errors,
    };
  };

  const handleSaveIntroductionData = async (nextIntroductionData: IntroductionData) => {
    const idToken = await getIdTokenByUserId(loggedInUser?.id);
    const isSynced = await upsertSiteContentInFirebase({
      heroImageUrls,
      logoUrl,
      introductionData: nextIntroductionData,
    }, idToken);

    if (isSynced) {
      setIntroductionData(nextIntroductionData);
    }

    return isSynced;
  };

  const handleCreateEvent = (newEventData: Omit<Event, 'id' | 'participants'>) => {
    const saveEvent = async () => {
      const newEvent: Event = {
        ...newEventData,
        id: Date.now(),
        participants: 0,
      };

      const idToken = await getIdTokenByUserId(loggedInUser?.id);
      const isSynced = await createEventInFirebase(newEvent, idToken);
      if (!isSynced) {
        alert('행사 Firebase 저장에 실패했습니다.');
        return;
      }

      setEvents(prevEvents => [...prevEvents, newEvent]);
      navigate('events');
    };

    saveEvent();
  };
  
  const handleCreateBoardPost = (newPostData: Omit<BoardPost, 'id' | 'author' | 'date' | 'views' | 'comments' | 'isNotice' | 'description'>) => {
    if (!loggedInUser) return;

    const saveBoardPost = async () => {
      const d = new Date();
      const newPost: BoardPost = {
          ...newPostData,
          id: Date.now(),
          author: loggedInUser.name,
          date: `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`,
          views: 0,
          comments: 0,
          isNotice: false,
          description: newPostData.content.substring(0, 100) + (newPostData.content.length > 100 ? '...' : ''),
      };

      let idToken: string | undefined;
      const proofPassword = userAuthProofs[loggedInUser.id];
      if (proofPassword) {
        try {
          const signInData = await signInWithFirebase(loggedInUser.id, proofPassword);
          idToken = signInData?.idToken as string | undefined;
        } catch (error) {
          idToken = undefined;
        }
      }

      const isSynced = await createBoardPostInFirebase(newPost, idToken);
      if (!isSynced) {
        alert('게시글 Firebase 저장에 실패했습니다.');
        return;
      }

      setBoardPosts(prevPosts => [newPost, ...prevPosts]);
      navigate('board');
    };

    saveBoardPost();
  };

  const handleCreateNewsPost = (newPostData: Omit<NewsArticle, 'id' | 'date' | 'views'>) => {
    const saveNewsPost = async () => {
      const d = new Date();
      const newPost: NewsArticle = {
        ...newPostData,
        id: newsArticles.length > 0 ? Math.max(...newsArticles.map(a => a.id)) + 1 : 1,
        date: `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`,
        views: 0,
      };

      const idToken = await getIdTokenByUserId(loggedInUser?.id);
      const isSynced = await createNewsInFirebase(newPost, idToken);
      if (!isSynced) {
        alert('소식/공지 Firebase 저장에 실패했습니다.');
        return;
      }

      setNewsArticles(prev => [newPost, ...prev]);
      navigate('news');
    };

    saveNewsPost();
  };

  const handleUpdateEvent = (updatedEvent: Event) => {
    const saveUpdatedEvent = async () => {
      const idToken = await getIdTokenByUserId(loggedInUser?.id);
      const isSynced = await updateEventInFirebase(updatedEvent, idToken);
      if (!isSynced) {
        alert('행사 Firebase 저장에 실패했습니다.');
        return;
      }

      setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    };

    saveUpdatedEvent();
  };

  const handleApplyForEvent = async (eventId: number, applicant: { name: string; phone: string; email: string }) => {
    if (!loggedInUser) {
      alert('로그인이 필요합니다.');
      navigate('login');
      return false;
    }

    const targetEvent = events.find((event) => event.id === eventId);
    if (!targetEvent) {
      alert('행사 정보를 찾을 수 없습니다.');
      return false;
    }

    if (targetEvent.status !== 'recruiting') {
      alert('모집 중인 행사만 신청할 수 있습니다.');
      return false;
    }

    if (targetEvent.participants >= targetEvent.capacity) {
      alert('신청 인원이 마감되었습니다.');
      return false;
    }

    const nextParticipants = targetEvent.participants + 1;
    const updatedEvent: Event = {
      ...targetEvent,
      participants: nextParticipants,
      status: nextParticipants >= targetEvent.capacity ? 'closed' : targetEvent.status,
    };

    const idToken = await getIdTokenByUserId(loggedInUser.id);
    if (!idToken) {
      alert('로그인 세션이 만료되었습니다. 다시 로그인 후 시도해주세요.');
      return false;
    }
    const newApplication: EventApplication = {
      id: `${eventId}-${loggedInUser.id}-${Date.now()}`,
      eventId,
      userId: loggedInUser.id,
      name: applicant.name,
      phone: applicant.phone,
      email: applicant.email,
      createdAt: new Date().toISOString(),
    };

    const isEventSynced = await updateEventInFirebase(updatedEvent, idToken);
    const isApplicationSynced = await createEventApplicationInFirebase(newApplication, idToken);
    if (!isEventSynced || !isApplicationSynced) {
      alert('참가 신청 Firebase 저장에 실패했습니다.');
      return false;
    }

    setEvents(prev => prev.map(event => event.id === eventId ? updatedEvent : event));
    setEventApplications((prev) => [newApplication, ...prev]);
    return true;
  };

  const handleDeleteEvent = (eventId: number) => {
    const removeEvent = async () => {
      if (!window.confirm('삭제하시겠습니까?')) return;

      const idToken = await getIdTokenByUserId(loggedInUser?.id);
      const isSynced = await deleteEventInFirebase(eventId, idToken);
      if (!isSynced) {
        alert('행사 Firebase 삭제에 실패했습니다.');
        return;
      }

      setEvents(prev => prev.filter(e => e.id !== eventId));
    };

    removeEvent();
  };
  const handleDeleteBoardPost = (postId: number) => {
    const deleteBoardPost = async () => {
      if (!window.confirm('삭제하시겠습니까?')) return;

      let idToken: string | undefined;
      if (loggedInUser) {
        const proofPassword = userAuthProofs[loggedInUser.id];
        if (proofPassword) {
          try {
            const signInData = await signInWithFirebase(loggedInUser.id, proofPassword);
            idToken = signInData?.idToken as string | undefined;
          } catch (error) {
            idToken = undefined;
          }
        }
      }

      const isSynced = await deleteBoardPostInFirebase(postId, idToken);
      if (!isSynced) {
        alert('게시글 Firebase 삭제에 실패했습니다.');
        return;
      }

      setBoardPosts(prev => prev.filter(p => p.id !== postId));
    };

    deleteBoardPost();
  };

  const handleToggleBoardNotice = (postId: number) => {
    const toggleBoardNotice = async () => {
      const targetPost = boardPosts.find(p => p.id === postId);
      if (!targetPost) return;
      const updatedPost: BoardPost = { ...targetPost, isNotice: !targetPost.isNotice };

      let idToken: string | undefined;
      if (loggedInUser) {
        const proofPassword = userAuthProofs[loggedInUser.id];
        if (proofPassword) {
          try {
            const signInData = await signInWithFirebase(loggedInUser.id, proofPassword);
            idToken = signInData?.idToken as string | undefined;
          } catch (error) {
            idToken = undefined;
          }
        }
      }

      const isSynced = await updateBoardPostInFirebase(updatedPost, idToken);
      if (!isSynced) {
        alert('게시글 공지 상태 Firebase 저장에 실패했습니다.');
        return;
      }

      setBoardPosts(prev => prev.map(p => p.id === postId ? updatedPost : p));
    };

    toggleBoardNotice();
  };

  const handleDeleteNewsPost = (newsId: number) => {
    const removeNewsPost = async () => {
      if (!window.confirm('삭제하시겠습니까?')) return;

      const idToken = await getIdTokenByUserId(loggedInUser?.id);
      const isSynced = await deleteNewsInFirebase(newsId, idToken);
      if (!isSynced) {
        alert('소식/공지 Firebase 삭제에 실패했습니다.');
        return;
      }

      setNewsArticles(prev => prev.filter(article => article.id !== newsId));
      navigate('news');
    };

    removeNewsPost();
  };

  const handleVoteOnProposal = (proposalId: number) => {
    if (!loggedInUser) return navigate('login');
    setEventProposals(prev => prev.map(p => {
        if (p.id === proposalId) {
            const hasVoted = p.votedUserIds.includes(loggedInUser.id);
            return {
                ...p,
                votes: hasVoted ? p.votes - 1 : p.votes + 1,
                votedUserIds: hasVoted ? p.votedUserIds.filter(id => id !== loggedInUser.id) : [...p.votedUserIds, loggedInUser.id]
            };
        }
        return p;
    }));
  };

  const handleCreateProposal = (proposal: { title: string; description: string }) => {
      if (!loggedInUser) return navigate('login');
      const newProposal: EventProposal = {
          id: Date.now(),
          title: proposal.title,
          description: proposal.description,
          proposerName: loggedInUser.name,
          votes: 1,
          votedUserIds: [loggedInUser.id],
      };
      setEventProposals(prev => [...prev, newProposal]);
  };

  const handleReceiveRights = (pollId: number) => {
    const saveVotingRights = async () => {
      const targetPoll = polls.find((poll) => poll.id === pollId);
      if (!targetPoll) return;

      const updatedPoll: Poll = { ...targetPoll, hasVotingRights: true };
      const idToken = await getIdTokenByUserId(loggedInUser?.id);
      const isSynced = await updatePollInFirebase(updatedPoll, idToken);
      if (!isSynced) {
        alert('투표권 상태 Firebase 저장에 실패했습니다.');
        return;
      }

      setPolls(prev => prev.map(p => p.id === pollId ? updatedPoll : p));
      alert("투표권을 획득했습니다.");
    };

    saveVotingRights();
  };

  const handleVote = (pollId: number, optionId: string) => {
    if (!loggedInUser) return;

    const saveVote = async () => {
      const targetPoll = polls.find((poll) => poll.id === pollId);
      if (!targetPoll || targetPoll.votedUserIds.includes(loggedInUser.id)) return;

      const updatedOptions = targetPoll.options.map((opt) =>
        opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
      );
      const updatedPoll: Poll = {
        ...targetPoll,
        options: updatedOptions,
        totalVotes: targetPoll.totalVotes + 1,
        hasVoted: true,
        votedUserIds: [...targetPoll.votedUserIds, loggedInUser.id],
      };

      const idToken = await getIdTokenByUserId(loggedInUser.id);
      const isSynced = await updatePollInFirebase(updatedPoll, idToken);
      if (!isSynced) {
        alert('투표 Firebase 저장에 실패했습니다.');
        return;
      }

      setPolls(prev => prev.map((poll) => (poll.id === pollId ? updatedPoll : poll)));
    };

    saveVote();
  };

  const handleCreatePoll = (newPollData: Omit<Poll, 'id' | 'totalVotes' | 'hasVoted' | 'hasVotingRights' | 'votedUserIds'>) => {
    const savePoll = async () => {
      const newPoll: Poll = { ...newPollData, id: Date.now(), totalVotes: 0, hasVoted: false, hasVotingRights: false, votedUserIds: [] };

      const idToken = await getIdTokenByUserId(loggedInUser?.id);
      const isSynced = await createPollInFirebase(newPoll, idToken);
      if (!isSynced) {
        alert('온라인 투표 Firebase 저장에 실패했습니다.');
        return;
      }

      setPolls(prev => [newPoll, ...prev]);
    };

    savePoll();
  };

  const handleDeletePoll = (pollId: number) => {
    const removePoll = async () => {
      const idToken = await getIdTokenByUserId(loggedInUser?.id);
      const isSynced = await deletePollInFirebase(pollId, idToken);
      if (!isSynced) {
        alert('온라인 투표 Firebase 삭제에 실패했습니다.');
        return;
      }

      setPolls(prev => prev.filter(p => p.id !== pollId));
    };

    removePoll();
  };

  const handleUpdatePoll = (updatedPoll: Poll) => {
    const saveUpdatedPoll = async () => {
      const idToken = await getIdTokenByUserId(loggedInUser?.id);
      const isSynced = await updatePollInFirebase(updatedPoll, idToken);
      if (!isSynced) {
        alert('온라인 투표 Firebase 저장에 실패했습니다.');
        return;
      }

      setPolls(prev => prev.map(p => p.id === updatedPoll.id ? updatedPoll : p));
    };

    saveUpdatedPoll();
  };

  const totalMembers = users.length;
  const fullMembers = users.filter(u => u.level === '정회원').length;
  const generalMembers = users.filter(u => u.level === '일반회원').length;
  const totalPosts = newsArticles.length + boardPosts.length;
  const totalComments = boardPosts.reduce((sum, post) => sum + post.comments, 0);
  const totalParticipants = events.reduce((sum, event) => sum + event.participants, 0);

  const renderPage = () => {
    switch (page) {
      case 'home': return (
        <>
          <Hero onNavigate={navigate} heroImageUrls={heroImageUrls} totalMembers={totalMembers} fullMembers={fullMembers} introductionData={introductionData} />
          <NewsSection articles={newsArticles.slice(0, 3)} onNavigate={navigate} />
          <ActivitiesSection onNavigate={navigate} />
          <CallToAction onNavigate={navigate} />
        </>
      );
      case 'signup': return <SignUpPage onCheckId={handleCheckSignUpId} onSignUp={handleSignUp} />;
      case 'introduction': return <IntroductionPage onNavigate={navigate} introductionData={introductionData} totalMembers={totalMembers} />;
      case 'news': return <NewsPage onNavigate={navigate} newsArticles={newsArticles} loggedInUser={loggedInUser} />;
      case 'news-detail': 
        const news = newsArticles.find(a => a.id === selectedNewsId);
        return news ? <NewsDetailPage article={news} allArticles={newsArticles} onNavigate={navigate} loggedInUser={loggedInUser} onDeleteNewsPost={handleDeleteNewsPost} /> : <NewsPage onNavigate={navigate} newsArticles={newsArticles} loggedInUser={loggedInUser} />;
      case 'new-news-post': return <NewNewsPostPage onNavigate={navigate} onCreateNewsPost={handleCreateNewsPost} />;
      case 'board': return <BoardPage onNavigate={navigate} boardPosts={boardPosts} loggedInUser={loggedInUser} onDeleteBoardPost={handleDeleteBoardPost} />;
      case 'board-detail':
        const post = boardPosts.find(p => p.id === selectedBoardPostId);
        return post ? <BoardDetailPage post={post} allPosts={boardPosts} onNavigate={navigate} loggedInUser={loggedInUser} onDeleteBoardPost={handleDeleteBoardPost} /> : <BoardPage onNavigate={navigate} boardPosts={boardPosts} loggedInUser={loggedInUser} onDeleteBoardPost={handleDeleteBoardPost} />;
      case 'new-board-post': return <NewBoardPostPage onNavigate={navigate} onCreateBoardPost={handleCreateBoardPost} />;
      case 'events': return <EventsPage onNavigate={navigate} events={processedEvents} totalParticipants={totalParticipants} loggedInUser={loggedInUser} onUpdateEvent={handleUpdateEvent} onDeleteEvent={handleDeleteEvent} eventProposals={eventProposals} onVoteOnProposal={handleVoteOnProposal} onCreateProposal={handleCreateProposal} />;
      case 'event-detail':
        const event = processedEvents.find(e => e.id === selectedEventId);
        return event ? <EventDetailPage event={event} onNavigate={navigate} loggedInUser={loggedInUser} onApplyForEvent={handleApplyForEvent} /> : <EventsPage onNavigate={navigate} events={processedEvents} totalParticipants={totalParticipants} loggedInUser={loggedInUser} onUpdateEvent={handleUpdateEvent} onDeleteEvent={handleDeleteEvent} eventProposals={eventProposals} onVoteOnProposal={handleVoteOnProposal} onCreateProposal={handleCreateProposal} />;
      case 'new-event': return <NewEventPage onNavigate={navigate} onCreateEvent={handleCreateEvent} />;
      case 'online-voting': return <OnlineVotingPage onNavigate={navigate} loggedInUser={loggedInUser} polls={polls} onVote={handleVote} onReceiveRights={handleReceiveRights} onCreatePoll={handleCreatePoll} onUpdatePoll={handleUpdatePoll} />;
      case 'donation': return <DonationPage />;
      case 'member': return <MemberPage onNavigate={navigate} totalMembers={totalMembers} fullMembers={fullMembers} generalMembers={generalMembers} totalPosts={totalPosts} />;
      case 'mypage': return <MyPage loggedInUser={loggedInUser} myPosts={boardPosts.filter(p => p.author === loggedInUser?.name)} joinedEvents={processedEvents.slice(0, 2)} onNavigate={navigate} />;
      case 'edit-profile': return <EditProfilePage user={loggedInUser} onUpdate={handleUpdateProfile} onWithdraw={handleWithdraw} onNavigate={navigate} />;
      case 'upgrade-member': return <UpgradeMemberPage user={loggedInUser} onUpgrade={handleRequestUpgrade} onNavigate={navigate} />;
      case 'login': return <LoginPage onNavigate={navigate} onLoginSuccess={handleLogin} />;
      case 'find-credentials': return <FindCredentialsPage onNavigate={navigate} />;
      case 'admin': return loggedInUser?.level === '관리자' ? (
        <AdminPage loggedInUser={loggedInUser} users={users} setUsers={setUsers} stats={{ totalMembers, totalPosts, totalComments }} heroImageUrls={heroImageUrls} setHeroImageUrls={setHeroImageUrls} logoUrl={logoUrl} setLogoUrl={setLogoUrl} introductionData={introductionData} setIntroductionData={setIntroductionData} polls={polls} onCreatePoll={handleCreatePoll} onDeletePoll={handleDeletePoll} boardPosts={boardPosts} onDeleteBoardPost={handleDeleteBoardPost} onToggleBoardNotice={handleToggleBoardNotice} onApproveUpgrade={handleApproveUpgrade} onUpdateUser={handleAdminUpdateUser} onDeleteUser={handleAdminDeleteUser} onBulkCreateUsers={handleBulkCreateUsers} onSaveIntroductionData={handleSaveIntroductionData} events={events} eventApplications={eventApplications} />
      ) : <HomePage />;
      default: return <HomePage />;
    }
  };

  const HomePage = () => renderPage();

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen font-sans text-gray-800 dark:text-gray-200 transition-colors duration-300 flex flex-col">
      <Header onNavigate={navigate} page={page} loggedInUser={loggedInUser} onLogout={handleLogout} logoUrl={logoUrl} />
      <main className="flex-grow">{renderPage()}</main>
      <Footer onNavigate={navigate} />
    </div>
  );
};

export default App;
