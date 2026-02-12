import type { BoardPost, Event, EventApplication, IntroductionData, NewsArticle, Poll, User } from '../types';

const FIREBASE_API_KEY = 'AIzaSyCu_FlxY1wTwRA-CM-wqUp0gWOJhAgotEw';
const FIREBASE_PROJECT_ID = 'fair-education-backend-eb45a';

const AUTH_BASE_URL = 'https://identitytoolkit.googleapis.com/v1';
const FIRESTORE_BASE_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;

const FIREBASE_ID_DOMAIN = '@myapp.com';

const toDisplayUserId = (rawUserId: string) => rawUserId.replace(/@myapp\.com$/i, '');

const toFirebaseEmail = (userId: string) => {
  const normalizedId = toDisplayUserId(userId.trim());
  return `${normalizedId}${FIREBASE_ID_DOMAIN}`;
};

const parseFirebaseError = (message?: string) => {
  switch (message) {
    case 'EMAIL_EXISTS':
      return '이미 사용 중인 아이디입니다.';
    case 'WEAK_PASSWORD : Password should be at least 6 characters':
    case 'WEAK_PASSWORD':
      return '비밀번호는 6자리 이상이어야 합니다.';
    case 'INVALID_EMAIL':
      return '아이디 형식이 올바르지 않습니다.';
    case 'EMAIL_NOT_FOUND':
      return '존재하지 않는 계정입니다.';
    case 'INVALID_PASSWORD':
    case 'INVALID_LOGIN_CREDENTIALS':
      return '아이디 또는 비밀번호가 올바르지 않습니다.';
    case 'USER_DISABLED':
      return '사용이 중지된 계정입니다.';
    default:
      return 'Firebase 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
  }
};

class FirebaseAuthError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

const toFirestoreUserFields = (user: User) => ({
  id: { stringValue: toDisplayUserId(user.id) },
  name: { stringValue: user.name },
  level: { stringValue: user.level },
  email: { stringValue: user.email || '' },
  phone: { stringValue: user.phone || '' },
  address: { stringValue: user.address || '' },
  addressDetail: { stringValue: user.addressDetail || '' },
  isUpgradeRequested: { booleanValue: !!user.isUpgradeRequested },
});

const toFirestoreBoardPostFields = (post: BoardPost) => ({
  id: { integerValue: String(post.id) },
  tag: { stringValue: post.tag },
  tagType: { stringValue: post.tagType },
  title: { stringValue: post.title },
  description: { stringValue: post.description },
  content: { stringValue: post.content },
  author: { stringValue: post.author },
  date: { stringValue: post.date },
  views: { integerValue: String(post.views) },
  comments: { integerValue: String(post.comments) },
  isNotice: { booleanValue: !!post.isNotice },
  images: {
    arrayValue: {
      values: (post.images || []).map((image) => ({ stringValue: image })),
    },
  },
});

const toFirestoreEventFields = (event: Event) => ({
  id: { integerValue: String(event.id) },
  status: { stringValue: event.status },
  categories: {
    arrayValue: {
      values: event.categories.map((category) => ({ stringValue: category })),
    },
  },
  isOnline: { booleanValue: !!event.isOnline },
  isRegularMeeting: { booleanValue: !!event.isRegularMeeting },
  title: { stringValue: event.title },
  description: { stringValue: event.description },
  date: { stringValue: event.date },
  time: { stringValue: event.time },
  location: { stringValue: event.location },
  participants: { integerValue: String(event.participants) },
  capacity: { integerValue: String(event.capacity) },
  price: { stringValue: event.price || '' },
  recruitmentStartDate: { stringValue: event.recruitmentStartDate || '' },
  recruitmentEndDate: { stringValue: event.recruitmentEndDate || '' },
});

const toFirestoreEventApplicationFields = (application: EventApplication) => ({
  id: { stringValue: application.id },
  eventId: { integerValue: String(application.eventId) },
  userId: { stringValue: application.userId },
  name: { stringValue: application.name },
  phone: { stringValue: application.phone || '' },
  email: { stringValue: application.email || '' },
  createdAt: { stringValue: application.createdAt },
});

