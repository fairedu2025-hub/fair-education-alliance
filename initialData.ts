
import { User, NewsArticle, BoardPost, Event, EventProposal, Poll, IntroductionData } from './types';

export const initialUsers: User[] = [
    { id: 'admin', name: '관리자', level: '관리자', email: 'admin@example.com', phone: '010-0000-0000' },
];

export const initialNewsArticles: NewsArticle[] = [
  { id: 1, isImportant: true, tags: [{ text: '공지사항', style: 'red' }, { text: '중요', style: 'red' }], title: '2024년 하반기 정기총회 개최 안내', description: '오늘 11월 19일(금) 오후 7시, 인천시민회관에서 공정교육바른인천연합 2024년 하반기 정기총회가 개최됩니다. 모든 회원님들의 참석을 부탁드립니다.', date: '2024년 10월 25일', views: 245, content: '공정교육바른인천연합의 2024년 하반기 정기총회가 오는 11월 19일 금요일 오후 7시에 인천시민회관 대강당에서 개최될 예정입니다.\n\n이번 정기총회에서는 2024년도 활동 보고 및 결산, 2025년도 사업 계획 및 예산안 승인, 그리고 신규 임원 선출 등 중요한 안건들이 다뤄질 예정입니다. 회원 여러분의 소중한 의견이 단체의 미래를 결정하는 중요한 자리이오니, 부디 참석하시어 자리를 빛내주시길 바랍니다.\n\n참석이 어려우신 회원님들께서는 위임장을 통해 의결권을 행사하실 수 있으며, 관련 양식은 홈페이지 공지사항에서 다운로드 받으실 수 있습니다. 기타 문의사항은 사무국으로 연락 주시기 바랍니다.' },
  { id: 2, isImportant: true, tags: [{ text: '공지사항', style: 'red' }, { text: '중요', style: 'red' }], title: '11월 시민교육 세미나 일정 변경 안내', description: '11월로 예정되었던 시민교육 세미나가 11월 8일에서 11월 22일로 변경되었습니다. 참석 예정이신 회원님들께서는 참고 부탁드립니다.', date: '2024년 10월 8일', views: 98, content: '회원 여러분께 중요 안내 말씀드립니다.\n\n당초 11월 8일로 예정되어 있던 "디지털 시대의 시민 리더십" 주제의 11월 시민교육 세미나가 강사님의 긴급한 개인 사정으로 인해 부득이하게 11월 22일(금) 동일 시간으로 변경되었습니다.\n\n이미 참석 신청을 하신 회원님들께는 개별적으로 안내 문자를 발송해드렸습니다. 일정 변경으로 인해 불편을 드린 점 진심으로 사과드리며, 너그러운 양해 부탁드립니다. 변경된 일정에도 많은 관심과 참여를 기대합니다.' },
  { id: 3, tags: [{ text: '교육프로그램', style: 'blue' }], title: '시민교육 리더십 아카데미 4기 모집', description: '건강한 시민의식과 리더십 강화를 위한 시민교육 리더십 아카데미 4기 수강생을 모집합니다. 12주 과정으로 진행되며, 우수 수료생에게는 표창이 수여됩니다.', date: '2024년 10월 20일', views: 189, content: '지역 사회의 미래를 이끌어갈 리더를 양성하기 위한 "시민교육 리더십 아카데미" 4기 수강생을 모집합니다.\n\n본 과정은 민주주의의 원리, 비판적 사고, 공공 갈등 해결, 리더십 스피치 등 총 12주에 걸친 체계적인 커리큘럼으로 구성되어 있습니다. 각 분야 최고의 전문가들이 강사로 참여하여 깊이 있는 교육을 제공할 것입니다. 과정 수료 후에는 수료증이 발급되며, 우수 수료생에게는 인천시장상 표창의 기회가 주어집니다. 시민 리더로 성장하고 싶은 분들의 많은 지원 바랍니다.' },
  { id: 4, tags: [{ text: '언론보도', style: 'green' }], title: "인천일보 '시민교육의 중요성' 기사 게재", description: '인천일보에 공정교육바른인천연합의 시민교육 활동과 성과를 다룬 기사가 게재되었습니다. 지역사회의 큰 관심을 받고 있습니다.', date: '2024년 10월 18일', views: 156, content: '지난 10월 18일, 지역 대표 언론사인 인천일보에 우리 공정교육바른인천연합의 활동을 조명하는 기획 기사가 게재되었습니다.\n\n기사는 "깨어있는 시민, 건강한 인천을 만든다"라는 제목으로, 우리 단체가 지난 8년간 펼쳐온 다양한 시민교육 프로그램의 성과와 지역 사회에 미친 긍정적인 영향을 심도 있게 다루었습니다. 특히 청소년 시민교육 프로그램이 미래 세대의 민주적 가치관 형성에 기여하고 있다는 점을 높이 평가했습니다. 이번 언론 보도를 계기로 시민교육의 중요성에 대한 사회적 공감대가 더욱 확산되기를 기대합니다.' },
  { id: 5, tags: [{ text: '행사소식', style: 'orange' }], title: '제3회 인천 시민 토론회 성공적 개최', description: '지난 10월 12일 개최된 투명한 행정만들기를 위한 시민 토론회에 150여 명의 시민들이 참여하여 활발한 토론을 진행했습니다.', date: '2024년 10월 15일', views: 203, content: '지난 10월 12일, 인천시청 대회의실에서 "투명한 행정, 신뢰받는 인천"을 주제로 제3회 인천 시민 토론회가 성황리에 개최되었습니다.\n\n이번 토론회에는 150여 명의 시민, 전문가, 공무원들이 참여하여 인천시 행정의 투명성 강화를 위한 다양한 정책 제안과 아이디어를 나누었습니다. 특히 정보공개청구 활성화 방안과 시민참여예산제 확대에 대한 열띤 토론이 이어졌습니다. 이날 논의된 내용은 보고서로 정리하여 인천시와 시의회에 공식적으로 전달할 예정입니다. 참여해주신 모든 분들께 감사드립니다.' },
  { id: 6, tags: [{ text: '교육프로그램', style: 'blue' }], title: '청소년 시민교육 프로그램 참가자 모집', description: '미래의 시민 리더를 양성하기 위한 청소년 시민교육 프로그램 참가자를 모집합니다. 중·고등학생 대상으로 사전 진행됩니다.', date: '2024년 10월 10일', views: 134, content: '미래 사회의 주역인 청소년들의 건강한 시민의식 함양을 위한 "2024 청소년 시민교육 프로그램" 참가자를 모집합니다.\n\n이번 프로그램은 "우리가 만드는 민주주의"를 주제로, 모의 국회, 정책 제안 워크숍, 미디어 리터러시 교육 등 청소년들의 눈높이에 맞춘 체험 중심 활동으로 구성됩니다. 인천 지역 중·고등학생이라면 누구나 참여할 수 있으며, 참가비는 무료입니다. 미래의 시민 리더로 성장하고 싶은 청소년 여러분의 많은 참여를 기다립니다.' },
];

