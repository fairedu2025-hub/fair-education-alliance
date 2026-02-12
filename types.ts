
export interface NewsArticle {
  id: number;
  tags: { text: string; style: 'red' | 'blue' | 'green' | 'orange' | 'gray' }[];
  title: string;
  description: string;
  content: string;
  date: string;
  views: number;
  isImportant?: boolean;
  images?: string[];
}

export interface BoardPost {
  id: number;
  tag: string;
  tagType: 'notice' | 'review' | 'free' | 'qna' | 'suggestion';
  title: string;
  description: string;
  content: string;
  author: string;
  date: string;
  views: number;
  comments: number;
  isNotice?: boolean;
  images?: string[];
}

export type EventStatus = 'recruiting' | 'closed' | 'finished';
export type EventCategory = '교육' | '토론' | '문화' | '자원봉사';

export interface Event {
  id: number;
  status: EventStatus;
  categories: EventCategory[];
  isOnline?: boolean;
  isRegularMeeting?: boolean;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  participants: number;
  capacity: number;
  price?: string;
  recruitmentStartDate?: string;
  recruitmentEndDate?: string;
}

export interface EventApplication {
  id: string;
  eventId: number;
  userId: string;
  name: string;
  phone: string;
  email: string;
  createdAt: string;
}

export type UserLevel = '정회원' | '일반회원' | '관리자';

export interface User {
  id: string;
  name: string;
  level: UserLevel;
  email?: string;
  phone?: string;
  address?: string;
  addressDetail?: string;
  isUpgradeRequested?: boolean; // 승급 요청 상태 추가
}

export interface HistoryItem {
  year: string;
  event: string;
}

export interface Executive {
    name: string;
    role: string;
    bio: string;
    photoUrl?: string;
}

export interface AchievementsData {
    educationPrograms: number;
    yearsOfActivity: string;
    graduates: number;
}

export interface PresidentData {
    name: string;
    greeting: string;
    photoUrl?: string;
}

export interface IntroductionData {
    achievements: AchievementsData;
    history: HistoryItem[];
    executives: Executive[];
    president: PresidentData;
}

export interface EventProposal {
  id: number;
  title: string;
  description: string;
  proposerName: string;
  votes: number;
  votedUserIds: string[];
}

export interface PollOption {
    id: string;
    text: string;
    votes: number;
}

export interface Poll {
    id: number;
    title: string;
    description: string;
    options: PollOption[];
    startDate: string;
    endDate: string;
    totalVotes: number;
    hasVoted: boolean;
    hasVotingRights: boolean;
    votedUserIds: string[]; // Added to track users who voted
}

export type Page = 
  'home' 
  | 'signup' 
  | 'introduction' 
  | 'news'
  | 'news-detail'
  | 'new-news-post'
  | 'board' 
  | 'board-detail'
  | 'events' 
  | 'online-voting'
  | 'donation' 
  | 'member' 
  | 'login' 
  | 'find-credentials' 
  | 'admin'
  | 'new-event'
  | 'event-detail'
  | 'new-board-post'
  | 'mypage'
  | 'edit-profile'
  | 'upgrade-member';