const toFirestorePollFields = (poll: Poll) => ({
  id: { integerValue: String(poll.id) },
  title: { stringValue: poll.title },
  description: { stringValue: poll.description },
  options: {
    arrayValue: {
      values: poll.options.map((option) => ({
        mapValue: {
          fields: {
            id: { stringValue: option.id },
            text: { stringValue: option.text },
            votes: { integerValue: String(option.votes) },
          },
        },
      })),
    },
  },
  startDate: { stringValue: poll.startDate },
  endDate: { stringValue: poll.endDate },
  totalVotes: { integerValue: String(poll.totalVotes) },
  hasVoted: { booleanValue: !!poll.hasVoted },
  hasVotingRights: { booleanValue: !!poll.hasVotingRights },
  votedUserIds: {
    arrayValue: {
      values: (poll.votedUserIds || []).map((userId) => ({ stringValue: userId })),
    },
  },
});

const toFirestoreNewsFields = (article: NewsArticle) => ({
  id: { integerValue: String(article.id) },
  title: { stringValue: article.title },
  description: { stringValue: article.description },
  content: { stringValue: article.content },
  date: { stringValue: article.date },
  views: { integerValue: String(article.views) },
  isImportant: { booleanValue: !!article.isImportant },
  tags: {
    arrayValue: {
      values: (article.tags || []).map((tag) => ({
        mapValue: {
          fields: {
            text: { stringValue: tag.text },
            style: { stringValue: tag.style },
          },
        },
      })),
    },
  },
  images: {
    arrayValue: {
      values: (article.images || []).map((image) => ({ stringValue: image })),
    },
  },
});

const parseFirestoreInt = (value: any, defaultValue = 0) => {
  const raw = value?.integerValue ?? value?.doubleValue;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : defaultValue;
};

const parseFirestoreString = (value: any, defaultValue = '') => {
  const raw = value?.stringValue;
  return typeof raw === 'string' ? raw : defaultValue;
};

const parseFirestoreBool = (value: any, defaultValue = false) => {
  const raw = value?.booleanValue;
  return typeof raw === 'boolean' ? raw : defaultValue;
};

const parseFirestoreStringArray = (value: any) => {
  const values = value?.arrayValue?.values;
  if (!Array.isArray(values)) return [];
  return values.map((item: any) => parseFirestoreString(item)).filter(Boolean);
};

const parseFirestoreEventCategories = (value: any) => {
  const categories = parseFirestoreStringArray(value);
  return categories as Event['categories'];
};

const parseFirestorePollOptions = (value: any): Poll['options'] => {
  const values = value?.arrayValue?.values;
  if (!Array.isArray(values)) return [];

  return values.map((item: any, index: number) => {
    const fields = item?.mapValue?.fields || {};
    return {
      id: parseFirestoreString(fields.id, `opt-${index}`),
      text: parseFirestoreString(fields.text),
      votes: parseFirestoreInt(fields.votes, 0),
    };
  });
};

const parseFirestoreNewsTags = (value: any): NewsArticle['tags'] => {
  const values = value?.arrayValue?.values;
  if (!Array.isArray(values)) return [];

  return values.map((item: any) => {
    const fields = item?.mapValue?.fields || {};
    const style = parseFirestoreString(fields.style, 'gray');
    const safeStyle: NewsArticle['tags'][number]['style'] =
      style === 'red' || style === 'blue' || style === 'green' || style === 'orange' || style === 'gray'
        ? style
        : 'gray';

    return {
      text: parseFirestoreString(fields.text),
      style: safeStyle,
    };
  }).filter((tag) => !!tag.text);
};

const parseFirestoreUserLevel = (value: any): User['level'] => {
  const level = parseFirestoreString(value, '일반회원');
  if (level === '관리자' || level === '정회원' || level === '일반회원') {
    return level;
  }
  return '일반회원';
};

const getFirestoreAuthHeaders = (idToken?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (idToken) {
    headers.Authorization = `Bearer ${idToken}`;
  }

  return headers;
};

const createFirestoreUserDocument = async (user: User, idToken?: string) => {
  const displayUserId = toDisplayUserId(user.id);
  const createUrl = `${FIRESTORE_BASE_URL}/users?documentId=${encodeURIComponent(displayUserId)}&key=${FIREBASE_API_KEY}`;

  return fetch(createUrl, {
    method: 'POST',
    headers: getFirestoreAuthHeaders(idToken),
    body: JSON.stringify({
      fields: toFirestoreUserFields(user),
    }),
  });
};