export const initialBoardPosts: BoardPost[] = [
  { id: 1, isNotice: true, tag: '공지사항', tagType: 'notice', title: '2024년 하반기 정기총회 관련 공지사항', description: '정기총회 개최일정과 안건에 대해 안내드립니다. 모든 회원님들의 적극적인 참여를 부탁드립니다.', author: '관리자', date: '2024년 10월 25일', views: 312, comments: 8, content: '회원 여러분께,\n\n2024년도 하반기 정기총회가 아래와 같이 개최될 예정이오니, 많은 참석 부탁드립니다.\n\n- 일시: 2024년 11월 19일 (금) 오후 7시\n- 장소: 인천시민회관 대강당\n\n주요 안건으로는 2024년 활동 결산 보고, 2025년 사업 계획 승인, 그리고 신규 임원 선출이 있습니다. 회원 여러분의 소중한 의견을 기다립니다.' },
  { id: 2, isNotice: true, tag: '공지사항', tagType: 'notice', title: '온라인 교육 플랫폼 이용 안내', description: '새로 구축된 온라인 교육 플랫폼 이용 방법에 대해 안내드립니다.', author: '관리자', date: '2024년 10월 19일', views: 245, comments: 4, content: '안녕하세요, 공정교육바른인천연합입니다.\n\n회원님들의 편의를 위해 온라인 교육 플랫폼을 새롭게 오픈했습니다. 이제 언제 어디서든 양질의 시민교육 콘텐츠를 학습하실 수 있습니다.\n\n플랫폼 주소: [온라인 플랫폼 주소 삽입]\n\n로그인 후 "내 강의실" 메뉴에서 수강 가능한 강좌를 확인해주세요. 이용 중 궁금한 점은 언제든지 문의게시판에 남겨주시기 바랍니다. 많은 이용 바랍니다.' },
  { id: 3, tag: '행사후기', tagType: 'review', title: '시민교육 프로그램 수강 후기', description: '지난 달 참여한 시민교육 리더십 아카데미 후기를 공유합니다. 정말 유익한 시간이었습니다.', author: '김지호', date: '2024년 10월 23일', views: 156, comments: 12, content: '지난 12주간 진행된 시민교육 리더십 아카데미에 참여했습니다. 처음에는 막연한 기대로 시작했지만, 매주 깊이 있는 강의와 열정적인 토론을 통해 시민으로서의 역할과 책임에 대해 다시 한번 생각해보는 계기가 되었습니다.\n\n특히 공공 갈등 해결 워크숍이 가장 기억에 남습니다. 이론으로만 배우던 것을 실제 사례에 적용해보니 훨씬 이해가 잘 되었고, 다른 분들과 의견을 나누며 시야를 넓힐 수 있었습니다. 좋은 프로그램을 만들어주신 연합 관계자분들께 감사드립니다. 다음 기수에도 많은 분들이 참여하셨으면 좋겠습니다.' },
  { id: 4, tag: '자유게시판', tagType: 'free', title: '신입회원 인사드립니다!', description: '안녕하세요! 이번에 새로 가입한 신입회원입니다. 앞으로 열심히 활동하겠습니다.', author: '이희정', date: '2024년 10월 22일', views: 89, comments: 15, content: '안녕하세요, 반갑습니다!\n\n이번에 공정교육바른인천연합에 새로 가입한 이희정이라고 합니다. 평소 교육 문제에 관심이 많았는데, 이렇게 좋은 단체에 함께하게 되어 정말 기쁩니다.\n\n아직 모르는 것이 많지만, 선배 회원님들께 많이 배우고 열심히 활동에 참여하며 성장하고 싶습니다. 앞으로 잘 부탁드립니다. 모두들 환절기 감기 조심하세요!' },
  { id: 5, tag: '질문&답변', tagType: 'qna', title: '교육 프로그램 참여 방법 문의', description: '시민교육 프로그램에 참여하고 싶은데 어떻게 신청하면 되나요? 자세한 절차를 알려주세요.', author: '박철수', date: '2024년 10월 21일', views: 134, comments: 6, content: '안녕하세요. 시민교육 프로그램에 참여하고 싶은데 신청 방법을 잘 모르겠습니다.\n\n홈페이지 [활동(행사)] 메뉴에서 원하는 프로그램을 찾았는데, "신청하기" 버튼이 보이지 않습니다. 혹시 신청 기간이 따로 정해져 있는 건가요? 아니면 다른 방법으로 신청해야 하나요? 자세한 절차를 알려주시면 감사하겠습니다.' },
];

