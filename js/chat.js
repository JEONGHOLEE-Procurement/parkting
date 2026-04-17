// ============================================
// 파크팅 (Parkting) - Chat Page
// ============================================

import { MOCK_USERS, PARKS } from './data.js';

const MOCK_MESSAGES = {
  1: [
    { from: 'system', text: '💕 매칭이 성사되었습니다! 대화를 시작해보세요.', time: '19:30' },
    { from: 'other', text: '안녕하세요! 보라매공원 러닝트랙에서 뵙겠습니다 🏃‍♀️', time: '19:31' },
    { from: 'me', text: '반갑습니다! 오늘 날씨가 좋은데 같이 달려볼까요?', time: '19:32' },
    { from: 'other', text: '좋아요! 6시에 트랙 입구에서 만나요 ☺️', time: '19:33' },
  ],
  3: [
    { from: 'system', text: '💕 매칭이 성사되었습니다!', time: '18:00' },
    { from: 'other', text: '올림픽공원에서 요가하시는 분이세요?', time: '18:05' },
    { from: 'me', text: '네! 요가 좋아하세요?', time: '18:06' },
    { from: 'other', text: '네~ 주말마다 평화의 광장에서 해요! 같이 해요 🧘‍♀️', time: '18:10' },
  ]
};

let currentChatUser = null;

function initChat(app) {
  renderChatList(app);
}

function renderChatList(app) {
  const container = document.getElementById('chat-list');
  if (!container) return;
  
  const matchedUsers = MOCK_USERS.filter(u => MOCK_MESSAGES[u.id]);
  
  container.innerHTML = matchedUsers.length ? matchedUsers.map(u => {
    const msgs = MOCK_MESSAGES[u.id];
    const lastMsg = msgs[msgs.length - 1];
    const spot = findSpot(u);
    return `
      <div class="chat-preview-item" data-user="${u.id}" style="display:flex; align-items:center; gap:var(--spacing-md); padding:var(--spacing-md); border-radius:var(--radius-lg); cursor:pointer; transition:var(--transition-fast);">
        <div class="avatar" style="position:relative;">
          ${u.emoji}
          ${u.online ? '<div style="position:absolute;bottom:1px;right:1px;width:10px;height:10px;background:var(--accent-green);border:2px solid var(--bg-primary);border-radius:50%;"></div>' : ''}
        </div>
        <div style="flex:1; min-width:0;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-weight:600; font-size:0.95rem;">${u.name}, ${u.age}</span>
            <span style="font-size:0.7rem; color:var(--text-muted);">${lastMsg.time}</span>
          </div>
          <div style="font-size:0.8rem; color:var(--text-secondary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
            ${lastMsg.from === 'me' ? '나: ' : ''}${lastMsg.text}
          </div>
          <div style="font-size:0.65rem; color:var(--text-muted); margin-top:2px;">📍 ${spot || '서울'}</div>
        </div>
      </div>
    `;
  }).join('') : `
    <div style="text-align:center; padding:var(--spacing-4xl) var(--spacing-lg);">
      <div style="font-size:3rem; margin-bottom:var(--spacing-md);">💬</div>
      <h4 style="margin-bottom:var(--spacing-sm);">아직 채팅이 없어요</h4>
      <p style="font-size:0.85rem; color:var(--text-secondary);">매칭 페이지에서 좋아요를 보내보세요!</p>
      <button class="btn btn-primary btn-sm" data-page="profile" style="margin-top:var(--spacing-md);">💕 매칭하러 가기</button>
    </div>
  `;
  
  // Click handlers
  container.querySelectorAll('.chat-preview-item').forEach(item => {
    item.addEventListener('click', () => {
      const user = MOCK_USERS.find(u => u.id === parseInt(item.dataset.user));
      if (user) openChatRoom(user, app);
    });
    item.addEventListener('mouseenter', () => { item.style.background = 'var(--bg-glass)'; });
    item.addEventListener('mouseleave', () => { item.style.background = 'none'; });
  });
  
  container.querySelectorAll('[data-page]').forEach(btn => {
    btn.addEventListener('click', () => app.navigateTo(btn.dataset.page));
  });
}