const patchFirestoreUserDocument = async (user: User, idToken?: string) => {
  const displayUserId = toDisplayUserId(user.id);
  const patchUrl = `${FIRESTORE_BASE_URL}/users/${encodeURIComponent(displayUserId)}?key=${FIREBASE_API_KEY}`;

  return fetch(patchUrl, {
    method: 'PATCH',
    headers: getFirestoreAuthHeaders(idToken),
    body: JSON.stringify({
      fields: toFirestoreUserFields(user),
    }),
  });
};

const upsertFirestoreUserDocument = async (user: User, idToken?: string) => {
  const patchRes = await patchFirestoreUserDocument(user, idToken);
  if (patchRes.ok) return;

  if (patchRes.status === 404 || patchRes.status === 400) {
    const createRes = await createFirestoreUserDocument(user, idToken);
    if (createRes.ok) return;
    const createBody = await createRes.json().catch(() => ({}));
    throw new Error(createBody?.error?.message || 'FIRESTORE_UPSERT_FAILED');
  }

  const patchBody = await patchRes.json().catch(() => ({}));
  throw new Error(patchBody?.error?.message || 'FIRESTORE_PATCH_FAILED');
};

const saveUserProfileBestEffort = async (user: User, idToken?: string) => {
  try {
    await upsertFirestoreUserDocument(user, idToken);
  } catch (error) {
    // Firebase Auth 가입은 이미 완료된 상태이므로 프로필 저장 실패는 회원가입 실패로 처리하지 않음.
  }
};

export const checkFirebaseUserIdAvailability = async (userId: string) => {
  const email = toFirebaseEmail(userId);

  // 1) 빠른 판별: createAuthUri
  const uriRes = await fetch(`${AUTH_BASE_URL}/accounts:createAuthUri?key=${FIREBASE_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identifier: email,
      continueUri: window.location.origin,
    }),
  });

  if (uriRes.ok) {
    const uriData = await uriRes.json().catch(() => ({}));
    const registered = uriData?.registered === true;
    const hasProviders = Array.isArray(uriData?.allProviders) && uriData.allProviders.length > 0;
    const hasSignInMethods = Array.isArray(uriData?.signinMethods) && uriData.signinMethods.length > 0;
    if (registered || hasProviders || hasSignInMethods) {
      return false;
    }
  }

  // 2) 확정 판별: 임시 가입 후 즉시 삭제(가입 가능 여부를 Auth에서 직접 확인)
  const probePassword = `__id_probe_${Date.now()}_${Math.random().toString(36).slice(2)}__`;
  const signUpRes = await fetch(`${AUTH_BASE_URL}/accounts:signUp?key=${FIREBASE_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password: probePassword,
      returnSecureToken: true,
    }),
  });

  const signUpData = await signUpRes.json().catch(() => ({}));
  if (!signUpRes.ok) {
    const code = signUpData?.error?.message;
    if (code === 'EMAIL_EXISTS') return false;
    throw new Error(parseFirebaseError(code));
  }

  const idToken = signUpData?.idToken as string | undefined;
  if (!idToken) {
    throw new Error('아이디 중복 확인에 실패했습니다.');
  }

  // 임시 생성 계정 정리
  let deleted = false;
  for (let i = 0; i < 3; i += 1) {
    const deleteRes = await fetch(`${AUTH_BASE_URL}/accounts:delete?key=${FIREBASE_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });
    if (deleteRes.ok) {
      deleted = true;
      break;
    }
  }

  if (!deleted) {
    throw new Error('아이디 확인 중 임시 계정 정리에 실패했습니다. 잠시 후 다시 시도해주세요.');
  }

  return true;
};

export const checkFirebaseUserIdExists = async (userId: string) => {
  const res = await fetch(`${AUTH_BASE_URL}/accounts:createAuthUri?key=${FIREBASE_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identifier: toFirebaseEmail(userId),
      continueUri: window.location.origin,
    }),
  });

  if (!res.ok) {
    throw new Error('Firebase 사용자 조회에 실패했습니다.');
  }

  const data = await res.json();
  return !!data?.registered || (Array.isArray(data?.allProviders) && data.allProviders.length > 0);
};

