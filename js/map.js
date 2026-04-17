// ============================================
// 파크팅 (Parkting) - Map & SPOT System (V2)
// ============================================

import { PARKS, MOCK_USERS, SPOT_TYPES } from './data.js';

let map = null;
let markers = [];
let spotCircles = [];
let userMarker = null;
let selectedPark = null;
let sidebarOpen = false;

function initMap(app) {
  setupParkChips(app);
  setupMapButtons(app);
}

function setupParkChips(app) {
  const container = document.getElementById('park-chips');
  if (!container) return;
  
  container.innerHTML = PARKS.map(park => `
    <button class="park-chip" data-park="${park.id}">
      📍 ${park.name} <span style="color: var(--accent-green); font-size: 0.7rem;">(${park.activeUsers}명)</span>
    </button>
  `).join('');
  
  container.querySelectorAll('.park-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      container.querySelectorAll('.park-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const park = PARKS.find(p => p.id === chip.dataset.park);
      if (park) selectPark(park, app);
    });
  });
}

function initLeafletMap(park) {
  const mapEl = document.getElementById('map-container');
  if (!mapEl) return;
  
  if (map) { map.remove(); map = null; }
  
  map = L.map('map-container', {
    zoomControl: false,
    attributionControl: false
  }).setView([park.lat, park.lng], 16);
  
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19
  }).addTo(map);

  L.control.zoom({ position: 'bottomright' }).addTo(map);
  
  clearMarkers();
  park.spots.forEach(spot => {
    const spotType = SPOT_TYPES[spot.type];
    
    const circle = L.circle([spot.lat, spot.lng], {
      radius: spot.radius,
      color: spotType.color,
      fillColor: spotType.color,
      fillOpacity: 0.1,
      weight: 2,
      opacity: 0.6,
      dashArray: '5, 10'
    }).addTo(map);
    spotCircles.push(circle);
    
    const icon = L.divIcon({
      className: 'spot-marker',
      html: `<div class="spot-marker-inner" style="background: ${spotType.color}20; border: 2px solid ${spotType.color};">
        <span>${spot.icon}</span>
        <div class="spot-marker-count" style="background: ${spotType.color};">${spot.activeUsers}</div>
      </div>`,
      iconSize: [50, 50],
      iconAnchor: [25, 25]
    });
    
    const marker = L.marker([spot.lat, spot.lng], { icon }).addTo(map);
    marker.on('click', () => showSpotDetail(spot, park));
    markers.push(marker);
    
    const usersInSpot = MOCK_USERS.filter(u => u.location === spot.id);
    usersInSpot.forEach(user => {
      const offsetLat = spot.lat + (Math.random() - 0.5) * 0.001;
      const offsetLng = spot.lng + (Math.random() - 0.5) * 0.001;
      
      const userIcon = L.divIcon({
        className: 'user-marker',
        html: `<div class="user-marker-inner ${user.online ? 'online' : ''}">${user.emoji}</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });
      
      const uMarker = L.marker([offsetLat, offsetLng], { icon: userIcon }).addTo(map);
      uMarker.bindPopup(`
        <div style="text-align:center; padding:4px; color:#000;">
          <div style="font-size:1.5rem;">${user.emoji}</div>
          <strong>${user.name}</strong>, ${user.age}
          <div style="font-size:0.7rem; color:#666;">${user.interests.slice(0,2).join(' · ')}</div>
        </div>
      `);
      markers.push(uMarker);
    });
  });
}

function selectPark(park, app) {
  selectedPark = park;
  initLeafletMap(park);
  
  const info = document.getElementById('park-info');
  if (info) {
    info.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
        <span style="font-size:1.2rem;">📍</span>
        <h3 style="font-size:1rem;">${park.name}</h3>
        <div class="participant-count" style="margin-left:auto;">
          <span class="participant-dot"></span>
          ${park.activeUsers}명 접속중
        </div>
      </div>
      <p style="font-size:0.8rem; color:var(--text-secondary)">${park.description}</p>
    `;
    info.style.display = 'block';
  }
}

function showSpotDetail(spot, park) {
  const sidebar = document.getElementById('spot-sidebar');
  if (!sidebar) return;

  const spotType = SPOT_TYPES[spot.type];
  const usersHere = MOCK_USERS.filter(u => u.location === spot.id);
  
  // Mock existing chat rooms for this spot
  const mockChatRooms = [
    { name: `${spot.name} 모임`, members: Math.floor(spot.activeUsers * 0.6), active: true },
    { name: `${spot.name} 운동메이트`, members: Math.floor(spot.activeUsers * 0.3), active: true },
  ];
  
  document.getElementById('spot-detail').innerHTML = `
    <div style="text-align:center; padding:var(--spacing-lg) 0;">
      <div style="font-size:3rem; margin-bottom:var(--spacing-sm);">${spot.icon}</div>
      <h3>${spot.name}</h3>
      <span class="tag" style="background:${spotType.color}20; color:${spotType.color}; margin-top:var(--spacing-sm); display:inline-flex;">${spotType.icon} ${spotType.label}</span>
      <p style="color:var(--text-secondary); font-size:0.85rem; margin-top:var(--spacing-md);">${spot.description}</p>
    </div>

    <div style="display:flex; gap:var(--spacing-md); margin-bottom:var(--spacing-xl);">
      <div class="card" style="flex:1; text-align:center; padding:var(--spacing-md);">
        <div style="font-size:1.5rem; font-weight:800; color:${spotType.color};">${spot.activeUsers}</div>
        <div style="font-size:0.7rem; color:var(--text-secondary);">현재 접속</div>
      </div>
      <div class="card" style="flex:1; text-align:center; padding:var(--spacing-md);">
        <div style="font-size:1.5rem; font-weight:800; color:var(--accent-pink);">${spot.radius}m</div>
        <div style="font-size:0.7rem; color:var(--text-secondary);">SPOT 반경</div>
      </div>
    </div>

    <h4 style="margin-bottom:var(--spacing-md);">🧑‍🤝‍🧑 지금 여기 있는 사람들</h4>
    <div style="display:flex; flex-direction:column; gap:var(--spacing-sm); margin-bottom:var(--spacing-xl);">
      ${usersHere.map(u => `
        <div class="card" style="display:flex; align-items:center; gap:var(--spacing-md); padding:var(--spacing-md); cursor:pointer;">
          <div class="avatar">${u.emoji}</div>
          <div style="flex:1;">
            <div style="font-weight:600; font-size:0.9rem;">${u.name}, ${u.age}</div>
            <div style="font-size:0.75rem; color:var(--text-secondary);">${u.interests.slice(0,2).join(' · ')}</div>
          </div>
          ${u.online ? '<span class="participant-dot"></span>' : ''}
        </div>
      `).join('')}
    </div>

    <!-- V2: 오픈채팅 참여/만들기 2가지 옵션 -->
    <h4 style="margin-bottom:var(--spacing-md);">💬 오픈채팅</h4>
    <div style="display:flex; gap:var(--spacing-sm); margin-bottom:var(--spacing-md);">
      <button class="btn btn-primary" style="flex:1; font-size:0.85rem;" id="btn-join-chat">
        ✅ 참여하기
      </button>
      <button class="kakao-btn" style="flex:1; justify-content:center; font-size:0.85rem;" id="btn-create-chat">
        ➕ 만들기
      </button>
    </div>

    <!-- 기존 채팅방 목록 (참여하기 클릭 시 표시) -->
    <div id="chat-room-list" style="display:none; margin-bottom:var(--spacing-lg);">
      <p style="font-size:0.75rem; color:var(--text-muted); margin-bottom:var(--spacing-sm);">현재 활성 채팅방</p>
      ${mockChatRooms.map((room, i) => `
        <div class="card chat-room-item" style="display:flex; align-items:center; gap:var(--spacing-md); padding:var(--spacing-md); margin-bottom:var(--spacing-xs); cursor:pointer;" data-room="${i}">
          <div style="width:40px; height:40px; border-radius:var(--radius-md); background:var(--gradient-primary); display:flex; align-items:center; justify-content:center; font-size:1.2rem;">💬</div>
          <div style="flex:1;">
            <div style="font-weight:600; font-size:0.85rem;">${room.name}</div>
            <div style="font-size:0.7rem; color:var(--text-secondary);">👥 ${room.members}명 참여중</div>
          </div>
          <span class="participant-dot"></span>
        </div>
      `).join('')}
    </div>

    <!-- 채팅방 만들기 폼 (만들기 클릭 시 표시) -->
    <div id="create-chat-form" style="display:none; margin-bottom:var(--spacing-lg);">
      <div style="margin-bottom:var(--spacing-md);">
        <label style="display:block; font-size:0.8rem; color:var(--text-secondary); margin-bottom:4px;">채팅방 이름</label>
        <input type="text" class="input" id="chat-room-name" placeholder="예: ${spot.name} 러닝크루" style="width:100%;">
      </div>
      <div style="margin-bottom:var(--spacing-md);">
        <label style="display:block; font-size:0.8rem; color:var(--text-secondary); margin-bottom:4px;">설명 (선택)</label>
        <input type="text" class="input" id="chat-room-desc" placeholder="채팅방 소개를 입력하세요" style="width:100%;">
      </div>
      <button class="kakao-btn" style="width:100%; justify-content:center;" id="btn-kakao-login-create">
        🔑 카카오 로그인 후 생성하기
      </button>
    </div>

    <p style="text-align:center; font-size:0.7rem; color:var(--text-muted);">
      카카오톡 오픈채팅으로 자동 연결됩니다
    </p>
  `;
  
  // Event listeners for chat options
  setupChatOptions(spot, park);
  
  sidebar.classList.add('open');
  sidebarOpen = true;
}

function setupChatOptions(spot, park) {
  const joinBtn = document.getElementById('btn-join-chat');
  const createBtn = document.getElementById('btn-create-chat');
  const roomList = document.getElementById('chat-room-list');
  const createForm = document.getElementById('create-chat-form');
  
  joinBtn?.addEventListener('click', () => {
    roomList.style.display = roomList.style.display === 'none' ? 'block' : 'none';
    createForm.style.display = 'none';
  });
  
  createBtn?.addEventListener('click', () => {
    createForm.style.display = createForm.style.display === 'none' ? 'block' : 'none';
    roomList.style.display = 'none';
  });
  
  // Join existing room
  document.querySelectorAll('.chat-room-item').forEach(item => {
    item.addEventListener('click', () => {
      showKakaoLoginModal(() => {
        window.app.showToast('오픈채팅에 참여했습니다! 💬', '💛');
      });
    });
  });
  
  // Create new room
  document.getElementById('btn-kakao-login-create')?.addEventListener('click', () => {
    const name = document.getElementById('chat-room-name')?.value;
    if (!name) {
      window.app.showToast('채팅방 이름을 입력해주세요', '⚠️');
      return;
    }
    showKakaoLoginModal(() => {
      window.app.showToast(`'${name}' 채팅방이 생성되었습니다! 🎉`, '💛');
      createForm.style.display = 'none';
    });
  });
}

function showKakaoLoginModal(onSuccess) {
  const overlay = document.getElementById('kakao-login-modal');
  if (!overlay) return;
  
  overlay.innerHTML = `
    <div class="modal" style="max-width:400px;">
      <button class="modal-close" id="close-kakao-modal">✕</button>
      <div style="text-align:center; padding:var(--spacing-lg) 0;">
        <div style="width:60px; height:60px; background:#FEE500; border-radius:var(--radius-lg); display:flex; align-items:center; justify-content:center; font-size:2rem; margin:0 auto var(--spacing-lg);">💬</div>
        <h3 style="margin-bottom:var(--spacing-sm);">카카오 로그인</h3>
        <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:var(--spacing-xl);">
          오픈채팅 기능을 이용하려면<br>카카오 계정으로 로그인해주세요
        </p>
        <button class="kakao-btn" style="width:100%; justify-content:center; padding:var(--spacing-md) var(--spacing-xl);" id="kakao-login-btn">
          💬 카카오 계정으로 계속하기
        </button>
        <p style="font-size:0.7rem; color:var(--text-muted); margin-top:var(--spacing-md);">
          로그인 시 이용약관에 동의하는 것으로 간주합니다
        </p>
      </div>
    </div>
  `;
  overlay.classList.add('active');
  
  document.getElementById('close-kakao-modal')?.addEventListener('click', () => {
    overlay.classList.remove('active');
  });
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('active');
  });
  
  document.getElementById('kakao-login-btn')?.addEventListener('click', () => {
    // Simulate login
    const btn = document.getElementById('kakao-login-btn');
    btn.innerHTML = '<div class="spinner" style="width:20px;height:20px;border-width:2px;margin:0 auto;"></div>';
    setTimeout(() => {
      overlay.classList.remove('active');
      if (onSuccess) onSuccess();
    }, 1500);
  });
}

function clearMarkers() {
  markers.forEach(m => m.remove());
  spotCircles.forEach(c => c.remove());
  markers = [];
  spotCircles = [];
}

function setupMapButtons(app) {
  const closeBtn = document.getElementById('close-sidebar');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      document.getElementById('spot-sidebar').classList.remove('open');
      sidebarOpen = false;
    });
  }
  
  const locateBtn = document.getElementById('locate-me');
  if (locateBtn) {
    locateBtn.addEventListener('click', () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
          const { latitude, longitude } = pos.coords;
          if (map) {
            if (userMarker) userMarker.remove();
            const icon = L.divIcon({
              className: 'my-location',
              html: `<div class="my-location-dot"></div>`,
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            });
            userMarker = L.marker([latitude, longitude], { icon }).addTo(map);
            map.setView([latitude, longitude], 16);
            app.showToast('현재 위치를 찾았습니다!', '📍');
          }
        }, () => {
          app.showToast('위치 권한을 허용해주세요', '⚠️');
        });
      }
    });
  }
}

export { initMap };
