// ============================================
// 파크팅 (Parkting) - Map & SPOT System
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
  
  // Add spots
  clearMarkers();
  park.spots.forEach(spot => {
    const spotType = SPOT_TYPES[spot.type];
    
    // Spot circle
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
    
    // Spot marker
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
    
    // User markers in spot
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

    <button class="kakao-btn" style="width:100%; justify-content:center;" onclick="window.app.showToast('카카오톡 오픈채팅이 생성되었습니다! 💬', '💛')">
      💬 오픈채팅 참여하기
    </button>
    <p style="text-align:center; font-size:0.7rem; color:var(--text-muted); margin-top:var(--spacing-sm);">
      이 SPOT의 오픈 카카오톡 채팅방이 자동으로 생성됩니다
    </p>
  `;
  
  sidebar.classList.add('open');
  sidebarOpen = true;
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