export const signUpWithFirebase = async (user: User, password: string) => {
  const displayUserId = toDisplayUserId(user.id);
  const authRes = await fetch(`${AUTH_BASE_URL}/accounts:signUp?key=${FIREBASE_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: toFirebaseEmail(displayUserId),
      password,
      returnSecureToken: true,
    }),
  });

  const authData = await authRes.json();
  if (!authRes.ok) {
    throw new Error(parseFirebaseError(authData?.error?.message));
  }

  const idToken = authData.idToken as string | undefined;
  if (!idToken) {
    throw new Error('회원가입 인증 토큰을 받지 못했습니다.');
  }

  // 회원가입의 기준은 Firebase Auth 성공으로 처리
  // Firestore 프로필 저장은 환경(규칙/미생성)에 따라 실패할 수 있어 보조 저장으로 처리
  await saveUserProfileBestEffort(user, idToken);

  // 과거 탈퇴 마커가 남아있으면 재가입 후 로그인 차단될 수 있어 정리
  await clearUserDeletedMarkerInFirebase(displayUserId, idToken);
};

export const updateUserLevelInFirebase = async (user: User, idToken?: string) => {
  try {
    await upsertFirestoreUserDocument(user, idToken);
    return true;
  } catch (error) {
    // Firestore 규칙/권한 이슈가 있어도 UI 동작은 막지 않도록 호출부에서 fallback 처리
    return false;
  }
};

export const fetchUsersFromFirebase = async (idToken?: string) => {
  try {
    const res = await fetch(`${FIRESTORE_BASE_URL}/users?key=${FIREBASE_API_KEY}`, {
      method: 'GET',
      headers: getFirestoreAuthHeaders(idToken),
    });
    if (!res.ok) return null;

    const data = await res.json();
    const documents = Array.isArray(data?.documents) ? data.documents : [];

    const users: User[] = documents.map((doc: any) => {
      const fields = doc?.fields || {};
      return {
        id: parseFirestoreString(fields.id),
        name: parseFirestoreString(fields.name),
        level: parseFirestoreUserLevel(fields.level),
        email: parseFirestoreString(fields.email),
        phone: parseFirestoreString(fields.phone),
        address: parseFirestoreString(fields.address),
        addressDetail: parseFirestoreString(fields.addressDetail),
        isUpgradeRequested: parseFirestoreBool(fields.isUpgradeRequested, false),
      };
    });

    return users.filter((user) => !!user.id);
  } catch (error) {
    return null;
  }
};

export const deleteUserProfileFromFirebase = async (userId: string, idToken?: string) => {
  try {
    const res = await fetch(`${FIRESTORE_BASE_URL}/users/${encodeURIComponent(toDisplayUserId(userId))}?key=${FIREBASE_API_KEY}`, {
      method: 'DELETE',
      headers: getFirestoreAuthHeaders(idToken),
    });
    return res.ok;
  } catch (error) {
    return false;
  }
};

export const markUserDeletedByAdminInFirebase = async (userId: string, adminId: string, idToken?: string) => {
  try {
    const fields = {
      userId: { stringValue: toDisplayUserId(userId) },
      deletedBy: { stringValue: toDisplayUserId(adminId) },
      deletedAt: { stringValue: new Date().toISOString() },
    };

    const res = await fetch(`${FIRESTORE_BASE_URL}/deletedUsers/${encodeURIComponent(toDisplayUserId(userId))}?key=${FIREBASE_API_KEY}`, {
      method: 'PATCH',
      headers: getFirestoreAuthHeaders(idToken),
      body: JSON.stringify({ fields }),
    });

    return res.ok;
  } catch (error) {
    return false;
  }
};

export const isUserMarkedDeletedInFirebase = async (userId: string, idToken?: string) => {
  try {
    const res = await fetch(`${FIRESTORE_BASE_URL}/deletedUsers/${encodeURIComponent(toDisplayUserId(userId))}?key=${FIREBASE_API_KEY}`, {
      method: 'GET',
      headers: getFirestoreAuthHeaders(idToken),
    });

    if (res.status === 404) return false;
    if (!res.ok) return false;

    const data = await res.json();
    return !!data?.name;
  } catch (error) {
    return false;
  }
};

export const clearUserDeletedMarkerInFirebase = async (userId: string, idToken?: string) => {
  try {
    const res = await fetch(`${FIRESTORE_BASE_URL}/deletedUsers/${encodeURIComponent(toDisplayUserId(userId))}?key=${FIREBASE_API_KEY}`, {
      method: 'DELETE',
      headers: getFirestoreAuthHeaders(idToken),
    });
    return res.ok || res.status === 404;
  } catch (error) {
    return false;
  }
};

interface SiteContentPayload {
  heroImageUrls: string[];
  logoUrl: string;
  introductionData: IntroductionData;
}

const toSiteContentFields = (payload: SiteContentPayload) => ({
  heroImageUrlsJson: { stringValue: JSON.stringify(payload.heroImageUrls || []) },
  logoUrl: { stringValue: payload.logoUrl || '' },
  introductionDataJson: { stringValue: JSON.stringify(payload.introductionData || {}) },
});

export const fetchSiteContentFromFirebase = async (): Promise<SiteContentPayload | null> => {
  try {
    const res = await fetch(`${FIRESTORE_BASE_URL}/settings/siteContent?key=${FIREBASE_API_KEY}`);
    if (!res.ok) return null;

    const data = await res.json();
    const fields = data?.fields || {};

    const heroImageUrlsJson = parseFirestoreString(fields.heroImageUrlsJson, '[]');
    const introductionDataJson = parseFirestoreString(fields.introductionDataJson, '{}');

    const heroImageUrlsParsed = JSON.parse(heroImageUrlsJson);
    const introductionDataParsed = JSON.parse(introductionDataJson);

    return {
      heroImageUrls: Array.isArray(heroImageUrlsParsed) ? heroImageUrlsParsed : [],
      logoUrl: parseFirestoreString(fields.logoUrl, ''),
      introductionData: (introductionDataParsed || {}) as IntroductionData,
    };
  } catch (error) {
    return null;
  }
};

export const upsertSiteContentInFirebase = async (payload: SiteContentPayload, idToken?: string) => {
  try {
    const res = await fetch(`${FIRESTORE_BASE_URL}/settings/siteContent?key=${FIREBASE_API_KEY}`, {
      method: 'PATCH',
      headers: getFirestoreAuthHeaders(idToken),
      body: JSON.stringify({ fields: toSiteContentFields(payload) }),
    });
    return res.ok;
  } catch (error) {
    return false;
  }
};

export const fetchUserProfileFromFirebase = async (userId: string, idToken?: string) => {
  try {
    const res = await fetch(`${FIRESTORE_BASE_URL}/users/${encodeURIComponent(toDisplayUserId(userId))}?key=${FIREBASE_API_KEY}`, {
      method: 'GET',
      headers: getFirestoreAuthHeaders(idToken),
    });

    if (!res.ok) return null;

    const data = await res.json();
    const fields = data?.fields || {};
    const user: User = {
      id: parseFirestoreString(fields.id, toDisplayUserId(userId)),
      name: parseFirestoreString(fields.name, toDisplayUserId(userId)),
      level: parseFirestoreUserLevel(fields.level),
      email: parseFirestoreString(fields.email),
      phone: parseFirestoreString(fields.phone),
      address: parseFirestoreString(fields.address),
      addressDetail: parseFirestoreString(fields.addressDetail),
      isUpgradeRequested: parseFirestoreBool(fields.isUpgradeRequested, false),
    };

    return user;
  } catch (error) {
    return null;
  }
};

export const signInWithFirebase = async (userId: string, password: string) => {
  const res = await fetch(`${AUTH_BASE_URL}/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: toFirebaseEmail(userId),
      password,
      returnSecureToken: true,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    const code = data?.error?.message || 'UNKNOWN';
    throw new FirebaseAuthError(code, parseFirebaseError(code));
  }

  return data;
};