function openChatRoom(user, app) {
  currentChatUser = user;
  const chatView = document.getElementById('chat-view');
  const chatListView = document.getElementById('chat-list-view');
  if (!chatView || !chatListView) return;
  
  chatListView.style.display = 'none';
  chatView.style.display = 'flex';
  
  const msgs = MOCK_MESSAGES[user.id] || [];
  const spot = findSpot(user);
  
  document.getElementById('chat-header-content').innerHTML = `
    <button id="chat-back-btn" style="background:none; color:var(--text-primary); font-size:1.2rem; padding:var(--spacing-sm);">←</button>
    <div class="avatar" style="width:36px; height:36px; font-size:1rem;">${user.emoji}</div>
    <div style="flex:1;">
      <div style="font-weight:600; font-size:0.9rem;">${user.name}, ${user.age}</div>
      <div style="font-size:0.65rem; color:var(--accent-green);">${user.online ? '접속중' : '오프라인'} · ${spot || '서울'}</div>
    </div>
  `;
  
  const messagesEl = document.getElementById('chat-messages');
  messagesEl.innerHTML = msgs.map(m => {
    if (m.from === 'system') {
      return `<div style="text-align:center; margin:var(--spacing-md) 0;">
        <span style="font-size:0.7rem; color:var(--text-muted); background:var(--bg-glass); padding:4px 12px; border-radius:var(--radius-pill);">${m.text}</span>
      </div>`;
    }
    const isMe = m.from === 'me';
    return `
      <div style="display:flex; justify-content:${isMe ? 'flex-end' : 'flex-start'}; margin-bottom:var(--spacing-sm);">
        ${!isMe ? `<div class="avatar" style="width:30px;height:30px;font-size:0.8rem;margin-right:8px;flex-shrink:0;">${user.emoji}</div>` : ''}
        <div style="max-width:75%;">
          <div style="padding:10px 14px; border-radius:${isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px'}; background:${isMe ? 'var(--gradient-primary)' : 'var(--bg-glass)'}; font-size:0.9rem; line-height:1.5;">
            ${m.text}
          </div>
          <div style="font-size:0.6rem; color:var(--text-muted); margin-top:2px; text-align:${isMe ? 'right' : 'left'};">${m.time}</div>
        </div>
      </div>
    `;
  }).join('');
  messagesEl.scrollTop = messagesEl.scrollHeight;
  
  // Back button
  document.getElementById('chat-back-btn')?.addEventListener('click', () => {
    chatView.style.display = 'none';
    chatListView.style.display = 'block';
  });
  
  // Send message
  const sendBtn = document.getElementById('chat-send-btn');
  const inputEl = document.getElementById('chat-input');
  
  const sendMessage = () => {
    const text = inputEl.value.trim();
    if (!text) return;
    
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`;
    
    messagesEl.innerHTML += `
      <div style="display:flex; justify-content:flex-end; margin-bottom:var(--spacing-sm); animation:fadeInUp 0.3s ease;">
        <div style="max-width:75%;">
          <div style="padding:10px 14px; border-radius:16px 16px 4px 16px; background:var(--gradient-primary); font-size:0.9rem; line-height:1.5;">
            ${text}
          </div>
          <div style="font-size:0.6rem; color:var(--text-muted); margin-top:2px; text-align:right;">${time}</div>
        </div>
      </div>
    `;
    inputEl.value = '';
    messagesEl.scrollTop = messagesEl.scrollHeight;
    
    // Auto reply
    setTimeout(() => {
      const replies = ['좋은 생각이에요! 😊', '저도 그렇게 생각해요~', '내일 만나요! 🌳', '기대되네요 ✨', '꼭이요! 💕'];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      messagesEl.innerHTML += `
        <div style="display:flex; justify-content:flex-start; margin-bottom:var(--spacing-sm); animation:fadeInUp 0.3s ease;">
          <div class="avatar" style="width:30px;height:30px;font-size:0.8rem;margin-right:8px;flex-shrink:0;">${user.emoji}</div>
          <div style="max-width:75%;">
            <div style="padding:10px 14px; border-radius:16px 16px 16px 4px; background:var(--bg-glass); font-size:0.9rem; line-height:1.5;">${reply}</div>
            <div style="font-size:0.6rem; color:var(--text-muted); margin-top:2px;">${time}</div>
          </div>
        </div>
      `;
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }, 1500);
  };
  
  sendBtn?.removeEventListener('click', sendMessage);
  sendBtn?.addEventListener('click', sendMessage);
  inputEl?.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });
}

function findSpot(user) {
  for (const park of PARKS) {
    const spot = park.spots.find(s => s.id === user.location);
    if (spot) return `${park.name} · ${spot.name}`;
  }
  return null;
}

export { initChat };
