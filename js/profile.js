// ============================================
// 파크팅 (Parkting) - Profile & Matching
// ============================================

import { MOCK_USERS, PARKS } from './data.js';

let currentCardIndex = 0;
let cardStack = [];

function initProfile(app) {
  cardStack = [...MOCK_USERS].sort(() => Math.random() - 0.5);
  currentCardIndex = 0;
  renderCurrentCard();
  setupSwipeActions(app);
  renderNearbyUsers();
}

function renderCurrentCard() {
  const container = document.getElementById('card-stack');
  if (!container) return;
  
  if (currentCardIndex >= cardStack.length) {
    container.innerHTML = `
      <div style="text-align:center; padding:var(--spacing-4xl) var(--spacing-lg);">
        <div style="font-size:4rem; margin-bottom:var(--spacing-lg);">🎉</div>
        <h3 style="margin-bottom:var(--spacing-sm);">오늘의 매칭을 모두 확인했어요!</h3>
        <p style="color:var(--text-secondary);">내일 새로운 사람들을 만나보세요</p>
      </div>
    `;
    return;
  }
  
  // Show 2 cards (current + next)
  const cards = [];
  for (let i = Math.min(currentCardIndex + 1, cardStack.length - 1); i >= currentCardIndex; i--) {
    const user = cardStack[i];
    const spot = findSpotForUser(user);
    const isCurrent = i === currentCardIndex;
    const colors = ['#FF6B9D', '#C44FE2', '#7B61FF', '#2AF598', '#FF8E53', '#FEE140'];
    const bgColor = colors[user.id % colors.length];
    
    cards.push(`
      <div class="profile-card ${isCurrent ? 'current' : 'next'}" 
           id="${isCurrent ? 'current-card' : ''}"
           style="position:absolute; ${!isCurrent ? 'transform:scale(0.95); opacity:0.7;' : ''}">
        <div class="profile-card-img" style="background: linear-gradient(135deg, ${bgColor}40, ${bgColor}10); display:flex; align-items:center; justify-content:center;">
          <span style="font-size: 8rem;">${user.emoji}</span>
        </div>
        <div class="profile-card-stamp like">LIKE</div>
        <div class="profile-card-stamp nope">NOPE</div>
        <div class="profile-card-overlay">
          <div class="profile-card-name">
            ${user.name} <span class="profile-card-age">${user.age}</span>
          </div>
          <div class="profile-card-location">
            📍 ${spot ? spot.parkName + ' · ' + spot.spotName : '서울'}
            ${user.online ? '<span class="participant-dot"></span>' : ''}
          </div>
          <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:var(--spacing-sm);">${user.bio}</p>
          <div class="profile-card-tags">
            ${user.interests.map((tag, idx) => {
              const tagClasses = ['tag-pink', 'tag-purple', 'tag-blue', 'tag-green', 'tag-yellow'];
              return `<span class="tag ${tagClasses[idx % tagClasses.length]}">${tag}</span>`;
            }).join('')}
          </div>
        </div>
      </div>
    `);
  }
  
  container.innerHTML = `
    <div style="position:relative; width:340px; height:480px; margin:0 auto;">
      ${cards.join('')}
    </div>
  `;
  
  // Setup swipe gesture on current card
  const currentCard = document.getElementById('current-card');
  if (currentCard) setupSwipeGesture(currentCard, app);
}

function findSpotForUser(user) {
  for (const park of PARKS) {
    const spot = park.spots.find(s => s.id === user.location);
    if (spot) return { parkName: park.name, spotName: spot.name };
  }
  return null;
}

function setupSwipeGesture(card, app) {
  let startX = 0, currentX = 0, isDragging = false;
  
  const onStart = (e) => {
    isDragging = true;
    startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    card.style.transition = 'none';
  };
  
  const onMove = (e) => {
    if (!isDragging) return;
    currentX = (e.type.includes('mouse') ? e.clientX : e.touches[0].clientX) - startX;
    card.style.transform = `translateX(${currentX}px) rotate(${currentX * 0.05}deg)`;
    
    if (currentX > 50) {
      card.classList.add('swiping-right');
      card.classList.remove('swiping-left');
    } else if (currentX < -50) {
      card.classList.add('swiping-left');
      card.classList.remove('swiping-right');
    } else {
      card.classList.remove('swiping-right', 'swiping-left');
    }
  };
  
  const onEnd = () => {
    if (!isDragging) return;
    isDragging = false;
    card.style.transition = 'transform 0.3s ease';
    
    if (currentX > 100) {
      swipeCard('right', app);
    } else if (currentX < -100) {
      swipeCard('left', app);
    } else {
      card.style.transform = '';
      card.classList.remove('swiping-right', 'swiping-left');
    }
    currentX = 0;
  };
  
  card.addEventListener('mousedown', onStart);
  card.addEventListener('touchstart', onStart, { passive: true });
  window.addEventListener('mousemove', onMove);
  window.addEventListener('touchmove', onMove, { passive: true });
  window.addEventListener('mouseup', onEnd);
  window.addEventListener('touchend', onEnd);
}

function swipeCard(direction, app) {
  const card = document.getElementById('current-card');
  if (!card) return;
  
  const user = cardStack[currentCardIndex];
  const xOff = direction === 'right' ? 500 : -500;
  card.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
  card.style.transform = `translateX(${xOff}px) rotate(${xOff * 0.05}deg)`;
  card.style.opacity = '0';
  
  if (direction === 'right') {
    app.showToast(`${user.name}님에게 관심을 보냈습니다! 💕`, '💖');
  }
  
  setTimeout(() => {
    currentCardIndex++;
    renderCurrentCard();
  }, 400);
}

function setupSwipeActions(app) {
  document.getElementById('btn-nope')?.addEventListener('click', () => swipeCard('left', app));
  document.getElementById('btn-super')?.addEventListener('click', () => {
    const user = cardStack[currentCardIndex];
    if (user) {
      app.showToast(`${user.name}님에게 Super Like! ⭐`, '💜');
      setTimeout(() => { currentCardIndex++; renderCurrentCard(); }, 300);
    }
  });
  document.getElementById('btn-like')?.addEventListener('click', () => swipeCard('right', app));
}

function renderNearbyUsers() {
  const container = document.getElementById('nearby-users');
  if (!container) return;
  
  const onlineUsers = MOCK_USERS.filter(u => u.online);
  container.innerHTML = `
    <h4 style="margin-bottom:var(--spacing-md);">📍 근처에 있는 사람들</h4>
    <div style="display:flex; flex-direction:column; gap:var(--spacing-sm);">
      ${onlineUsers.map(u => {
        const spot = findSpotForUser(u);
        return `
          <div class="card" style="display:flex; align-items:center; gap:var(--spacing-md); padding:var(--spacing-md); cursor:pointer;">
            <div class="avatar">${u.emoji}</div>
            <div style="flex:1; min-width:0;">
              <div style="font-weight:600; font-size:0.9rem;">${u.name}, ${u.age}</div>
              <div style="font-size:0.75rem; color:var(--text-secondary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                ${spot ? spot.parkName + ' · ' + spot.spotName : '서울'} · ${u.interests[0]}
              </div>
            </div>
            <span class="participant-dot"></span>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

export { initProfile };