export const isDeletedFromFirebaseAuth = async (userId: string) => {
  const probePassword = '__auth_existence_probe_invalid_password__';
  const res = await fetch(`${AUTH_BASE_URL}/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: toFirebaseEmail(userId),
      password: probePassword,
      returnSecureToken: true,
    }),
  });

  if (res.ok) return false;

  const data = await res.json().catch(() => ({}));
  const code = data?.error?.message;

  // 계정 삭제 시에만 명확히 true 처리 (그 외 오류는 안전하게 false)
  if (code === 'EMAIL_NOT_FOUND') return true;
  return false;
};

export const deleteFirebaseAccount = async (userId: string, password?: string) => {
  if (!password) return;

  const signInData = await signInWithFirebase(userId, password);
  const idToken = signInData?.idToken as string | undefined;
  if (!idToken) return;

  await fetch(`${AUTH_BASE_URL}/accounts:delete?key=${FIREBASE_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });
};

export const fetchBoardPostsFromFirebase = async () => {
  try {
    const res = await fetch(`${FIRESTORE_BASE_URL}/boardPosts?key=${FIREBASE_API_KEY}`);
    if (!res.ok) return null;

    const data = await res.json();
    const documents = Array.isArray(data?.documents) ? data.documents : [];

    const posts: BoardPost[] = documents.map((doc: any) => {
      const fields = doc?.fields || {};
      return {
        id: parseFirestoreInt(fields.id),
        tag: parseFirestoreString(fields.tag),
        tagType: (parseFirestoreString(fields.tagType, 'free') as BoardPost['tagType']),
        title: parseFirestoreString(fields.title),
        description: parseFirestoreString(fields.description),
        content: parseFirestoreString(fields.content),
        author: parseFirestoreString(fields.author),
        date: parseFirestoreString(fields.date),
        views: parseFirestoreInt(fields.views),
        comments: parseFirestoreInt(fields.comments),
        isNotice: parseFirestoreBool(fields.isNotice, false),
        images: parseFirestoreStringArray(fields.images),
      };
    });

    return posts
      .filter((post) => Number.isFinite(post.id) && post.id > 0 && post.title)
      .sort((a, b) => b.id - a.id);
  } catch (error) {
    return null;
  }
};

