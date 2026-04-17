// ============================================
// 파크팅 (Parkting) - Landing Page
// ============================================

import { PARKS, MOCK_USERS, EVENTS } from './data.js';

function initLanding(app) {
  renderHeroStats();
  setupScrollAnimations();
  setupCTAs(app);
  animateCounter();
}

function renderHeroStats() {
  const totalUsers = MOCK_USERS.length * 127; // Simulated scale
  const totalSpots = PARKS.reduce((acc, p) => acc + p.spots.length, 0);
  const totalEvents = EVENTS.length * 12;
  
  const statsEl = document.getElementById('hero-stats');
  if (statsEl) {
    statsEl.innerHTML = `
      <div class="stat-card card">
        <div class="stat-number" data-count="${totalUsers}">0</div>
        <div class="stat-label">활성 사용자</div>
      </div>
      <div class="stat-card card">
        <div class="stat-number" data-count="${totalSpots}">0</div>
        <div class="stat-label">파크팅 SPOT</div>
      </div>
      <div class="stat-card card">
        <div class="stat-number" data-count="${totalEvents}">0</div>
        <div class="stat-label">진행중인 이벤트</div>
      </div>
      <div class="stat-card card">
        <div class="stat-number" data-count="${PARKS.length}">0</div>
        <div class="stat-label">파트너 공원</div>
      </div>
    `;
  }
}

function animateCounter() {
  const counters = document.querySelectorAll('[data-count]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const duration = 2000;
        const start = performance.now();
        
        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(target * eased).toLocaleString();
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(c => observer.observe(c));
}

function setupScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in-up');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function setupCTAs(app) {
  document.querySelectorAll('[data-action="start"]').forEach(btn => {
    btn.addEventListener('click', () => app.navigateTo('map'));
  });
  document.querySelectorAll('[data-action="events"]').forEach(btn => {
    btn.addEventListener('click', () => app.navigateTo('events'));
  });
}

export { initLanding };
