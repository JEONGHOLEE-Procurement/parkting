// ============================================
// 파크팅 (Parkting) - Mock Data
// ============================================

const PARKS = [
  {
    id: 'boramae',
    name: '보라매공원',
    nameEn: 'Boramae Park',
    lat: 37.4923,
    lng: 126.9219,
    address: '서울 동작구 여의대방로20길 33',
    description: '도심 속 자연을 만나는 곳, 보라매공원에서 새로운 인연을 만들어보세요',
    activeUsers: 47,
    spots: [
      { id: 'boramae-track', name: '달리기 트랙', icon: '🏃', lat: 37.4930, lng: 126.9225, radius: 150, activeUsers: 12, description: '함께 달리며 자연스럽게 대화해요', type: 'sports' },
      { id: 'boramae-lake', name: '호수 광장', icon: '🌊', lat: 37.4918, lng: 126.9210, radius: 100, activeUsers: 8, description: '호수를 바라보며 여유로운 시간을', type: 'chill' },
      { id: 'boramae-garden', name: '장미원', icon: '🌹', lat: 37.4915, lng: 126.9230, radius: 80, activeUsers: 15, description: '꽃향기 가득한 로맨틱 스팟', type: 'romantic' },
      { id: 'boramae-playground', name: '잔디광장', icon: '🌿', lat: 37.4925, lng: 126.9200, radius: 120, activeUsers: 12, description: '피크닉하며 새 친구 만나기', type: 'social' }
    ]
  },
  {
    id: 'olympic',
    name: '올림픽공원',
    nameEn: 'Olympic Park',
    lat: 37.5209,
    lng: 127.1216,
    address: '서울 송파구 올림픽로 424',
    description: '서울의 대표 공원에서 특별한 만남을',
    activeUsers: 82,
    spots: [
      { id: 'olympic-peace', name: '평화의 광장', icon: '🕊️', lat: 37.5200, lng: 127.1200, radius: 200, activeUsers: 25, description: '넓은 광장에서 다양한 사람들과', type: 'social' },
      { id: 'olympic-lake', name: '몽촌해자', icon: '🏞️', lat: 37.5215, lng: 127.1230, radius: 150, activeUsers: 18, description: '물가에서 산책하며 대화해요', type: 'chill' },
      { id: 'olympic-art', name: '조각공원', icon: '🗿', lat: 37.5190, lng: 127.1210, radius: 100, activeUsers: 10, description: '예술과 함께하는 문화 교류', type: 'culture' },
      { id: 'olympic-bike', name: '자전거 도로', icon: '🚴', lat: 37.5225, lng: 127.1190, radius: 180, activeUsers: 29, description: '함께 라이딩하며 이야기해요', type: 'sports' }
    ]
  },
  {
    id: 'hangang',
    name: '여의도 한강공원',
    nameEn: 'Yeouido Hangang Park',
    lat: 37.5284,
    lng: 126.9326,
    address: '서울 영등포구 여의동로 330',
    description: '한강 야경과 함께하는 로맨틱 만남',
    activeUsers: 124,
    spots: [
      { id: 'hangang-sunset', name: '선셋 포인트', icon: '🌅', lat: 37.5290, lng: 126.9340, radius: 120, activeUsers: 35, description: '일몰을 함께 보며 감성 충전', type: 'romantic' },
      { id: 'hangang-picnic', name: '피크닉존', icon: '🧺', lat: 37.5280, lng: 126.9310, radius: 200, activeUsers: 42, description: '치맥하며 자연스러운 만남을', type: 'social' },
      { id: 'hangang-bike', name: '자전거 대여소', icon: '🚲', lat: 37.5275, lng: 126.9350, radius: 100, activeUsers: 20, description: '함께 달리는 한강 라이딩', type: 'sports' },
      { id: 'hangang-stage', name: '물빛 무대', icon: '🎵', lat: 37.5295, lng: 126.9300, radius: 150, activeUsers: 27, description: '버스킹과 함께하는 즐거운 시간', type: 'culture' }
    ]
  },
  {
    id: 'seoul-forest',
    name: '서울숲',
    nameEn: 'Seoul Forest',
    lat: 37.5443,
    lng: 127.0374,
    address: '서울 성동구 뚝섬로 273',
    description: '숲속에서 만나는 자연스러운 인연',
    activeUsers: 63,
    spots: [
      { id: 'forest-deer', name: '사슴방사장', icon: '🦌', lat: 37.5450, lng: 127.0380, radius: 100, activeUsers: 18, description: '귀여운 사슴과 함께하는 힐링', type: 'chill' },
      { id: 'forest-butterfly', name: '나비정원', icon: '🦋', lat: 37.5438, lng: 127.0365, radius: 80, activeUsers: 12, description: '아름다운 나비와 함께하는 산책', type: 'romantic' },
      { id: 'forest-community', name: '커뮤니티센터', icon: '🏠', lat: 37.5445, lng: 127.0390, radius: 120, activeUsers: 22, description: '다양한 문화 프로그램 참여', type: 'culture' },
      { id: 'forest-field', name: '잔디밭', icon: '⛺', lat: 37.5440, lng: 127.0370, radius: 150, activeUsers: 11, description: '넓은 잔디에서 자유로운 활동', type: 'social' }
    ]
  }
];