export const fetchNewsFromFirebase = async () => {
  try {
    const res = await fetch(`${FIRESTORE_BASE_URL}/news?key=${FIREBASE_API_KEY}`);
    if (!res.ok) return null;

    const data = await res.json();
    const documents = Array.isArray(data?.documents) ? data.documents : [];

    const newsArticles: NewsArticle[] = documents.map((doc: any) => {
      const fields = doc?.fields || {};
      return {
        id: parseFirestoreInt(fields.id),
        title: parseFirestoreString(fields.title),
        description: parseFirestoreString(fields.description),
        content: parseFirestoreString(fields.content),
        date: parseFirestoreString(fields.date),
        views: parseFirestoreInt(fields.views),
        isImportant: parseFirestoreBool(fields.isImportant, false),
        tags: parseFirestoreNewsTags(fields.tags),
        images: parseFirestoreStringArray(fields.images),
      };
    });

    return newsArticles
      .filter((article) => Number.isFinite(article.id) && article.id > 0 && article.title)
      .sort((a, b) => b.id - a.id);
  } catch (error) {
    return null;
  }
};

export const createNewsInFirebase = async (article: NewsArticle, idToken?: string) => {
  try {
    const res = await fetch(`${FIRESTORE_BASE_URL}/news?documentId=${encodeURIComponent(String(article.id))}&key=${FIREBASE_API_KEY}`, {
      method: 'POST',
      headers: getFirestoreAuthHeaders(idToken),
      body: JSON.stringify({ fields: toFirestoreNewsFields(article) }),
    });
    return res.ok;
  } catch (error) {
    return false;
  }
};

export const deleteNewsInFirebase = async (newsId: number, idToken?: string) => {
  try {
    const res = await fetch(`${FIRESTORE_BASE_URL}/news/${encodeURIComponent(String(newsId))}?key=${FIREBASE_API_KEY}`, {
      method: 'DELETE',
      headers: getFirestoreAuthHeaders(idToken),
    });
    return res.ok;
  } catch (error) {
    return false;
  }
};