export const initialEvents: Event[] = [
  { id: 1, status: 'recruiting', categories: ['교육'], title: '시민교육 리더십 아카데미 5기', description: '건전한 시민의식과 리더십 역량 강화를 위한 체계적인 교육 프로그램입니다...', date: '2024-11-15', time: '19:00', location: '인천시민회관 중강당', participants: 0, capacity: 50, recruitmentStartDate: '2024-10-20', recruitmentEndDate: '2024-11-10', isRegularMeeting: false },
  { id: 2, status: 'recruiting', categories: ['토론'], isOnline: true, title: '청년 정책 토론회: 인천의 미래를 말하다', description: '인천 지역 청년들이 직접 참여하여 청년 정책의 현황과 발전 방향을 논의하는 토론회입니다...', date: '2024-11-22', time: '14:00', location: '온라인 (Zoom)', participants: 0, capacity: 100, recruitmentStartDate: '2024-10-25', recruitmentEndDate: '2024-11-20', isRegularMeeting: false },
  { id: 3, status: 'recruiting', categories: ['문화'], title: '가을 독서 문화제', description: '회원들과 함께하는 가을 독서 문화제입니다. 다양한 도서와 강연이 준비되어 있습니다.', date: '2024-10-28', time: '14:00', location: '인천 중앙도서관', participants: 0, capacity: 40, recruitmentStartDate: '2024-09-20', recruitmentEndDate: '2024-10-15', isRegularMeeting: false },
];

export const initialEventProposals: EventProposal[] = [
  { id: 1, title: '청소년 코딩 교육 워크숍', description: '방학을 맞이한 청소년들을 대상으로 파이썬 기초 코딩 워크숍을 진행하여 IT 역량을 강화합니다.', proposerName: '운영국', votes: 0, votedUserIds: [] },
  { id: 2, title: '인천 역사 탐방 챌린지', description: '인천의 주요 역사적 장소를 방문하고 미션을 수행하는 챌린지를 통해 지역 역사에 대한 이해를 높입니다.', proposerName: '운영국', votes: 0, votedUserIds: [] },
  { id: 3, title: '다문화 가정과 함께하는 요리 교실', description: '다양한 국적의 주민들이 함께 모여 각국의 전통 음식을 만들고 나누며 문화 교류의 장을 마련합니다.', proposerName: '운영국', votes: 0, votedUserIds: [] },
];