const MOCK_USERS = [
  { id: 1, name: '지민', age: 25, gender: 'F', emoji: '👩', interests: ['러닝', '카페탐방', '사진'], bio: '달리기를 좋아하는 활발한 성격! 같이 뛸 러닝메이트 구해요 🏃‍♀️', location: 'boramae-track', online: true },
  { id: 2, name: '현우', age: 27, gender: 'M', emoji: '👨', interests: ['자전거', '음악', '맥주'], bio: '한강 자전거 타고 치맥하는 게 최고의 주말이에요 🍻', location: 'hangang-bike', online: true },
  { id: 3, name: '수빈', age: 23, gender: 'F', emoji: '👧', interests: ['요가', '독서', '피크닉'], bio: '공원에서 요가하고 책 읽는 걸 좋아해요 📚', location: 'olympic-peace', online: true },
  { id: 4, name: '도윤', age: 26, gender: 'M', emoji: '🧑', interests: ['스케이트보드', '사진', '커피'], bio: '스케이트보드 타는 거 구경하러 오세요 🛹', location: 'olympic-art', online: true },
  { id: 5, name: '예린', age: 24, gender: 'F', emoji: '👩‍🦰', interests: ['그림', '산책', '카페'], bio: '공원에서 그림 그리는 게 취미예요 🎨', location: 'forest-butterfly', online: false },
  { id: 6, name: '재현', age: 28, gender: 'M', emoji: '👨‍🦱', interests: ['러닝', '헬스', '영화'], bio: '주3회 보라매공원 러닝합니다! 같이 뛰실 분?', location: 'boramae-track', online: true },
  { id: 7, name: '하은', age: 22, gender: 'F', emoji: '👩‍🦳', interests: ['버스킹', '노래', '댄스'], bio: '한강에서 버스킹 듣는 걸 좋아해요 🎤', location: 'hangang-stage', online: true },
  { id: 8, name: '시우', age: 29, gender: 'M', emoji: '🧔', interests: ['캠핑', '바베큐', '등산'], bio: '주말마다 공원에서 피크닉해요! 같이해요 🏕️', location: 'hangang-picnic', online: true },
  { id: 9, name: '은지', age: 25, gender: 'F', emoji: '👩‍🎤', interests: ['댄스', '요가', '맛집'], bio: '서울숲에서 요가 같이 하실 분! 🧘‍♀️', location: 'forest-field', online: false },
  { id: 10, name: '준호', age: 26, gender: 'M', emoji: '👨‍🎓', interests: ['독서', '토론', '커피'], bio: '커뮤니티센터 독서모임 만들고 싶어요 📖', location: 'forest-community', online: true },
  { id: 11, name: '소희', age: 24, gender: 'F', emoji: '👩‍💼', interests: ['사진', '여행', '카페'], bio: '예쁜 풍경을 담는 사진작가 지망생이에요 📷', location: 'boramae-garden', online: true },
  { id: 12, name: '민재', age: 27, gender: 'M', emoji: '👨‍💻', interests: ['코딩', '게임', '산책'], bio: '개발자인데 가끔 공원에서 바람 쐬러 옵니다 💻', location: 'olympic-lake', online: true }
];