export const createBoardPostInFirebase = async (post: BoardPost, idToken?: string) => {
  try {
    const res = await fetch(`${FIRESTORE_BASE_URL}/boardPosts?documentId=${encodeURIComponent(String(post.id))}&key=${FIREBASE_API_KEY}`, {
      method: 'POST',
      headers: getFirestoreAuthHeaders(idToken),
      body: JSON.stringify({ fields: toFirestoreBoardPostFields(post) }),
    });
    return res.ok;
  } catch (error) {
    return false;
  }
};

export const updateBoardPostInFirebase = async (post: BoardPost, idToken?: string) => {
  try {
    const res = await fetch(`${FIRESTORE_BASE_URL}/boardPosts/${encodeURIComponent(String(post.id))}?key=${FIREBASE_API_KEY}`, {
      method: 'PATCH',
      headers: getFirestoreAuthHeaders(idToken),
      body: JSON.stringify({ fields: toFirestoreBoardPostFields(post) }),
    });
    return res.ok;
  } catch (error) {
    return false;
  }
};

export const deleteBoardPostInFirebase = async (postId: number, idToken?: string) => {
  try {
    const res = await fetch(`${FIRESTORE_BASE_URL}/boardPosts/${encodeURIComponent(String(postId))}?key=${FIREBASE_API_KEY}`, {
      method: 'DELETE',
      headers: getFirestoreAuthHeaders(idToken),
    });
    return res.ok;
  } catch (error) {
    return false;
  }
};

export const fetchEventsFromFirebase = async () => {
  try {
    const res = await fetch(`${FIRESTORE_BASE_URL}/events?key=${FIREBASE_API_KEY}`);
    if (!res.ok) return null;

    const data = await res.json();
    const documents = Array.isArray(data?.documents) ? data.documents : [];

    const events: Event[] = documents.map((doc: any) => {
      const fields = doc?.fields || {};
      return {
        id: parseFirestoreInt(fields.id),
        status: parseFirestoreString(fields.status, 'recruiting') as Event['status'],
        categories: parseFirestoreEventCategories(fields.categories),
        isOnline: parseFirestoreBool(fields.isOnline, false),
        isRegularMeeting: parseFirestoreBool(fields.isRegularMeeting, false),
        title: parseFirestoreString(fields.title),
        description: parseFirestoreString(fields.description),
        date: parseFirestoreString(fields.date),
        time: parseFirestoreString(fields.time),
        location: parseFirestoreString(fields.location),
        participants: parseFirestoreInt(fields.participants),
        capacity: parseFirestoreInt(fields.capacity),
        price: parseFirestoreString(fields.price),
        recruitmentStartDate: parseFirestoreString(fields.recruitmentStartDate),
        recruitmentEndDate: parseFirestoreString(fields.recruitmentEndDate),
      };
    });

    return events
      .filter((event) => Number.isFinite(event.id) && event.id > 0 && event.title)
      .sort((a, b) => b.id - a.id);
  } catch (error) {
    return null;
  }
};

export const createEventInFirebase = async (event: Event, idToken?: string) => {
  try {
    const res = await fetch(`${FIRESTORE_BASE_URL}/events?documentId=${encodeURIComponent(String(event.id))}&key=${FIREBASE_API_KEY}`, {
      method: 'POST',
      headers: getFirestoreAuthHeaders(idToken),
      body: JSON.stringify({ fields: toFirestoreEventFields(event) }),
    });
    return res.ok;
  } catch (error) {
    return false;
  }
};

export const updateEventInFirebase = async (event: Event, idToken?: string) => {
  try {
    const res = await fetch(`${FIRESTORE_BASE_URL}/events/${encodeURIComponent(String(event.id))}?key=${FIREBASE_API_KEY}`, {
      method: 'PATCH',
      headers: getFirestoreAuthHeaders(idToken),
      body: JSON.stringify({ fields: toFirestoreEventFields(event) }),
    });
    return res.ok;
  } catch (error) {
    return false;
  }
};

export const deleteEventInFirebase = async (eventId: number, idToken?: string) => {
  try {
    const res = await fetch(`${FIRESTORE_BASE_URL}/events/${encodeURIComponent(String(eventId))}?key=${FIREBASE_API_KEY}`, {
      method: 'DELETE',
      headers: getFirestoreAuthHeaders(idToken),
    });
    return res.ok;
  } catch (error) {
    return false;
  }
};

