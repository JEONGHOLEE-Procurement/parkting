// ============================================
// 파크팅 (Parkting) - Events Page
// ============================================

import { EVENTS, PARKS, SPOT_TYPES } from './data.js';

function initEvents(app) {
  renderEventFilters();
  renderEvents('all');
  setupEventFilters();
  setupEventModal(app);
}

function renderEventFilters() {
  const container = document.getElementById('event-filters');
  if (!container) return;
  const parks = [{ id: 'all', name: '전체' }, ...PARKS.map(p => ({ id: p.id, name: p.name }))];
  container.innerHTML = parks.map(p => `
    <button class="park-chip ${p.id === 'all' ? 'active' : ''}" data-filter="${p.id}">${p.name}</button>
  `).join('');
}

function renderEvents(filter) {
  const container = document.getElementById('events-list');
  if (!container) return;
  
  const filtered = filter === 'all' ? EVENTS : EVENTS.filter(e => e.park === filter);
  
  container.innerHTML = filtered.map(event => {
    const d = new Date(event.date);
    const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    const park = PARKS.find(p => p.id === event.park);
    const progress = Math.round((event.participants / event.maxParticipants) * 100);
    
    return `
      <div class="event-card" data-event="${event.id}">
        <div class="event-card-date">
          <span class="event-card-date-month">${months[d.getMonth()]}</span>
          <span class="event-card-date-day">${d.getDate()}</span>
        </div>
        <div class="event-card-info">
          <div class="event-card-title">${event.image} ${event.title}</div>
          <div class="event-card-meta">
            <span>📍 ${park ? park.name : ''}</span>
            <span>🕐 ${event.time}</span>
            <span>👥 ${event.participants}/${event.maxParticipants}</span>
          </div>
          <div style="margin-top:8px; display:flex; gap:4px; flex-wrap:wrap;">
            ${event.tags.map(t => `<span class="tag tag-purple">${t}</span>`).join('')}
          </div>
          <div style="margin-top:8px; background:rgba(255,255,255,0.1); border-radius:999px; height:4px; overflow:hidden;">
            <div style="background:var(--gradient-primary); height:100%; width:${progress}%; border-radius:999px; transition:width 0.5s ease;"></div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function setupEventFilters() {
  document.getElementById('event-filters')?.addEventListener('click', (e) => {
    const chip = e.target.closest('.park-chip');
    if (!chip) return;
    document.querySelectorAll('#event-filters .park-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    renderEvents(chip.dataset.filter);
  });
}

function setupEventModal(app) {
  document.getElementById('events-list')?.addEventListener('click', (e) => {
    const card = e.target.closest('.event-card');
    if (!card) return;
    const event = EVENTS.find(ev => ev.id === parseInt(card.dataset.event));
    if (!event) return;
    
    const park = PARKS.find(p => p.id === event.park);
    const spot = park?.spots.find(s => s.id === event.spot);
    const progress = Math.round((event.participants / event.maxParticipants) * 100);
    
    const overlay = document.getElementById('event-modal');
    overlay.innerHTML = `
      <div class="modal">
        <button class="modal-close" id="close-event-modal">✕</button>
        <div style="text-align:center; margin-bottom:var(--spacing-xl);">
          <div style="font-size:4rem; margin-bottom:var(--spacing-sm);">${event.image}</div>
          <h3>${event.title}</h3>
        </div>
        <div style="display:flex; gap:var(--spacing-md); margin-bottom:var(--spacing-lg);">
          <div class="card" style="flex:1; text-align:center; padding:var(--spacing-md);">
            <div style="font-size:0.7rem; color:var(--text-muted);">날짜</div>
            <div style="font-weight:700;">${event.date}</div>
          </div>
          <div class="card" style="flex:1; text-align:center; padding:var(--spacing-md);">
            <div style="font-size:0.7rem; color:var(--text-muted);">시간</div>
            <div style="font-weight:700;">${event.time}</div>
          </div>
        </div>
        <p style="color:var(--text-secondary); font-size:0.9rem; margin-bottom:var(--spacing-lg);">${event.description}</p>
        <div style="margin-bottom:var(--spacing-md);">
          <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-bottom:4px;">
            <span>참가자</span>
            <span>${event.participants} / ${event.maxParticipants}명</span>
          </div>
          <div style="background:rgba(255,255,255,0.1); border-radius:999px; height:6px; overflow:hidden;">
            <div style="background:var(--gradient-primary); height:100%; width:${progress}%; border-radius:999px;"></div>
          </div>
        </div>
        ${spot ? `<p style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:var(--spacing-lg);">📍 ${park.name} · ${spot.icon} ${spot.name}</p>` : ''}
        <div style="display:flex; gap:var(--spacing-sm);">
          <button class="btn btn-primary" style="flex:1;" id="join-event-btn">참가 신청하기</button>
          <button class="kakao-btn" style="flex:1; justify-content:center;" id="event-kakao-btn">💬 채팅 참여</button>
        </div>
      </div>
    `;
    overlay.classList.add('active');
    
    document.getElementById('close-event-modal').addEventListener('click', () => overlay.classList.remove('active'));
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('active'); });
    document.getElementById('join-event-btn').addEventListener('click', () => {
      app.showToast(`'${event.title}' 이벤트에 참가 신청했습니다!`, '🎉');
      overlay.classList.remove('active');
    });
    document.getElementById('event-kakao-btn').addEventListener('click', () => {
      app.showToast('이벤트 오픈채팅방이 생성되었습니다!', '💛');
      overlay.classList.remove('active');
    });
  });
}

export { initEvents };