const EVENTS = [
  { id: 1, title: '보라매 선셋 러닝 크루', park: 'boramae', spot: 'boramae-track', date: '2026-04-19', time: '18:00', description: '매주 토요일 저녁, 보라매공원 달리기 트랙에서 함께 달려요! 초보자도 환영합니다.', participants: 23, maxParticipants: 40, tags: ['러닝', '운동', '소셜'], image: '🏃' },
  { id: 2, title: '한강 피크닉 & 와인파티', park: 'hangang', spot: 'hangang-picnic', date: '2026-04-20', time: '16:00', description: '여의도 한강공원에서 와인 한 잔과 함께 새로운 친구를 만들어보세요.', participants: 38, maxParticipants: 50, tags: ['와인', '피크닉', '소셜'], image: '🧺' },
  { id: 3, title: '서울숲 요가 모닝', park: 'seoul-forest', spot: 'forest-field', date: '2026-04-21', time: '08:00', description: '아침 공기를 마시며 서울숲에서 함께 요가해요. 매트 지참!', participants: 15, maxParticipants: 25, tags: ['요가', '힐링', '아침'], image: '🧘' },
  { id: 4, title: '올림픽공원 버스킹 나이트', park: 'olympic', spot: 'olympic-peace', date: '2026-04-22', time: '19:00', description: '평화의 광장에서 펼쳐지는 오픈 버스킹! 관객도, 참여자도 모두 환영!', participants: 56, maxParticipants: 100, tags: ['음악', '버스킹', '문화'], image: '🎵' },
  { id: 5, title: '보라매 장미원 포토워크', park: 'boramae', spot: 'boramae-garden', date: '2026-04-23', time: '14:00', description: '장미가 만개하는 보라매공원에서 사진가들과 함께 포토워크!', participants: 18, maxParticipants: 30, tags: ['사진', '산책', '꽃'], image: '📸' },
  { id: 6, title: '한강 선셋 자전거 라이딩', park: 'hangang', spot: 'hangang-bike', date: '2026-04-24', time: '17:30', description: '석양과 함께 한강을 달리는 자전거 라이딩! 대여 자전거 이용 가능.', participants: 31, maxParticipants: 40, tags: ['자전거', '라이딩', '선셋'], image: '🚴' },
  { id: 7, title: '동작구 벚꽃 축제 MZ 파티', park: 'boramae', spot: 'boramae-playground', date: '2026-04-25', time: '15:00', description: 'MZ세대를 위한 특별한 벚꽃 축제! DJ 파티, 포토부스, 푸드트럭까지!', participants: 89, maxParticipants: 200, tags: ['축제', 'MZ', '파티'], image: '🌸' },
  { id: 8, title: '서울숲 독서모임', park: 'seoul-forest', spot: 'forest-community', date: '2026-04-26', time: '10:00', description: '나무 그늘 아래서 함께 책을 읽고 이야기를 나눠요.', participants: 8, maxParticipants: 15, tags: ['독서', '토론', '문화'], image: '📚' }
];

const SPOT_TYPES = {
  sports: { label: '스포츠', color: '#2AF598', icon: '🏅' },
  chill: { label: '힐링', color: '#7B61FF', icon: '🍃' },
  romantic: { label: '로맨틱', color: '#FF6B9D', icon: '💕' },
  social: { label: '소셜', color: '#FF8E53', icon: '🤝' },
  culture: { label: '문화', color: '#FEE140', icon: '🎨' }
};

export { PARKS, MOCK_USERS, EVENTS, SPOT_TYPES };