export const fetchEventApplicationsFromFirebase = async (idToken?: string) => {
  try {
    const res = await fetch(`${FIRESTORE_BASE_URL}/eventApplications?key=${FIREBASE_API_KEY}`, {
      method: 'GET',
      headers: getFirestoreAuthHeaders(idToken),
    });
    if (!res.ok) return null;

    const data = await res.json();
    const documents = Array.isArray(data?.documents) ? data.documents : [];

    const applications: EventApplication[] = documents.map((doc: any) => {
      const fields = doc?.fields || {};
      return {
        id: parseFirestoreString(fields.id),
        eventId: parseFirestoreInt(fields.eventId),
        userId: parseFirestoreString(fields.userId),
        name: parseFirestoreString(fields.name),
        phone: parseFirestoreString(fields.phone),
        email: parseFirestoreString(fields.email),
        createdAt: parseFirestoreString(fields.createdAt),
      };
    });

    return applications
      .filter((application) => !!application.id && Number.isFinite(application.eventId) && application.eventId > 0)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch (error) {
    return null;
  }
};

export const createEventApplicationInFirebase = async (application: EventApplication, idToken?: string) => {
  try {
    const res = await fetch(`${FIRESTORE_BASE_URL}/eventApplications?documentId=${encodeURIComponent(application.id)}&key=${FIREBASE_API_KEY}`, {
      method: 'POST',
      headers: getFirestoreAuthHeaders(idToken),
      body: JSON.stringify({ fields: toFirestoreEventApplicationFields(application) }),
    });
    return res.ok;
  } catch (error) {
    return false;
  }
};

export const fetchPollsFromFirebase = async () => {
  try {
    const res = await fetch(`${FIRESTORE_BASE_URL}/polls?key=${FIREBASE_API_KEY}`);
    if (!res.ok) return null;

    const data = await res.json();
    const documents = Array.isArray(data?.documents) ? data.documents : [];

    const polls: Poll[] = documents.map((doc: any) => {
      const fields = doc?.fields || {};
      return {
        id: parseFirestoreInt(fields.id),
        title: parseFirestoreString(fields.title),
        description: parseFirestoreString(fields.description),
        options: parseFirestorePollOptions(fields.options),
        startDate: parseFirestoreString(fields.startDate),
        endDate: parseFirestoreString(fields.endDate),
        totalVotes: parseFirestoreInt(fields.totalVotes),
        hasVoted: parseFirestoreBool(fields.hasVoted, false),
        hasVotingRights: parseFirestoreBool(fields.hasVotingRights, false),
        votedUserIds: parseFirestoreStringArray(fields.votedUserIds),
      };
    });

    return polls
      .filter((poll) => Number.isFinite(poll.id) && poll.id > 0 && poll.title)
      .sort((a, b) => b.id - a.id);
  } catch (error) {
    return null;
  }
};

export const createPollInFirebase = async (poll: Poll, idToken?: string) => {
  try {
    const res = await fetch(`${FIRESTORE_BASE_URL}/polls?documentId=${encodeURIComponent(String(poll.id))}&key=${FIREBASE_API_KEY}`, {
      method: 'POST',
      headers: getFirestoreAuthHeaders(idToken),
      body: JSON.stringify({ fields: toFirestorePollFields(poll) }),
    });
    return res.ok;
  } catch (error) {
    return false;
  }
};

export const updatePollInFirebase = async (poll: Poll, idToken?: string) => {
  try {
    const res = await fetch(`${FIRESTORE_BASE_URL}/polls/${encodeURIComponent(String(poll.id))}?key=${FIREBASE_API_KEY}`, {
      method: 'PATCH',
      headers: getFirestoreAuthHeaders(idToken),
      body: JSON.stringify({ fields: toFirestorePollFields(poll) }),
    });
    return res.ok;
  } catch (error) {
    return false;
  }
};

export const deletePollInFirebase = async (pollId: number, idToken?: string) => {
  try {
    const res = await fetch(`${FIRESTORE_BASE_URL}/polls/${encodeURIComponent(String(pollId))}?key=${FIREBASE_API_KEY}`, {
      method: 'DELETE',
      headers: getFirestoreAuthHeaders(idToken),
    });
    return res.ok;
  } catch (error) {
    return false;
  }
};
