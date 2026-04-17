// ============================================
// 파크팅 (Parkting) - SPA Router & App Core
// ============================================

import { PARKS, MOCK_USERS, EVENTS, SPOT_TYPES } from './data.js';
import { initLanding } from './landing.js';
import { initMap } from './map.js';
import { initEvents } from './events.js';
import { initProfile } from './profile.js';
import { initChat } from './chat.js';

class App {
  constructor() {
    this.currentPage = 'landing';
    this.currentPark = null;
    this.currentSpot = null;
    this.userLocation = null;
    this.init();
  }

  init() {
    this.setupNavigation();
    this.setupScrollEffect();
    this.setupMobileMenu();
    this.setupBottomBar();
    this.initPages();
    
    // Check URL hash
    const hash = window.location.hash.slice(1) || 'landing';
    this.navigateTo(hash);
    
    window.addEventListener('hashchange', () => {
      const page = window.location.hash.slice(1) || 'landing';
      this.navigateTo(page);
    });
  }

  setupNavigation() {
    document.querySelectorAll('[data-page]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigateTo(el.dataset.page);
      });
    });
  }

  setupScrollEffect() {
    const nav = document.querySelector('.nav');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  }

  setupMobileMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');
    if (toggle && menu) {
      toggle.addEventListener('click', () => {
        menu.classList.toggle('open');
      });
      menu.querySelectorAll('.nav-item, .nav-cta').forEach(item => {
        item.addEventListener('click', () => menu.classList.remove('open'));
      });
    }
  }

  setupBottomBar() {
    document.querySelectorAll('.bottom-bar-item').forEach(btn => {
      btn.addEventListener('click', () => {
        this.navigateTo(btn.dataset.page);
      });
    });
  }

  navigateTo(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    // Show target page
    const target = document.getElementById(`page-${page}`);
    if (target) {
      target.classList.add('active');
      this.currentPage = page;
      window.location.hash = page;
      
      // Update nav active states
      document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === page);
      });
      document.querySelectorAll('.bottom-bar-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === page);
      });
      
      // Scroll to top
      if (page !== 'landing') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // Show/hide nav based on page
      const nav = document.querySelector('.nav');
      if (page === 'map') {
        nav.style.display = 'none';
      } else {
        nav.style.display = '';
      }
    }
  }

  initPages() {
    initLanding(this);
    initMap(this);
    initEvents(this);
    initProfile(this);
    initChat(this);
  }

  showToast(message, icon = '✨') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-text">${message}</span>
    `;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});

export { App };