export const initialPolls: Poll[] = [
    {
        id: 1,
        title: '2025년 정기총회 안건 상정 투표',
        description: '이번 정기총회에서 다룰 주요 안건들에 대한 회원님들의 의견을 미리 수렴합니다.',
        options: [
            { id: 'opt1', text: '정관 일부 개정의 건', votes: 0 },
            { id: 'opt2', text: '신규 임원 선출 방식 변경', votes: 0 },
            { id: 'opt3', text: '2026년 사업계획안 승인', votes: 0 },
        ],
        startDate: '2025-12-21 09:00', 
        endDate: '2025-12-31 18:00',
        totalVotes: 0,
        hasVoted: false,
        hasVotingRights: false,
        votedUserIds: []
    },
    {
        id: 2,
        title: '2024년 시민교육 프로그램 만족도 조사',
        description: '지난 1년간 진행된 시민교육 프로그램에 대한 회원님들의 만족도를 조사하여 내년 계획에 반영하고자 합니다.',
        options: [
            { id: 'p2_opt1', text: '매우 만족', votes: 0 },
            { id: 'p2_opt2', text: '만족', votes: 0 },
            { id: 'p2_opt3', text: '보통', votes: 0 },
            { id: 'p2_opt4', text: '불만족', votes: 0 },
        ],
        startDate: '2024-11-01 09:00',
        endDate: '2024-11-15 18:00',
        totalVotes: 0,
        hasVoted: false,
        hasVotingRights: false,
        votedUserIds: []
    }
];

export const initialIntroductionData: IntroductionData = {
    achievements: {
        educationPrograms: 27,
        yearsOfActivity: '8년',
        graduates: 1200,
    },
    history: [
        { year: '2017', event: '공정교육바른인천연합 설립' },
        { year: '2018', event: '첫 번째 시민교육 프로그램 런칭' },
        { year: '2019', event: '인천시와 교육 협력 MOU 체결' },
        { year: '2020', event: '온라인 교육 플랫폼 구축' },
        { year: '2021', event: '정회원 100명 돌파' },
        { year: '2022', event: '청소년 시민교육 프로그램 시작' },
        { year: '2023', event: '지역사회 봉사활동 확대' },
        { year: '2024', event: '디지털 시민교육 강화' }
    ],
    executives: [
        { name: '최명석', role: '이사장', bio: '시민 교육 전문가, 현 인천시 교육 정책 자문관' },
        { name: '이영희', role: '명예회장', bio: 'NGO 활동가, 시민사회단체 연대 경력 20년' },
        { name: '박철수', role: '사무국장', bio: '교육기획 전문가, 시민교육 프로그램 개발' },
        { name: '최은정', role: '홍보이사', bio: '언론인 출신, 시민소통 및 홍보 담당' },
        { name: '정광호', role: '교육이사', bio: '교육학 박사, 평생교육 전문가' },
        { name: '한소영', role: '총무이사', bio: '회사원, 재무관리 및 운영 총괄' }
    ],
    president: {
        name: '김지호',
        photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        greeting: `공정교육바른인천연합(공인연)을 찾아주신 여러분께 깊이 감사드립니다.
공인연은 흔들리는 인천 교육을 바로 세우고, 아이들의 미래를 지키기 위한 시민들의 뜻이 모여 출범한 연합체입니다.

교육은 어떠한 이념이나 정치의 도구가 되어서는 안 됩니다.
우리는 “학생·학부모·교사”를 중심에 두고, 공정하고 바른 교육 환경을 회복하는 데 힘쓰고 있습니다.

다가오는 2026년 인천시교육감 선거는 교육 정상화를 위한 중요한 전환점입니다.
공인연은 100여 개 시민사회단체와 함께 분열이 아닌 단일화, 갈등이 아닌 통합, 주장이 아닌 책임 있는 비전을 바탕으로
인천 교육을 이끌 보수 단일 후보를 공정하게 선정할 것입니다.

우리는 능력·도덕성·교육철학을 갖춘 후보를 투명한 절차로 시민께 추천드리며,
특정인의 이해가 아닌 인천 시민 전체의 교육적 가치를 최우선으로 두겠습니다.

공정교육바른인천연합은 선언합니다.
“인천 교육은 반드시 바뀌어야 합니다.”
그 변화는 공정성 회복, 확고한 가치, 그리고 흔들림 없는 원칙에서 시작됩니다.

시민 여러분의 참여와 지지는 인천 교육을 다시 바로 세우는 힘입니다.
공인연은 단일화의 성공을 넘어, “인천 교육 정상화의 새로운 시대” 를 열기 위해 끝까지 책임을 다하겠습니다.

감사합니다.`
    }
};

export const initialHeroImageUrls = [
  "https://picsum.photos/1920/1080?grayscale&blur=2&random=1",
  "https://picsum.photos/1920/1080?grayscale&blur=2&random=2",
  "https://picsum.photos/1920/1080?grayscale&blur=2&random=3",
];

export const DEFAULT_LOGO = '/logo.png';
